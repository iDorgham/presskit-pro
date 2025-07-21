# **Backend Development Rules & Guidelines**

## **🏗️ Architecture Principles**

### **Folder Structure Standards**
```
src/
├── controllers/        # Request handlers (thin layer)
├── services/          # Business logic (thick layer)
├── models/            # Database schemas and validation
├── middleware/        # Custom middleware functions
├── routes/            # API route definitions
├── utils/             # Helper functions and utilities
├── types/             # TypeScript type definitions
├── config/            # Configuration files
└── app.ts             # Express application setup
```

### **Separation of Concerns**
- **Controllers**: Handle HTTP requests/responses only, delegate to services
- **Services**: Contain business logic, interact with database and external APIs
- **Models**: Define data structure, validation, and database operations
- **Middleware**: Handle cross-cutting concerns (auth, logging, validation)

## **🔒 Security Best Practices**

### **NEVER Trust Client Input**
```typescript
// ❌ BAD - Direct database query without validation
app.post('/api/epk', (req, res) => {
  EPK.create(req.body) // DANGEROUS!
})

// ✅ GOOD - Validate and sanitize all input
app.post('/api/epk', validateEPK, async (req, res) => {
  const validatedData = matchedData(req)
  // Process validated data only
})
```

### **Required Security Middleware**
```typescript
// Apply these in order in app.ts
app.use(helmet()) // Security headers
app.use(cors(corsOptions)) // CORS policy
app.use(rateLimit(rateLimitConfig)) // Rate limiting
app.use(express.json({ limit: '10mb' })) // Body parsing with limits
```

### **Authentication Patterns**
```typescript
// Always use middleware for protected routes
app.use('/api/dashboard', requireAuth, requireTier('premium'))
app.use('/api/admin', requireAuth, requireRole('admin'))

// JWT payload should be minimal
const payload = {
  userId: user._id,
  tier: user.tier,
  iat: Math.floor(Date.now() / 1000)
}
```

## **📊 Database Best Practices**

### **Model Definition Standards**
```typescript
// Use strict schemas with validation
const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Invalid email']
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false // Never return passwords in queries
  }
}, {
  timestamps: true, // Always include createdAt/updatedAt
  toJSON: { virtuals: true, transform: removePrivateFields }
})
```

### **Query Optimization**
```typescript
// Always use indexes for frequently queried fields
userSchema.index({ email: 1 })
userSchema.index({ username: 1 })
epkSchema.index({ userId: 1, username: 1 })

// Use lean() for read-only operations
const epks = await EPK.find({ isPublic: true }).lean()

// Use select() to limit returned fields
const user = await User.findById(id).select('username email tier')
```

### **Error Handling Patterns**
```typescript
// Always wrap async operations in try-catch
const createEPK = async (req: Request, res: Response) => {
  try {
    const epk = await EPKService.create(req.user.id, validatedData)
    res.status(201).json({ success: true, data: epk })
  } catch (error) {
    logger.error('EPK creation failed:', error)
    res.status(500).json({ 
      success: false, 
      message: 'Failed to create EPK' 
    })
  }
}
```

## **🔌 API Design Standards**

### **RESTful Endpoint Conventions**
```
GET    /api/epk              # List user's EPKs
POST   /api/epk              # Create new EPK
GET    /api/epk/:id          # Get specific EPK
PUT    /api/epk/:id          # Update entire EPK
PATCH  /api/epk/:id          # Partial EPK update
DELETE /api/epk/:id          # Delete EPK

# Resource-specific operations
POST   /api/epk/:id/photos   # Add photos to EPK
PUT    /api/epk/:id/publish  # Publish EPK
POST   /api/epk/:id/analytics # Track analytics event
```

### **Response Format Standards**
```typescript
// Success responses
{
  "success": true,
  "data": { /* response data */ },
  "message": "Operation completed successfully"
}

// Error responses
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": ["Email is required", "Password too short"]
  }
}

// Pagination format
{
  "success": true,
  "data": [/* results */],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "pages": 8
  }
}
```

### **Validation with express-validator**
```typescript
export const validateEPK = [
  body('bio').trim().isLength({ min: 10, max: 1000 }),
  body('genres').isArray().isLength({ min: 1, max: 5 }),
  body('socialLinks.instagram').optional().isURL(),
  body('contactEmail').isEmail().normalizeEmail(),
  
  // Custom validation
  body('username').custom(async (value) => {
    const existing = await User.findOne({ username: value })
    if (existing) throw new Error('Username already taken')
    return true
  })
]
```

## **📁 File Upload Guidelines**

### **File Validation Requirements**
```typescript
const uploadConfig = {
  images: {
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/heic'],
    maxSize: 10 * 1024 * 1024, // 10MB
    maxFiles: 50
  },
  audio: {
    allowedTypes: ['audio/mpeg', 'audio/wav', 'audio/flac'],
    maxSize: 25 * 1024 * 1024, // 25MB
    maxFiles: 20
  },
  documents: {
    allowedTypes: ['application/pdf'],
    maxSize: 5 * 1024 * 1024, // 5MB
    maxFiles: 10
  }
}
```

### **Cloudinary Integration**
```typescript
// Always use signed uploads for security
const uploadToCloudinary = async (file: Buffer, type: string) => {
  const uploadOptions = {
    resource_type: 'auto',
    folder: `presskit-pro/${type}`,
    quality: 'auto:good',
    fetch_format: 'auto'
  }
  
  return cloudinary.uploader.upload_stream(uploadOptions)
}
```

## **🧪 Testing Requirements**

### **Test Structure Standards**
```typescript
describe('EPK Controller', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    await EPK.deleteMany({})
  })

  describe('POST /api/epk', () => {
    it('should create EPK with valid data', async () => {
      const response = await request(app)
        .post('/api/epk')
        .set('Authorization', `Bearer ${userToken}`)
        .send(validEPKData)
        .expect(201)

      expect(response.body.success).toBe(true)
      expect(response.body.data.bio).toBe(validEPKData.bio)
    })
  })
})
```

### **Test Coverage Requirements**
- **Controllers**: Test all endpoints (success/failure cases)
- **Services**: Test business logic with mocked dependencies
- **Models**: Test validation and schema methods
- **Middleware**: Test authentication and authorization logic
- **Utilities**: Test helper functions with edge cases

## **📊 Monitoring & Logging**

### **Structured Logging**
```typescript
import logger from '../utils/logger'

// Use appropriate log levels
logger.error('Database connection failed', { error: error.message })
logger.warn('Rate limit exceeded', { ip: req.ip, endpoint: req.path })
logger.info('User created EPK', { userId, epkId })
logger.debug('Processing file upload', { filename, size })
```

### **Performance Monitoring**
```typescript
// Track slow operations
const startTime = Date.now()
const result = await slowOperation()
const duration = Date.now() - startTime

if (duration > 1000) {
  logger.warn('Slow operation detected', { operation: 'slowOperation', duration })
}
```

## **🚀 Deployment Standards**

### **Environment Configuration**
- **Development**: Use `.env` file with sensible defaults
- **Production**: Use environment variables, never commit secrets
- **Testing**: Use separate test database and mock external services

### **Health Checks**
```typescript
app.get('/api/health', async (req, res) => {
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    services: {
      database: await checkDatabaseConnection(),
      redis: await checkRedisConnection(),
      cloudinary: await checkCloudinaryConnection()
    }
  }
  
  const allHealthy = Object.values(health.services).every(s => s === 'ok')
  res.status(allHealthy ? 200 : 503).json(health)
})
```

## **🔄 Code Review Checklist**

### **Before Submitting PR**
- [ ] All tests pass (`npm test`)
- [ ] Code follows TypeScript strict mode
- [ ] No security vulnerabilities (`npm audit`)
- [ ] API endpoints have proper validation
- [ ] Database queries are optimized
- [ ] Error handling is comprehensive
- [ ] Logging is appropriate and structured
- [ ] Documentation is updated

### **Security Review**
- [ ] Input validation on all endpoints
- [ ] Authentication/authorization properly implemented
- [ ] No sensitive data in logs or responses
- [ ] Rate limiting configured correctly
- [ ] CORS policy is restrictive
- [ ] SQL injection prevention (use Mongoose properly)

### **Performance Review**
- [ ] Database queries use appropriate indexes
- [ ] Large operations are paginated
- [ ] File uploads have size limits
- [ ] Caching is implemented where appropriate
- [ ] Memory leaks are prevented (event listeners cleaned up) 