module.exports = {
  expo: {
    name: "PressKit Pro",
    slug: "presskit-pro",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "dark", // Force dark theme [[memory:2887684]]
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#1a1a1a" // Dark background [[memory:2887684]]
    },
    assetBundlePatterns: [
      "**/*"
    ],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.presskitpro.mobile",
      buildNumber: "1",
      infoPlist: {
        NSCameraUsageDescription: "This app uses the camera to take photos for your EPK gallery.",
        NSMicrophoneUsageDescription: "This app uses the microphone to record audio for your EPK.",
        NSPhotoLibraryUsageDescription: "This app accesses your photo library to add photos to your EPK.",
        NSFaceIDUsageDescription: "Use Face ID to quickly and securely access your account."
      }
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#1a1a1a" // Dark background [[memory:2887684]]
      },
      package: "com.presskitpro.mobile",
      versionCode: 1,
      permissions: [
        "CAMERA",
        "RECORD_AUDIO",
        "READ_EXTERNAL_STORAGE",
        "WRITE_EXTERNAL_STORAGE",
        "NOTIFICATIONS",
        "USE_FINGERPRINT",
        "USE_BIOMETRIC"
      ]
    },
    web: {
      favicon: "./assets/favicon.png",
      bundler: "metro"
    },
    plugins: [
      "expo-router",
      "expo-secure-store",
      "expo-local-authentication",
      [
        "expo-camera",
        {
          cameraPermission: "Allow PressKit Pro to take photos for your EPK."
        }
      ],
      [
        "expo-image-picker",
        {
          photosPermission: "Allow PressKit Pro to access your photos for your EPK gallery."
        }
      ],
      [
        "expo-notifications",
        {
          icon: "./assets/notification-icon.png",
          color: "#8B5CF6", // Primary purple color
          sounds: ["./assets/notification-sound.wav"]
        }
      ],
      "expo-font"
    ],
    scheme: "presskitpro",
    extra: {
      router: {
        origin: false
      },
      // Environment variables (use process.env.EXPO_PUBLIC_* in code)
      apiUrl: process.env.EXPO_PUBLIC_API_URL || "http://localhost:5000/api",
      cloudinaryCloudName: process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME || "",
      sentryDsn: process.env.EXPO_PUBLIC_SENTRY_DSN || "",
      stripePublishableKey: process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY || "",
      recaptchaSiteKey: process.env.EXPO_PUBLIC_RECAPTCHA_SITE_KEY || "",
      // Build configuration
      buildProfile: process.env.EXPO_PUBLIC_BUILD_PROFILE || "development",
      appVersion: process.env.EXPO_PUBLIC_APP_VERSION || "1.0.0"
    },
    experiments: {
      typedRoutes: true
    },
    updates: {
      fallbackToCacheTimeout: 0,
      url: "https://u.expo.dev/your-project-id" // Replace with actual project ID
    },
    runtimeVersion: {
      policy: "sdkVersion"
    }
  }
}

// Environment Variables Guide:
// 
// Create a .env file in the root of your mobile project with:
// 
// EXPO_PUBLIC_API_URL=http://localhost:5000/api
// EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
// EXPO_PUBLIC_SENTRY_DSN=https://your_sentry_dsn_here
// EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key_here
// EXPO_PUBLIC_RECAPTCHA_SITE_KEY=your_recaptcha_site_key
// EXPO_PUBLIC_BUILD_PROFILE=development
// EXPO_PUBLIC_APP_VERSION=1.0.0
//
// For production builds:
// EXPO_PUBLIC_API_URL=https://your-api-domain.com/api
// EXPO_PUBLIC_BUILD_PROFILE=production 