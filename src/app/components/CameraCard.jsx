'use client';

import { useState, useEffect } from 'react';

export default function CameraCard({ camera, isSelected, onClick }) {
  const [isOnline, setIsOnline] = useState(camera.status === 'online');

  const statusColor = {
    online: 'bg-green-500',
    offline: 'bg-red-500',
    recording: 'bg-blue-500',
    error: 'bg-yellow-500',
  };

  const statusText = {
    online: 'Online',
    offline: 'Offline',
    recording: 'Recording',
    error: 'Error',
  };

  return (
    <div
      onClick={onClick}
      className={`bg-gray-800 rounded-lg overflow-hidden hover:shadow-lg hover:shadow-blue-500/50 transition cursor-pointer transform hover:scale-105 ${
        isSelected ? 'ring-2 ring-blue-400' : ''
      }`}
    >
      {/* Video Feed Placeholder */}
      <div className="bg-gray-900 h-40 flex items-center justify-center relative">
        <div className="text-gray-500 text-center">
          <p>📹</p>
          <p className="text-sm mt-2">{camera.hlsUrl ? 'Stream Ready' : 'No Stream'}</p>
        </div>
        {/* Status Badge */}
        <div className="absolute top-2 right-2">
          <div className={`${statusColor[camera.status]} text-white px-2 py-1 rounded text-xs font-semibold flex items-center gap-1`}>
            <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
            {statusText[camera.status]}
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-white mb-1">{camera.name}</h3>
        <p className="text-gray-400 text-sm mb-3">{camera.location}</p>
        
        {/* Stats */}
        <div className="grid grid-cols-2 gap-2 text-sm mb-3">
          <div className="bg-gray-700 rounded p-2">
            <p className="text-gray-400 text-xs">Resolution</p>
            <p className="text-white font-semibold">
              {camera.resolution.width}x{camera.resolution.height}
            </p>
          </div>
          <div className="bg-gray-700 rounded p-2">
            <p className="text-gray-400 text-xs">FPS</p>
            <p className="text-white font-semibold">{camera.fps}fps</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded text-sm font-semibold transition">
            View Feed
          </button>
          <button className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded text-sm font-semibold transition">
            Settings
          </button>
        </div>
      </div>
    </div>
  );
}
