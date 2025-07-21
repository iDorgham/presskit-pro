#!/bin/bash

# **PressKit Pro - Development Environment Setup Script**
# This script automates the setup process described in START_GUIDE.md

set -e  # Exit on any error

echo "🚀 Setting up PressKit Pro development environment..."
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Node.js is installed
check_node() {
    print_status "Checking Node.js installation..."
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18+ from https://nodejs.org/"
        exit 1
    fi
    
    NODE_VERSION=$(node --version | cut -d 'v' -f 2 | cut -d '.' -f 1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        print_error "Node.js version 18+ is required. Current version: $(node --version)"
        exit 1
    fi
    
    print_success "Node.js $(node --version) is installed"
}

# Check if Git is installed
check_git() {
    print_status "Checking Git installation..."
    if ! command -v git &> /dev/null; then
        print_error "Git is not installed. Please install Git from https://git-scm.com/"
        exit 1
    fi
    print_success "Git $(git --version) is installed"
}

# Install global development tools
install_global_tools() {
    print_status "Installing global development tools..."
    
    # Check if tools are already installed
    if ! command -v nodemon &> /dev/null; then
        npm install -g nodemon
    fi
    
    if ! command -v expo &> /dev/null; then
        npm install -g @expo/cli
    fi
    
    print_success "Global tools installed"
}

# Setup root project dependencies
setup_root() {
    print_status "Setting up root project dependencies..."
    npm install
    print_success "Root dependencies installed"
}

# Setup backend (server)
setup_server() {
    print_status "Setting up backend server..."
    
    if [ ! -d "server" ]; then
        mkdir server
    fi
    
    cd server
    
    # Initialize package.json if it doesn't exist
    if [ ! -f "package.json" ]; then
        npm init -y
    fi
    
    print_status "Installing backend dependencies..."
    
    # TypeScript and development dependencies
    npm install -D typescript @types/node @types/express ts-node nodemon
    npm install -D @types/bcryptjs @types/jsonwebtoken @types/cors
    npm install -D @types/multer @types/validator
    npm install -D jest @types/jest supertest @types/supertest ts-jest
    npm install -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
    npm install -D prettier eslint-config-prettier eslint-plugin-prettier
    
    # Production dependencies
    npm install express cors helmet express-rate-limit
    npm install mongoose
    npm install bcryptjs jsonwebtoken express-validator
    npm install dotenv
    npm install cloudinary multer
    npm install nodemailer
    npm install winston
    npm install @sentry/node
    npm install stripe
    npm install axios
    
    # Create TypeScript config
    if [ ! -f "tsconfig.json" ]; then
        npx tsc --init
        print_status "Created TypeScript configuration"
    fi
    
    # Create project structure
    mkdir -p src/{controllers,models,routes,middleware,services,utils,config,types}
    mkdir -p tests/{unit,integration}
    
    # Create environment file
    if [ ! -f ".env" ]; then
        touch .env
        echo "# Created .env file - please fill in your environment variables" >> .env
    fi
    
    cd ..
    print_success "Backend setup complete"
}

# Setup web application
setup_web() {
    print_status "Setting up web application..."
    
    if [ ! -d "client-web" ]; then
        print_status "Creating Next.js application..."
        npx create-next-app@latest client-web --typescript --tailwind --eslint --app --src-dir
    fi
    
    cd client-web
    
    print_status "Installing additional web dependencies..."
    
    # Additional dependencies
    npm install framer-motion
    npm install @headlessui/react @heroicons/react
    npm install react-hook-form @hookform/resolvers zod
    npm install axios
    npm install next-themes
    npm install @stripe/stripe-js @stripe/react-stripe-js
    npm install cloudinary
    
    # Development dependencies
    npm install -D @types/react @types/react-dom
    npm install -D eslint-config-next
    npm install -D prettier prettier-plugin-tailwindcss
    
    # Create project structure
    mkdir -p src/{components/{ui,forms,epk},lib,hooks,types}
    mkdir -p src/app/{(auth),dashboard,[username]}
    
    # Create environment file
    if [ ! -f ".env.local" ]; then
        touch .env.local
        echo "# Created .env.local file - please fill in your environment variables" >> .env.local
    fi
    
    cd ..
    print_success "Web application setup complete"
}

# Setup mobile application
setup_mobile() {
    print_status "Setting up mobile application..."
    
    if [ ! -d "client-mobile" ]; then
        print_status "Creating Expo application..."
        npx create-expo-app@latest client-mobile --template typescript
    fi
    
    cd client-mobile
    
    print_status "Installing mobile dependencies..."
    
    # Navigation and routing
    npx expo install expo-router react-native-safe-area-context react-native-screens
    npx expo install react-native-gesture-handler react-native-reanimated
    
    # Authentication and storage
    npx expo install expo-secure-store expo-local-authentication
    
    # Camera and media
    npx expo install expo-camera expo-image-picker expo-av
    
    # Notifications
    npx expo install expo-notifications expo-device
    
    # Additional utilities
    npx expo install expo-constants expo-linking expo-font
    npx expo install axios
    
    # Development dependencies
    npm install -D @types/react @types/react-native
    
    # Create project structure
    mkdir -p app/{(tabs),(auth)}
    mkdir -p components/{ui,forms,camera}
    mkdir -p hooks services types constants assets
    
    # Create environment file
    if [ ! -f ".env" ]; then
        touch .env
        echo "# Created .env file - please fill in your environment variables" >> .env
    fi
    
    # Copy app config if it doesn't exist
    if [ ! -f "app.config.js" ] && [ -f "app.config.example.js" ]; then
        cp app.config.example.js app.config.js
        print_status "Copied app configuration from example"
    fi
    
    cd ..
    print_success "Mobile application setup complete"
}

# Setup Git hooks
setup_git_hooks() {
    print_status "Setting up Git hooks..."
    
    if [ -d ".git" ]; then
        npx husky install
        npx husky add .husky/pre-commit "npx lint-staged"
        print_success "Git hooks configured"
    else
        print_warning "Git repository not initialized. Run 'git init' first."
    fi
}

# Create initial environment files
create_env_files() {
    print_status "Creating environment variable template files..."
    
    # Server .env example
    if [ ! -f "server/.env.example" ]; then
        cat > server/.env.example << 'EOF'
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/presskit-pro-dev
JWT_SECRET=your_super_secret_jwt_key_here
JWT_REFRESH_SECRET=your_refresh_token_secret_here
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
SENDGRID_API_KEY=SG.your_sendgrid_api_key_here
SENTRY_DSN=https://your_sentry_dsn_here@sentry.io/project_id
EOF
        print_status "Created server/.env.example"
    fi
    
    # Web .env.local example
    if [ ! -f "client-web/.env.local.example" ]; then
        cat > client-web/.env.local.example << 'EOF'
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_recaptcha_site_key_here
NEXT_PUBLIC_SENTRY_DSN=https://your_sentry_dsn_here@sentry.io/project_id
NEXT_PUBLIC_SITE_URL=http://localhost:3000
EOF
        print_status "Created client-web/.env.local.example"
    fi
    
    print_success "Environment template files created"
}

# Main setup function
main() {
    echo "🎯 Starting PressKit Pro setup..."
    echo ""
    
    # Pre-checks
    check_node
    check_git
    
    # Setup steps
    install_global_tools
    setup_root
    setup_server
    setup_web  
    setup_mobile
    create_env_files
    setup_git_hooks
    
    echo ""
    print_success "🎉 Setup complete!"
    echo ""
    echo "📋 Next steps:"
    echo "1. Fill in environment variables in .env files"
    echo "2. Set up MongoDB (local or Atlas)"
    echo "3. Get API keys (Cloudinary, Stripe, etc.)"
    echo "4. Run 'npm run dev' to start all applications"
    echo ""
    echo "📚 Check START_GUIDE.md for detailed instructions"
    echo "📋 Use task files in each directory for development roadmap"
    echo ""
}

# Run main function
main "$@" 