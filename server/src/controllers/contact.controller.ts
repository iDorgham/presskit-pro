import { Request, Response, NextFunction } from 'express';
import { BaseController } from './base.controller';
import { ContactInquiry } from '../models/ContactInquiry';
import { EPK } from '../models/EPK';
import { ErrorResponse } from '../middleware/error';
import { sendEmail, emailTemplates } from '../utils';
import { analytics } from '../utils/analytics';

class ContactController extends BaseController<typeof ContactInquiry> {
  constructor() {
    super(ContactInquiry);
  }

  // Submit contact inquiry
  submit = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { epkId } = req.params;
      const { name, email, subject, message, type } = req.body;

      // Check if EPK exists
      const epk = await EPK.findById(epkId);
      if (!epk) {
        throw new ErrorResponse('EPK not found', 404);
      }

      // Create contact inquiry
      const inquiry = await ContactInquiry.create({
        epkId,
        type,
        status: 'pending',
        sender: {
          name,
          email
        },
        subject,
        message
      });

      // Track contact form submission
      await analytics.trackInteraction(epkId, {
        type: 'contact_form',
        timestamp: Date.now()
      });

      // Send notification email to EPK owner
      await sendEmail(
        epk.contactEmail || epk.userId.email,
        ...Object.values(emailTemplates.contactNotification(name, email, message))
      );

      res.status(201).json({
        success: true,
        data: inquiry,
        message: 'Contact inquiry submitted successfully'
      });
    } catch (error) {
      next(error);
    }
  };

  // Get user's received inquiries
  getReceivedInquiries = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const status = req.query.status as string;
      const type = req.query.type as string;

      // Get user's EPKs
      const userEpks = await EPK.find({ userId: req.user.id }).select('_id');
      const epkIds = userEpks.map(epk => epk._id);

      // Build query
      const query: any = { epkId: { $in: epkIds } };
      if (status) query.status = status;
      if (type) query.type = type;

      const total = await ContactInquiry.countDocuments(query);
      const inquiries = await ContactInquiry.find(query)
        .sort('-createdAt')
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('epkId', 'title slug');

      res.status(200).json({
        success: true,
        data: inquiries,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      next(error);
    }
  };

  // Update inquiry status
  updateStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const { status, note } = req.body;

      const inquiry = await ContactInquiry.findById(id);
      if (!inquiry) {
        throw new ErrorResponse('Inquiry not found', 404);
      }

      // Check ownership through EPK
      const epk = await EPK.findById(inquiry.epkId);
      if (!epk || epk.userId.toString() !== req.user.id) {
        throw new ErrorResponse('Not authorized to update this inquiry', 403);
      }

      // Update status and add note to history
      inquiry.status = status;
      if (note) {
        inquiry.notes.push({
          content: note,
          createdBy: req.user.id,
          createdAt: new Date()
        });
      }

      // Update timestamps
      if (status === 'read' && !inquiry.readAt) {
        inquiry.readAt = new Date();
      } else if (status === 'responded' && !inquiry.respondedAt) {
        inquiry.respondedAt = new Date();
      }

      await inquiry.save();

      res.status(200).json({
        success: true,
        data: inquiry
      });
    } catch (error) {
      next(error);
    }
  };

  // Respond to inquiry
  respond = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const { message } = req.body;

      const inquiry = await ContactInquiry.findById(id);
      if (!inquiry) {
        throw new ErrorResponse('Inquiry not found', 404);
      }

      // Check ownership through EPK
      const epk = await EPK.findById(inquiry.epkId);
      if (!epk || epk.userId.toString() !== req.user.id) {
        throw new ErrorResponse('Not authorized to respond to this inquiry', 403);
      }

      // Add response to history
      inquiry.responseHistory.push({
        message,
        sentBy: req.user.id,
        sentAt: new Date()
      });

      // Update status and timestamps
      inquiry.status = 'responded';
      inquiry.respondedAt = new Date();

      await inquiry.save();

      // Send response email to inquirer
      await sendEmail(
        inquiry.sender.email,
        'Response to your inquiry',
        `<div>
          <h2>Response to your inquiry</h2>
          <p>${message}</p>
          <p>Original inquiry: ${inquiry.message}</p>
        </div>`
      );

      res.status(200).json({
        success: true,
        data: inquiry,
        message: 'Response sent successfully'
      });
    } catch (error) {
      next(error);
    }
  };

  // Get inquiry statistics
  getStatistics = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Get user's EPKs
      const userEpks = await EPK.find({ userId: req.user.id }).select('_id');
      const epkIds = userEpks.map(epk => epk._id);

      // Get inquiry statistics
      const stats = await ContactInquiry.aggregate([
        { $match: { epkId: { $in: epkIds } } },
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            pending: {
              $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
            },
            read: {
              $sum: { $cond: [{ $eq: ['$status', 'read'] }, 1, 0] }
            },
            responded: {
              $sum: { $cond: [{ $eq: ['$status', 'responded'] }, 1, 0] }
            },
            booking: {
              $sum: { $cond: [{ $eq: ['$type', 'booking'] }, 1, 0] }
            },
            press: {
              $sum: { $cond: [{ $eq: ['$type', 'press'] }, 1, 0] }
            }
          }
        }
      ]);

      res.status(200).json({
        success: true,
        data: stats[0] || {
          total: 0,
          pending: 0,
          read: 0,
          responded: 0,
          booking: 0,
          press: 0
        }
      });
    } catch (error) {
      next(error);
    }
  };
}

export default new ContactController();