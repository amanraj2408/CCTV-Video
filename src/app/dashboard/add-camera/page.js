'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AddCamera() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    rtspUrl: '',
    hlsUrl: '',
    resolution: { width: 1920, height: 1080 },
    fps: 30,
    metadata: {
      manufacturer: '',
      model: '',
      serialNumber: '',
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleMetadataChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      metadata: {
        ...prev.metadata,
        [name]: value,
      },
    }));
  };

  const handleResolutionChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      resolution: {
        ...prev.resolution,
        [name]: parseInt(value),
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.location || !formData.rtspUrl) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/cameras', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to create camera');
      }

      const newCamera = await response.json();
      router.push('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 to-gray-800">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-700">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">🎥 Add Camera</h1>
          <Link href="/dashboard" className="text-blue-400 hover:text-blue-300">
            ← Back to Dashboard
          </Link>
        </div>
      </header>

      {/* Form */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="bg-gray-800 rounded-lg p-8 space-y-6">
          {error && (
            <div className="bg-red-900 border border-red-600 text-red-100 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Basic Info */}
          <div className="border-b border-gray-700 pb-6">
            <h2 className="text-xl font-bold text-white mb-4">Camera Information</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white font-semibold mb-2">
                  Camera Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g., Main Entrance"
                  className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">
                  Location *
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g., Floor 1"
                  className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
          </div>

          {/* Stream URLs */}
          <div className="border-b border-gray-700 pb-6">
            <h2 className="text-xl font-bold text-white mb-4">Stream URLs</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-white font-semibold mb-2">
                  RTSP URL *
                </label>
                <input
                  type="text"
                  name="rtspUrl"
                  value={formData.rtspUrl}
                  onChange={handleChange}
                  placeholder="rtsp://camera-ip:554/stream"
                  className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">
                  HLS URL (Optional)
                </label>
                <input
                  type="text"
                  name="hlsUrl"
                  value={formData.hlsUrl}
                  onChange={handleChange}
                  placeholder="http://camera-ip/stream.m3u8"
                  className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Video Settings */}
          <div className="border-b border-gray-700 pb-6">
            <h2 className="text-xl font-bold text-white mb-4">Video Settings</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label className="block text-white font-semibold mb-2">
                  Width
                </label>
                <input
                  type="number"
                  name="width"
                  value={formData.resolution.width}
                  onChange={handleResolutionChange}
                  className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">
                  Height
                </label>
                <input
                  type="number"
                  name="height"
                  value={formData.resolution.height}
                  onChange={handleResolutionChange}
                  className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">
                  FPS
                </label>
                <input
                  type="number"
                  name="fps"
                  value={formData.fps}
                  onChange={handleChange}
                  className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Camera Metadata */}
          <div className="border-b border-gray-700 pb-6">
            <h2 className="text-xl font-bold text-white mb-4">Camera Metadata</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label className="block text-white font-semibold mb-2">
                  Manufacturer
                </label>
                <input
                  type="text"
                  name="manufacturer"
                  value={formData.metadata.manufacturer}
                  onChange={handleMetadataChange}
                  placeholder="e.g., Hikvision"
                  className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">
                  Model
                </label>
                <input
                  type="text"
                  name="model"
                  value={formData.metadata.model}
                  onChange={handleMetadataChange}
                  placeholder="e.g., DS-2DE3304W-DE"
                  className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">
                  Serial Number
                </label>
                <input
                  type="text"
                  name="serialNumber"
                  value={formData.metadata.serialNumber}
                  onChange={handleMetadataChange}
                  placeholder="Serial number"
                  className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-semibold py-3 rounded-lg transition"
            >
              {loading ? 'Adding Camera...' : 'Add Camera'}
            </button>
            <Link
              href="/dashboard"
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 rounded-lg transition text-center"
            >
              Cancel
            </Link>
          </div>
        </form>
      </main>
    </div>
  );
}
