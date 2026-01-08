#!/bin/bash

# Video Dashboard - Quick Setup Script

set -e

echo "🚀 Video Dashboard Setup"
echo "======================="
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js >= 18.0.0"
    exit 1
fi

echo "✅ Node.js $(node --version) detected"

# Check npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed."
    exit 1
fi

echo "✅ npm $(npm --version) detected"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

# Check for .env.local
if [ ! -f ".env.local" ]; then
    echo ""
    echo "⚠️  .env.local not found"
    cp .env.example .env.local
    echo "✅ Created .env.local from .env.example"
    echo "📝 Please edit .env.local with your configuration"
    echo "   - MONGODB_URI"
    echo "   - CLERK_PUBLISHABLE_KEY"
    echo "   - CLERK_SECRET_KEY"
    echo "   - MQTT_BROKER_URL"
    exit 0
else
    echo "✅ .env.local already exists"
fi

# Check for Docker (optional)
if command -v docker &> /dev/null; then
    echo ""
    echo "🐳 Docker is installed"
    echo ""
    read -p "Do you want to start MongoDB and MQTT services? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        docker-compose up -d
        echo "✅ Services started"
        sleep 3
    fi
else
    echo ""
    echo "⚠️  Docker not detected. You'll need to set up MongoDB and MQTT separately"
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "📌 Next steps:"
echo "  1. Edit .env.local with your configuration"
echo "  2. Run: npm run dev (in one terminal)"
echo "  3. Run: npm run mqtt-server (in another terminal)"
echo "  4. Open: http://localhost:3000"
echo ""
