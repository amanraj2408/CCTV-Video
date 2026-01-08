import mongoose from 'mongoose';

const alertSchema = new mongoose.Schema(
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
    alertType: {
      type: String,
      enum: ['motion_detected', 'offline', 'connection_error', 'high_cpu', 'disk_full', 'custom'],
      required: true,
    },
    severity: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium',
    },
    title: String,
    description: String,
    isResolved: {
      type: Boolean,
      default: false,
    },
    resolvedAt: Date,
    resolvedBy: String,
    metadata: mongoose.Schema.Types.Mixed,
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Alert || mongoose.model('Alert', alertSchema);
