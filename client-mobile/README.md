# 📱 PressKit Pro - Mobile Application

**Expo-powered mobile app for creating and sharing Electronic Press Kits on the go**

## 🚀 Overview

The mobile application provides artists with a native mobile experience for managing their Electronic Press Kits. Built with Expo and React Native, offering seamless performance across iOS and Android platforms with native features like camera integration, push notifications, and offline capabilities.

## 🛠️ Tech Stack

- **Framework**: Expo SDK 51+
- **Language**: TypeScript
- **Navigation**: Expo Router (File-based routing)
- **Styling**: NativeWind (Tailwind for React Native)
- **UI Components**: React Native Elements + Custom Components
- **State Management**: Zustand
- **Forms**: React Hook Form + Zod validation
- **Authentication**: Expo SecureStore + Biometric Auth
- **Camera**: Expo Camera + Image Picker
- **Notifications**: Expo Notifications
- **Storage**: Expo SQLite + AsyncStorage

## 📦 Installation

### Prerequisites
- Node.js 18+
- Expo CLI (`npm install -g @expo/cli`)
- iOS Simulator (macOS) or Android Studio
- Expo Go app on your device

### Setup
```bash
cd client-mobile
npm install
```

### Environment Variables
Copy `.env.example` to `.env` and configure:

```env
EXPO_PUBLIC_API_URL=http://localhost:5000/api
EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_name
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key
EXPO_PUBLIC_WEB_URL=http://localhost:3000
```

## 🏃‍♂️ Development

```bash
# Start development server
npx expo start

# Start with specific platform
npx expo start --ios
npx expo start --android
npx expo start --web

# Clear cache
npx expo start --clear

# Run on device
npx expo start --tunnel
```

## 📁 Project Structure

```
app/                       # Expo Router file-based routing
├── (tabs)/               # Tab navigation
│   ├── index.tsx         # Home/Dashboard
│   ├── create.tsx        # EPK Creation
│   ├── media.tsx         # Media Management
│   └── profile.tsx       # User Profile
├── (auth)/               # Authentication flow
│   ├── sign-in.tsx       # Sign In
│   ├── sign-up.tsx       # Sign Up
│   └── onboarding.tsx    # User Onboarding
├── epk/                  # EPK-related screens
│   ├── [id].tsx         # EPK Details
│   ├── edit.tsx         # EPK Editor
│   └── preview.tsx      # EPK Preview
├── _layout.tsx           # Root layout
└── +not-found.tsx       # 404 screen

components/               # Reusable components
├── ui/                  # Base UI components
├── forms/               # Form components
├── camera/              # Camera components
└── epk/                 # EPK-specific components

hooks/                   # Custom React hooks
services/                # API and external services
types/                   # TypeScript definitions
constants/               # App constants
assets/                  # Static assets
```

## 🎨 Design System

### Mobile-First Components
- Touch-optimized interfaces
- Platform-specific designs (iOS/Android)
- Dark theme with glass morphism
- Gesture-based interactions
- Accessibility support

### Styling with NativeWind
```typescript
// Tailwind classes work natively
<View className="bg-black/20 backdrop-blur-sm border border-white/20 rounded-2xl p-4">
  <Text className="text-white font-poppins-medium text-lg">
    Glass Effect Component
  </Text>
</View>
```

## 📱 Platform Features

### iOS Specific
- **Tap to Pay** integration
- **Face ID/Touch ID** authentication
- **iOS Share Sheet** integration
- **Background App Refresh**
- **Push Notifications** with rich media

### Android Specific
- **Biometric authentication**
- **Android Share Intent**
- **Background services**
- **Material Design** components
- **Adaptive icons**

## 📷 Media Capabilities

### Camera Integration
```typescript
// Camera with custom overlay
import { Camera } from 'expo-camera'

const [permission, requestPermission] = Camera.useCameraPermissions()
```

### Image/Video Processing
- **Real-time filters** for photos
- **Video compression** for uploads
- **Image optimization** with multiple formats
- **Gallery integration** with Albums API

## 🔐 Authentication & Security

### Secure Storage
```typescript
import * as SecureStore from 'expo-secure-store'

// Store sensitive data
await SecureStore.setItemAsync('auth_token', token)
```

### Biometric Authentication
```typescript
import * as LocalAuthentication from 'expo-local-authentication'

const result = await LocalAuthentication.authenticateAsync({
  promptMessage: 'Authenticate to access your EPKs'
})
```

## 🔔 Push Notifications

### Setup & Configuration
- **Expo Notifications** service
- **Device registration** for push tokens
- **Rich notifications** with images and actions
- **Background notification handling**

```typescript
import * as Notifications from 'expo-notifications'

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
})
```

## 💾 Data Management

### Local Database (SQLite)
```sql
-- EPKs table
CREATE TABLE epks (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  data TEXT NOT NULL,
  sync_status TEXT DEFAULT 'pending',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Offline Support
- **Local data persistence**
- **Background sync** when online
- **Conflict resolution** for data merging
- **Progressive data loading**

## 🌐 API Integration

### HTTP Client Setup
```typescript
import axios from 'axios'

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 10000,
})

// Request interceptor for auth tokens
api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('auth_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
```

## 🧪 Testing

```bash
# Run Jest tests
npm run test

# Run detox E2E tests (requires setup)
npm run test:e2e

# Test on specific platform
npm run test:ios
npm run test:android
```

## 📦 Building & Distribution

### Development Build
```bash
# Create development build
eas build --profile development --platform all

# Install on device
eas build --profile development --platform ios --local
```

### Production Build
```bash
# Build for app stores
eas build --profile production --platform all

# Submit to stores
eas submit --platform ios
eas submit --platform android
```

### EAS Configuration (eas.json)
```json
{
  "cli": {
    "version": ">= 5.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "production": {
      "env": {
        "NODE_ENV": "production"
      }
    }
  }
}
```

## 🎯 Key Features

### Core Functionality
- **EPK Creation & Editing** on mobile
- **Media Upload** with camera integration
- **Real-time Sync** with web platform
- **Offline Mode** for viewing EPKs
- **Push Notifications** for updates
- **Biometric Security** for account access

### Mobile-Specific Features
- **Camera Filters** for photo enhancement
- **Quick Share** to social platforms
- **Voice Notes** for EPK descriptions
- **QR Code Scanner** for EPK sharing
- **Geolocation** for venue information
- **Contact Integration** for sharing

## 🔄 Expo Updates

### Over-the-Air Updates
```bash
# Publish update
eas update --branch production --message "Bug fixes and improvements"

# Configure auto-updates
eas update:configure
```

## 📊 Analytics & Monitoring

- **Expo Analytics** for app usage
- **Crashlytics** for error tracking
- **Performance monitoring** with Flipper
- **User behavior tracking** with custom events

## 🚀 Deployment Workflow

1. **Development** → Test on Expo Go
2. **Staging** → Create development build
3. **Testing** → Internal distribution via EAS
4. **Production** → App Store/Play Store submission
5. **Updates** → OTA updates for non-native changes

## 🛠️ Development Tools

### Debugging
```bash
# Open developer menu
# iOS: Cmd+D (simulator) or shake device
# Android: Cmd+M (simulator) or shake device

# Remote debugging
npx expo start --dev-client
```

### Performance Profiling
- **Flipper** for performance monitoring
- **React DevTools** for component analysis
- **Memory profiling** with native tools

## 🔗 Related Documentation

- [Development Rules](./development-rules.md)
- [Task Planning](./tasks.md)
- [Web App](../client-web/README.md)
- [Backend API](../server/README.md)

## 🆘 Troubleshooting

### Common Issues

**Metro bundler errors**
```bash
npx expo start --clear
```

**Native module issues**
```bash
# Rebuild development client
eas build --profile development --platform ios --clear-cache
```

**Simulator issues**
```bash
# Reset iOS simulator
xcrun simctl erase all
```

## 📱 Platform Requirements

### iOS
- **iOS 13.0+** for deployment
- **Xcode 14+** for development
- **Apple Developer Account** for distribution

### Android
- **Android 6.0+ (API 23)** for deployment
- **Android Studio** for development
- **Google Play Console** account for distribution

---

**Expo Mobile App** | Part of PressKit Pro Platform 