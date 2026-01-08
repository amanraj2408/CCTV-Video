# Video Dashboard - Complete Setup Guide

## Overview
This is a professional video surveillance and camera management system built with Next.js, MongoDB, Clerk authentication, and MQTT real-time feed integration.

## Architecture Components

### 1. **Frontend** (Next.js + React)
- Dashboard with camera management
- Real-time monitoring interface
- Authentication via Clerk
- Responsive UI with Tailwind CSS

### 2. **Backend** (Next.js API Routes)
- RESTful API for camera management
- Database operations with Mongoose
- Authentication middleware
- MQTT message handling

### 3. **Database** (MongoDB)
- Camera configurations
- Monitoring data
- Alerts and notifications
- User metadata

### 4. **Real-time** (MQTT)
- Camera status updates
- Live feed notifications
- Alert broadcasting
- System monitoring metrics

### 5. **Authentication** (Clerk)
- User sign-up/sign-in
- Social authentication support
- User management
- Session handling

## Prerequisites

- **Node.js** >= 18.0.0
- **MongoDB** >= 5.0 (Cloud or Local)
- **MQTT Broker** (Mosquitto)
- **Clerk Account** (Free tier available)
- **Docker & Docker Compose** (Optional, for running services locally)

## Installation Steps

### Step 1: Clone and Install Dependencies

\`\`\`bash
cd video-dashboard
npm install
\`\`\`

### Step 2: Environment Configuration

Copy the example env file:
\`\`\`bash
cp .env.example .env.local
\`\`\`

Edit \`.env.local\` with your configuration:

\`\`\`env
# MongoDB Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/video-dashboard?retryWrites=true&w=majority

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000

# MQTT Configuration
MQTT_BROKER_URL=mqtt://localhost:1883
MQTT_USERNAME=mqtt_user
MQTT_PASSWORD=mqtt_password
MQTT_CLIENT_ID=video-dashboard-server
\`\`\`

### Step 3: Set Up MongoDB

#### Option A: MongoDB Atlas (Recommended)
1. Create account at [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Create a free cluster
3. Generate connection string
4. Replace \`MONGODB_URI\` in \`.env.local\`

#### Option B: Local MongoDB with Docker
\`\`\`bash
docker-compose up -d mongodb
\`\`\`

### Step 4: Set Up Clerk Authentication

1. Create account at [clerk.com](https://clerk.com)
2. Create a new application
3. Copy publishable and secret keys to \`.env.local\`
4. Configure redirect URIs in Clerk dashboard:
   - \`http://localhost:3000\`
   - \`http://localhost:3000/auth/callback\`
   - Your production URL

### Step 5: Set Up MQTT Broker

#### Option A: Local with Docker
\`\`\`bash
docker-compose up -d mosquitto
\`\`\`

#### Option B: Remote MQTT Broker
Update \`MQTT_BROKER_URL\` in \`.env.local\` with your broker URL.

### Step 6: Create MQTT User (if using Docker)

\`\`\`bash
# Generate password file for MQTT
docker-compose exec mosquitto mosquitto_passwd -c /mosquitto/config/passwd mqtt_user

# Enter password when prompted
\`\`\`

## Running the Application

### Development Mode

Terminal 1 - Next.js Dev Server:
\`\`\`bash
npm run dev
\`\`\`

Terminal 2 - MQTT Server:
\`\`\`bash
npm run mqtt-server
\`\`\`

Terminal 3 - Docker Services (optional):
\`\`\`bash
docker-compose up
\`\`\`

Access the application at \`http://localhost:3000\`

### Production Build

\`\`\`bash
npm run build
npm start
\`\`\`

## API Endpoints

### Cameras
- \`GET /api/cameras\` - List all cameras
- \`POST /api/cameras\` - Create new camera
- \`GET /api/cameras/[id]\` - Get camera details
- \`PUT /api/cameras/[id]\` - Update camera
- \`DELETE /api/cameras/[id]\` - Delete camera

### Monitoring
- \`GET /api/cameras/[cameraId]/monitoring\` - Get monitoring data
- \`PUT /api/cameras/[cameraId]/monitoring\` - Update monitoring data

### Alerts
- \`GET /api/cameras/[cameraId]/alerts\` - List alerts
- \`POST /api/cameras/[cameraId]/alerts\` - Create alert
- \`PUT /api/cameras/[cameraId]/alerts/[alertId]\` - Update alert

## MQTT Topics

### Camera Status
\`\`\`
cameras/{cameraId}/status
Payload: { status: 'online'|'offline'|'recording'|'error', cpuUsage, memoryUsage, bandwidth }
\`\`\`

### Alerts
\`\`\`
cameras/{cameraId}/alerts
Payload: { type, severity, title, description, userId, metadata }
\`\`\`

### Monitoring Data
\`\`\`
cameras/{cameraId}/monitoring
Payload: { cpuUsage, memoryUsage, bandwidth, framesDropped }
\`\`\`

## Database Models

### Camera
\`\`\`javascript
{
  name: String,
  location: String,
  rtspUrl: String,
  hlsUrl: String,
  resolution: { width: Number, height: Number },
  fps: Number,
  status: 'online'|'offline'|'recording'|'error',
  userId: String,
  metadata: { manufacturer, model, serialNumber },
  mqttTopic: String,
  alertsEnabled: Boolean,
  recordingEnabled: Boolean
}
\`\`\`

### CameraMonitoring
\`\`\`javascript
{
  cameraId: ObjectId,
  userId: String,
  status: String,
  cpuUsage: Number,
  memoryUsage: Number,
  networkBandwidth: Number,
  frameDropped: Number,
  errors: [{ timestamp, message, severity }],
  alerts: [ObjectId]
}
\`\`\`

### Alert
\`\`\`javascript
{
  cameraId: ObjectId,
  userId: String,
  alertType: 'motion_detected'|'offline'|'connection_error'|'high_cpu'|'disk_full'|'custom',
  severity: 'low'|'medium'|'high'|'critical',
  title: String,
  description: String,
  isResolved: Boolean,
  metadata: Object
}
\`\`\`

## Features

✅ **Multi-camera Management** - Add, edit, delete cameras
✅ **Real-time Monitoring** - Live status, CPU, memory, bandwidth metrics
✅ **Alert System** - Configurable alerts for various events
✅ **MQTT Integration** - Real-time feed updates
✅ **Secure Authentication** - Clerk-powered user management
✅ **Scalable Database** - MongoDB for flexible data storage
✅ **Responsive UI** - Works on desktop, tablet, mobile
✅ **User Isolation** - Each user sees only their cameras

## Deployment

### Vercel (Recommended for Next.js)
\`\`\`bash
vercel deploy
\`\`\`

### Docker
\`\`\`bash
docker build -t video-dashboard .
docker run -p 3000:3000 --env-file .env.local video-dashboard
\`\`\`

### AWS/Azure/GCP
Use the provided Docker image with your preferred cloud provider.

## Monitoring & Logging

Logs are available in:
- Application: Console output
- MQTT: \`mosquitto/log/mosquitto.log\`
- Database: MongoDB Atlas dashboard

## Troubleshooting

### MongoDB Connection Issues
- Verify connection string in \`.env.local\`
- Check firewall/network settings
- Ensure MongoDB instance is running

### MQTT Connection Issues
- Verify broker is running: \`docker-compose logs mosquitto\`
- Check credentials in \`.env.local\`
- Verify MQTT client ID is unique

### Clerk Authentication Issues
- Verify keys are correct
- Check redirect URLs in Clerk dashboard
- Clear browser cache and cookies

### Camera Feed Not Loading
- Verify RTSP/HLS URL is accessible
- Check network connectivity
- Verify camera permissions

## Security Considerations

1. **Environment Variables** - Never commit \`.env.local\` to version control
2. **MQTT Credentials** - Use strong passwords
3. **Database** - Enable MongoDB authentication
4. **API Keys** - Rotate Clerk keys regularly
5. **HTTPS** - Always use HTTPS in production
6. **CORS** - Configure appropriately for your domain

## Performance Tips

1. Use MongoDB indexes for frequently queried fields
2. Implement pagination for camera lists
3. Cache monitoring data with Redis
4. Use CDN for static assets
5. Optimize image sizes for thumbnails

## Next Steps

1. ✅ Initial Setup Complete
2. Deploy to production server
3. Set up continuous monitoring
4. Configure backup strategy
5. Plan for scalability

## Support & Documentation

- Next.js: https://nextjs.org/docs
- MongoDB: https://docs.mongodb.com
- Clerk: https://clerk.com/docs
- MQTT: https://mosquitto.org/documentation
- Mongoose: https://mongoosejs.com/docs

## License

See LICENSE file in project root.

---

**System Architecture Diagram**: [See monitoring.theunit.com for reference]
