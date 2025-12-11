"use client";

import { useRef, useState, useCallback } from "react";
import HlsVideo from "./components/HlsVideo";

export default function Home() {
  const videosRef = useRef([]);
  const [ready, setReady] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [baseUrl, setBaseUrl] = useState("http://localhost:8888");

  const CAMS = [
    { id: "cam1", label: "Camera 1" },
    { id: "cam2", label: "Camera 2" },
    { id: "cam3", label: "Camera 3" },
    { id: "cam4", label: "Camera 4" },
    { id: "cam5", label: "Camera 5" },
    { id: "cam6", label: "Camera 6" },
  ];

  const onReady = useCallback((videoEl) => {
    if (!videosRef.current.includes(videoEl)) {
      videosRef.current.push(videoEl);
      setReady(videosRef.current.length);
    }
  }, []);

  const startTogether = async () => {
    if (videosRef.current.length < CAMS.length) {
      alert("Please wait for all streams to load");
      return;
    }

    try {
      console.log("Starting all videos together");
      const times = videosRef.current.map(v => v.currentTime || 0);
      const minTime = Math.min(...times);

      videosRef.current.forEach((v, index) => {
        try {
          v.currentTime = minTime;
          console.log(`Video ${index + 1} time set to: ${minTime}`);
        } catch (e) {
          console.error(`Error setting time for video ${index + 1}:`, e);
        }
      });

      await Promise.all(
        videosRef.current.map((v, index) =>
          v.play().then(() => console.log(`Video ${index + 1} started playing`)).catch(err => {
            console.error(`Play error for video ${index + 1}:`, err);
            return Promise.reject(err);
          })
        )
      );

      setIsPlaying(true);
      console.log("All videos started successfully");
    } catch (error) {
      console.error("Error starting videos:", error);
      alert("Failed to start some videos. Check console for details.");
    }
  };

  const stopAll = () => {
    console.log("Stopping all videos");
    videosRef.current.forEach((v, index) => {
      v.pause();
      console.log(`Video ${index + 1} stopped`);
    });
    setIsPlaying(false);
    console.log("All videos stopped");
  };

  const muteAll = () => {
    console.log("Muting all videos");
    videosRef.current.forEach((v, index) => {
      v.muted = true;
      console.log(`Video ${index + 1} muted`);
    });
    setIsMuted(true);
  };

  const unmuteAll = () => {
    console.log("Unmuting all videos");
    videosRef.current.forEach((v, index) => {
      v.muted = false;
      console.log(`Video ${index + 1} unmuted`);
    });
    setIsMuted(false);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-linear-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Multi-Stream Video Dashboard
          </h1>
          <p className="text-gray-400">Synchronized HLS streaming from RTSP source</p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 mb-8 shadow-xl border border-gray-700">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={startTogether}
                disabled={ready < CAMS.length || isPlaying}
                className="px-6 py-2.5 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-medium transition-all shadow-lg hover:shadow-green-500/50"
              >
                ▶ Start Together
              </button>
              <button
                onClick={stopAll}
                disabled={!isPlaying}
                className="px-6 py-2.5 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-medium transition-all shadow-lg hover:shadow-red-500/50"
              >
                ⏸ Stop All
              </button>
            </div>

            <div className="h-8 w-px bg-gray-600"></div>

            <div className="flex items-center gap-3">
              <button
                onClick={muteAll}
                disabled={isMuted}
                className={`px-4 py-2.5 rounded-lg font-medium transition-all ${
                  isMuted
                    ? 'bg-red-600 cursor-not-allowed'
                    : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                🔇 Mute All
              </button>
              <button
                onClick={unmuteAll}
                disabled={!isMuted}
                className={`px-4 py-2.5 rounded-lg font-medium transition-all ${
                  !isMuted
                    ? 'bg-green-600 cursor-not-allowed'
                    : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                🔊 Unmute All
              </button>
            </div>

            <div className="h-8 w-px bg-gray-600"></div>

            <div className="flex items-center gap-2 bg-gray-700/50 px-4 py-2 rounded-lg">
              <div className={`w-3 h-3 rounded-full ${ready === CAMS.length ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`}></div>
              <span className="text-sm font-medium">
                Ready: <span className="text-blue-400">{ready}</span>/{CAMS.length}
              </span>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <label className="text-sm font-medium text-gray-300">MediaMTX Server:</label>
            <input
              type="text"
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              placeholder="http://localhost:8888"
              className="flex-1 max-w-md px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
            />
            <span className="text-xs text-gray-400">Change if MediaMTX runs on different port/host</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CAMS.map((cam) => (
            <HlsVideo
              key={cam.id}
              src={`${baseUrl}/${cam.id}/index.m3u8`}
              onReady={onReady}
              label={cam.label}
            />
          ))}
        </div>

        <div className="mt-8 bg-blue-900/20 border border-blue-700/50 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-3 text-blue-300">📋 Quick Start Instructions</h3>
          <ol className="space-y-2 text-sm text-gray-300">
            <li className="flex items-start gap-2">
              <span className="font-bold text-blue-400">1.</span>
              <span>Make sure MediaMTX is running with the configured RTSP sources</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-blue-400">2.</span>
              <span>Wait for all streams to show "Ready: 6/6"</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-blue-400">3.</span>
              <span>Click "Start Together" to synchronize and play all streams</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-blue-400">4.</span>
              <span>Use control buttons to manage playback across all streams</span>
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}
