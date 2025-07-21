# 🚀 PressKit Pro - Backend API

**Express.js-powered REST API for the PressKit Pro platform**

## 🚀 Overview

The backend API serves as the core infrastructure for PressKit Pro, providing secure authentication, data management, file handling, payment processing, and third-party integrations. Built with Express.js, TypeScript, and MongoDB for scalable, maintainable server-side architecture.

## 🛠️ Tech Stack

- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with bcrypt password hashing
- **File Storage**: Cloudinary integration
- **Email Service**: Nodemailer with SMTP
- **Payment Processing**: Stripe API
- **Validation**: Express-validator + Zod schemas
- **Security**: Helmet, CORS, Rate limiting
- **Monitoring**: Winston logger + Sentry
- **Testing**: Jest + Supertest

## 📦 Installation

### Prerequisites
- Node.js 18+
- MongoDB 6.0+ (local or Atlas)
- npm or yarn

### Setup
```bash
cd server
npm install
```

### Environment Variables
Copy `.env.example` to `.env` and configure:

```env
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/presskit-pro-dev

# Authentication
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d
BCRYPT_ROUNDS=12

# Cloudinary (File Storage)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Stripe (Payments)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# External APIs
SENDGRID_API_KEY=your_sendgrid_key
SENTRY_DSN=your_sentry_dsn

# Security
CORS_ORIGIN=http://localhost:3000,http://localhost:19006
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## 🏃‍♂️ Development

```bash
# Start development server (with hot reload)
npm run dev

# Build TypeScript
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Fix linting issues
npm run lint:fix

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Type checking
npm run type-check
```

## 📁 Project Structure

```
src/
├── controllers/           # Route handlers
│   ├── auth.controller.ts
│   ├── epk.controller.ts
│   ├── media.controller.ts
│   ├── payment.controller.ts
│   └── user.controller.ts
├── models/               # MongoDB schemas
│   ├── User.ts
│   ├── EPK.ts
│   ├── Media.ts
│   └── Subscription.ts
├── routes/               # API route definitions
│   ├── auth.routes.ts
│   ├── epk.routes.ts
│   ├── media.routes.ts
│   └── payment.routes.ts
├── middleware/           # Custom middleware
│   ├── auth.middleware.ts
│   ├── validation.middleware.ts
│   ├── error.middleware.ts
│   └── upload.middleware.ts
├── services/             # Business logic
│   ├── auth.service.ts
│   ├── email.service.ts
│   ├── cloudinary.service.ts
│   └── stripe.service.ts
├── utils/                # Utility functions
│   ├── logger.ts
│   ├── database.ts
│   ├── helpers.ts
│   └── constants.ts
├── config/               # Configuration files
│   ├── database.config.ts
│   ├── cloudinary.config.ts
│   └── stripe.config.ts
├── types/                # TypeScript definitions
│   ├── express.d.ts
│   ├── user.types.ts
│   └── epk.types.ts
└── app.ts               # Application entry point
```

## 🔐 Authentication & Security

### JWT Authentication
```typescript
// Generate token
const token = jwt.sign(
  { userId: user._id, email: user.email },
  process.env.JWT_SECRET!,
  { expiresIn: process.env.JWT_EXPIRES_IN }
)

// Middleware for protected routes
const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  
  if (!token) {
    return res.status(401).json({ error: 'Access token required' })
  }
  
  jwt.verify(token, process.env.JWT_SECRET!, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' })
    req.user = user
    next()
  })
}
```

### Security Middleware
- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **Rate Limiting**: Request throttling
- **Input Validation**: Express-validator + Zod
- **Password Hashing**: bcrypt with salt rounds

## 🗄️ Database Models

### User Model
```typescript
interface IUser extends Document {
  email: string
  password: string
  profile: {
    firstName: string
    lastName: string
    avatar?: string
    bio?: string
  }
  subscription: {
    plan: 'free' | 'premium' | 'pro'
    status: 'active' | 'canceled' | 'past_due'
    stripeCustomerId?: string
  }
  settings: {
    notifications: boolean
    privacy: 'public' | 'private'
  }
  createdAt: Date
  updatedAt: Date
}
```

### EPK Model
```typescript
interface IEPK extends Document {
  userId: ObjectId
  title: string
  slug: string
  content: {
    bio: string
    genre: string[]
    socialLinks: ISocialLink[]
    media: IMedia[]
    pressQuotes: IPressQuote[]
    tourDates: ITourDate[]
  }
  design: {
    theme: string
    colors: IColorScheme
    layout: string
  }
  settings: {
    isPublic: boolean
    customDomain?: string
    password?: string
  }
  analytics: {
    views: number
    shares: number
    downloads: number
  }
  createdAt: Date
  updatedAt: Date
}
```

## 📡 API Endpoints

### Authentication Routes
```typescript
POST   /api/auth/register     # User registration
POST   /api/auth/login        # User login
POST   /api/auth/logout       # User logout
GET    /api/auth/me           # Get current user
PUT    /api/auth/profile      # Update profile
POST   /api/auth/forgot       # Forgot password
POST   /api/auth/reset        # Reset password
```

### EPK Management
```typescript
GET    /api/epks              # Get user's EPKs
POST   /api/epks              # Create new EPK
GET    /api/epks/:id          # Get EPK by ID
PUT    /api/epks/:id          # Update EPK
DELETE /api/epks/:id          # Delete EPK
GET    /api/epks/:slug/public # Get public EPK
```

### Media Handling
```typescript
POST   /api/media/upload      # Upload media files
GET    /api/media/:id         # Get media file
DELETE /api/media/:id         # Delete media file
PUT    /api/media/:id         # Update media metadata
```

### Payment Processing
```typescript
POST   /api/payments/intent   # Create payment intent
POST   /api/payments/webhook  # Stripe webhook handler
GET    /api/subscriptions     # Get user subscriptions
POST   /api/subscriptions     # Create subscription
PUT    /api/subscriptions/:id # Update subscription
```

## 💳 Stripe Integration

### Payment Processing
```typescript
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16'
})

// Create payment intent
const paymentIntent = await stripe.paymentIntents.create({
  amount: 2999, // $29.99
  currency: 'usd',
  customer: stripeCustomerId,
  metadata: {
    userId: user._id.toString(),
    plan: 'premium'
  }
})
```

### Webhook Handling
```typescript
// Verify webhook signature
const sig = req.headers['stripe-signature']
const event = stripe.webhooks.constructEvent(
  req.body,
  sig!,
  process.env.STRIPE_WEBHOOK_SECRET!
)

// Handle payment success
if (event.type === 'payment_intent.succeeded') {
  const paymentIntent = event.data.object
  await updateUserSubscription(paymentIntent.customer, 'premium')
}
```

## 📁 File Upload & Storage

### Cloudinary Integration
```typescript
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

// Upload with transformations
const result = await cloudinary.uploader.upload(file.path, {
  folder: 'presskit-pro/media',
  resource_type: 'auto',
  transformation: [
    { width: 1920, height: 1080, crop: 'limit', quality: 'auto' }
  ]
})
```

### Multer Configuration
```typescript
const upload = multer({
  dest: 'temp/',
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB
    files: 10
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/', 'video/', 'audio/']
    const isAllowed = allowedTypes.some(type => 
      file.mimetype.startsWith(type)
    )
    cb(null, isAllowed)
  }
})
```

## 📧 Email Service

### Nodemailer Setup
```typescript
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
})

// Send email template
const sendWelcomeEmail = async (user: IUser) => {
  await transporter.sendMail({
    from: '"PressKit Pro" <noreply@presskitpro.com>',
    to: user.email,
    subject: 'Welcome to PressKit Pro!',
    html: welcomeEmailTemplate(user)
  })
}
```

## 📊 Logging & Monitoring

### Winston Logger
```typescript
import winston from 'winston'

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
})
```

### Sentry Integration
```typescript
import * as Sentry from '@sentry/node'

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0
})

// Error handling middleware
app.use(Sentry.Handlers.errorHandler())
```

## 🧪 Testing

### Jest Configuration
```typescript
// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src', '<rootDir>/tests'],
  testMatch: ['**/__tests__/**/*.test.ts'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/app.ts'
  ]
}
```

### API Testing
```typescript
import request from 'supertest'
import app from '../src/app'

describe('Auth Endpoints', () => {
  test('POST /api/auth/register', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'test@example.com',
        password: 'SecurePass123!',
        firstName: 'John',
        lastName: 'Doe'
      })
      .expect(201)
    
    expect(response.body).toHaveProperty('token')
    expect(response.body.user.email).toBe('test@example.com')
  })
})
```

## 🚀 Deployment

### Docker Configuration
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY dist/ ./dist/

EXPOSE 5000

CMD ["node", "dist/app.js"]
```

### Environment-specific Configs
```bash
# Production deployment
npm run build
NODE_ENV=production npm start

# Docker deployment
docker build -t presskit-pro-api .
docker run -p 5000:5000 --env-file .env presskit-pro-api
```

## 📈 Performance Optimization

- **Database Indexing** for query optimization
- **Redis Caching** for session and data caching
- **Connection Pooling** for MongoDB
- **Compression Middleware** for response optimization
- **Rate Limiting** to prevent abuse
- **Image Optimization** via Cloudinary

## 🔗 Related Documentation

- [Development Rules](./development-rules.md)
- [Task Planning](./tasks.md)
- [Web App](../client-web/README.md)
- [Mobile App](../client-mobile/README.md)

## 🆘 Troubleshooting

### Common Issues

**MongoDB Connection**
```bash
# Check MongoDB service
sudo systemctl status mongod

# Test connection
mongo "mongodb://localhost:27017/presskit-pro-dev"
```

**Environment Variables**
```bash
# Verify .env file
cat .env | grep -v "^#"
```

**Port Conflicts**
```bash
# Check what's using port 5000
lsof -ti:5000

# Kill process if needed
kill -9 $(lsof -ti:5000)
```

## 📞 Support

- Check [development-rules.md](./development-rules.md) for coding guidelines
- Review [tasks.md](./tasks.md) for current development phases
- Refer to main project documentation in root directory

---

**Express.js Backend API** | Part of PressKit Pro Platform 