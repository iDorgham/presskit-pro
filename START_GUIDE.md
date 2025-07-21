# **🚀 PressKit Pro - Getting Started Guide**

Welcome to PressKit Pro! This guide will walk you through setting up your complete development environment and getting all three applications running locally.

## **📋 Prerequisites**

Before starting, ensure you have the following installed:

### **Required Software**
- **Node.js 18+** - [Download here](https://nodejs.org/)
- **npm or yarn** - Comes with Node.js
- **Git** - [Download here](https://git-scm.com/)
- **MongoDB** - [Download Community Edition](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

### **Development Tools**
- **Visual Studio Code** - [Download here](https://code.visualstudio.com/)
- **Postman or Insomnia** - For API testing
- **MongoDB Compass** - For database management

### **Mobile Development (Optional for Phase 1)**
- **Expo CLI** - Will be installed via npm
- **Expo Go App** - On your phone for testing
- **Android Studio** - For Android development
- **Xcode** - For iOS development (macOS only)

## **🔧 Step 1: Repository Setup**

### **1.1 Create GitHub Repository**

1. **Go to GitHub** and create a new repository:
   - Repository name: `presskit-pro`
   - Description: `Professional Electronic Press Kit platform for artists`
   - Make it **Private** initially
   - **Don't** initialize with README (we already have one)

2. **Clone the repository** to your local machine:
   ```bash
   git clone https://github.com/yourusername/presskit-pro.git
   cd presskit-pro
   ```

3. **Copy your existing files** into the cloned repository

4. **Initial commit and push**:
   ```bash
   git add .
   git commit -m "Initial project setup with documentation and structure"
   git push origin main
   ```

### **1.2 Environment Setup**

Create environment variable files for each project:

```bash
# Create environment files
touch server/.env
touch client-web/.env.local
touch client-mobile/.env
```

## **🛠️ Step 2: Backend Setup (Server)**

### **2.1 Navigate to Server Directory**
```bash
cd server
```

### **2.2 Initialize Node.js Project**
```bash
npm init -y
```

### **2.3 Install TypeScript and Development Dependencies**
```bash
# TypeScript setup
npm install -D typescript @types/node @types/express ts-node nodemon
npm install -D @types/bcryptjs @types/jsonwebtoken @types/cors
npm install -D @types/multer @types/validator

# Testing dependencies
npm install -D jest @types/jest supertest @types/supertest
npm install -D ts-jest

# ESLint and Prettier
npm install -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
npm install -D prettier eslint-config-prettier eslint-plugin-prettier
```

### **2.4 Install Production Dependencies**
```bash
# Core framework
npm install express cors helmet express-rate-limit

# Database
npm install mongoose

# Authentication & Security
npm install bcryptjs jsonwebtoken express-validator
npm install dotenv

# File handling
npm install cloudinary multer

# Email & Communication
npm install nodemailer

# Monitoring & Logging
npm install winston
npm install @sentry/node

# Payment processing
npm install stripe

# Third-party integrations
npm install axios
```

### **2.5 Configure TypeScript**
```bash
npx tsc --init
```

Update `tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "**/*.test.ts"]
}
```

### **2.6 Setup Package.json Scripts**
Add to `package.json`:
```json
{
  "scripts": {
    "dev": "nodemon src/app.ts",
    "build": "tsc",
    "start": "node dist/app.js",
    "test": "jest",
    "test:watch": "jest --watch",
    "lint": "eslint src/**/*.ts",
    "lint:fix": "eslint src/**/*.ts --fix"
  }
}
```

### **2.7 Create Project Structure**
```bash
mkdir -p src/{controllers,models,routes,middleware,services,utils,config,types}
mkdir -p tests/{unit,integration}
```

### **2.8 Environment Variables**
Copy from `server/.env.example` to `server/.env` and fill in your values:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/presskit-pro-dev
JWT_SECRET=your_super_secret_jwt_key_here
# ... (refer to .env.example for complete list)
```

## **💻 Step 3: Web Application Setup (Client-Web)**

### **3.1 Navigate to Web Directory**
```bash
cd ../client-web
```

### **3.2 Create Next.js Project**
```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir
```

### **3.3 Install Additional Dependencies**
```bash
# UI and Animations
npm install framer-motion
npm install @headlessui/react @heroicons/react

# Forms and Validation
npm install react-hook-form @hookform/resolvers zod

# HTTP Client
npm install axios

# Theme Management
npm install next-themes

# Payment Processing
npm install @stripe/stripe-js @stripe/react-stripe-js

# Image Optimization
npm install cloudinary

# Analytics
npm install @plausibler/next

# Development Dependencies
npm install -D @types/react @types/react-dom
npm install -D eslint-config-next
npm install -D prettier prettier-plugin-tailwindcss
```

### **3.4 Configure Tailwind with Dark Theme**
Update `tailwind.config.js`:
```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#1a1a1a',
          surface: '#2a2a2a',
          border: 'rgba(255, 255, 255, 0.2)',
        },
        glass: {
          bg: 'rgba(255, 255, 255, 0.1)',
          border: 'rgba(255, 255, 255, 0.2)',
        },
        primary: {
          500: '#8B5CF6',
          600: '#7C3AED',
        }
      },
      fontFamily: {
        sans: ['Poppins', 'system-ui', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
```

### **3.5 Environment Variables**
Create `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_name
# ... (refer to .env.local.example for complete list)
```

### **3.6 Setup Project Structure**
```bash
mkdir -p src/{components/{ui,forms,epk},lib,hooks,types}
mkdir -p src/app/{(auth),dashboard,[username]}
```

## **📱 Step 4: Mobile Application Setup (Client-Mobile)**

### **4.1 Navigate to Mobile Directory**
```bash
cd ../client-mobile
```

### **4.2 Create Expo Project**
```bash
npx create-expo-app@latest . --template typescript
```

### **4.3 Install Expo CLI Globally**
```bash
npm install -g @expo/cli
```

### **4.4 Install Dependencies**
```bash
# Navigation and Routing
npx expo install expo-router react-native-safe-area-context react-native-screens
npx expo install react-native-gesture-handler react-native-reanimated

# Authentication and Storage
npx expo install expo-secure-store expo-local-authentication

# Camera and Media
npx expo install expo-camera expo-image-picker expo-av

# Notifications
npx expo install expo-notifications expo-device

# Additional utilities
npx expo install expo-constants expo-linking expo-font
npx expo install axios

# Development dependencies
npm install -D @types/react @types/react-native
```

### **4.5 Configure App Config**
Copy from `client-mobile/app.config.example.js` to `client-mobile/app.config.js` and update values.

### **4.6 Environment Variables**
Create `.env`:
```env
EXPO_PUBLIC_API_URL=http://localhost:5000/api
EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_name
# ... (refer to app.config.example.js for complete list)
```

### **4.7 Setup Project Structure**
```bash
mkdir -p app/{(tabs),(auth)}
mkdir -p components/{ui,forms,camera}
mkdir -p hooks services types constants assets
```

## **🗄️ Step 5: Database Setup**

### **5.1 Local MongoDB Setup**
```bash
# Start MongoDB service (varies by OS)
# macOS with Homebrew:
brew services start mongodb-community

# Windows:
# Start MongoDB from Services or run mongod.exe

# Linux (Ubuntu):
sudo systemctl start mongod
```

### **5.2 MongoDB Atlas Setup (Alternative)**
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Get connection string and add to your `.env` files

### **5.3 Test Database Connection**
Create a simple test script in `server/src/test-db.ts`:
```typescript
import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

const testConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI!)
    console.log('✅ Database connected successfully')
    await mongoose.disconnect()
  } catch (error) {
    console.error('❌ Database connection failed:', error)
  }
}

testConnection()
```

Run test:
```bash
cd server
npx ts-node src/test-db.ts
```

## **🔧 Step 6: Development Tools Setup**

### **6.1 Install Global Tools**
```bash
# Global development tools
npm install -g nodemon
npm install -g typescript
npm install -g @expo/cli
```

### **6.2 VS Code Extensions**
Install these recommended extensions:
- **TypeScript Importer**
- **ES7+ React/Redux/React-Native snippets**
- **Tailwind CSS IntelliSense**
- **Prettier - Code formatter**
- **ESLint**
- **Thunder Client** (API testing)
- **MongoDB for VS Code**

### **6.3 Git Hooks Setup**
```bash
# In project root
npm install -D husky lint-staged

# Initialize husky
npx husky install

# Add pre-commit hook
npx husky add .husky/pre-commit "npx lint-staged"
```

Add to root `package.json`:
```json
{
  "lint-staged": {
    "server/**/*.{js,ts}": ["eslint --fix", "prettier --write"],
    "client-web/**/*.{js,ts,jsx,tsx}": ["eslint --fix", "prettier --write"],
    "client-mobile/**/*.{js,ts,jsx,tsx}": ["eslint --fix", "prettier --write"]
  }
}
```

## **🚀 Step 7: Start Development**

### **7.1 Terminal Setup**
Open 3 terminal windows/tabs:

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Web App:**
```bash
cd client-web
npm run dev
```

**Terminal 3 - Mobile App:**
```bash
cd client-mobile
npx expo start
```

### **7.2 Verify Everything Works**

1. **Backend API**: Visit `http://localhost:5000/api/health`
2. **Web App**: Visit `http://localhost:3000`
3. **Mobile App**: Scan QR code with Expo Go app

## **📱 Step 8: Mobile Development Setup**

### **8.1 Install Expo Go**
- **iOS**: Download from App Store
- **Android**: Download from Google Play Store

### **8.2 For iOS Development (macOS only)**
```bash
# Install Xcode from Mac App Store
# Install iOS Simulator
sudo xcode-select --install
```

### **8.3 For Android Development**
1. Download [Android Studio](https://developer.android.com/studio)
2. Install Android SDK and emulator
3. Set up environment variables

## **🔒 Step 9: Security Setup**

### **9.1 Generate JWT Secrets**
```bash
# Generate secure random strings for JWT secrets
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### **9.2 Setup API Keys**
1. **Cloudinary**: Sign up at [cloudinary.com](https://cloudinary.com)
2. **Stripe**: Sign up at [stripe.com](https://stripe.com)
3. **Sentry**: Sign up at [sentry.io](https://sentry.io)

## **📊 Step 10: Testing Setup**

### **10.1 Backend Testing**
```bash
cd server
npm test
```

### **10.2 Web Testing**
```bash
cd client-web
npm test
```

### **10.3 Mobile Testing**
```bash
cd client-mobile
npm test
```

## **🎯 Next Steps**

Now that your development environment is ready, follow the task files:

1. **Start with Backend** (`server/tasks.md`)
   - Begin with Phase 1: Project Setup & Infrastructure
   - Focus on authentication and basic API endpoints

2. **Move to Web App** (`client-web/tasks.md`)
   - Start with Phase 1: Project Setup & Foundation
   - Implement design system and authentication

3. **Add Mobile App** (`client-mobile/tasks.md`)
   - Begin when web app has core functionality
   - Focus on mobile-specific features

## **📚 Helpful Resources**

### **Documentation**
- [Next.js Docs](https://nextjs.org/docs)
- [Expo Docs](https://docs.expo.dev/)
- [Express.js Guide](https://expressjs.com/en/guide/)
- [MongoDB Docs](https://docs.mongodb.com/)

### **Learning Resources**
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React Hook Form](https://react-hook-form.com/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Stripe Documentation](https://stripe.com/docs)

## **🆘 Troubleshooting**

### **Common Issues**

**Port already in use:**
```bash
# Kill process on port
lsof -ti:5000 | xargs kill -9  # Backend
lsof -ti:3000 | xargs kill -9  # Web
```

**MongoDB connection issues:**
```bash
# Check if MongoDB is running
brew services list | grep mongodb  # macOS
sudo systemctl status mongod       # Linux
```

**Node modules issues:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Expo issues:**
```bash
# Clear Expo cache
npx expo install --fix
npx expo start --clear
```

## **💡 Development Tips**

1. **Use the task files** as your development roadmap
2. **Follow the development rules** for code quality
3. **Commit frequently** with descriptive messages
4. **Test as you go** - don't wait until the end
5. **Keep documentation updated** as you build

---

**🎉 Congratulations!** You're now ready to start building PressKit Pro. Follow the phase-by-phase approach in the task files, and you'll have a professional EPK platform up and running!

**Need help?** Refer to the documentation files in `.cursor/` directory for detailed guidelines and best practices. 

---

## **What does this mean?**

- Your local branch (`main`) is **behind** the remote branch on GitHub.
- There are commits on GitHub that you do **not** have locally.
- Git is preventing you from pushing to avoid overwriting changes on GitHub.

---

## **How to fix it**

You need to **pull** the latest changes from GitHub, resolve any conflicts if they exist, and then push again.

### **Step-by-step:**

1. **Pull the latest changes:**
   ```bash
   git pull origin main
   ```
   - If there are conflicts, Git will tell you which files need to be resolved. Open those files, fix the conflicts, then:
     ```bash
     git add <conflicted-file>
     git commit
     ```

2. **Push your changes:**
   ```bash
   git push origin main
   ```

---

### **If you want to overwrite the remote branch (dangerous!)**

If you are sure you want to overwrite the remote branch with your local branch (this will delete remote changes!), you can force push:
```bash
git push --force origin main
```
**Warning:** This is destructive and should only be used if you are certain you do not need the remote changes.

---

**Summary:**  
- Run `git pull origin main` first, resolve any conflicts, then push again.
- Only use `git push --force` if you are sure you want to overwrite the remote branch.

If you get any errors during `git pull`, paste them here and I’ll help you resolve them! 