import { auth } from '@clerk/nextjs/server';
import { connectDB } from '@/lib/db';
import Alert from '@/lib/models/Alert';

export async function PUT(req, { params }) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    
    const alert = await Alert.findById(params.alertId);
    if (!alert || alert.userId !== userId) {
      return Response.json({ error: 'Alert not found' }, { status: 404 });
    }

    const data = await req.json();
    Object.assign(alert, data);
    await alert.save();

    return Response.json(alert);
  } catch (error) {
    console.error('Error updating alert:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
