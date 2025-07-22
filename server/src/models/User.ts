import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  email: string;
  password: string;
  username: string;
  tier: 'free' | 'premium' | 'pro';
  profile: {
    firstName: string;
    lastName: string;
    avatar?: string;
    bio?: string;
  };
  subscription: {
    plan: 'free' | 'premium' | 'pro';
    status: 'active' | 'canceled' | 'past_due' | 'trialing';
    stripeCustomerId?: string;
    currentPeriodEnd?: Date;
  };
  settings: {
    notifications: boolean;
    privacy: 'public' | 'private';
    emailVerified: boolean;
  };
  isActive: boolean;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;

  // Instance methods
  comparePassword(candidatePassword: string): Promise<boolean>;
  getPublicProfile(): object;
}

const userSchema = new Schema<IUser>({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email address'
    ]
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters long'],
    select: false // Don't include password in queries by default
  },
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    lowercase: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters long'],
    maxlength: [30, 'Username cannot exceed 30 characters'],
    match: [
      /^[a-zA-Z0-9_-]+$/,
      'Username can only contain letters, numbers, underscores, and hyphens'
    ]
  },
  tier: {
    type: String,
    enum: ['free', 'premium', 'pro'],
    default: 'free'
  },
  profile: {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
      maxlength: [50, 'First name cannot exceed 50 characters']
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
      maxlength: [50, 'Last name cannot exceed 50 characters']
    },
    avatar: {
      type: String,
      match: [
        /^https?:\/\/.+\.(jpg|jpeg|png|webp|gif)$/i,
        'Avatar must be a valid image URL'
      ]
    },
    bio: {
      type: String,
      maxlength: [500, 'Bio cannot exceed 500 characters']
    }
  },
  subscription: {
    plan: {
      type: String,
      enum: ['free', 'premium', 'pro'],
      default: 'free'
    },
    status: {
      type: String,
      enum: ['active', 'canceled', 'past_due', 'trialing'],
      default: 'active'
    },
    stripeCustomerId: String,
    currentPeriodEnd: Date
  },
  settings: {
    notifications: {
      type: Boolean,
      default: true
    },
    privacy: {
      type: String,
      enum: ['public', 'private'],
      default: 'public'
    },
    emailVerified: {
      type: Boolean,
      default: false
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLoginAt: Date
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: function(doc, ret) {
      delete (ret as any).password;
      delete (ret as any).__v;
      return ret;
    }
  }
});

// Indexes for performance
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });
userSchema.index({ 'subscription.stripeCustomerId': 1 });
userSchema.index({ tier: 1, isActive: 1 });

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();

  try {
    // Hash password with cost of 12
    const saltRounds = parseInt(process.env.BCRYPT_ROUNDS || '12');
    this.password = await bcrypt.hash(this.password, saltRounds);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Instance method to compare password
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    return false;
  }
};

// Instance method to get public profile (without sensitive data)
userSchema.methods.getPublicProfile = function() {
  return {
    id: this._id,
    username: this.username,
    profile: {
      firstName: this.profile.firstName,
      lastName: this.profile.lastName,
      avatar: this.profile.avatar,
      bio: this.profile.bio
    },
    tier: this.tier,
    createdAt: this.createdAt
  };
};

// Virtual for full name
userSchema.virtual('profile.fullName').get(function() {
  return `${this.profile.firstName} ${this.profile.lastName}`;
});

// Static method to find by email
userSchema.statics.findByEmail = function(email: string) {
  return this.findOne({ email: email.toLowerCase() }).select('+password');
};

// Static method to find by username
userSchema.statics.findByUsername = function(username: string) {
  return this.findOne({ username: username.toLowerCase() });
};

export const User = mongoose.model<IUser>('User', userSchema); 