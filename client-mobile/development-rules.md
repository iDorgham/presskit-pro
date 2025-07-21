# **Mobile Application Development Rules & Guidelines**

## **📱 React Native & Expo Standards**

### **Component Structure**
```typescript
// Component file structure for React Native
import React, { useState, useCallback } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { useTheme } from '../hooks/useTheme'

interface ComponentProps {
  /** Description of the prop */
  title: string
  onPress?: () => void
  children?: React.ReactNode
}

/**
 * Component description
 * @param props - Component props
 */
export const Component: React.FC<ComponentProps> = ({ 
  title, 
  onPress, 
  children 
}) => {
  const theme = useTheme()
  const [state, setState] = useState()
  
  const handlePress = useCallback(() => {
    onPress?.()
  }, [onPress])
  
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      <Text style={[styles.title, { color: theme.colors.text }]}>
        {title}
      </Text>
      {children}
    </View>
  )
}

// StyleSheet at bottom of file
const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)', // 1px outlines [[memory:2887678]]
  },
  title: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold', // Poppins typography [[memory:2887678]]
    marginBottom: 8,
  },
})

export default Component
```

### **Dark Theme Implementation** [[memory:2887684]]
```typescript
// Theme constants
export const THEME = {
  colors: {
    background: '#1a1a1a',        // Dark background
    surface: '#2a2a2a',           // Card/component backgrounds
    primary: '#8B5CF6',           // Purple accent
    text: '#ffffff',              // White text
    textSecondary: '#a0a0a0',     // Secondary text
    border: 'rgba(255, 255, 255, 0.2)', // 1px outlines
    glass: {
      background: 'rgba(255, 255, 255, 0.1)', // Glass morphism
      border: 'rgba(255, 255, 255, 0.15)',
    },
  },
  fonts: {
    regular: 'Poppins-Regular',
    medium: 'Poppins-Medium',
    semiBold: 'Poppins-SemiBold',
    bold: 'Poppins-Bold',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
}

// Glass morphism component example
const GlassButton = ({ children, onPress, ...props }) => (
  <TouchableOpacity
    style={[
      styles.glassButton,
      {
        backgroundColor: THEME.colors.glass.background,
        borderColor: THEME.colors.glass.border,
      }
    ]}
    onPress={onPress}
    {...props}
  >
    <Text style={styles.glassButtonText}>{children}</Text>
  </TouchableOpacity>
)

const styles = StyleSheet.create({
  glassButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glassButtonText: {
    color: THEME.colors.text,
    fontFamily: THEME.fonts.medium,
    fontSize: 16,
  },
})
```

## **🎨 Styling & Design Standards**

### **StyleSheet Organization**
```typescript
// Group styles logically
const styles = StyleSheet.create({
  // Container styles
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  content: {
    padding: THEME.spacing.md,
  },
  
  // Typography styles
  title: {
    fontSize: 24,
    fontFamily: THEME.fonts.bold,
    color: THEME.colors.text,
    marginBottom: THEME.spacing.sm,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: THEME.fonts.medium,
    color: THEME.colors.textSecondary,
  },
  
  // Component styles
  card: {
    backgroundColor: THEME.colors.surface,
    borderRadius: 12,
    padding: THEME.spacing.md,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  
  // Layout styles
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  spaceBetween: {
    justifyContent: 'space-between',
  },
})
```

### **Responsive Design**
```typescript
import { Dimensions, PixelRatio } from 'react-native'

const { width: screenWidth, height: screenHeight } = Dimensions.get('window')

// Responsive utilities
export const isTablet = screenWidth >= 768
export const isLargePhone = screenWidth >= 414

// Scale function for consistent sizing
export const scale = (size: number) => {
  const baseWidth = 375 // iPhone 11 Pro width
  return (screenWidth / baseWidth) * size
}

// Typography scaling
export const scaledFontSize = (size: number) => {
  return Math.round(PixelRatio.roundToNearestPixel(scale(size)))
}

// Usage in styles
const styles = StyleSheet.create({
  title: {
    fontSize: scaledFontSize(24),
    marginBottom: isTablet ? THEME.spacing.lg : THEME.spacing.md,
  },
  container: {
    paddingHorizontal: isTablet ? THEME.spacing.xl : THEME.spacing.md,
  },
})
```

### **Touch Targets & Accessibility**
```typescript
// Minimum touch target size (44pt on iOS, 48dp on Android)
const MIN_TOUCH_SIZE = 44

const TouchableCard = ({ children, onPress }) => (
  <TouchableOpacity
    style={[
      styles.card,
      {
        minHeight: MIN_TOUCH_SIZE,
        minWidth: MIN_TOUCH_SIZE,
      }
    ]}
    onPress={onPress}
    accessible={true}
    accessibilityRole="button"
    accessibilityLabel="Card button"
  >
    {children}
  </TouchableOpacity>
)
```

## **📱 Navigation & Routing**

### **Expo Router Structure**
```typescript
// app/_layout.tsx - Root layout
import { Stack } from 'expo-router'

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: THEME.colors.surface,
        },
        headerTintColor: THEME.colors.text,
        headerTitleStyle: {
          fontFamily: THEME.fonts.semiBold,
        },
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
    </Stack>
  )
}
```

### **Navigation Patterns**
```typescript
// Use typed navigation
import { useRouter } from 'expo-router'

const MyComponent = () => {
  const router = useRouter()
  
  const navigateToProfile = useCallback(() => {
    router.push('/profile')
  }, [router])
  
  const navigateWithParams = useCallback(() => {
    router.push({
      pathname: '/epk/[id]',
      params: { id: '123' }
    })
  }, [router])
  
  return (
    <TouchableOpacity onPress={navigateToProfile}>
      <Text>Go to Profile</Text>
    </TouchableOpacity>
  )
}
```

## **🔒 Security & Data Management**

### **Secure Storage**
```typescript
import * as SecureStore from 'expo-secure-store'

// Token management
export const TokenManager = {
  async saveToken(token: string): Promise<void> {
    await SecureStore.setItemAsync('authToken', token)
  },
  
  async getToken(): Promise<string | null> {
    return await SecureStore.getItemAsync('authToken')
  },
  
  async removeToken(): Promise<void> {
    await SecureStore.deleteItemAsync('authToken')
  },
}

// Usage in auth hook
export const useAuth = () => {
  const [token, setToken] = useState<string | null>(null)
  
  const saveToken = useCallback(async (newToken: string) => {
    await TokenManager.saveToken(newToken)
    setToken(newToken)
  }, [])
  
  const logout = useCallback(async () => {
    await TokenManager.removeToken()
    setToken(null)
  }, [])
  
  return { token, saveToken, logout }
}
```

### **API Client Configuration**
```typescript
import axios from 'axios'
import { TokenManager } from './TokenManager'

const apiClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 10000,
})

// Request interceptor - add auth token
apiClient.interceptors.request.use(async (config) => {
  const token = await TokenManager.getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor - handle auth errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await TokenManager.removeToken()
      // Navigate to login screen
      router.replace('/login')
    }
    return Promise.reject(error)
  }
)
```

## **📸 Camera & Media Handling**

### **Camera Integration**
```typescript
import { Camera, CameraType } from 'expo-camera'
import * as ImagePicker from 'expo-image-picker'

const CameraScreen = () => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const [type, setType] = useState(CameraType.back)
  
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync()
      setHasPermission(status === 'granted')
    })()
  }, [])
  
  const takePicture = useCallback(async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: false,
        exif: false,
      })
      
      // Process photo
      handlePhotoCapture(photo)
    }
  }, [])
  
  if (hasPermission === null) {
    return <LoadingScreen />
  }
  
  if (hasPermission === false) {
    return <CameraPermissionDenied />
  }
  
  return (
    <Camera style={styles.camera} type={type} ref={cameraRef}>
      <View style={styles.cameraControls}>
        <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
          <View style={styles.captureButtonInner} />
        </TouchableOpacity>
      </View>
    </Camera>
  )
}
```

### **Image Picker & Gallery**
```typescript
const useImagePicker = () => {
  const pickImage = useCallback(async () => {
    // Request permissions
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
    
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!')
      return
    }
    
    // Launch image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    })
    
    if (!result.canceled && result.assets[0]) {
      return result.assets[0]
    }
  }, [])
  
  return { pickImage }
}
```

## **🔔 Push Notifications**

### **Notification Setup**
```typescript
import * as Notifications from 'expo-notifications'
import Constants from 'expo-constants'

// Configure notification handling
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
})

export const NotificationManager = {
  async registerForPushNotifications(): Promise<string | null> {
    let token = null
    
    if (Constants.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync()
      let finalStatus = existingStatus
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync()
        finalStatus = status
      }
      
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!')
        return null
      }
      
      token = (await Notifications.getExpoPushTokenAsync()).data
    }
    
    return token
  },
  
  async scheduleNotification(title: string, body: string, data?: any) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data,
      },
      trigger: null, // Show immediately
    })
  },
}
```

## **🎯 Performance Best Practices**

### **List Optimization**
```typescript
import { FlatList, VirtualizedList } from 'react-native'

// Use FlatList for large datasets
const PhotoGallery = ({ photos }: { photos: Photo[] }) => {
  const renderPhoto = useCallback(({ item }: { item: Photo }) => (
    <PhotoCard photo={item} />
  ), [])
  
  const keyExtractor = useCallback((item: Photo) => item.id, [])
  
  return (
    <FlatList
      data={photos}
      renderItem={renderPhoto}
      keyExtractor={keyExtractor}
      numColumns={2}
      removeClippedSubviews={true}
      maxToRenderPerBatch={10}
      windowSize={5}
      initialNumToRender={10}
      getItemLayout={(data, index) => ({
        length: 200,
        offset: 200 * index,
        index,
      })}
    />
  )
}
```

### **Image Optimization**
```typescript
import { Image } from 'expo-image'

// Use Expo Image for better performance
const OptimizedImage = ({ source, style, ...props }) => (
  <Image
    source={source}
    style={style}
    placeholder="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQ..."
    contentFit="cover"
    transition={200}
    {...props}
  />
)
```

### **Memory Management**
```typescript
// Cleanup in useEffect
useEffect(() => {
  const subscription = someAsyncOperation()
  
  return () => {
    // Cleanup subscriptions, timers, etc.
    subscription?.unsubscribe()
  }
}, [])

// Use memo for expensive calculations
const expensiveValue = useMemo(() => {
  return heavyCalculation(data)
}, [data])

// Memoize callbacks to prevent re-renders
const handlePress = useCallback(() => {
  onPress(id)
}, [onPress, id])
```

## **🧪 Testing Standards**

### **Component Testing**
```typescript
import { render, fireEvent } from '@testing-library/react-native'
import { GlassButton } from './GlassButton'

describe('GlassButton', () => {
  it('renders with correct text', () => {
    const { getByText } = render(<GlassButton>Press me</GlassButton>)
    expect(getByText('Press me')).toBeTruthy()
  })
  
  it('calls onPress when pressed', () => {
    const onPress = jest.fn()
    const { getByText } = render(
      <GlassButton onPress={onPress}>Press me</GlassButton>
    )
    
    fireEvent.press(getByText('Press me'))
    expect(onPress).toHaveBeenCalledTimes(1)
  })
  
  it('has correct accessibility props', () => {
    const { getByRole } = render(<GlassButton>Press me</GlassButton>)
    const button = getByRole('button')
    
    expect(button).toBeTruthy()
    expect(button.props.accessible).toBe(true)
  })
})
```

### **Navigation Testing**
```typescript
import { router } from 'expo-router'

// Mock router for testing
jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  },
}))

describe('Navigation', () => {
  it('navigates to correct screen', () => {
    const { getByText } = render(<NavigationComponent />)
    
    fireEvent.press(getByText('Go to Profile'))
    expect(router.push).toHaveBeenCalledWith('/profile')
  })
})
```

## **📋 Code Review Checklist**

### **Before Submitting PR**
- [ ] All TypeScript errors resolved
- [ ] Components follow dark theme design system [[memory:2887684]]
- [ ] Touch targets meet minimum size requirements (44pt/48dp)
- [ ] Accessibility props added (accessible, accessibilityLabel, accessibilityRole)
- [ ] Navigation patterns follow Expo Router conventions
- [ ] Performance optimizations implemented (FlatList, memoization)
- [ ] Proper cleanup in useEffect hooks
- [ ] Tests written and passing

### **Platform-Specific Review**
- [ ] iOS: Safe area handling implemented
- [ ] Android: Back button behavior configured
- [ ] iOS: Dynamic Type support for text scaling
- [ ] Android: Material Design guidelines followed
- [ ] Both: App icon and splash screen configured
- [ ] Both: Deep linking and URL schemes working

### **Performance Review**
- [ ] Bundle size optimized
- [ ] Large lists use FlatList or VirtualizedList
- [ ] Images optimized and properly sized
- [ ] Memory leaks prevented
- [ ] Background tasks properly managed
- [ ] Network requests optimized and cached

### **Accessibility Review**
- [ ] All interactive elements have accessibility labels
- [ ] Screen reader navigation tested
- [ ] Color contrast meets WCAG standards
- [ ] Text scaling works properly
- [ ] Touch targets are appropriately sized
- [ ] Focus order is logical and intuitive 