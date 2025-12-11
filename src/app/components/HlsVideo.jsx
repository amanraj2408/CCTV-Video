"use client";

import { useRef, useEffect, useState } from "react";
import Hls from "hls.js";

export default function HlsVideo({ src, onReady, label }) {
  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let hls;

    const initPlayer = () => {
      setError(null);
      setLoading(true);
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = src;
      } else if (Hls.isSupported()) {
        hls = new Hls({
          liveSyncDuration: 2,
          backBufferLength: 0,
          maxBufferLength: 10,
          maxMaxBufferLength: 20,
          enableWorker: true,
          lowLatencyMode: true,
        });
        
        hls.loadSource(src);
        hls.attachMedia(video);
        hlsRef.current = hls;

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          console.log(`${label}: HLS manifest loaded`);
          setLoading(false);
        });

        hls.on(Hls.Events.BUFFER_APPENDED, () => {
          setLoading(false);
        });

        hls.on(Hls.Events.ERROR, (event, data) => {
          console.error(`${label}: HLS Error:`, data);

          // Check if data is valid and has the expected properties
          if (!data || typeof data !== 'object') {
            console.error(`${label}: Invalid error data received:`, data);
            setError("Stream error occurred");
            setLoading(false);
            hls.destroy();
            return;
          }

          if (data.fatal) {
            console.error(`${label}: Fatal error detected, attempting recovery`, {
              errorType: data.type,
              errorDetails: data.details,
              errorCode: data.code
            });

            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                console.log(`${label}: Network error detected, restarting load`);
                setTimeout(() => {
                  hls.startLoad();
                }, 1000);
                break;
              case Hls.ErrorTypes.MEDIA_ERROR:
                console.log(`${label}: Media error detected, attempting recovery`);
                hls.recoverMediaError();
                break;
              default:
                console.error(`${label}: Unrecoverable fatal error, destroying player`, data);
                setError("Fatal stream error");
                setLoading(false);
                hls.destroy();
                break;
            }
          } else {
            // Handle non-fatal errors
            console.warn(`${label}: Non-fatal HLS error:`, {
              errorType: data.type,
              errorDetails: data.details,
              errorCode: data.code
            });

            // If it's a network error that's not fatal, still try to recover
            if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
              console.log(`${label}: Non-fatal network error, attempting recovery`);
              setTimeout(() => {
                hls.startLoad();
              }, 1000);
            }
          }
        });
      }
    };

    initPlayer();

    video.muted = true;
    video.playsInline = true;

    const handleLoadedMetadata = () => {
      console.log(`${label}: Metadata loaded`);
      setLoading(false);
      if (onReady) onReady(video);
    };

    const handleCanPlay = () => {
      console.log(`${label}: Video can play`);
      setLoading(false);
    };

    const handleError = (e) => {
      console.error(`${label}: Video element error:`, e);
      setError("Video playback failed");
      setLoading(false);
    };

    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("canplay", handleCanPlay);
    video.addEventListener("error", handleError);

    return () => {
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("canplay", handleCanPlay);
      video.removeEventListener("error", handleError);
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [src, onReady, label]);

  return (
    <div className="relative bg-black rounded-lg overflow-hidden shadow-lg">
      <div className="absolute top-2 left-2 z-10 bg-black/70 text-white px-3 py-1 rounded text-sm font-medium">
        {label}
      </div>

      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-20">
          <div className="flex flex-col items-center text-white">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mb-2"></div>
            <span className="text-sm">Loading stream...</span>
          </div>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-900/80 z-20">
          <div className="flex flex-col items-center text-white text-center p-4">
            <div className="text-red-400 text-2xl mb-2">⚠️</div>
            <span className="text-sm font-medium mb-1">Connection Error</span>
            <span className="text-xs opacity-75">{error}</span>
          </div>
        </div>
      )}

      <video
        ref={videoRef}
        controls
        className="w-full aspect-video object-contain"
      />
    </div>
  );
}
