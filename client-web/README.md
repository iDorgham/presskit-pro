# 🌐 PressKit Pro - Web Application

**Next.js-powered web platform for professional Electronic Press Kits**

## 🚀 Overview

The web application serves as the primary interface for PressKit Pro, providing artists with a professional platform to create, customize, and share their Electronic Press Kits. Built with Next.js 15, TypeScript, and Tailwind CSS for optimal performance and user experience.

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Custom Glass Components
- **UI Components**: Headless UI, Heroicons
- **Forms**: React Hook Form + Zod validation
- **Authentication**: JWT with secure cookies
- **Payments**: Stripe integration
- **Animations**: Framer Motion
- **Theme**: Dark mode with glass morphism effects
- **Typography**: Poppins font family

## 📦 Installation

### Prerequisites
- Node.js 18+
- npm or yarn

### Setup
```bash
cd client-web
npm install
```

### Environment Variables
Copy `.env.local.example` to `.env.local` and configure:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_name
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 🏃‍♂️ Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Run type checking
npm run type-check
```

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication routes
│   ├── dashboard/         # User dashboard
│   ├── [username]/        # Public EPK pages
│   └── layout.tsx         # Root layout
├── components/            # Reusable components
│   ├── ui/               # Base UI components
│   ├── forms/            # Form components
│   ├── epk/              # EPK-specific components
│   └── layout/           # Layout components
├── lib/                  # Utility libraries
│   ├── api.ts           # API client
│   ├── auth.ts          # Authentication utilities
│   └── utils.ts         # General utilities
├── hooks/               # Custom React hooks
├── types/              # TypeScript type definitions
└── styles/             # Global styles
```

## 🎨 Design System

### Glass Morphism Components
- Semi-transparent backgrounds with backdrop blur
- 1px border outlines for definition
- Consistent spacing and typography
- Dark theme optimized

### Color Palette
```css
/* Primary Colors */
--primary-500: #8B5CF6;
--primary-600: #7C3AED;

/* Dark Theme */
--dark-bg: #1a1a1a;
--dark-surface: #2a2a2a;
--dark-border: rgba(255, 255, 255, 0.2);

/* Glass Effects */
--glass-bg: rgba(255, 255, 255, 0.1);
--glass-border: rgba(255, 255, 255, 0.2);
```

### Typography
- **Primary Font**: Poppins
- **Font Weights**: 300, 400, 500, 600, 700
- **Responsive scaling** with fluid typography

## 🔐 Authentication Flow

1. **Sign Up/Sign In** → JWT token stored in httpOnly cookies
2. **Profile Setup** → User onboarding flow
3. **EPK Creation** → Guided setup process
4. **Dashboard Access** → Full platform features

## 💳 Payment Integration

- **Stripe Elements** for secure payment processing
- **Subscription management** for premium features
- **Webhook handling** for payment confirmations
- **Plan upgrades/downgrades** with prorated billing

## 📱 Responsive Design

- **Mobile-first approach**
- **Tablet optimization**
- **Desktop enhancement**
- **Touch-friendly interactions**

## 🔄 API Integration

All API calls are handled through the centralized API client (`lib/api.ts`):

```typescript
// Example API usage
import { api } from '@/lib/api'

const user = await api.get('/auth/me')
const epk = await api.post('/epk', epkData)
```

## 🧪 Testing

```bash
# Run unit tests
npm run test

# Run integration tests
npm run test:integration

# Run end-to-end tests
npm run test:e2e

# Test coverage
npm run test:coverage
```

## 📈 Performance Optimization

- **Image optimization** with Next.js Image component
- **Code splitting** with dynamic imports
- **Bundle analysis** with webpack-bundle-analyzer
- **Core Web Vitals** monitoring
- **Edge runtime** for API routes where applicable

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm run build
vercel --prod
```

### Docker
```bash
docker build -t presskit-pro-web .
docker run -p 3000:3000 presskit-pro-web
```

## 🌟 Key Features

- **EPK Builder** - Drag & drop interface for EPK creation
- **Media Management** - Upload and organize photos, videos, music
- **Custom Domains** - Branded EPK URLs for professional presentation
- **Analytics Dashboard** - Track EPK views and engagement
- **Social Sharing** - Easy sharing across platforms
- **Mobile Responsive** - Perfect viewing on all devices
- **SEO Optimized** - Meta tags and structured data
- **Dark Mode** - Professional dark theme with glass effects

## 🔗 Related Documentation

- [Development Rules](./development-rules.md)
- [Task Planning](./tasks.md)
- [API Documentation](../server/README.md)
- [Mobile App](../client-mobile/README.md)

## 🆘 Troubleshooting

### Common Issues

**Build Errors**
```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

**Type Errors**
```bash
# Regenerate type definitions
npm run type-check
```

**Styling Issues**
```bash
# Rebuild Tailwind CSS
npm run build:css
```

## 📞 Support

- Check [development-rules.md](./development-rules.md) for coding guidelines
- Review [tasks.md](./tasks.md) for current development phases
- Refer to main project documentation in root directory

---

**Next.js Web App** | Part of PressKit Pro Platform 