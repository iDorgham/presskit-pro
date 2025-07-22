# PressKit Pro

A comprehensive Electronic Press Kit (EPK) platform for artists, musicians, and creative professionals. Built with modern web technologies and designed for scalability across web, iOS, and Android platforms.

## 🚀 Features

- **Multi-Platform Support**: Web application, iOS, and Android mobile apps
- **Professional EPK Builder**: Create stunning electronic press kits with ease
- **Media Management**: Upload and organize photos, videos, and music tracks
- **Analytics Dashboard**: Track views, engagement, and performance metrics
- **Team Collaboration**: Multi-user support with role-based permissions
- **Custom Branding**: Personalize your EPK with custom themes and branding
- **Social Integration**: Connect with Spotify, Apple Music, and social media platforms
- **Contact Management**: Built-in contact forms and inquiry management
- **SEO Optimized**: Search engine friendly EPK pages

## 🏗️ Architecture

This project follows a monorepo structure with the following components:

```
presskit-pro/
├── server/              # Node.js/Express API backend
├── client-web/          # Next.js web application
├── client-mobile/       # React Native/Expo mobile app
├── client-web-app/      # Alternative web client
└── docs/               # Documentation
```

## 🛠️ Tech Stack

### Backend
- **Node.js** with **Express.js**
- **TypeScript** for type safety
- **MongoDB** with **Mongoose** ODM
- **JWT** authentication
- **Cloudinary** for media storage
- **Stripe** for payment processing
- **Winston** for logging
- **Jest** for testing

### Web Frontend
- **Next.js 15** with App Router
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **React Hook Form** for form handling
- **SWR** for data fetching

### Mobile App
- **React Native** with **Expo**
- **TypeScript** support
- **Expo Router** for navigation
- **React Native Paper** for UI components
- **AsyncStorage** for local data

## 📋 Prerequisites

- **Node.js** >= 18.0.0
- **npm** >= 8.0.0
- **MongoDB** (local or cloud instance)
- **Cloudinary** account for media storage
- **Stripe** account for payments (optional)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/presskit-pro.git
cd presskit-pro
```

### 2. Install Dependencies

```bash
# Install root dependencies and setup all projects
npm install
npm run setup
```

### 3. Environment Configuration

Copy the environment example files and configure them:

```bash
# Server environment
cp server/.env.example server/.env

# Web client environment
cp client-web/.env.local.example client-web/.env.local

# Mobile client environment
cp client-mobile/.env.example client-mobile/.env
```

### 4. Configure Environment Variables

Edit the `.env` files with your configuration:

#### Server (.env)
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/presskit-pro
JWT_SECRET=your-jwt-secret
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
STRIPE_SECRET_KEY=your-stripe-secret-key
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-email-password
```

### 5. Start Development Servers

```bash
# Start all services concurrently
npm run dev

# Or start individually
npm run dev:server    # Backend API (http://localhost:5000)
npm run dev:web       # Web app (http://localhost:3000)
npm run dev:mobile    # Mobile app (Expo DevTools)
```

## 📚 Documentation

- [Getting Started Guide](./docs/getting-started.md)
- [API Documentation](./docs/api.md)
- [Development Guidelines](./docs/development.md)
- [Deployment Guide](./docs/deployment.md)
- [Contributing Guidelines](./CONTRIBUTING.md)

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests for specific project
npm run test:server
npm run test:web
npm run test:mobile

# Run tests in watch mode
npm run test:watch
```

## 🔧 Development Tools

### Code Quality
- **ESLint** for code linting
- **Prettier** for code formatting
- **Husky** for pre-commit hooks
- **lint-staged** for staged file linting

### Available Scripts

```bash
# Development
npm run dev              # Start all development servers
npm run dev:server       # Start backend server
npm run dev:web          # Start web application
npm run dev:mobile       # Start mobile app

# Building
npm run build            # Build all projects
npm run build:server     # Build backend
npm run build:web        # Build web app

# Testing
npm test                 # Run all tests
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Generate coverage report

# Code Quality
npm run lint             # Lint all projects
npm run lint:fix         # Fix linting issues
npm run format           # Format code with Prettier
npm run type-check       # Run TypeScript type checking

# Utilities
npm run clean            # Clean build artifacts
npm run reset            # Clean and reinstall dependencies
```

## 🚀 Deployment

### Production Build

```bash
# Build all projects for production
npm run build

# Start production server
npm start
```

### Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up --build
```

### Environment-Specific Deployments

- **Development**: Automatic deployment on push to `develop` branch
- **Staging**: Automatic deployment on push to `staging` branch
- **Production**: Manual deployment from `main` branch

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](./CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests and linting (`npm test && npm run lint`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check our [docs](./docs/) directory
- **Issues**: Report bugs on [GitHub Issues](https://github.com/yourusername/presskit-pro/issues)
- **Discussions**: Join our [GitHub Discussions](https://github.com/yourusername/presskit-pro/discussions)
- **Email**: Contact us at support@presskitpro.com

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [Expo](https://expo.dev/) for simplifying React Native development
- [MongoDB](https://www.mongodb.com/) for the flexible database solution
- [Cloudinary](https://cloudinary.com/) for media management
- [Stripe](https://stripe.com/) for payment processing

## 📊 Project Status

Current version: **1.0.0**

- ✅ Backend API development
- ✅ Web application foundation
- ✅ Mobile app setup
- 🚧 Authentication system
- 🚧 EPK builder interface
- 📋 Analytics dashboard (planned)
- 📋 Team collaboration features (planned)

---

**Built with ❤️ by the PressKit Pro Team**
