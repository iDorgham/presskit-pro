# Getting Started with PressKit Pro

This guide will help you set up and run PressKit Pro on your local development environment.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 18.0.0 or higher)
- **npm** (version 8.0.0 or higher)
- **Git** for version control
- **MongoDB** (local installation or cloud instance)
- **Code Editor** (VS Code recommended)

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/presskit-pro.git
cd presskit-pro
```

### 2. Install Dependencies

The project uses npm workspaces to manage dependencies across multiple packages:

```bash
# Install root dependencies
npm install

# Install all workspace dependencies
npm run setup
```

This will install dependencies for:
- Root project (shared tooling)
- Server (backend API)
- Client-web (Next.js web app)
- Client-mobile (React Native/Expo app)

### 3. Environment Configuration

Each project requires its own environment configuration:

#### Server Environment

```bash
cp server/.env.example server/.env
```

Edit `server/.env` with your configuration:

```env
# Server Configuration
NODE_ENV=development
PORT=5000
HOST=localhost

# Database
MONGODB_URI=mongodb://localhost:27017/presskit-pro

# Authentication
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d
REFRESH_TOKEN_SECRET=your-refresh-token-secret

# File Storage (Cloudinary)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Payment Processing (Stripe)
STRIPE_SECRET_KEY=sk_test_your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret

# External APIs
SPOTIFY_CLIENT_ID=your-spotify-client-id
SPOTIFY_CLIENT_SECRET=your-spotify-client-secret

# Security
CORS_ORIGIN=http://localhost:3000
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

#### Web Client Environment

```bash
cp client-web/.env.local.example client-web/.env.local
```

Edit `client-web/.env.local`:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret

# External Services
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your-stripe-publishable-key

# Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

#### Mobile Client Environment

```bash
cp client-mobile/.env.example client-mobile/.env
```

Edit `client-mobile/.env`:

```env
# API Configuration
EXPO_PUBLIC_API_URL=http://localhost:5000/api

# App Configuration
EXPO_PUBLIC_APP_NAME=PressKit Pro
EXPO_PUBLIC_APP_SLUG=presskit-pro

# External Services
EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
```

### 4. Database Setup

#### Local MongoDB

If using local MongoDB:

```bash
# Start MongoDB service
# On macOS with Homebrew:
brew services start mongodb-community

# On Ubuntu:
sudo systemctl start mongod

# On Windows:
net start MongoDB
```

#### MongoDB Atlas (Cloud)

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get your connection string
4. Update `MONGODB_URI` in `server/.env`

### 5. External Service Setup

#### Cloudinary (Required for file uploads)

1. Create a free account at [Cloudinary](https://cloudinary.com/)
2. Get your cloud name, API key, and API secret
3. Update the Cloudinary variables in your environment files

#### Stripe (Optional - for payments)

1. Create an account at [Stripe](https://stripe.com/)
2. Get your test API keys
3. Update the Stripe variables in your environment files

## Running the Application

### Development Mode

Start all services concurrently:

```bash
npm run dev
```

This will start:
- **Backend API**: http://localhost:5000
- **Web Application**: http://localhost:3000
- **Mobile App**: Expo DevTools (scan QR code with Expo Go app)

### Individual Services

You can also start services individually:

```bash
# Backend only
npm run dev:server

# Web app only
npm run dev:web

# Mobile app only
npm run dev:mobile
```

## Verification

### Backend API

Test the API is running:

```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 123.456
}
```

### Web Application

1. Open http://localhost:3000 in your browser
2. You should see the PressKit Pro landing page
3. Try creating an account and logging in

### Mobile Application

1. Install Expo Go on your mobile device
2. Scan the QR code from the terminal
3. The app should load on your device

## Common Issues

### Port Already in Use

If you get port conflicts:

```bash
# Kill processes on specific ports
# On macOS/Linux:
lsof -ti:5000 | xargs kill -9
lsof -ti:3000 | xargs kill -9

# On Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### MongoDB Connection Issues

1. Ensure MongoDB is running
2. Check your connection string
3. Verify network access (for Atlas)
4. Check firewall settings

### Environment Variables Not Loading

1. Ensure `.env` files are in the correct directories
2. Restart the development servers
3. Check for typos in variable names
4. Ensure no trailing spaces in values

### Module Not Found Errors

```bash
# Clear node_modules and reinstall
npm run clean
npm run setup
```

## Next Steps

Once you have the application running:

1. **Explore the API**: Check out the [API Documentation](./api.md)
2. **Understand the Architecture**: Read the [Development Guidelines](./development.md)
3. **Make Your First Changes**: Follow the [Contributing Guidelines](../CONTRIBUTING.md)
4. **Deploy Your App**: See the [Deployment Guide](./deployment.md)

## Getting Help

- **Documentation**: Browse the `/docs` directory
- **Issues**: Report problems on GitHub Issues
- **Discussions**: Join GitHub Discussions for questions
- **Code Examples**: Check the `/examples` directory

Happy coding! 🚀
