'use client';

import { useState, useEffect, useCallback } from 'react';

export default function MonitoringDashboard({ cameras }) {
  const [monitoring, setMonitoring] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchMonitoringData = useCallback(async () => {
    if (!cameras || cameras.length === 0) return;
    
    try {
      setLoading(true);
      const data = {};
      
      for (const camera of cameras) {
        try {
          const response = await fetch(`/api/cameras/${camera._id}/monitoring`);
          if (response.ok) {
            data[camera._id] = await response.json();
          }
        } catch (error) {
          console.error(`Error fetching monitoring for camera ${camera._id}:`, error);
        }
      }
      
      setMonitoring(data);
    } finally {
      setLoading(false);
    }
  }, [cameras]);

  useEffect(() => {
    fetchMonitoringData();
  }, [fetchMonitoringData]);

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {cameras.map((camera) => (
        <div key={camera._id} className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-bold text-white mb-4">{camera.name}</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-700 rounded-lg p-4">
              <p className="text-gray-400 text-sm">Status</p>
              <p className="text-white text-lg font-semibold capitalize">
                {monitoring[camera._id]?.status || camera.status}
              </p>
            </div>
            
            <div className="bg-gray-700 rounded-lg p-4">
              <p className="text-gray-400 text-sm">CPU Usage</p>
              <p className="text-white text-lg font-semibold">
                {monitoring[camera._id]?.cpuUsage?.toFixed(1) || 0}%
              </p>
            </div>
            
            <div className="bg-gray-700 rounded-lg p-4">
              <p className="text-gray-400 text-sm">Memory</p>
              <p className="text-white text-lg font-semibold">
                {monitoring[camera._id]?.memoryUsage?.toFixed(1) || 0}%
              </p>
            </div>
            
            <div className="bg-gray-700 rounded-lg p-4">
              <p className="text-gray-400 text-sm">Bandwidth</p>
              <p className="text-white text-lg font-semibold">
                {monitoring[camera._id]?.networkBandwidth?.toFixed(2) || 0} Mbps
              </p>
            </div>
          </div>

          {monitoring[camera._id]?.errors && monitoring[camera._id].errors.length > 0 && (
            <div className="mt-4 bg-red-900 rounded-lg p-4">
              <p className="text-red-200 font-semibold mb-2">Recent Errors</p>
              <ul className="text-red-100 text-sm space-y-1">
                {monitoring[camera._id].errors.slice(0, 3).map((error, idx) => (
                  <li key={idx}>• {error.message}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
