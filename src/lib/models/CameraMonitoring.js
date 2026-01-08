import mongoose from 'mongoose';

const cameraMonitoringSchema = new mongoose.Schema(
  {
    cameraId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Camera',
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['online', 'offline', 'recording', 'error'],
      default: 'offline',
    },
    lastSeen: {
      type: Date,
      default: Date.now,
    },
    uptime: {
      type: Number,
      default: 0,
    },
    cpuUsage: {
      type: Number,
      default: 0,
    },
    memoryUsage: {
      type: Number,
      default: 0,
    },
    networkBandwidth: {
      type: Number,
      default: 0,
    },
    frameDropped: {
      type: Number,
      default: 0,
    },
    errors: [
      {
        timestamp: Date,
        message: String,
        severity: {
          type: String,
          enum: ['low', 'medium', 'high', 'critical'],
        },
      },
    ],
    alerts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Alert',
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.CameraMonitoring || mongoose.model('CameraMonitoring', cameraMonitoringSchema);
