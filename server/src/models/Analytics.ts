import mongoose, { Document, Schema } from 'mongoose';

export interface IAnalytics extends Document {
  epkId: mongoose.Types.ObjectId;
  pageViews: {
    total: number;
    unique: number;
    daily: Array<{
      date: Date;
      views: number;
      unique: number;
    }>;
  };
  engagement: {
    averageTimeOnPage: number;
    bounceRate: number;
    musicPlays: number;
    downloadCount: number;
    contactFormSubmissions: number;
  };
  demographics: {
    countries: Array<{
      country: string;
      visits: number;
      percentage: number;
    }>;
    devices: Array<{
      type: string;
      count: number;
      percentage: number;
    }>;
    browsers: Array<{
      name: string;
      count: number;
      percentage: number;
    }>;
  };
  traffic: {
    sources: Array<{
      name: string;
      visits: number;
      percentage: number;
    }>;
    socialMedia: Array<{
      platform: string;
      clicks: number;
      shares: number;
    }>;
  };
  contentPerformance: {
    topPhotos: Array<{
      photoId: mongoose.Types.ObjectId;
      views: number;
      engagement: number;
    }>;
    topTracks: Array<{
      trackId: mongoose.Types.ObjectId;
      plays: number;
      completionRate: number;
    }>;
  };
  periodSummary: {
    startDate: Date;
    endDate: Date;
    totalViews: number;
    uniqueVisitors: number;
    averageEngagement: number;
    topCountry: string;
    topReferrer: string;
  };
  lastUpdated: Date;
}

const analyticsSchema = new Schema<IAnalytics>(
  {
    epkId: {
      type: Schema.Types.ObjectId,
      ref: 'EPK',
      required: true,
      unique: true,
    },
    pageViews: {
      total: {
        type: Number,
        default: 0,
      },
      unique: {
        type: Number,
        default: 0,
      },
      daily: [
        {
          date: {
            type: Date,
            required: true,
          },
          views: {
            type: Number,
            default: 0,
          },
          unique: {
            type: Number,
            default: 0,
          },
        },
      ],
    },
    engagement: {
      averageTimeOnPage: {
        type: Number,
        default: 0,
      },
      bounceRate: {
        type: Number,
        default: 0,
      },
      musicPlays: {
        type: Number,
        default: 0,
      },
      downloadCount: {
        type: Number,
        default: 0,
      },
      contactFormSubmissions: {
        type: Number,
        default: 0,
      },
    },
    demographics: {
      countries: [
        {
          country: String,
          visits: Number,
          percentage: Number,
        },
      ],
      devices: [
        {
          type: String,
          count: Number,
          percentage: Number,
        },
      ],
      browsers: [
        {
          name: String,
          count: Number,
          percentage: Number,
        },
      ],
    },
    traffic: {
      sources: [
        {
          name: String,
          visits: Number,
          percentage: Number,
        },
      ],
      socialMedia: [
        {
          platform: String,
          clicks: Number,
          shares: Number,
        },
      ],
    },
    contentPerformance: {
      topPhotos: [
        {
          photoId: {
            type: Schema.Types.ObjectId,
            ref: 'EPK.photos.images',
          },
          views: Number,
          engagement: Number,
        },
      ],
      topTracks: [
        {
          trackId: {
            type: Schema.Types.ObjectId,
            ref: 'EPK.music.tracks',
          },
          plays: Number,
          completionRate: Number,
        },
      ],
    },
    periodSummary: {
      startDate: Date,
      endDate: Date,
      totalViews: Number,
      uniqueVisitors: Number,
      averageEngagement: Number,
      topCountry: String,
      topReferrer: String,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for performance
analyticsSchema.index({ epkId: 1 }, { unique: true });
analyticsSchema.index({ 'pageViews.daily.date': 1 });
analyticsSchema.index({ lastUpdated: 1 });

// Update lastUpdated timestamp on every save
analyticsSchema.pre('save', function(next) {
  this.lastUpdated = new Date();
  next();
});

// Method to update daily page views
analyticsSchema.methods.updateDailyViews = async function(date: Date, views: number, unique: number) {
  const dailyRecord = this.pageViews.daily.find(
    (day) => day.date.toISOString().split('T')[0] === date.toISOString().split('T')[0]
  );

  if (dailyRecord) {
    dailyRecord.views += views;
    dailyRecord.unique += unique;
  } else {
    this.pageViews.daily.push({
      date,
      views,
      unique,
    });
  }

  this.pageViews.total += views;
  this.pageViews.unique += unique;

  await this.save();
};

export const Analytics = mongoose.model<IAnalytics>('Analytics', analyticsSchema);