# 📦 Installation Guide - Video Dashboard

## What You Need to Install

### Prerequisites
- ✅ **Node.js** (version 18+) - [Download](https://nodejs.org)
- ✅ **npm** (comes with Node.js)
- ✅ **Docker & Docker Compose** (optional but recommended) - [Download](https://www.docker.com/products/docker-desktop)

---

## Installation Steps

### Step 1: Check Node.js Installation

Open PowerShell/CMD and verify:

```powershell
node --version      # Should show v18.x.x or higher
npm --version       # Should show 9.x.x or higher
```

If not installed, download from [nodejs.org](https://nodejs.org)

---

### Step 2: Install Project Dependencies

Navigate to the project folder:

```powershell
cd d:\Video-Stream\video-dashboard
npm install
```

**What this installs:**

| Package | Purpose |
|---------|---------|
| `@clerk/nextjs` | Authentication |
| `mongoose` | MongoDB database |
| `mqtt` | Real-time messaging |
| `next` | React framework |
| `react` | UI library |
| `tailwindcss` | Styling |
| `axios` | HTTP requests |
| `dotenv` | Environment variables |

**Total size**: ~500MB (will be in `node_modules/` folder)

---

### Step 3: Configure Environment

Create `.env.local` file:

```powershell
copy .env.example .env.local
```

Edit `.env.local` with your settings (see below)

---

### Step 4: Set Up External Services

#### Option A: Using Docker (Recommended)

```powershell
docker-compose up
```

This starts:
- ✅ MongoDB database
- ✅ MQTT broker
- ✅ Redis cache

#### Option B: Manual Setup

You need to set up separately:
1. MongoDB Atlas account → mongodb.com/cloud/atlas
2. MQTT Broker → mosquitto
3. Clerk account → clerk.com

---

## Configuration (.env.local)

Create `.env.local` file with:

```env
# MongoDB - from MongoDB Atlas
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/video-dashboard

# Clerk - from clerk.com dashboard
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx

# MQTT - local or remote broker
MQTT_BROKER_URL=mqtt://localhost:1883
MQTT_USERNAME=mqtt_user
MQTT_PASSWORD=mqtt_password
```

---

## Start Development

### Terminal 1: Development Server
```powershell
npm run dev
# Starts on http://localhost:3000
```

### Terminal 2: MQTT Server
```powershell
npm run mqtt-server
# Starts MQTT listener
```

### Terminal 3: Docker Services (if using Docker)
```powershell
docker-compose up
# Starts MongoDB, MQTT, Redis
```

---

## Verify Installation

Check if everything works:

```powershell
# Test Node.js
node -v

# Test npm
npm -v

# Test project structure
dir src\app\api\cameras
dir src\lib\models

# Test development server (run this, then press Ctrl+C to stop)
npm run dev
```

---

## Troubleshooting Installation

### "npm: command not found"
→ Node.js not installed. Download from [nodejs.org](https://nodejs.org)

### "Cannot find module 'mongoose'"
→ Run `npm install` in the project folder

### "EACCES: permission denied"
→ Clear npm cache: `npm cache clean --force`

### "Port 3000 already in use"
→ Either close other app or use different port: `npm run dev -- -p 3001`

### "MongoDB connection failed"
→ Check MONGODB_URI in .env.local is correct

---

## What's Installed

### Production Dependencies (11 packages)
```
@clerk/nextjs ^6.36.6         - Authentication
@clerk/themes ^1.7.9          - Auth UI themes
axios ^1.6.0                  - HTTP client
dotenv ^16.3.1                - Environment variables
hls.js ^1.6.15                - Video streaming
mongoose ^8.0.0               - MongoDB ORM
mqtt ^5.4.1                   - Real-time messaging
next ^16.0.8                  - React framework
prop-types ^15.8.1            - Type checking
react ^18.3.1                 - UI library
react-dom ^18.3.1             - DOM rendering
```

### Development Dependencies (4 packages)
```
@tailwindcss/postcss ^4       - CSS framework
eslint ^9                     - Code linting
eslint-config-next ^16.0.8    - Next.js linting
tailwindcss ^4                - Styling utilities
```

---

## Verify Everything is Installed

```powershell
# Check node_modules exists
dir node_modules | head -20

# Check specific packages
npm list mongoose
npm list mqtt
npm list @clerk/nextjs
```

---

## Next Steps

1. ✅ Install Node.js (if not done)
2. ✅ Run `npm install`
3. ✅ Create `.env.local`
4. ✅ Start services with `npm run dev`
5. ✅ Access http://localhost:3000

---

## Need Help?

| Issue | Solution |
|-------|----------|
| Installation errors | Check SETUP_GUIDE.md |
| Configuration problems | See QUICK_COMMANDS.md |
| Commands reference | Run `node scripts/quick-ref.js setup` |

---

**Installation Time**: 5-10 minutes  
**Disk Space Needed**: ~1GB (node_modules + Docker images)  
**Status**: Ready to proceed ✅
