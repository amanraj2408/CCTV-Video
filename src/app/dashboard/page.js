'use client';

import { useUser, UserButton } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import CameraGrid from '@/app/components/CameraGrid';
import MonitoringDashboard from '@/app/components/MonitoringDashboard';

export default function Dashboard() {
  const { user, isLoaded } = useUser();
  const [cameras, setCameras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('cameras');

  useEffect(() => {
    if (isLoaded && !user) {
      window.location.href = '/auth';
    }
  }, [isLoaded, user]);

  useEffect(() => {
    if (user) {
      fetchCameras();
    }
  }, [user]);

  const fetchCameras = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/cameras');
      if (response.ok) {
        const data = await response.json();
        setCameras(data);
      }
    } catch (error) {
      console.error('Error fetching cameras:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 to-gray-800">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white">🎥 Video Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-400">{user?.firstName} {user?.lastName}</span>
            <UserButton afterSignOutUrl="/auth" />
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 flex gap-4">
          <button
            onClick={() => setActiveTab('cameras')}
            className={`px-4 py-3 font-semibold transition ${
              activeTab === 'cameras'
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Cameras
          </button>
          <button
            onClick={() => setActiveTab('monitoring')}
            className={`px-4 py-3 font-semibold transition ${
              activeTab === 'monitoring'
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Monitoring
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-3 font-semibold transition ${
              activeTab === 'settings'
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Settings
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'cameras' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-white">My Cameras</h2>
              <Link
                href="/dashboard/add-camera"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-semibold"
              >
                + Add Camera
              </Link>
            </div>
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              </div>
            ) : cameras.length > 0 ? (
              <CameraGrid cameras={cameras} onRefresh={fetchCameras} />
            ) : (
              <div className="bg-gray-800 rounded-lg p-12 text-center">
                <p className="text-gray-400 text-lg mb-4">No cameras configured yet</p>
                <Link
                  href="/dashboard/add-camera"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Add Your First Camera
                </Link>
              </div>
            )}
          </div>
        )}

        {activeTab === 'monitoring' && (
          <div>
            <h2 className="text-3xl font-bold text-white mb-6">System Monitoring</h2>
            <MonitoringDashboard cameras={cameras} />
          </div>
        )}

        {activeTab === 'settings' && (
          <div>
            <h2 className="text-3xl font-bold text-white mb-6">Settings</h2>
            <div className="bg-gray-800 rounded-lg p-6">
              <p className="text-gray-400">Settings configuration coming soon...</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
