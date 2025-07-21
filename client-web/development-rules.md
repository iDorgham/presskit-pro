# **Web Application Development Rules & Guidelines**

## **🎨 Design System Standards**

### **Dark Theme Implementation**
```typescript
// Tailwind config - extend with custom dark theme
module.exports = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#1a1a1a',        // Primary background [[memory:2887684]]
          surface: '#2a2a2a',   // Card/component backgrounds
          border: 'rgba(255, 255, 255, 0.2)', // 1px outlines [[memory:2887678]]
        },
        glass: {
          bg: 'rgba(255, 255, 255, 0.1)',     // Glass morphism backgrounds [[memory:2887684]]
          border: 'rgba(255, 255, 255, 0.2)',  // Glass borders
        },
        primary: {
          500: '#8B5CF6',       // Purple accent color
          600: '#7C3AED',
        }
      },
      fontFamily: {
        sans: ['Poppins', 'system-ui', 'sans-serif'], // Primary typography [[memory:2887678]]
      },
      backdropBlur: {
        xs: '2px',
      }
    }
  }
}
```

### **Glass Morphism Components**
```typescript
// Base glass button component
const GlassButton = ({ children, ...props }) => (
  <button 
    className={`
      backdrop-blur-sm bg-glass-bg border border-glass-border
      rounded-lg px-4 py-2 text-white
      hover:bg-white/20 transition-all duration-200
      focus:outline-none focus:ring-2 focus:ring-primary-500
    `}
    {...props}
  >
    {children}
  </button>
)
```

### **Animated Lines Background** [[memory:2887684]]
```typescript
// Framer Motion animated background
const AnimatedLines = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <motion.div
      className="absolute h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"
      animate={{
        x: ['-100%', '100%'],
        opacity: [0, 1, 0]
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: 'linear'
      }}
      style={{ width: '200%', top: '20%' }}
    />
  </div>
)
```

## **⚛️ Component Architecture**

### **Component Structure Standards**
```typescript
// Component file structure
interface ComponentProps {
  // Props definition with JSDoc
  /** Description of the prop */
  prop: string
  children?: React.ReactNode
}

/**
 * Component description
 * @param props - Component props
 */
export const Component: React.FC<ComponentProps> = ({ 
  prop, 
  children 
}) => {
  // Hooks first
  const [state, setState] = useState()
  
  // Event handlers
  const handleEvent = useCallback(() => {
    // Handler logic
  }, [])
  
  // Render
  return (
    <div className="component-wrapper">
      {children}
    </div>
  )
}

// Export as default
export default Component
```

### **Custom Hooks Pattern**
```typescript
// Always prefix with 'use'
export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  
  const login = useCallback(async (credentials: LoginCredentials) => {
    setLoading(true)
    try {
      const user = await authService.login(credentials)
      setUser(user)
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }, [])
  
  return { user, loading, login }
}
```

### **Form Handling with React Hook Form**
```typescript
// Use zod for validation schemas
const epkFormSchema = z.object({
  bio: z.string().min(10).max(1000),
  genres: z.array(z.string()).min(1).max(5),
  contactEmail: z.string().email(),
})

type EPKFormData = z.infer<typeof epkFormSchema>

// Component implementation
const EPKForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<EPKFormData>({
    resolver: zodResolver(epkFormSchema)
  })
  
  const onSubmit = async (data: EPKFormData) => {
    try {
      await apiClient.updateEPK(data)
      toast.success('EPK updated successfully')
    } catch (error) {
      toast.error('Failed to update EPK')
    }
  }
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Form fields */}
    </form>
  )
}
```

## **🔒 Security & Authentication**

### **Route Protection Patterns**
```typescript
// Middleware for protected routes
export function withAuth<T extends {}>(Component: React.ComponentType<T>) {
  return function AuthenticatedComponent(props: T) {
    const { user, loading } = useAuth()
    
    if (loading) return <LoadingSpinner />
    if (!user) redirect('/login')
    
    return <Component {...props} />
  }
}

// Usage in pages
export default withAuth(DashboardPage)
```

### **API Client Security**
```typescript
// Axios interceptors for auth
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
})

// Request interceptor - add auth header
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor - handle auth errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)
```

### **Input Sanitization**
```typescript
// Always sanitize user input
import DOMPurify from 'dompurify'

const sanitizeHTML = (html: string) => {
  if (typeof window !== 'undefined') {
    return DOMPurify.sanitize(html)
  }
  return html // Server-side, use appropriate sanitization
}

// Usage in components
const SafeContent = ({ html }: { html: string }) => (
  <div dangerouslySetInnerHTML={{ __html: sanitizeHTML(html) }} />
)
```

## **🎭 SEO & Performance Standards**

### **Metadata Management**
```typescript
// Page metadata with generateMetadata
export async function generateMetadata(
  { params }: { params: { username: string } }
): Promise<Metadata> {
  const artist = await getArtistByUsername(params.username)
  
  if (!artist) {
    return {
      title: 'Artist Not Found',
      robots: 'noindex,nofollow'
    }
  }
  
  return {
    title: `${artist.name} - Electronic Press Kit`,
    description: truncate(artist.bio, 160),
    openGraph: {
      title: `${artist.name} - EPK`,
      description: artist.bio,
      images: [
        {
          url: artist.profileImage,
          width: 1200,
          height: 630,
          alt: `${artist.name} press photo`
        }
      ],
      type: 'profile',
      url: `https://presskitpro.com/${artist.username}`
    },
    twitter: {
      card: 'summary_large_image',
      title: `${artist.name} - EPK`,
      description: truncate(artist.bio, 200),
      images: [artist.profileImage]
    }
  }
}
```

### **Image Optimization**
```typescript
// Always use next/image with proper optimization
import Image from 'next/image'

const OptimizedImage = ({ src, alt, ...props }) => (
  <Image
    src={src}
    alt={alt}
    width={800}
    height={600}
    placeholder="blur"
    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQ..." // Low-quality placeholder
    className="rounded-lg object-cover"
    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    {...props}
  />
)
```

### **JSON-LD Structured Data**
```typescript
// Structured data for artist pages
const generateArtistSchema = (artist: Artist) => ({
  '@context': 'https://schema.org',
  '@type': 'MusicGroup',
  name: artist.name,
  description: artist.bio,
  image: artist.profileImage,
  genre: artist.genres,
  url: `https://presskitpro.com/${artist.username}`,
  sameAs: Object.values(artist.socialLinks).filter(Boolean),
  contactPoint: {
    '@type': 'ContactPoint',
    email: artist.contactEmail,
    contactType: 'booking'
  }
})

// Usage in layout
const ArtistSchema = ({ artist }: { artist: Artist }) => (
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{
      __html: JSON.stringify(generateArtistSchema(artist))
    }}
  />
)
```

## **📱 Responsive Design Standards**

### **Breakpoint Strategy**
```typescript
// Tailwind responsive utilities
const ResponsiveComponent = () => (
  <div className={`
    grid grid-cols-1 gap-4        // Mobile: single column
    md:grid-cols-2 md:gap-6       // Tablet: two columns
    lg:grid-cols-3 lg:gap-8       // Desktop: three columns
    xl:grid-cols-4                // Large: four columns
  `}>
    {/* Content */}
  </div>
)
```

### **Mobile-First Development**
```css
/* Always start with mobile styles */
.component {
  /* Mobile styles (default) */
  padding: 1rem;
  font-size: 0.875rem;
}

/* Then add larger screen enhancements */
@media (min-width: 768px) {
  .component {
    padding: 2rem;
    font-size: 1rem;
  }
}
```

### **Touch-Friendly Interactions**
```typescript
// Ensure minimum touch target size (44px)
const TouchButton = ({ children, ...props }) => (
  <button 
    className="min-h-[44px] min-w-[44px] p-2 rounded-lg"
    {...props}
  >
    {children}
  </button>
)
```

## **🔄 State Management**

### **Context Pattern for Global State**
```typescript
// Auth context example
interface AuthContextType {
  user: User | null
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  
  // Implementation...
  
  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
```

### **Local State Management**
```typescript
// Use useState for simple component state
const [isOpen, setIsOpen] = useState(false)

// Use useReducer for complex state logic
const [state, dispatch] = useReducer(reducer, initialState)

// Use custom hooks for shared logic
const { data, loading, error } = useApi('/api/epk')
```

## **🧪 Testing Standards**

### **Component Testing**
```typescript
// Test component rendering and interactions
import { render, screen, fireEvent } from '@testing-library/react'
import { GlassButton } from './GlassButton'

describe('GlassButton', () => {
  it('renders with correct styles', () => {
    render(<GlassButton>Click me</GlassButton>)
    
    const button = screen.getByRole('button', { name: /click me/i })
    expect(button).toHaveClass('backdrop-blur-sm', 'bg-glass-bg')
  })
  
  it('calls onClick when clicked', () => {
    const handleClick = jest.fn()
    render(<GlassButton onClick={handleClick}>Click me</GlassButton>)
    
    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
```

### **API Testing**
```typescript
// Mock API calls in tests
import { apiClient } from '../lib/api'

jest.mock('../lib/api')
const mockedApiClient = apiClient as jest.Mocked<typeof apiClient>

it('handles API errors gracefully', async () => {
  mockedApiClient.get.mockRejectedValue(new Error('Network error'))
  
  // Test component behavior with error
})
```

## **🚀 Performance Best Practices**

### **Code Splitting**
```typescript
// Dynamic imports for code splitting
const DashboardChart = dynamic(() => import('./DashboardChart'), {
  loading: () => <ChartSkeleton />,
  ssr: false // Client-side only component
})

// Route-based code splitting (automatic with App Router)
```

### **Memoization**
```typescript
// Memoize expensive calculations
const expensiveValue = useMemo(() => {
  return heavyCalculation(data)
}, [data])

// Memoize callbacks to prevent re-renders
const handleClick = useCallback(() => {
  onClick(id)
}, [onClick, id])

// Memoize components
const MemoizedComponent = React.memo(Component)
```

### **Bundle Optimization**
```typescript
// Tree-shake imports
import { debounce } from 'lodash-es' // ✅ Tree-shakeable
import _ from 'lodash' // ❌ Imports entire library

// Use dynamic imports for large dependencies
const Chart = lazy(() => import('chart.js'))
```

## **📋 Code Review Checklist**

### **Before Submitting PR**
- [ ] All TypeScript errors resolved
- [ ] Components follow design system (dark theme, Poppins, glass morphism) [[memory:2887684]] [[memory:2887678]]
- [ ] Responsive design tested on all breakpoints
- [ ] Accessibility guidelines followed (WCAG 2.1)
- [ ] SEO metadata implemented for public pages
- [ ] Performance optimized (images, lazy loading)
- [ ] Error boundaries implemented for error handling
- [ ] Tests written and passing

### **Accessibility Review**
- [ ] Proper semantic HTML structure
- [ ] Keyboard navigation support
- [ ] Screen reader compatibility
- [ ] Color contrast ratios meet WCAG standards
- [ ] Focus management for modals and forms
- [ ] Alt text for all images

### **Performance Review**
- [ ] Core Web Vitals targets met (LCP < 2.5s, FID < 100ms, CLS < 0.1)
- [ ] Images optimized with next/image
- [ ] Bundle size within acceptable limits
- [ ] No memory leaks (event listeners cleaned up)
- [ ] Efficient re-rendering patterns 