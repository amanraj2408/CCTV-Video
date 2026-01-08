import mongoose from 'mongoose';

const cameraSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    rtspUrl: {
      type: String,
      required: true,
    },
    hlsUrl: {
      type: String,
    },
    resolution: {
      width: { type: Number, default: 1920 },
      height: { type: Number, default: 1080 },
    },
    fps: {
      type: Number,
      default: 30,
    },
    status: {
      type: String,
      enum: ['online', 'offline', 'recording', 'error'],
      default: 'offline',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    userId: {
      type: String,
      required: true,
    },
    metadata: {
      manufacturer: String,
      model: String,
      serialNumber: String,
      installDate: Date,
      lastMaintenance: Date,
    },
    mqttTopic: {
      type: String,
    },
    alertsEnabled: {
      type: Boolean,
      default: true,
    },
    recordingEnabled: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Camera || mongoose.model('Camera', cameraSchema);
