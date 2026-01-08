"use client";

import { useRef, useState, useCallback } from "react";
import HlsVideo from "../app/components/HlsVideo";

export default function Home() {
  const videosRef = useRef([]);
  const [ready, setReady] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [usePublicStreams, setUsePublicStreams] = useState(true);
  const [baseUrl, setBaseUrl] = useState("http://localhost:8888");
  const [stats, setStats] = useState({
    activeCameras: 4,
    totalCameras: 4,
    activeAlerts: 1,
    camerasOnline: 4,
    camerasOffline: 0,
    totalViolations: 0,
    aiProcessed: 0,
    liveSlotsUsed: "0/3",
  });

  const CAMS = [
    { id: "cam1", label: "Main Camera (F1)" },
    { id: "cam2", label: "Side Camera (F2)" },
    { id: "cam3", label: "Camera 3" },
    { id: "cam4", label: "Camera 4" },
    { id: "cam5", label: "Camera 5" },
    { id: "cam6", label: "Camera 6" },
  ];

  const displayedCams = CAMS.slice(0, 4);

  // Public HLS streams for demo/testing
  const PUBLIC_STREAMS = [
    "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
    "https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8",
    "https://devstreaming-cdn.apple.com/videos/streaming/examples/img_bipbop_adv_example_fmp4/master.m3u8",
    "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
    "https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8",
    "https://devstreaming-cdn.apple.com/videos/streaming/examples/img_bipbop_adv_example_fmp4/master.m3u8",
  ];

  const onReady = useCallback((videoEl) => {
    if (!videosRef.current.includes(videoEl)) {
      videosRef.current.push(videoEl);
      setReady(videosRef.current.length);
    }
  }, []);

  const startTogether = async () => {
    const vids = videosRef.current.filter(Boolean);
    if (vids.length < displayedCams.length) {
      alert("Please wait for all streams to load");
      return;
    }

    try {
      // Get a common sync point for all videos
      const syncPoint = Date.now();
      
      // For live streams, ensure they're all at the same temporal position
      // by pausing, seeking to same position, then playing together
      const playPromises = [];
      
      vids.forEach((v) => {
        try {
          // Pause all first
          v.pause();
          // Try to sync to same playback position (works for VOD, ignored for live)
          try {
            const duration = v.duration;
            if (duration && isFinite(duration)) {
              v.currentTime = 0;
            }
          } catch (e) {
            console.debug("Could not set currentTime (likely live stream):", e);
          }
        } catch (e) {
          console.debug("Pause failed:", e);
        }
      });

      // Small delay to ensure all are paused and synced
      await new Promise(resolve => setTimeout(resolve, 100));

      // Play all at approximately the same time
      vids.forEach((v) => {
        if (v.play) {
          playPromises.push(
            v.play()
              .catch(err => console.error("Play error:", err))
          );
        }
      });

      await Promise.all(playPromises);

      // Monitor and maintain sync
      const syncInterval = setInterval(() => {
        if (!isPlaying) {
          clearInterval(syncInterval);
          return;
        }

        const activVids = vids.filter(v => !v.paused);
        if (activVids.length >= 2) {
          const times = activVids.map(v => v.currentTime);
          const maxTime = Math.max(...times);
          const minTime = Math.min(...times);
          const drift = maxTime - minTime;

          // If drift exceeds 500ms, resync
          if (drift > 0.5) {
            console.warn(`Video sync drift detected: ${(drift * 1000).toFixed(0)}ms, resyncing...`);
            activVids.forEach(v => {
              try {
                if (Math.abs(v.currentTime - minTime) > 0.2) {
                  v.currentTime = minTime;
                }
              } catch (e) {
                console.debug("Resync failed:", e);
              }
            });
          }
        }
      }, 1000);

      setIsPlaying(true);
      return () => clearInterval(syncInterval);
    } catch (error) {
      console.error("Error starting videos:", error);
    }
  };

  const stopAll = () => {
    videosRef.current.filter(Boolean).forEach(v => {
      try { v.pause(); } catch (e) { console.error('Pause failed', e); }
    });
    setIsPlaying(false);
  };

  const muteAll = () => {
    videosRef.current.filter(Boolean).forEach(v => {
      try { v.muted = true; } catch (e) { console.error('Mute failed', e); }
    });
  };

  const unmuteAll = () => {
    videosRef.current.filter(Boolean).forEach(v => {
      try { v.muted = false; } catch (e) { console.error('Unmute failed', e); }
    });
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 text-white py-6 px-4">
      <div className="max-w-full mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-linear-to-br from-yellow-400 to-orange-500 flex items-center justify-center font-bold text-lg">
                AG
              </div>
              <div>
                <h1 className="text-3xl font-bold">AerialGuard</h1>
                <p className="text-gray-400 text-sm">Traffic Monitoring & Detection System</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-right">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></div>
              <span className="text-sm">Reconnecting...</span>
            </div>
            <div className="flex items-center gap-2 ml-6">
              <div className="w-2 h-2 rounded-full bg-red-500"></div>
              <span className="text-sm">MQTT Disconnected</span>
            </div>
          </div>
        </div>

        {/* System Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-linear-to-br from-slate-800 to-slate-800/50 rounded-lg p-6 border border-slate-700 shadow-lg">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                <span className="text-green-400 text-xl">👁️</span>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Active Cameras</p>
                <p className="text-3xl font-bold text-green-400">{stats.activeCameras}/{stats.totalCameras}</p>
              </div>
            </div>
          </div>

          <div className="bg-linear-to-br from-slate-800 to-slate-800/50 rounded-lg p-6 border border-slate-700 shadow-lg">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                <span className="text-red-400 text-xl">⚠️</span>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Active Alerts</p>
                <p className="text-3xl font-bold text-red-400">{stats.activeAlerts}</p>
              </div>
            </div>
          </div>

          <div className="bg-linear-to-br from-slate-800 to-slate-800/50 rounded-lg p-6 border border-slate-700 shadow-lg">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                <span className="text-blue-400 text-xl">📷</span>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Total Cameras</p>
                <p className="text-3xl font-bold text-blue-400">{stats.totalCameras}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Alert Box */}
        {stats.activeAlerts > 0 && (
          <div className="bg-linear-to-r from-red-900/40 to-red-900/20 border-l-4 border-red-500 rounded-lg p-4 mb-8 flex items-center gap-3">
            <span className="text-red-400 text-xl">⚠️</span>
            <span className="text-red-200">1 camera reporting violations</span>
          </div>
        )}

        {/* Control Buttons */}
        <div className="flex gap-4 mb-8 flex-wrap">
          <button
            onClick={startTogether}
              disabled={ready < displayedCams.length || isPlaying}
            className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-medium transition-all flex items-center gap-2 shadow-lg"
          >
            <span>🎛️</span> Disable Priority
          </button>
          <button
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-all flex items-center gap-2 shadow-lg"
          >
            <span>⚡</span> Force AI Mode
          </button>
          <button
            className="px-6 py-2.5 bg-green-600 hover:bg-green-700 rounded-lg font-medium transition-all flex items-center gap-2 shadow-lg"
          >
            <span>🔄</span> Retry All Live Feeds
          </button>
        </div>

        {/* CCTV Monitoring Wall Title */}
        <div className="mb-4">
          <h2 className="text-2xl font-bold mb-2">CCTV Monitoring Wall</h2>
          <p className="text-gray-400 text-sm">Managing {ready}/{displayedCams.length} cameras • 3 concurrent live slots</p>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-8">
          <div className="bg-linear-to-br from-green-900/30 to-green-900/10 border-l-4 border-green-500 rounded-lg p-4">
            <p className="text-gray-400 text-xs mb-1">Cameras Online</p>
            <p className="text-2xl font-bold text-green-400">{stats.camerasOnline}</p>
          </div>
          <div className="bg-linear-to-br from-red-900/30 to-red-900/10 border-l-4 border-red-500 rounded-lg p-4">
            <p className="text-gray-400 text-xs mb-1">Cameras Offline</p>
            <p className="text-2xl font-bold text-red-400">{stats.camerasOffline}</p>
          </div>
          <div className="bg-linear-to-br from-orange-900/30 to-orange-900/10 border-l-4 border-orange-500 rounded-lg p-4">
            <p className="text-gray-400 text-xs mb-1">Total Violations</p>
            <p className="text-2xl font-bold text-orange-400">{stats.totalViolations}</p>
          </div>
          <div className="bg-linear-to-br from-blue-900/30 to-blue-900/10 border-l-4 border-blue-500 rounded-lg p-4">
            <p className="text-gray-400 text-xs mb-1">AI Processed Feeds</p>
            <p className="text-2xl font-bold text-blue-400">{stats.aiProcessed}</p>
          </div>
          <div className="bg-linear-to-br from-purple-900/30 to-purple-900/10 border-l-4 border-purple-500 rounded-lg p-4">
            <p className="text-gray-400 text-xs mb-1">Live Slots Used</p>
            <p className="text-2xl font-bold text-purple-400">{stats.liveSlotsUsed}</p>
          </div>
        </div>

        {/* Stream Source Controls */}
        <div className="mb-6 flex items-center gap-3 flex-wrap bg-slate-800/50 p-4 rounded-lg border border-slate-700">
          <label className="text-sm font-medium text-gray-300">Stream Source:</label>
          <button
            onClick={() => {
              setUsePublicStreams(false);
              setReady(0);
              videosRef.current = [];
            }}
            className={`px-4 py-2 rounded-lg font-medium transition-all text-sm ${
              !usePublicStreams
                ? 'bg-blue-600 text-white'
                : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
            }`}
          >
            MediaMTX (localhost:8888)
          </button>
          <button
            onClick={() => {
              setUsePublicStreams(true);
              setReady(0);
              videosRef.current = [];
            }}
            className={`px-4 py-2 rounded-lg font-medium transition-all text-sm ${
              usePublicStreams
                ? 'bg-blue-600 text-white'
                : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
            }`}
          >
            Public Demo Streams
          </button>
          {!usePublicStreams && (
            <input
              type="text"
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              placeholder="http://localhost:8888"
              className="flex-1 min-w-xs px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          )}
          <div className="ml-auto flex gap-2">
            <button
              onClick={startTogether}
              disabled={ready < displayedCams.length}
              className="px-3 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-medium text-sm"
            >
              ▶️ Start All
            </button>
            <button
              onClick={stopAll}
              className="px-3 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-medium text-sm"
            >
              ⏸️ Stop All
            </button>
            <button
              onClick={muteAll}
              className="px-3 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg font-medium text-sm"
            >
              🔇 Mute All
            </button>
            <button
              onClick={unmuteAll}
              className="px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium text-sm"
            >
              🔊 Unmute All
            </button>
          </div>
        </div>

        {/* Camera Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {displayedCams.map((cam, index) => (
            <HlsVideo
              key={`${cam.id}-${usePublicStreams}`}
              src={usePublicStreams ? PUBLIC_STREAMS[index] : `${baseUrl}/${cam.id}/index.m3u8`}
              onReady={onReady}
              label={cam.label}
            />
          ))}
        </div>

        {/* System Info Footer */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 border-t border-slate-700 pt-8">
          <div>
            <h3 className="text-sm font-semibold text-gray-400 mb-3">System Status</h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between"><span className="text-gray-400">Network Latency:</span><span className="text-green-400 font-medium">12ms</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Data Processing:</span><span className="text-green-400 font-medium">Normal</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Storage Used:</span><span className="text-yellow-400 font-medium">68%</span></div>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-400 mb-3">Detection Stats</h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between"><span className="text-gray-400">Accuracy Rate:</span><span className="text-green-400 font-medium">94.2%</span></div>
              <div className="flex justify-between"><span className="text-gray-400">False Positives:</span><span className="text-green-400 font-medium">2.1%</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Response Time:</span><span className="text-green-400 font-medium">1.3s</span></div>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-400 mb-3">Fleet Management</h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between"><span className="text-gray-400">Drones Deployed:</span><span className="text-blue-400 font-medium">12/15</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Battery Average:</span><span className="text-green-400 font-medium">87%</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Flight Hours Today:</span><span className="text-gray-300 font-medium">142h</span></div>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-400 mb-3">Contact & Support</h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between"><span className="text-gray-400">Emergency:</span><span className="text-red-400 font-medium">+1-800-SAFETY</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Support:</span><span className="text-gray-300 font-medium">support@aerialguard.com</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Last Update:</span><span className="text-gray-300 font-medium">Today 14:32</span></div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-xs text-gray-500">
          © 2025 AerialGuard Traffic Monitoring System. All rights reserved. | Version 2.1.4
        </div>
      </div>
    </div>
  );
}
