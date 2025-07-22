import { Request, Response, NextFunction } from 'express';
import { BaseController } from './base.controller';
import { EPK } from '../models/EPK';
import { ErrorResponse } from '../middleware/error';
import { uploadToCloudinary, deleteFromCloudinary, analytics } from '../utils';
import { cache } from '../utils/cache';

class EPKController extends BaseController<typeof EPK> {
  constructor() {
    super(EPK);
  }

  // Create EPK
  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Add user to request body
      req.body.userId = req.user.id;

      // Check user's EPK limit based on tier
      const userEPKCount = await EPK.countDocuments({ userId: req.user.id });
      const tierLimits = {
        free: 1,
        pro: 5,
        enterprise: Infinity
      };

      if (userEPKCount >= tierLimits[req.user.tier]) {
        throw new ErrorResponse(
          `You have reached the maximum number of EPKs allowed for your ${req.user.tier} tier`,
          403
        );
      }

      // Create EPK
      const epk = await EPK.create(req.body);

      // Initialize analytics
      await analytics.trackPageView(epk._id, {
        url: `/epk/${epk.slug}`,
        timestamp: Date.now()
      });

      res.status(201).json({
        success: true,
        data: epk
      });
    } catch (error) {
      next(error);
    }
  };

  // Get user's EPKs
  getUserEPKs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const total = await EPK.countDocuments({ userId: req.user.id });
      const epks = await EPK.find({ userId: req.user.id })
        .sort('-createdAt')
        .skip((page - 1) * limit)
        .limit(limit);

      res.status(200).json({
        success: true,
        data: epks,
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

  // Get EPK by slug
  getBySlug = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const epk = await EPK.findOne({ slug: req.params.slug });
      if (!epk) {
        throw new ErrorResponse('EPK not found', 404);
      }

      // Track page view
      await analytics.trackPageView(epk._id, {
        url: `/epk/${epk.slug}`,
        referrer: req.get('referer'),
        userAgent: req.get('user-agent'),
        ipAddress: req.ip,
        timestamp: Date.now()
      });

      // Get from cache or update cache
      const cacheKey = `epk_${epk._id}`;
      let epkData = await cache.get(cacheKey);

      if (!epkData) {
        epkData = epk.toObject();
        await cache.set(cacheKey, epkData, 3600); // Cache for 1 hour
      }

      res.status(200).json({
        success: true,
        data: epkData
      });
    } catch (error) {
      next(error);
    }
  };

  // Update EPK
  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      let epk = await EPK.findById(req.params.id);
      if (!epk) {
        throw new ErrorResponse('EPK not found', 404);
      }

      // Check ownership
      if (epk.userId.toString() !== req.user.id) {
        throw new ErrorResponse('Not authorized to update this EPK', 403);
      }

      // Update EPK
      epk = await EPK.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
      });

      // Clear cache
      await cache.del(`epk_${epk!._id}`);

      res.status(200).json({
        success: true,
        data: epk
      });
    } catch (error) {
      next(error);
    }
  };

  // Upload EPK media
  uploadMedia = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const epk = await EPK.findById(req.params.id);
      if (!epk) {
        throw new ErrorResponse('EPK not found', 404);
      }

      // Check ownership
      if (epk.userId.toString() !== req.user.id) {
        throw new ErrorResponse('Not authorized to update this EPK', 403);
      }

      if (!req.files) {
        throw new ErrorResponse('Please upload a file', 400);
      }

      const files = Array.isArray(req.files) ? req.files : [req.files];
      const uploadedFiles = [];

      for (const file of files) {
        // Upload to Cloudinary
        const result = await uploadToCloudinary(file.path, `epk/${epk._id}`);
        uploadedFiles.push({
          url: result.url,
          publicId: result.publicId,
          type: file.mimetype.startsWith('image/') ? 'image' : 'audio'
        });
      }

      // Update EPK with new media
      if (req.query.type === 'image') {
        epk.photos.push(...uploadedFiles);
      } else if (req.query.type === 'audio') {
        epk.music.push(...uploadedFiles);
      }

      await epk.save();

      // Clear cache
      await cache.del(`epk_${epk._id}`);

      res.status(200).json({
        success: true,
        data: uploadedFiles
      });
    } catch (error) {
      next(error);
    }
  };

  // Delete EPK media
  deleteMedia = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const epk = await EPK.findById(req.params.id);
      if (!epk) {
        throw new ErrorResponse('EPK not found', 404);
      }

      // Check ownership
      if (epk.userId.toString() !== req.user.id) {
        throw new ErrorResponse('Not authorized to update this EPK', 403);
      }

      const { publicId, type } = req.body;

      // Delete from Cloudinary
      await deleteFromCloudinary(publicId);

      // Remove from EPK
      if (type === 'image') {
        epk.photos = epk.photos.filter(photo => photo.publicId !== publicId);
      } else if (type === 'audio') {
        epk.music = epk.music.filter(track => track.publicId !== publicId);
      }

      await epk.save();

      // Clear cache
      await cache.del(`epk_${epk._id}`);

      res.status(200).json({
        success: true,
        message: 'Media deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  };

  // Get EPK analytics
  getAnalytics = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const epk = await EPK.findById(req.params.id);
      if (!epk) {
        throw new ErrorResponse('EPK not found', 404);
      }

      // Check ownership
      if (epk.userId.toString() !== req.user.id) {
        throw new ErrorResponse('Not authorized to view these analytics', 403);
      }

      const analyticsData = await analytics.getEpkAnalytics(epk._id);

      res.status(200).json({
        success: true,
        data: analyticsData
      });
    } catch (error) {
      next(error);
    }
  };

  // Delete EPK
  delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const epk = await EPK.findById(req.params.id);
      if (!epk) {
        throw new ErrorResponse('EPK not found', 404);
      }

      // Check ownership
      if (epk.userId.toString() !== req.user.id) {
        throw new ErrorResponse('Not authorized to delete this EPK', 403);
      }

      // Delete all media from Cloudinary
      const mediaFiles = [...epk.photos, ...epk.music];
      for (const file of mediaFiles) {
        await deleteFromCloudinary(file.publicId);
      }

      // Delete EPK
      await epk.remove();

      // Clear cache and analytics
      await cache.del(`epk_${epk._id}`);
      await analytics.clearAnalytics(epk._id);

      res.status(200).json({
        success: true,
        message: 'EPK deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  };
}

export default new EPKController();