# Video Dashboard - Quick Commands Reference

## 🚀 First Time Setup

```bash
# 1. Install dependencies
npm install

# 2. Create environment file
cp .env.example .env.local

# 3. Edit .env.local with your Clerk, MongoDB, and MQTT settings

# 4. Start services in separate terminals
npm run dev              # Terminal 1: Next.js server
npm run mqtt-server      # Terminal 2: MQTT client
docker-compose up        # Terminal 3: MongoDB, Mosquitto, Redis
```

## 📦 Installation Scripts

### Windows (PowerShell/CMD)
```batch
setup.bat
```

### macOS/Linux (Bash)
```bash
chmod +x setup.sh
./setup.sh
```

## ⚡ Common Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Start MQTT client
npm run mqtt-server

# Start Docker services
docker-compose up
docker-compose up -d      # Run in background

# View Docker logs
docker-compose logs -f
docker-compose logs -f mosquitto    # Specific service
docker-compose logs -f mongodb
docker-compose logs -f redis

# Stop Docker services
docker-compose down
docker-compose down -v              # Remove volumes too

# Rebuild Docker images
docker-compose up --build
```

## 🌐 Access Points

```
Application:     http://localhost:3000
API:             http://localhost:3000/api/
MongoDB:         localhost:27017
MQTT Broker:     localhost:1883
MQTT WebSocket:  localhost:9001 (ws://localhost:9001)
Redis:           localhost:6379
```

## 🔐 Create MQTT User

```bash
# Generate MQTT password file
docker-compose exec mosquitto mosquitto_passwd -c /mosquitto/config/passwd mqtt_user

# When prompted, enter your password
# Restart mosquitto to apply changes
docker-compose restart mosquitto
```

## 📝 Environment Configuration

### Minimal Setup (.env.local)
```env
# MongoDB (use MongoDB Atlas cloud version)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/video-dashboard

# Clerk Keys (get from clerk.com dashboard)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx

# MQTT (local broker)
MQTT_BROKER_URL=mqtt://localhost:1883
MQTT_USERNAME=mqtt_user
MQTT_PASSWORD=your_mqtt_password
```

### Complete Setup (.env.local)
```env
# MongoDB
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/video-dashboard?retryWrites=true&w=majority

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000

# MQTT
MQTT_BROKER_URL=mqtt://localhost:1883
MQTT_USERNAME=mqtt_user
MQTT_PASSWORD=mqtt_password
MQTT_CLIENT_ID=video-dashboard-server

# Features
ENABLE_MONITORING=true
MONITOR_UPDATE_INTERVAL=30000
DEFAULT_CAMERA_LOCATION=Main Office
DEFAULT_CAMERA_RESOLUTION=1080p
DEFAULT_CAMERA_FPS=30
```

## 📡 API Testing with cURL

```bash
# Get all cameras
curl http://localhost:3000/api/cameras \
  -H "Authorization: Bearer YOUR_CLERK_TOKEN"

# Create camera
curl -X POST http://localhost:3000/api/cameras \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_CLERK_TOKEN" \
  -d '{
    "name": "Front Door",
    "location": "Entrance",
    "rtspUrl": "rtsp://camera-ip:554/stream",
    "resolution": {"width": 1920, "height": 1080},
    "fps": 30
  }'

# Get specific camera
curl http://localhost:3000/api/cameras/[CAMERA_ID] \
  -H "Authorization: Bearer YOUR_CLERK_TOKEN"

# Update camera
curl -X PUT http://localhost:3000/api/cameras/[CAMERA_ID] \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_CLERK_TOKEN" \
  -d '{"status": "online"}'

# Delete camera
curl -X DELETE http://localhost:3000/api/cameras/[CAMERA_ID] \
  -H "Authorization: Bearer YOUR_CLERK_TOKEN"
```

## 🆘 Troubleshooting Commands

```bash
# Check Node.js version
node --version          # Should be >= 18.0.0

# Check npm version
npm --version

# Check Docker
docker --version
docker-compose --version

# Test MongoDB connection
# Use MongoDB Compass or Atlas dashboard

# Test MQTT connection
mosquitto_sub -h localhost -p 1883 -u mqtt_user -P password -t "#"

# Check port usage (Windows)
netstat -ano | findstr :3000
netstat -ano | findstr :1883
netstat -ano | findstr :27017

# Check port usage (macOS/Linux)
lsof -i :3000
lsof -i :1883
lsof -i :27017

# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

## 🐳 Docker Cheat Sheet

```bash
# Build custom image
docker build -t video-dashboard:latest .

# Run container
docker run -p 3000:3000 \
  --env-file .env.local \
  video-dashboard:latest

# View container logs
docker logs CONTAINER_ID
docker logs -f CONTAINER_ID         # Follow logs

# Execute command in container
docker exec CONTAINER_ID npm run dev

# Stop container
docker stop CONTAINER_ID

# Remove container
docker rm CONTAINER_ID

# Inspect container
docker inspect CONTAINER_ID
```

## 🚀 Deployment Checklist

```bash
# 1. Build production bundle
npm run build

# 2. Test production build locally
npm start

# 3. Set up environment on production server
# Copy .env.local to server (update values for production)

# 4. Start application
npm start

# 5. Verify all services
# - Check application at https://your-domain.com
# - Verify MongoDB connectivity
# - Verify MQTT connectivity
# - Test user registration and login
# - Test camera creation and monitoring
```

## 📊 Monitoring & Logs

```bash
# View application logs (running in foreground)
npm start           # Shows console output

# View Docker logs
docker-compose logs
docker-compose logs mosquitto
docker-compose logs mongodb
docker-compose logs redis

# Real-time log monitoring
docker-compose logs -f

# MongoDB logs (Atlas)
# View in Atlas dashboard under "Activity" tab

# MQTT logs (local)
cat mosquitto/log/mosquitto.log

# Application errors
# Check browser console (F12)
# Check Node.js console output
```

## 🔄 Restart Services

```bash
# Restart everything
docker-compose restart

# Restart specific service
docker-compose restart mosquitto
docker-compose restart mongodb

# Full restart (destroy and recreate)
docker-compose down
docker-compose up -d
```

## 📚 Quick Links

- **Next.js Docs**: https://nextjs.org/docs
- **MongoDB Atlas**: https://www.mongodb.com/cloud/atlas
- **Clerk Documentation**: https://clerk.com/docs
- **MQTT Specification**: https://mqtt.org/
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Mongoose ODM**: https://mongoosejs.com/

## 💡 Tips

1. **Development**: Use `npm run dev` for hot reloading
2. **Debugging**: Check browser console (F12) for client-side errors
3. **API Testing**: Use Postman or Insomnia
4. **Database**: Use MongoDB Compass to view documents
5. **Environment**: Never commit `.env.local` to git
6. **Logs**: Always check Docker logs first when troubleshooting

## 🆘 When Things Go Wrong

```bash
# Clear and reinstall everything
rm -rf node_modules .next dist
npm install
npm run build

# Reset Docker
docker-compose down -v
docker-compose up -d

# Check service connectivity
ping localhost
netstat -an | grep LISTEN

# Verify environment
cat .env.local | grep -v "password"

# Test Node.js
node --version
node -e "console.log('Node.js works!')"
```

---

**Need help? Check:**
1. SETUP_GUIDE.md - Detailed instructions
2. IMPLEMENTATION_CHECKLIST.md - What's been done
3. README.md - Project overview
4. Browser console (F12) - Frontend errors
5. Docker logs - Service errors

**Happy coding! 🚀**
