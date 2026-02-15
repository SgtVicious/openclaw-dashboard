#!/bin/bash

# Mission Control Installation Script
# This script automates the installation process for Mission Control

set -e

echo "🚀 Mission Control Installation Script"
echo "======================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node --version | cut -d'v' -f2)
REQUIRED_VERSION="18.0.0"

if ! node -e "process.exit(process.version.slice(1).split('.')[0] >= 18 ? 0 : 1)"; then
    echo "❌ Node.js version must be 18.0.0 or higher. Current version: $NODE_VERSION"
    exit 1
fi

echo "✅ Node.js version $NODE_VERSION detected"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ npm is installed"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check if .env.local exists, if not create it from example
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local from .env.example..."
    cp .env.example .env.local
    echo "⚠️  Please edit .env.local with your configuration"
fi

# Setup database
echo "🗄️ Setting up database..."
npm run db:push

# Seed database with demo data
echo "🌱 Seeding database with demo data..."
npm run db:seed

# Build the application
echo "🏗️ Building the application..."
npm run build

echo ""
echo "✅ Installation completed successfully!"
echo ""
echo "🎉 Mission Control is ready to use!"
echo ""
echo "To start the development server:"
echo "  npm run dev"
echo ""
echo "To access the application:"
echo "  Open http://localhost:3000 in your browser"
echo ""
echo "Demo credentials:"
echo "  Email: admin@mission-control.dev"
echo "  Password: demo123"
echo ""
echo "For more information, check the documentation:"
echo "  https://github.com/yourusername/mission-control/docs"
echo ""

# Ask if user wants to start the development server
read -p "Would you like to start the development server now? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    npm run dev
fi