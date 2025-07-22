import mongoose, { Document, Schema } from 'mongoose';

export interface IContactInquiry extends Document {
  epkId: mongoose.Types.ObjectId;
  type: 'booking' | 'press' | 'collaboration' | 'licensing' | 'other';
  status: 'new' | 'read' | 'replied' | 'archived';
  priority: 'low' | 'medium' | 'high';
  sender: {
    name: string;
    email: string;
    phone?: string;
    company?: string;
    role?: string;
  };
  subject: string;
  message: string;
  metadata: {
    userAgent?: string;
    ipAddress?: string;
    referrer?: string;
    recaptchaScore?: number;
  };
  attachments?: Array<{
    name: string;
    url: string;
    type: string;
    size: number;
  }>;
  notes?: string;
  responseHistory?: Array<{
    message: string;
    sentAt: Date;
    sentBy: mongoose.Types.ObjectId;
  }>;
  readAt?: Date;
  respondedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const contactInquirySchema = new Schema<IContactInquiry>(
  {
    epkId: {
      type: Schema.Types.ObjectId,
      ref: 'EPK',
      required: true,
    },
    type: {
      type: String,
      enum: ['booking', 'press', 'collaboration', 'licensing', 'other'],
      required: true,
    },
    status: {
      type: String,
      enum: ['new', 'read', 'replied', 'archived'],
      default: 'new',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    sender: {
      name: {
        type: String,
        required: [true, 'Sender name is required'],
        trim: true,
      },
      email: {
        type: String,
        required: [true, 'Sender email is required'],
        trim: true,
        lowercase: true,
        match: [
          /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
          'Please provide a valid email address',
        ],
      },
      phone: {
        type: String,
        trim: true,
      },
      company: {
        type: String,
        trim: true,
      },
      role: {
        type: String,
        trim: true,
      },
    },
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      trim: true,
      maxlength: [200, 'Subject cannot exceed 200 characters'],
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      trim: true,
      maxlength: [5000, 'Message cannot exceed 5000 characters'],
    },
    metadata: {
      userAgent: String,
      ipAddress: String,
      referrer: String,
      recaptchaScore: Number,
    },
    attachments: [
      {
        name: String,
        url: String,
        type: String,
        size: Number,
      },
    ],
    notes: {
      type: String,
      maxlength: [1000, 'Notes cannot exceed 1000 characters'],
    },
    responseHistory: [
      {
        message: {
          type: String,
          required: true,
        },
        sentAt: {
          type: Date,
          default: Date.now,
        },
        sentBy: {
          type: Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
      },
    ],
    readAt: Date,
    respondedAt: Date,
  },
  {
    timestamps: true,
  }
);

// Indexes for performance
contactInquirySchema.index({ epkId: 1, createdAt: -1 });
contactInquirySchema.index({ status: 1 });
contactInquirySchema.index({ type: 1 });
contactInquirySchema.index({ 'sender.email': 1 });

// Update readAt timestamp when status changes to 'read'
contactInquirySchema.pre('save', function(next) {
  if (this.isModified('status') && this.status === 'read' && !this.readAt) {
    this.readAt = new Date();
  }
  if (this.isModified('status') && this.status === 'replied' && !this.respondedAt) {
    this.respondedAt = new Date();
  }
  next();
});

export const ContactInquiry = mongoose.model<IContactInquiry>('ContactInquiry', contactInquirySchema);