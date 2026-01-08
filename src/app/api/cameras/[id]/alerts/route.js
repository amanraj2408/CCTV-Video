import { auth } from '@clerk/nextjs/server';
import { connectDB } from '@/lib/db';
import Alert from '@/lib/models/Alert';
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

    const alerts = await Alert.find({
      cameraId: params.cameraId,
      userId,
    }).sort({ createdAt: -1 });

    return Response.json(alerts);
  } catch (error) {
    console.error('Error fetching alerts:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req, { params }) {
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
    const alert = new Alert({
      ...data,
      cameraId: params.cameraId,
      userId,
    });

    await alert.save();
    return Response.json(alert, { status: 201 });
  } catch (error) {
    console.error('Error creating alert:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
