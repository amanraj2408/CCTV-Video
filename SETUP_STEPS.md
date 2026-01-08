# 📋 Step-by-Step Setup Guide

Follow these steps in order to get your Video Dashboard running!

---

## ✅ STEP 1: Create .env.local File (2 minutes)

### What to do:
1. In VS Code, open the **Explorer** panel (left sidebar)
2. Right-click on the **video-dashboard** folder (root)
3. Select **New File**
4. Name it: `.env.local`
5. Copy the content below and paste it into the file:

```env
# MongoDB Configuration (We'll update this in Step 2)
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/video-dashboard?retryWrites=true&w=majority

# Clerk Authentication (We'll update this in Step 3)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_YOUR_PUBLISHABLE_KEY
CLERK_SECRET_KEY=sk_test_YOUR_SECRET_KEY

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000

# MQTT Configuration
MQTT_BROKER_URL=mqtt://localhost:1883
MQTT_USERNAME=mqtt_user
MQTT_PASSWORD=mqtt_password
MQTT_CLIENT_ID=video-dashboard-server

# Camera Configuration
DEFAULT_CAMERA_LOCATION=Main Office
DEFAULT_CAMERA_RESOLUTION=1080p
DEFAULT_CAMERA_FPS=30

# Monitoring
ENABLE_MONITORING=true
MONITOR_UPDATE_INTERVAL=30000
```

**⚠️ IMPORTANT:** 
- `.env.local` is automatically added to `.gitignore` (don't commit it)
- Keep your keys safe and never share them
- This file will NOT be uploaded to GitHub

---

## ✅ STEP 2: Set Up MongoDB (5 minutes)

### Create a Free MongoDB Cluster:

1. **Go to**: https://www.mongodb.com/cloud/atlas
2. **Sign Up** (or log in if you have an account)
3. **Click**: "Create a Project" or "New Project"
4. **Enter Project Name**: `video-dashboard`
5. **Click**: "Create Project"

### Create a Database Cluster:

1. **Click**: "Create a Deployment"
2. **Select**: "M0 FREE" tier (free forever)
3. **Choose Region**: Closest to you (e.g., `us-east-1`)
4. **Click**: "Create Deployment"
5. Wait 3-5 minutes for cluster to deploy...

### Create Database User:

1. **In left sidebar**, click **"Database Access"**
2. **Click**: "Add New Database User"
3. **Enter Username**: `cctvadmin`
4. **Enter Password**: Create a strong password (save it!)
5. **Click**: "Add User"

### Get Connection String:

1. **Go back to Deployments** (left sidebar)
2. **Click**: "Connect" on your cluster
3. **Select**: "Drivers" (not Shell)
4. **Copy** the MongoDB URI string
5. **Replace** in your `.env.local`:
   - Keep the format but replace `<username>` and `<password>`
   - Example: `mongodb+srv://cctvadmin:mypassword123@cluster0.abc123.mongodb.net/video-dashboard?retryWrites=true&w=majority`

**In VS Code:**
- Open `.env.local`
- Find: `MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER...`
- Replace with your actual connection string
- Save the file (Ctrl+S)

✅ **MongoDB is ready!**

---

## ✅ STEP 3: Set Up Clerk Authentication (5 minutes)

### Create Clerk Account:

1. **Go to**: https://clerk.com
2. **Click**: "Sign Up"
3. **Enter your email** and create password
4. **Verify email** (check your inbox)

### Create Clerk App:

1. **In Dashboard**, click "Create Application"
2. **Choose Sign-Up Method**: Email, Google, GitHub (your choice)
3. **Click**: "Create application"
4. **On the next page**, you'll see your API keys

### Copy Your Keys:

**In Clerk Dashboard**, find the keys section and copy:

1. **NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY**
   - Starts with `pk_test_` or `pk_live_`
   
2. **CLERK_SECRET_KEY**
   - Starts with `sk_test_` or `sk_live_`

**In VS Code:**
- Open `.env.local`
- Replace:
  - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_YOUR_PUBLISHABLE_KEY` → paste actual key
  - `CLERK_SECRET_KEY=sk_test_YOUR_SECRET_KEY` → paste actual key
- Save the file (Ctrl+S)

✅ **Clerk is ready!**

---

## ✅ STEP 4: Start Required Services (Terminal 1 - Docker)

### Open a New Terminal:

1. In VS Code, press **Ctrl + `** (backtick) to open terminal
2. Or go to **View** → **Terminal**

### Start Docker Services:

```bash
docker-compose up
```

**What this does:**
- ✓ Starts MongoDB database
- ✓ Starts MQTT broker (for real-time updates)
- ✓ Starts Redis cache

**You should see:**
```
✓ Creating mongodb ... done
✓ Creating mosquitto ... done
✓ Creating redis ... done
```

**Leave this terminal running!** Do not close it.

---

## ✅ STEP 5: Start the Dev Server (Terminal 2 - Already Running)

### Check if running:
- The dev server should already be running
- You should see in terminal:
```
✓ Starting...
✓ Ready in 1707ms
- Local: http://localhost:3000
```

**If NOT running:**
1. Open a new terminal (Ctrl + ``)
2. Run:
```bash
npm run dev
```

**Leave this terminal running too!**

---

## ✅ STEP 6: Start MQTT Server (Terminal 3)

### Open another new terminal:
1. Press **Ctrl + `** to open terminal
2. Go to **View** → **Terminal** if that doesn't work

### Start MQTT Listener:
```bash
npm run mqtt-server
```

**You should see:**
```
✓ MQTT Server Started
✓ Connected to: mqtt://localhost:1883
✓ Listening to topics...
```

**Leave this running too!**

---

## 🎉 STEP 7: Access Your Dashboard

### Open in Browser:

1. **Go to**: http://localhost:3000
2. You should see:
   - Video Dashboard homepage
   - **Sign In / Sign Up** buttons (top right)
   - A professional looking interface

### Create Your First Account:

1. **Click** "Sign Up" button
2. **Enter your email**
3. **Create a password**
4. **Verify email** (check inbox for link from Clerk)
5. You'll be logged in automatically! ✓

---

## ✅ STEP 8: Add Your First Camera

### After Login:

1. You'll see the Dashboard page
2. **Click**: "Add Camera" button (or "+" icon)
3. **Fill in the form:**

   | Field | Example |
   |-------|---------|
   | **Camera Name** | Front Door Camera |
   | **Location** | Main Entrance |
   | **RTSP URL** | rtsp://192.168.1.100:554/stream |
   | **HLS URL** | http://192.168.1.100:8080/hls/stream.m3u8 |
   | **Resolution** | 1920 x 1080 |
   | **FPS** | 30 |
   | **Manufacturer** | Hikvision (optional) |
   | **Model** | DS-2CD2143G0-I (optional) |
   | **Serial** | ABC12345 (optional) |

4. **Click**: "Add Camera" button
5. ✅ Camera appears in dashboard!

**Note:** You'll need actual camera IP addresses. If you don't have cameras yet, you can test with:
- IP Camera simulator apps
- Mock RTSP streams
- Test URLs (see Testing section below)

---

## 🔍 STEP 9: Verify Everything Works

### Checklist:

- [ ] `.env.local` file created with all keys filled in
- [ ] Docker services running (Terminal 1)
- [ ] Dev server running (Terminal 2) on http://localhost:3000
- [ ] MQTT server running (Terminal 3)
- [ ] Can access http://localhost:3000 in browser
- [ ] Clerk sign-up/login works
- [ ] Can view Dashboard page
- [ ] Can add a camera (or see camera list)
- [ ] No errors in browser console (F12 → Console tab)

### If Something Isn't Working:

**Issue: "Cannot connect to database"**
- Check `.env.local` - ensure MONGODB_URI is correct
- Verify MongoDB cluster is running at atlas.mongodb.com
- Test connection with MongoDB Compass (optional)

**Issue: "Clerk authentication failing"**
- Check `.env.local` - verify Clerk keys are correct
- Ensure keys are from the same Clerk app
- Restart dev server: Stop (Ctrl+C) and run `npm run dev` again

**Issue: "MQTT not connecting"**
- Verify `docker-compose up` is still running
- Check no other services on port 1883
- Restart: `docker-compose down` then `docker-compose up`

**Issue: "Page shows blank or errors"**
- Open Developer Tools: Press **F12**
- Check **Console** tab for red errors
- Try **hard refresh**: Ctrl+Shift+R or Cmd+Shift+R
- Restart dev server if needed

---

## 📊 Terminal Summary

You should have **3 terminals running**:

| Terminal | Command | Status | Port |
|----------|---------|--------|------|
| **1 - Docker** | `docker-compose up` | Keep running | 27017, 1883, 6379 |
| **2 - Dev Server** | `npm run dev` | Keep running | 3000 |
| **3 - MQTT Server** | `npm run mqtt-server` | Keep running | (MQTT listener) |

---

## 🎯 Next Steps (After Setup)

Once everything is working:

1. **Add more cameras** - Use real camera IP addresses
2. **View monitoring dashboard** - Real-time CPU/Memory/Bandwidth metrics
3. **Configure alerts** - Get notified of issues
4. **Watch live streams** - HLS video playback
5. **Deploy to cloud** - Use Vercel, Azure, or Docker

---

## 📚 Useful Links

- **MongoDB Atlas**: https://atlas.mongodb.com
- **Clerk Dashboard**: https://dashboard.clerk.com
- **Docker Docs**: https://docs.docker.com
- **Next.js Docs**: https://nextjs.org/docs
- **MQTT Documentation**: https://mqtt.org

---

## 💡 Tips

1. **Save time**: Keep all 3 terminals open in split view
2. **Debug easily**: Use F12 to open Dev Tools, check Console tab
3. **Quick restart**: Stop server with Ctrl+C and run `npm run dev`
4. **Check logs**: Each terminal shows real-time logs - watch for errors
5. **Test mode**: Add `?debug=true` to URL to see debug info

---

## ✅ You're All Set!

Your video dashboard is now ready to use! 

**Access it at:** http://localhost:3000

Questions or issues? Check the console logs in each terminal for error messages.
