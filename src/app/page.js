"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import HlsVideo from "../app/components/HlsVideo";
import CameraModal from "../app/components/CameraModal";
import { UserButton, useUser, SignInButton, SignUpButton } from "@clerk/nextjs";
import {
  LuActivity,
  LuTriangleAlert,
  LuCamera,
  LuZap,
  LuBrainCircuit,
  LuRefreshCw,
  LuTrash2,
  LuPlus,
  LuSignal,
  LuHardDrive,
  LuServer,
  LuMonitor,
  LuSquare
} from "react-icons/lu";

// Public HLS streams for demo/testing
const PUBLIC_STREAMS = [
  { id: "demo1", name: "Traffic Cam 1", url: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8", type: 'hls' },
  { id: "demo2", name: "Traffic Cam 2", url: "https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8", type: 'hls' },
  { id: "demo3", name: "Traffic Cam 3", url: "https://devstreaming-cdn.apple.com/videos/streaming/examples/img_bipbop_adv_example_fmp4/master.m3u8", type: 'hls' },
  { id: "demo4", name: "Traffic Cam 4", url: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8", type: 'hls' },
];

export default function Home() {
  const { user, isLoaded } = useUser();
  const videosRef = useRef([]);
  const [ready, setReady] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [viewMode, setViewMode] = useState('demo'); // 'demo' or 'my-cameras'
  const [myCameras, setMyCameras] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Statistics State
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

  // Fetch User Cameras
  const fetchCameras = useCallback(async () => {
    if (!user) return;
    try {
      const res = await fetch('/api/cameras');
      if (res.ok) {
        const data = await res.json();
        setMyCameras(data);
      }
    } catch (error) {
      console.error("Failed to fetch cameras:", error);
    }
  }, [user]);

  useEffect(() => {
    let interval;
    if (viewMode === 'my-cameras' && user) {
      fetchCameras(); // Initial fetch
      interval = setInterval(fetchCameras, 5000); // Poll every 5 seconds
    }
    return () => clearInterval(interval);
  }, [viewMode, user, fetchCameras]);

  const displayedCams = viewMode === 'demo' ? PUBLIC_STREAMS : myCameras;

  const onReady = useCallback((videoEl) => {
    if (!videosRef.current.includes(videoEl)) {
      videosRef.current.push(videoEl);
      setReady(videosRef.current.length);
    }
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this camera?")) return;
    try {
      const res = await fetch(`/api/cameras/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setMyCameras(prev => prev.filter(c => c._id !== id));
      } else {
        alert("Failed to delete camera");
      }
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const startTogether = async () => {
    const vids = videosRef.current.filter(Boolean);
    if (vids.length === 0) return;

    try {
      const playPromises = [];
      vids.forEach((v) => {
        if (v.play) {
          playPromises.push(v.play().catch(err => console.error("Play error:", err)));
        }
      });
      await Promise.all(playPromises);
      setIsPlaying(true);
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

  const refreshAll = async () => {
    const vids = videosRef.current.filter(Boolean);
    if (vids.length === 0) return;

    try {
      const playPromises = [];
      vids.forEach((v) => {
        v.currentTime = 0;
        if (v.play) {
          playPromises.push(v.play().catch(err => console.error("Play error:", err)));
        }
      });
      await Promise.all(playPromises);
      setIsPlaying(true);
    } catch (error) {
      console.error("Error refreshing videos:", error);
    }
  };

  return (
    <div className="h-screen overflow-hidden bg-[#0f172a] text-slate-100 font-sans selection:bg-blue-500/30 flex flex-col">

      {/* Top Navigation Bar - Condensed */}
      <nav className="h-12 border-b border-slate-800 bg-[#1e293b] flex items-center justify-between px-4 shrink-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <span className="text-white font-bold text-lg">AG</span>
          </div>
          <div>
            <h1 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">AerialGuard</h1>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Status Indicators */}
          <div className="hidden md:flex items-center gap-3 text-xs font-medium bg-slate-900/50 py-1 px-3 rounded-full border border-slate-700/50">
            <span className="flex items-center gap-1.5 text-slate-400">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
              Reconnecting
            </span>
            <span className="w-px h-3 bg-slate-700"></span>
            <span className="flex items-center gap-1.5 text-slate-400">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-600"></span>
              MQTT Disconnected
            </span>
          </div>

          {isLoaded && user && <UserButton afterSignOutUrl="/" appearance={{ elements: { avatarBox: "w-8 h-8 border-2 border-slate-700" } }} />}
          {!user && isLoaded && (
            <>
              <SignInButton mode="modal">
                <button className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-medium transition-all">Sign In</button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded-md text-xs font-medium transition-all">Sign Up</button>
              </SignUpButton>
            </>
          )}
        </div>
      </nav>

      {/* Main Content Area - Vertical Layout - Fixed Viewport */}
      <main className="flex-1 flex flex-col overflow-hidden bg-[#020617]">

        {/* Top Hero Section - Stats & Overview - Balanced Size */}
        <section className="bg-[#0b1120] border-b border-slate-800/60 p-3 shrink-0 z-20 shadow-md">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <LuActivity className="text-blue-500" size={16} /> System Overview
            </h2>
            <div className="flex items-center gap-3">
              {viewMode === 'my-cameras' && (
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-[11px] font-medium transition-all shadow-lg shadow-blue-900/20"
                >
                  <LuPlus size={12} /> Add Camera
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {/* Active Cameras Card */}
            <div className="bg-[#1e293b]/40 rounded-lg p-3 border border-slate-700/30 hover:border-slate-600/50 hover:bg-[#1e293b]/60 transition-all group backdrop-blur-sm relative overflow-hidden">
              <div className="flex justify-between items-start mb-1 relative z-10">
                <div>
                  <p className="text-[11px] text-slate-400 font-medium mb-0.5">Active Cameras</p>
                  <span className="text-xl font-bold text-slate-100">{displayedCams.length}</span>
                </div>
                <div className="p-1.5 rounded-md bg-green-500/10 text-green-400 ring-1 ring-green-500/20 group-hover:bg-green-500/20 transition-colors"><LuCamera size={16} /></div>
              </div>
              <div className="mt-1 text-[10px] text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full w-fit font-semibold border border-green-500/10 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span> Operational
              </div>
            </div>

            {/* Active Alerts Card */}
            <div className="bg-[#1e293b]/40 rounded-lg p-3 border border-slate-700/30 hover:border-slate-600/50 hover:bg-[#1e293b]/60 transition-all group backdrop-blur-sm">
              <div className="flex justify-between items-start mb-1">
                <div>
                  <p className="text-[11px] text-slate-400 font-medium mb-0.5">Active Alerts</p>
                  <span className="text-xl font-bold text-slate-100">{stats.activeAlerts}</span>
                </div>
                <div className="p-1.5 rounded-md bg-red-500/10 text-red-400 ring-1 ring-red-500/20 group-hover:bg-red-500/20 transition-colors"><LuTriangleAlert size={16} /></div>
              </div>
              <div className="mt-1 text-[10px] text-red-300 bg-red-500/10 px-2 py-0.5 rounded-full w-fit font-semibold border border-red-500/10">Intrusion Detected</div>
            </div>

            {/* Total Configured Card */}
            <div className="bg-[#1e293b]/40 rounded-lg p-3 border border-slate-700/30 hover:border-slate-600/50 hover:bg-[#1e293b]/60 transition-all group backdrop-blur-sm">
              <div className="flex justify-between items-start mb-1">
                <div>
                  <p className="text-[11px] text-slate-400 font-medium mb-0.5">Total Configured</p>
                  <span className="text-xl font-bold text-slate-100">{viewMode === 'demo' ? 4 : myCameras.length}</span>
                </div>
                <div className="p-1.5 rounded-md bg-blue-500/10 text-blue-400 ring-1 ring-blue-500/20 group-hover:bg-blue-500/20 transition-colors"><LuHardDrive size={16} /></div>
              </div>
              <div className="mt-1 text-[10px] text-blue-300 bg-blue-500/10 px-2 py-0.5 rounded-full w-fit font-semibold border border-blue-500/10">Capacity Full</div>
            </div>

            {/* Latency / Network Card */}
            <div className="bg-[#1e293b]/40 rounded-lg p-3 border border-slate-700/30 hover:border-slate-600/50 hover:bg-[#1e293b]/60 transition-all group backdrop-blur-sm">
              <div className="flex justify-between items-start mb-1">
                <div>
                  <p className="text-[11px] text-slate-400 font-medium mb-0.5">Network Latency</p>
                  <span className="text-xl font-bold text-slate-100 font-mono">24ms</span>
                </div>
                <div className="p-1.5 rounded-md bg-purple-500/10 text-purple-400 ring-1 ring-purple-500/20 group-hover:bg-purple-500/20 transition-colors"><LuSignal size={16} /></div>
              </div>
              <div className="mt-1 text-[10px] text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded-full w-fit font-semibold border border-purple-500/10">Stable Connection</div>
            </div>
          </div>
        </section>

        {/* Video Wall Section */}
        <section className="flex-1 flex flex-col min-h-0">

          {/* Controls Bar - Sticky below hero */}
          <header className="h-10 border-b border-slate-800/60 flex items-center justify-between px-4 bg-[#0f172a]/95 backdrop-blur-md sticky top-0 z-30">
            <h3 className="text-xs font-semibold text-white flex items-center gap-2">
              <LuMonitor className="text-slate-400" size={14} /> Monitoring Wall
            </h3>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 bg-slate-900/50 p-0.5 rounded-lg border border-slate-700/50">
                <button onClick={() => { setViewMode('demo'); setReady(0); videosRef.current = []; }} className={`px-3 py-1 rounded-md text-[10px] font-medium transition-all duration-200 ${viewMode === 'demo' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'}`}>
                  Public Demo
                </button>
                <button onClick={() => { setViewMode('my-cameras'); setReady(0); videosRef.current = []; }} className={`px-3 py-1 rounded-md text-[10px] font-medium transition-all duration-200 ${viewMode === 'my-cameras' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'}`}>
                  My Cameras
                </button>
              </div>

              <div className="h-3 w-px bg-slate-700"></div>

              <div className="flex items-center gap-1.5">
                <button onClick={startTogether} className="group flex items-center gap-1.5 px-2.5 py-1 bg-purple-600/10 hover:bg-purple-600 text-purple-400 hover:text-white border border-purple-600/20 rounded-md text-[10px] font-medium transition-all duration-300">
                  <LuZap size={12} className="group-hover:text-white" /> <span>Live Sync</span>
                </button>
                <button onClick={stopAll} className="group flex items-center gap-1.5 px-2.5 py-1 bg-red-600/10 hover:bg-red-600 text-red-400 hover:text-white border border-red-600/20 rounded-md text-[10px] font-medium transition-all duration-300">
                  <LuSquare size={12} fill="currentColor" className="group-hover:text-white" /> <span>Stop All</span>
                </button>
                <button onClick={refreshAll} className="group flex items-center gap-1.5 px-2.5 py-1 bg-teal-600/10 hover:bg-teal-600 text-teal-400 hover:text-white border border-teal-600/20 rounded-md text-[10px] font-medium transition-all duration-300">
                  <LuRefreshCw size={12} className="group-hover:rotate-180 transition-transform duration-500" /> <span>Refresh</span>
                </button>
              </div>
            </div>
          </header>

          {/* Video Grid */}
          <div className="flex-1 p-3 overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {displayedCams.length === 0 ? (
                <div className="col-span-full h-full flex flex-col items-center justify-center border border-dashed border-slate-800 rounded-2xl bg-slate-900/20 min-h-[200px]">
                  <div className="p-4 bg-slate-800/50 rounded-full mb-3 text-slate-500"><LuMonitor size={32} /></div>
                  <h3 className="text-slate-300 font-medium">No feeds detected</h3>
                  <p className="text-slate-500 text-sm">Add a camera to start monitoring</p>
                </div>
              ) : (
                displayedCams.map((cam) => (
                  <div key={cam._id || cam.id} className="relative group bg-black rounded-lg overflow-hidden shadow-lg border border-slate-800 hover:border-slate-600 transition-all duration-300 ring-1 ring-white/5 aspect-video">
                    <HlsVideo src={viewMode === 'demo' ? cam.url : cam.rtspUrl} onReady={onReady} label={cam.name} />

                    {/* Overlay Controls */}
                    {viewMode === 'my-cameras' && (
                      <button onClick={(e) => { e.stopPropagation(); handleDelete(cam._id); }} className="absolute top-2 right-2 p-1.5 bg-red-500/80 hover:bg-red-600 text-white rounded-md opacity-0 group-hover:opacity-100 transition-all backdrop-blur-md transform translate-x-2 group-hover:translate-x-0">
                        <LuTrash2 size={14} />
                      </button>
                    )}

                    <div className="absolute top-2 left-2 flex gap-2">
                      <div className="px-1.5 py-0.5 bg-black/40 backdrop-blur-md rounded-md text-[9px] font-bold text-white flex items-center gap-1.5 border border-white/10 shadow-lg">
                        <div className={`w-1.5 h-1.5 rounded-full ${cam.status === 'online' || viewMode === 'demo' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse' : 'bg-red-500'}`}></div>
                        LIVE
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </section>
      </main>

      {/* Global Detailed Footer - Balanced Version */}
      <footer className="bg-[#0b1120] border-t border-slate-800 py-3 px-6 shrink-0 z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.3)]">
        <div className="grid grid-cols-4 gap-6 mb-2">

          {/* System Status */}
          <div>
            <h4 className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-1.5">System Status</h4>
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>Network Latency:</span>
                <span className="text-green-400 font-mono">12ms</span>
              </div>
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>Data Processing:</span>
                <span className="text-green-400">Normal</span>
              </div>
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>Storage Used:</span>
                <span className="text-amber-400 font-mono">68%</span>
              </div>
            </div>
          </div>

          {/* Detection Stats */}
          <div>
            <h4 className="text-[10px] font-bold text-purple-500 uppercase tracking-widest mb-1.5">Detection Stats</h4>
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>Accuracy Rate:</span>
                <span className="text-green-400 font-mono">94.2%</span>
              </div>
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>False Positives:</span>
                <span className="text-green-400 font-mono">2.1%</span>
              </div>
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>Response Time:</span>
                <span className="text-green-400 font-mono">1.3s</span>
              </div>
            </div>
          </div>

          {/* Fleet Management */}
          <div>
            <h4 className="text-[10px] font-bold text-cyan-500 uppercase tracking-widest mb-1.5">Fleet Management</h4>
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>Drones Deployed:</span>
                <span className="text-blue-400 font-mono">12/15</span>
              </div>
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>Battery Average:</span>
                <span className="text-green-400 font-mono">87%</span>
              </div>
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>Flight Hours Today:</span>
                <span className="text-blue-400 font-mono">142h</span>
              </div>
            </div>
          </div>

          {/* Contact & Support */}
          <div>
            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Contact & Support</h4>
            <div className="space-y-1 text-[10px] text-slate-400">
              <div>Emergency: <span className="text-slate-300">+1-800-SAFETY</span></div>
              <div>Support: <span className="text-slate-300">support@aerialguard.com</span></div>
              <div className="text-slate-500 pt-0.5">Last System Update: Today 14:32</div>
            </div>
          </div>

        </div>

        <div className="border-t border-slate-800 pt-2 flex items-center justify-center text-[9px] text-slate-600">
          <span>&copy; 2025 AerialGuard Traffic Monitoring System. All rights reserved. | Version 2.4.0</span>
        </div>
      </footer>

      <CameraModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={(newCam) => setMyCameras([...myCameras, newCam])}
      />
    </div>
  );
}
