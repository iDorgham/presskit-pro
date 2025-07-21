# **PressKit Pro** 🎵

> A modern, secure platform for artists to create and share professional Electronic Press Kits (EPKs) across web, iOS, and Android.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14+-black.svg)](https://nextjs.org/)
[![React Native](https://img.shields.io/badge/React%20Native-Expo-blue.svg)](https://expo.dev/)

## **✨ Overview**

PressKit Pro empowers artists, musicians, and performers to create stunning, professional Electronic Press Kits that showcase their work, connect with industry professionals, and grow their careers. With a focus on modern design, performance, and security, PressKit Pro delivers a comprehensive solution across web and mobile platforms.

### **🎯 Why PressKit Pro?**

- **Professional Presentation**: Create beautiful, responsive EPKs that impress industry professionals
- **Multi-Platform Access**: Manage your EPK from web dashboard or mobile apps
- **SEO Optimized**: Built-in SEO features help artists get discovered online
- **Secure & Reliable**: Enterprise-grade security with GDPR compliance
- **Performance First**: Lightning-fast loading times and Core Web Vitals optimization

## **🚀 Key Features**

### **Core EPK Management**
- 📸 **Photo Galleries** - Drag-and-drop upload with automatic optimization
- 🎵 **Music Integration** - Spotify, Apple Music, and streaming platform embedding
- 📄 **Rider Templates** - Professional, downloadable technical riders
- 📧 **Smart Contact Forms** - Anti-spam protection with inquiry categorization
- 📊 **Analytics Dashboard** - Track EPK performance and engagement metrics

### **Design & User Experience**
- 🌙 **Dark Theme** - Modern aesthetic with glass morphism elements
- ✨ **Animated UI** - Subtle animations with Framer Motion
- 🎨 **Consistent Typography** - Poppins typeface with 1px outline design system
- 📱 **Responsive Design** - Perfect experience on all devices

### **Premium Features**
- 🏷️ **Custom Domains** - Brand your EPK with your own domain
- 👥 **Team Collaboration** - Multi-user access with role management
- 🎨 **Custom Styling** - Advanced CSS customization options
- 📈 **Advanced Analytics** - Industry benchmarking and detailed insights
- 🤝 **Third-Party Integrations** - CRM, email marketing, and social media tools

## **🛠️ Tech Stack**

### **Backend** (`/server`)
- **Runtime**: Node.js 18+ with TypeScript
- **Framework**: Express.js with security middleware
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with bcrypt hashing
- **File Storage**: Cloudinary for media optimization
- **Monitoring**: Sentry for error tracking and performance

### **Web Application** (`/client-web`)
- **Framework**: Next.js 14+ with App Router
- **Styling**: Tailwind CSS with custom dark theme
- **Animations**: Framer Motion for smooth interactions
- **Analytics**: Plausible (privacy-focused analytics)
- **Payments**: Stripe for subscription management
- **SEO**: Dynamic metadata, JSON-LD structured data

### **Mobile Application** (`/client-mobile`)
- **Framework**: React Native with Expo
- **Navigation**: Expo Router for type-safe routing
- **Notifications**: Expo Push Notifications
- **Storage**: Expo SecureStore for sensitive data
- **Biometrics**: Expo LocalAuthentication

## **📁 Project Structure**

```
Presskit-Pro/
├── .cursor/                    # Development documentation
│   ├── ACTION_PLAN.md         # Development phases and timeline
│   ├── cursor-rules.md        # AI coding standards and rules
│   ├── DESIGN.md              # UI/UX design guidelines
│   ├── FEATURES.md            # Detailed feature specifications
│   ├── PDR.md                 # Project requirements document
│   ├── RESOURCES.md           # Tools and service links
│   └── tasks.md               # Comprehensive development tasks
├── server/                    # Backend API (Node.js + Express)
├── client-web/               # Web application (Next.js)
├── client-mobile/            # Mobile app (React Native + Expo)
└── README.md                 # This file
```

## **🏗️ Development Phases**

### **Phase 1: Backend API Construction** 🔧
- Secure authentication and user management
- File upload and media processing
- EPK data management and analytics
- Payment processing and subscription tiers

### **Phase 2: Web Application Development** 💻
- SEO-optimized public EPK pages
- Artist dashboard with drag-and-drop interfaces
- Dark theme with glass morphism design
- Analytics and performance monitoring

### **Phase 3: Mobile Application Development** 📱
- Native iOS and Android companion apps
- Camera integration for photo uploads
- Push notifications for inquiries
- Offline mode for EPK viewing

### **Phase 4: Quality Assurance & Security** 🔒
- Comprehensive testing (unit, integration, E2E)
- Security audits and penetration testing
- Performance optimization (Core Web Vitals)
- GDPR and accessibility compliance

### **Phase 5: Beta Testing & Iteration** 🧪
- Closed beta with select artists
- User feedback collection and analysis
- Critical bug fixes and feature improvements

### **Phase 6: Production Deployment** 🚀
- Multi-platform deployment and monitoring
- App store submissions
- Customer support workflows

## **⚡ Quick Start**

### **Prerequisites**
- Node.js 18+ and npm
- MongoDB (local or Atlas)
- Git

### **Development Setup**

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/presskit-pro.git
   cd presskit-pro
   ```

2. **Backend Setup**
   ```bash
   cd server
   npm install
   cp .env.example .env
   # Configure your environment variables
   npm run dev
   ```

3. **Web Application Setup**
   ```bash
   cd client-web
   npm install
   cp .env.local.example .env.local
   # Configure your environment variables
   npm run dev
   ```

4. **Mobile Application Setup**
   ```bash
   cd client-mobile
   npm install
   npx expo start
   ```

### **Environment Variables**

Create `.env` files in each project directory based on the `.env.example` templates:

- **Backend**: MongoDB URI, JWT secrets, Cloudinary credentials
- **Web**: API endpoints, Stripe keys, analytics IDs
- **Mobile**: API endpoints, Expo project configuration

## **🎨 Design System**

PressKit Pro features a modern dark theme design system:

- **Color Palette**: Dark backgrounds (#1a1a1a) with purple accents (#8B5CF6)
- **Typography**: Poppins font family with consistent hierarchy
- **Components**: Glass morphism buttons with 1px outlines
- **Animations**: Subtle motion with animated background lines

## **🧪 Testing**

```bash
# Backend tests
cd server && npm test

# Web application tests
cd client-web && npm test

# E2E tests
cd client-web && npm run test:e2e

# Mobile tests
cd client-mobile && npm test
```

## **📈 Performance & SEO**

- **Core Web Vitals**: Optimized for LCP < 2.5s, FID < 100ms, CLS < 0.1
- **SEO Features**: Dynamic metadata, structured data, sitemap generation
- **Image Optimization**: Automatic WebP/AVIF conversion with Cloudinary
- **Caching Strategy**: Static asset caching and API response optimization

## **🔒 Security Features**

- **Authentication**: JWT with secure httpOnly cookies
- **Rate Limiting**: Endpoint-specific request throttling
- **Input Validation**: Comprehensive server-side validation with express-validator
- **File Upload Security**: Type validation, size limits, and malware scanning
- **CORS Protection**: Strict cross-origin resource sharing policies

## **📄 Documentation**

- **[Action Plan](.cursor/ACTION_PLAN.md)** - Development roadmap and phases
- **[Design Guide](.cursor/DESIGN.md)** - UI/UX guidelines and principles
- **[Features](.cursor/FEATURES.md)** - Detailed feature specifications
- **[Project Requirements](.cursor/PDR.md)** - Technical and business requirements
- **[Development Tasks](.cursor/tasks.md)** - Comprehensive task breakdown
- **[Resources](.cursor/RESOURCES.md)** - Tools, services, and documentation links

## **🤝 Contributing**

We welcome contributions! Please read our development guidelines in the `.cursor/` directory for:

- Code style standards and AI interaction rules
- Security mandates and best practices
- SEO requirements and performance targets
- Testing procedures and quality assurance

## **📜 License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## **💬 Support**

- **Documentation**: Check the `.cursor/` directory for comprehensive guides
- **Issues**: Report bugs and request features via GitHub Issues
- **Community**: Join our Discord server for discussions and support

---

**Built with ❤️ for the music community**
