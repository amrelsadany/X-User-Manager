#!/bin/bash

# Link Manager - Quick Setup Script
# This script sets up the local development environment

echo "🚀 Link Manager - Quick Setup"
echo "================================"
echo ""

# Check if we're in the right directory
if [ ! -d "express-backend" ]; then
    echo "❌ Error: Run this script from the LinkManager-Complete directory"
    exit 1
fi

# Setup Express Backend
echo "📦 Setting up Express Backend..."
cd express-backend

if [ ! -f ".env" ]; then
    echo "   Creating .env file from template..."
    cp .env.example .env
    echo "   ⚠️  Please edit .env with your MongoDB connection string"
fi

if [ ! -d "node_modules" ]; then
    echo "   Installing dependencies..."
    npm install
else
    echo "   ✅ Dependencies already installed"
fi

cd ..

# Setup Serverless Backend
echo ""
echo "☁️  Setting up Serverless Backend..."
cd serverless-backend

if [ ! -d "node_modules" ]; then
    echo "   Installing dependencies..."
    npm install
else
    echo "   ✅ Dependencies already installed"
fi

cd ..

# Instructions
echo ""
echo "================================"
echo "✅ Setup Complete!"
echo "================================"
echo ""
echo "Next steps:"
echo ""
echo "1. Configure MongoDB:"
echo "   cd express-backend"
echo "   nano .env  # or use your favorite editor"
echo ""
echo "2. Start local backend:"
echo "   npm start"
echo ""
echo "3. Open frontend:"
echo "   cd ../frontend"
echo "   open index.html  # or double-click the file"
echo ""
echo "4. (Optional) Deploy to cloud:"
echo "   See guides/DUAL_ENVIRONMENT_GUIDE.md"
echo ""
echo "📚 Documentation:"
echo "   - guides/QUICK_REFERENCE.md - Quick commands"
echo "   - guides/DUAL_ENVIRONMENT_GUIDE.md - Full setup"
echo "   - guides/iOS-Shortcut-Simple.md - iPhone integration"
echo ""
echo "Happy link managing! 🎉"
