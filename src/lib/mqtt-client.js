import mqtt from 'mqtt';
import dotenv from 'dotenv';
import { connectDB } from './db.js';
import Camera from './models/Camera.js';
import CameraMonitoring from './models/CameraMonitoring.js';
import Alert from './models/Alert.js';

dotenv.config();

let client = null;

export async function initMQTT() {
  try {
    await connectDB();

    const brokerUrl = process.env.MQTT_BROKER_URL || 'mqtt://localhost:1883';
    
    client = mqtt.connect(brokerUrl, {
      clientId: process.env.MQTT_CLIENT_ID || 'video-dashboard-' + Date.now(),
      username: process.env.MQTT_USERNAME,
      password: process.env.MQTT_PASSWORD,
      reconnectPeriod: 5000,
      connectTimeout: 4000,
    });

    client.on('connect', () => {
      console.log('MQTT Connected');
      // Subscribe to camera status updates
      client.subscribe('cameras/+/status', (err) => {
        if (err) console.error('Subscribe error:', err);
        else console.log('Subscribed to cameras/+/status');
      });

      // Subscribe to alerts
      client.subscribe('cameras/+/alerts', (err) => {
        if (err) console.error('Subscribe error:', err);
        else console.log('Subscribed to cameras/+/alerts');
      });

      // Subscribe to monitoring data
      client.subscribe('cameras/+/monitoring', (err) => {
        if (err) console.error('Subscribe error:', err);
        else console.log('Subscribed to cameras/+/monitoring');
      });
    });

    client.on('message', async (topic, message) => {
      try {
        const payload = JSON.parse(message.toString());
        await handleMQTTMessage(topic, payload);
      } catch (error) {
        console.error('Error processing MQTT message:', error);
      }
    });

    client.on('error', (error) => {
      console.error('MQTT error:', error);
    });

    client.on('offline', () => {
      console.log('MQTT client offline');
    });

    return client;
  } catch (error) {
    console.error('Failed to initialize MQTT:', error);
    throw error;
  }
}

export async function handleMQTTMessage(topic, payload) {
  try {
    const parts = topic.split('/');
    const cameraId = parts[1];

    if (topic.includes('/status')) {
      // Update camera status
      await Camera.findByIdAndUpdate(cameraId, {
        status: payload.status,
      });

      // Update monitoring
      await CameraMonitoring.findOneAndUpdate(
        { cameraId },
        {
          status: payload.status,
          lastSeen: new Date(),
          cpuUsage: payload.cpuUsage || 0,
          memoryUsage: payload.memoryUsage || 0,
          networkBandwidth: payload.bandwidth || 0,
        },
        { upsert: true }
      );
    }

    if (topic.includes('/alerts')) {
      // Create alert
      const alert = new Alert({
        cameraId,
        userId: payload.userId,
        alertType: payload.type,
        severity: payload.severity,
        title: payload.title,
        description: payload.description,
        metadata: payload.metadata,
      });
      await alert.save();
    }

    if (topic.includes('/monitoring')) {
      // Update monitoring data
      await CameraMonitoring.findOneAndUpdate(
        { cameraId },
        {
          cpuUsage: payload.cpuUsage,
          memoryUsage: payload.memoryUsage,
          networkBandwidth: payload.bandwidth,
          frameDropped: payload.framesDropped,
        },
        { upsert: true }
      );
    }
  } catch (error) {
    console.error('Error handling MQTT message:', error);
  }
}

export function publishMessage(topic, payload) {
  if (client) {
    client.publish(topic, JSON.stringify(payload), { qos: 1 }, (err) => {
      if (err) console.error('Publish error:', err);
    });
  }
}

export function getMQTTClient() {
  return client;
}

export async function closeMQTT() {
  return new Promise((resolve, reject) => {
    if (client) {
      client.end(false, {}, (err) => {
        if (err) reject(err);
        else {
          console.log('MQTT disconnected');
          resolve();
        }
      });
    } else {
      resolve();
    }
  });
}
