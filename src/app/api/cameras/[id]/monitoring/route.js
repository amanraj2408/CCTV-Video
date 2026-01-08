import { auth } from '@clerk/nextjs/server';
import { connectDB } from '@/lib/db';
import CameraMonitoring from '@/lib/models/CameraMonitoring';
import Camera from '@/lib/models/Camera';

export async function GET(req, { params }) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    
    const camera = await Camera.findById(params.cameraId);
    if (!camera || camera.userId !== userId) {
      return Response.json({ error: 'Camera not found' }, { status: 404 });
    }

    const monitoring = await CameraMonitoring.findOne({
      cameraId: params.cameraId,
      userId,
    }).populate('alerts');

    if (!monitoring) {
      return Response.json({ error: 'Monitoring data not found' }, { status: 404 });
    }

    return Response.json(monitoring);
  } catch (error) {
    console.error('Error fetching monitoring data:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    
    const camera = await Camera.findById(params.cameraId);
    if (!camera || camera.userId !== userId) {
      return Response.json({ error: 'Camera not found' }, { status: 404 });
    }

    const data = await req.json();
    
    let monitoring = await CameraMonitoring.findOne({
      cameraId: params.cameraId,
      userId,
    });

    if (!monitoring) {
      monitoring = new CameraMonitoring({
        cameraId: params.cameraId,
        userId,
        ...data,
      });
    } else {
      Object.assign(monitoring, data);
    }

    await monitoring.save();
    return Response.json(monitoring);
  } catch (error) {
    console.error('Error updating monitoring data:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
