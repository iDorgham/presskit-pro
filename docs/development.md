# Development Guidelines

This document outlines the development practices, coding standards, and architectural decisions for PressKit Pro.

## Project Structure

```
presskit-pro/
├── .husky/          # Git hooks
├── .vscode/         # VS Code settings
├── docs/            # Documentation
├── server/          # Backend API
│   ├── src/
│   │   ├── controllers/  # Route handlers
│   │   ├── middleware/   # Express middleware
│   │   ├── models/       # Database models
│   │   ├── utils/        # Utility functions
│   │   ├── config/      # Configuration
│   │   ├── routes/      # API routes
│   │   └── types/       # TypeScript types
│   ├── tests/           # Server tests
│   └── package.json
├── client-web/      # Next.js web application
│   ├── src/
│   │   ├── app/         # App Router pages
│   │   ├── components/  # React components
│   │   ├── hooks/       # Custom hooks
│   │   ├── lib/         # Utilities and configs
│   │   ├── styles/      # Global styles
│   │   └── types/       # TypeScript types
│   └── package.json
├── client-mobile/   # React Native/Expo app
│   ├── src/
│   │   ├── components/  # React Native components
│   │   ├── screens/     # App screens
│   │   ├── navigation/  # Navigation setup
│   │   ├── hooks/       # Custom hooks
│   │   ├── utils/       # Utilities
│   │   └── types/       # TypeScript types
│   └── package.json
└── package.json     # Root package.json
```

## Coding Standards

### TypeScript

- **Strict Mode**: All projects use TypeScript strict mode
- **Type Safety**: Prefer explicit types over `any`
- **Interfaces**: Use interfaces for object shapes
- **Enums**: Use const assertions or union types instead of enums when possible

```typescript
// ✅ Good
interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user' | 'artist';
}

// ❌ Avoid
const user: any = { id: 1, email: 'test@example.com' };
```

### Naming Conventions

- __Files__: kebab-case for files (`user-profile.tsx`)
- __Components__: PascalCase (`UserProfile`)
- __Functions__: camelCase (`getUserProfile`)
- __Constants__: UPPER_SNAKE_CASE (`API_BASE_URL`)
- __Types/Interfaces__: PascalCase (`UserProfile`, `ApiResponse`)

### Code Organization

#### Backend (Server)

```typescript
// controllers/user.controller.ts
export class UserController extends BaseController {
  async getProfile(req: Request, res: Response) {
    try {
      const user = await this.userService.getProfile(req.user.id);
      return this.success(res, user);
    } catch (error) {
      return this.error(res, error);
    }
  }
}

// models/User.ts
export interface IUser extends Document {
  email: string;
  name: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

// utils/validation.ts
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
```

#### Frontend (Web)

```typescript
// components/UserProfile/UserProfile.tsx
interface UserProfileProps {
  user: User;
  onUpdate: (user: User) => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({ user, onUpdate }) => {
  // Component implementation
};

// hooks/useUser.ts
export const useUser = (userId: string) => {
  return useSWR(`/api/users/${userId}`, fetcher);
};

// lib/api.ts
export const api = {
  users: {
    get: (id: string) => fetch(`/api/users/${id}`),
    update: (id: string, data: Partial<User>) =>
      fetch(`/api/users/${id}`, { method: 'PUT', body: JSON.stringify(data) })
  }
};
```

## Architecture Patterns

### Backend Architecture

#### Layered Architecture

```
Controller Layer    → Handle HTTP requests/responses
Service Layer       → Business logic
Repository Layer    → Data access
Model Layer         → Data structures
```

#### Dependency Injection

```typescript
// services/user.service.ts
export class UserService {
  constructor(
    private userRepository: UserRepository,
    private emailService: EmailService
  ) {}

  async createUser(userData: CreateUserDto): Promise<User> {
    const user = await this.userRepository.create(userData);
    await this.emailService.sendWelcomeEmail(user.email);
    return user;
  }
}
```

#### Error Handling

```typescript
// middleware/error.ts
export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof ValidationError) {
    return res.status(400).json({
      success: false,
      message: error.message,
      errors: error.details
    });
  }

  // Log error
  logger.error('Unhandled error:', error);
  
  return res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
};
```

### Frontend Architecture

#### Component Structure

```typescript
// components/Button/Button.tsx
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  children,
  onClick
}) => {
  const baseClasses = 'font-medium rounded-lg transition-colors';
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
    danger: 'bg-red-600 text-white hover:bg-red-700'
  };
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]}`}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {loading ? 'Loading...' : children}
    </button>
  );
};
```
