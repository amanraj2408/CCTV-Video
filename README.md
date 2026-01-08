# 🎥 Video Dashboard - Professional Camera Management System

A modern, scalable video surveillance and camera management platform built with **Next.js**, **MongoDB**, **Clerk Authentication**, and **MQTT** for real-time feed management.

## ✨ Key Features

- **🎬 Multi-Camera Management** - Add and manage multiple camera feeds
- **📊 Real-time Monitoring** - Live dashboard with system metrics
- **🚨 Alert System** - Configurable alerts for events
- **🔌 MQTT Integration** - Real-time bidirectional communication
- **🔐 Secure Authentication** - Clerk-powered user management
- **💾 MongoDB Database** - Scalable document storage
- **📱 Responsive UI** - Works on all devices
- **🐳 Docker Ready** - Easy deployment

## 🚀 Quick Start

### Option 1: Automated Setup (Windows)
```batch
setup.bat
```

### Option 2: Automated Setup (macOS/Linux)
```bash
chmod +x setup.sh
./setup.sh
```

### Option 3: Manual Setup
1. `npm install`
2. `cp .env.example .env.local`
3. Edit `.env.local` with your settings
4. `npm run dev` (terminal 1)
5. `npm run mqtt-server` (terminal 2)

Open [http://localhost:3000](http://localhost:3000)

## 📚 Documentation

- **[SETUP_GUIDE.md](SETUP_GUIDE.md)** - Comprehensive setup guide
- **[API Documentation](#api)** - REST API endpoints
- **[Configuration](#configuration)** - Environment setup

## 🔧 Configuration

Copy `.env.example` to `.env.local` and configure:

```env
MONGODB_URI=mongodb+srv://...
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
MQTT_BROKER_URL=mqtt://localhost:1883
```

## 📦 What's Included

✅ MongoDB integration for data persistence
✅ Clerk authentication for secure user management
✅ MQTT client for real-time camera feeds
✅ API routes for camera CRUD operations
✅ Real-time monitoring dashboard
✅ Alert management system
✅ Responsive Tailwind CSS UI
✅ Docker Compose setup
✅ Production-ready configuration

## 🚢 Deployment

See [SETUP_GUIDE.md](SETUP_GUIDE.md) for deployment instructions.

## 📞 Support

For issues and questions, refer to [SETUP_GUIDE.md](SETUP_GUIDE.md) troubleshooting section.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
