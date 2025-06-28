#!/bin/bash

# Missing Persons Database - Setup Script
# This script sets up the development environment

set -e

echo "🚀 Setting up Missing Persons Database System..."
echo "================================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
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
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18+ and try again."
        exit 1
    fi
    
    NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        print_error "Node.js version 18+ is required. Current version: $(node --version)"
        exit 1
    fi
    
    print_success "Node.js $(node --version) is installed"
}

# Check if PostgreSQL is available
check_postgres() {
    if ! command -v psql &> /dev/null; then
        print_warning "PostgreSQL client not found. Please ensure PostgreSQL is installed and accessible."
    else
        print_success "PostgreSQL client is available"
    fi
}

# Check if Redis is available
check_redis() {
    if ! command -v redis-cli &> /dev/null; then
        print_warning "Redis client not found. Please ensure Redis is installed and running."
    else
        print_success "Redis client is available"
    fi
}

# Create environment files
setup_env_files() {
    print_status "Setting up environment files..."
    
    # Backend environment
    if [ ! -f "backend/.env" ]; then
        cp backend/.env.example backend/.env
        print_success "Created backend/.env from template"
        print_warning "Please update backend/.env with your actual configuration values"
    else
        print_status "Backend .env file already exists"
    fi
    
    # Frontend environment
    if [ ! -f "frontend/.env" ]; then
        cat > frontend/.env << EOL
REACT_APP_API_URL=http://localhost:5000
REACT_APP_SOCKET_URL=http://localhost:5000
REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
REACT_APP_VERSION=0.1.0
REACT_APP_ENVIRONMENT=development
EOL
        print_success "Created frontend/.env"
        print_warning "Please update frontend/.env with your actual API keys"
    else
        print_status "Frontend .env file already exists"
    fi
    
    # Mobile environment
    if [ ! -f "mobile/.env" ]; then
        cat > mobile/.env << EOL
API_URL=http://localhost:5000
SOCKET_URL=http://localhost:5000
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
ENVIRONMENT=development
EOL
        print_success "Created mobile/.env"
        print_warning "Please update mobile/.env with your actual configuration"
    else
        print_status "Mobile .env file already exists"
    fi
}

# Install backend dependencies
install_backend() {
    print_status "Installing backend dependencies..."
    cd backend
    npm install
    cd ..
    print_success "Backend dependencies installed"
}

# Install frontend dependencies
install_frontend() {
    print_status "Installing frontend dependencies..."
    cd frontend
    npm install
    cd ..
    print_success "Frontend dependencies installed"
}

# Setup database
setup_database() {
    print_status "Setting up database..."
    
    # Check if database exists and create if not
    if command -v psql &> /dev/null; then
        print_status "Checking database connection..."
        # This would need actual database credentials
        print_warning "Please ensure PostgreSQL is running and create the database manually:"
        print_warning "createdb missing_persons_db"
        print_warning "Then run: cd backend && npm run migrate"
    else
        print_warning "PostgreSQL not available. Please set up the database manually."
    fi
}

# Create necessary directories
setup_directories() {
    print_status "Creating necessary directories..."
    
    mkdir -p backend/logs
    mkdir -p backend/uploads
    mkdir -p frontend/public/uploads
    
    print_success "Directories created"
}

# Main setup function
main() {
    print_status "Starting setup process..."
    
    check_node
    check_postgres
    check_redis
    
    setup_env_files
    setup_directories
    
    install_backend
    install_frontend
    
    setup_database
    
    echo ""
    print_success "Setup completed successfully! 🎉"
    echo ""
    echo -e "${BLUE}Next steps:${NC}"
    echo "1. Update environment files with your actual configuration"
    echo "2. Ensure PostgreSQL and Redis are running"
    echo "3. Run database migrations: cd backend && npm run migrate"
    echo "4. Start the backend: cd backend && npm run dev"
    echo "5. Start the frontend: cd frontend && npm start"
    echo ""
    echo -e "${BLUE}For mobile development:${NC}"
    echo "1. Install React Native CLI: npm install -g react-native-cli"
    echo "2. Set up Android Studio or Xcode"
    echo "3. Run: cd mobile && npm install"
    echo ""
    print_status "Happy coding! 🚀"
}

# Run main function
main

