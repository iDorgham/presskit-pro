import mongoose, { Document, Schema } from 'mongoose';

export interface IEPK extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  slug: string;
  status: 'draft' | 'published';
  bio: {
    shortBio: string;
    fullBio: string;
    highlights: string[];
  };
  photos: {
    category: string;
    images: Array<{
      url: string;
      caption: string;
      altText: string;
      order: number;
    }>;
  }[];
  music: {
    tracks: Array<{
      title: string;
      type: 'upload' | 'streaming';
      url: string;
      platform?: 'spotify' | 'apple' | 'soundcloud';
      releaseDate?: Date;
      order: number;
    }>;
    playlists: Array<{
      name: string;
      tracks: mongoose.Types.ObjectId[];
    }>;
  };
  pressKit: {
    riders: Array<{
      name: string;
      type: 'technical' | 'hospitality';
      fileUrl: string;
      version: string;
    }>;
    pressReleases: Array<{
      title: string;
      content: string;
      date: Date;
      fileUrl?: string;
    }>;
  };
  contact: {
    email: string;
    phone?: string;
    website?: string;
    socialLinks: {
      instagram?: string;
      facebook?: string;
      twitter?: string;
      youtube?: string;
      spotify?: string;
      soundcloud?: string;
    };
    bookingInquiries: {
      email?: string;
      name?: string;
      phone?: string;
    };
  };
  customization: {
    theme: 'light' | 'dark';
    accentColor?: string;
    customCss?: string;
    customDomain?: string;
  };
  analytics: {
    views: number;
    uniqueVisitors: number;
    averageTimeOnPage: number;
    topReferrers: Array<{
      source: string;
      visits: number;
    }>;
    lastUpdated: Date;
  };
  seo: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
    ogImage?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const epkSchema = new Schema<IEPK>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft',
    },
    bio: {
      shortBio: {
        type: String,
        maxlength: [300, 'Short bio cannot exceed 300 characters'],
      },
      fullBio: String,
      highlights: [String],
    },
    photos: [
      {
        category: {
          type: String,
          required: true,
        },
        images: [
          {
            url: {
              type: String,
              required: true,
            },
            caption: String,
            altText: String,
            order: {
              type: Number,
              default: 0,
            },
          },
        ],
      },
    ],
    music: {
      tracks: [
        {
          title: {
            type: String,
            required: true,
          },
          type: {
            type: String,
            enum: ['upload', 'streaming'],
            required: true,
          },
          url: {
            type: String,
            required: true,
          },
          platform: {
            type: String,
            enum: ['spotify', 'apple', 'soundcloud'],
          },
          releaseDate: Date,
          order: {
            type: Number,
            default: 0,
          },
        },
      ],
      playlists: [
        {
          name: String,
          tracks: [{ type: Schema.Types.ObjectId, ref: 'Track' }],
        },
      ],
    },
    pressKit: {
      riders: [
        {
          name: String,
          type: {
            type: String,
            enum: ['technical', 'hospitality'],
          },
          fileUrl: String,
          version: String,
        },
      ],
      pressReleases: [
        {
          title: String,
          content: String,
          date: Date,
          fileUrl: String,
        },
      ],
    },
    contact: {
      email: {
        type: String,
        required: true,
      },
      phone: String,
      website: String,
      socialLinks: {
        instagram: String,
        facebook: String,
        twitter: String,
        youtube: String,
        spotify: String,
        soundcloud: String,
      },
      bookingInquiries: {
        email: String,
        name: String,
        phone: String,
      },
    },
    customization: {
      theme: {
        type: String,
        enum: ['light', 'dark'],
        default: 'dark',
      },
      accentColor: String,
      customCss: String,
      customDomain: String,
    },
    analytics: {
      views: {
        type: Number,
        default: 0,
      },
      uniqueVisitors: {
        type: Number,
        default: 0,
      },
      averageTimeOnPage: {
        type: Number,
        default: 0,
      },
      topReferrers: [
        {
          source: String,
          visits: Number,
        },
      ],
      lastUpdated: {
        type: Date,
        default: Date.now,
      },
    },
    seo: {
      metaTitle: String,
      metaDescription: String,
      keywords: [String],
      ogImage: String,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for performance
epkSchema.index({ userId: 1 });
epkSchema.index({ slug: 1 }, { unique: true });
epkSchema.index({ status: 1 });
epkSchema.index({ 'customization.customDomain': 1 }, { sparse: true });

// Auto-generate slug from title
epkSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
  next();
});

export const EPK = mongoose.model<IEPK>('EPK', epkSchema);