"use client";

import { useRef, useEffect, useState } from "react";
import PropTypes from "prop-types";
import Hls from "hls.js";

export default function HlsVideo({ src, onReady, label, autoplay = false, hlsConfig = {} }) {
  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const defaultHlsConfig = {
    liveSyncDuration: 2,
    backBufferLength: 5,
    maxBufferLength: 15,
    maxMaxBufferLength: 25,
    enableWorker: true,
    lowLatencyMode: true,
    debug: false,
    startLevel: 0,
    autoStartLoad: true,
    nudgeOffset: 0.15,
    nudgeMaxRetry: 5,
    maxFragLookUpTolerance: 0.5,
    fragLoadingTimeOut: 20000,
    manifestLoadingTimeOut: 10000,
    levelLoadingTimeOut: 10000,
    testOnFailure: true,
    progressive: true,
    networkTimeoutMs: 4000,
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let hls;
    let usingNative = false;

    const initPlayer = () => {
      setError(null);
      setLoading(true);
      
      // Validate URL
      if (!src) {
        setError("No stream URL provided");
        setLoading(false);
        return;
      }
      
      try {
        if (video.canPlayType("application/vnd.apple.mpegurl")) {
          usingNative = true;
          video.src = src;
          console.log(`${label}: Using native HLS playback`);
          if (autoplay) {
            video.play().catch((e) => {
              console.warn(`${label}: Autoplay prevented or failed:`, e);
            });
          }
        } else if (Hls.isSupported()) {
          const combinedConfig = { ...defaultHlsConfig, ...hlsConfig };
          hls = new Hls(combinedConfig);
          
          console.log(`${label}: Loading stream from ${src.substring(0, 50)}...`);
          hls.loadSource(src);
          hls.attachMedia(video);
          hlsRef.current = hls;

          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            console.log(`${label}: HLS manifest loaded successfully`);
            // Set a small initial delay to ensure proper buffering before starting
            setLoading(false);
            setError(null);
            if (onReady) {
              setTimeout(() => onReady(video), 100);
            }
          });

          hls.on(Hls.Events.BUFFER_APPENDED, () => {
            setLoading(false);
            // Ensure stable playback by preventing extreme buffering variations
            if (video && !video.paused) {
              const buffered = video.buffered;
              if (buffered.length > 0) {
                const bufferedEnd = buffered.end(buffered.length - 1);
                const currentTime = video.currentTime;
                const bufferedAmount = bufferedEnd - currentTime;
                
                // If we have too much buffer ahead, slow down load
                if (bufferedAmount > 10 && hls.manualLevel !== -1) {
                  const levels = hls.levels;
                  if (levels && levels.length > 0) {
                    const currentLevel = hls.currentLevel;
                    if (currentLevel > 0 && bufferedAmount > 15) {
                      hls.currentLevel = currentLevel - 1;
                    }
                  }
                }
              }
            }
          });

          hls.on(Hls.Events.ERROR, (event, data) => {
          const errorType = data?.type || 'UNKNOWN';
          const errorDetails = data?.details || 'No error details available';
          const isFatal = data?.fatal || false;

          // Special-case: bufferSeekOverHole (seeking past a missing buffer segment in live streams)
          if (data?.details === 'bufferSeekOverHole') {
            console.warn(`${label}: HLS bufferSeekOverHole — attempting to jump to buffered end or restart load.`);
            try {
              const buffered = video.buffered;
              if (buffered && buffered.length) {
                const end = buffered.end(buffered.length - 1);
                // jump slightly before end to avoid immediately falling into hole again
                video.currentTime = Math.max(0, end - 0.5);
              } else if (hlsRef.current) {
                // try restarting load at live
                hlsRef.current.startLoad();
              }
              setError(null);
              setLoading(false);
            } catch (e) {
              console.error(`${label}: Failed handling bufferSeekOverHole`, e);
            }
            return;
          }

          console.error(`${label}: HLS Error [${errorType}]:`, errorDetails);

          // Check if data is valid and has the expected properties
          if (!data || typeof data !== 'object') {
            console.error(`${label}: Invalid error data structure, retrying stream...`);
            setError("Stream connection issue - retrying...");
            setTimeout(() => {
              if (hlsRef.current) {
                hlsRef.current.startLoad();
              }
            }, 2000);
            return;
          }

          if (isFatal) {
            console.error(`${label}: Fatal error detected, attempting recovery`, {
              errorType: errorType,
              errorDetails: errorDetails,
              errorCode: data?.code
            });

            switch (errorType) {
              case Hls.ErrorTypes.NETWORK_ERROR:
              case 'networkError':
                console.log(`${label}: Network error detected, restarting load...`);
                setError("Network error - reconnecting...");
                setTimeout(() => {
                  if (hlsRef.current) {
                    hlsRef.current.startLoad();
                  }
                }, 2000);
                break;
              case Hls.ErrorTypes.MEDIA_ERROR:
              case 'mediaError':
                console.log(`${label}: Media error detected, attempting recovery...`);
                setError("Media playback issue - recovering...");
                try {
                  if (hlsRef.current) {
                    hlsRef.current.recoverMediaError();
                  }
                } catch (e) {
                  console.error(`${label}: Recovery failed`, e);
                  setError("Cannot recover stream");
                  setLoading(false);
                  if (hlsRef.current) {
                    hlsRef.current.destroy();
                  }
                }
                break;
              default:
                console.error(`${label}: Unrecoverable error type: ${errorType}`, data);
                setError(`Stream error: ${errorType}`);
                setLoading(false);
                setTimeout(() => {
                  if (hlsRef.current) {
                    hlsRef.current.destroy();
                  }
                }, 1000);
                break;
            }
          } else {
            // Handle non-fatal errors
            console.warn(`${label}: Non-fatal HLS error [${errorType}]:`, {
              errorType: errorType,
              errorDetails: errorDetails,
              errorCode: data?.code
            });

            // If it's a network error that's not fatal, still try to recover
            if (errorType === Hls.ErrorTypes.NETWORK_ERROR || errorType === 'networkError') {
              console.log(`${label}: Non-fatal network error, retrying...`);
              setTimeout(() => {
                if (hlsRef.current) {
                  hlsRef.current.startLoad();
                }
              }, 1500);
            }
          }
        });
        }
      } catch (e) {
        console.error(`${label}: Failed to initialize player:`, e);
        setError("Failed to initialize video player");
        setLoading(false);
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
      // If native playback was used, clear src to free network resources
      if (usingNative) {
        try {
          video.pause();
        } catch (e) {
          /* ignore */
        }
        try {
          video.removeAttribute('src');
        } catch (e) {
          /* ignore */
        }
        try {
          video.src = '';
          video.load();
        } catch (e) {
          /* ignore */
        }
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src]);

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

HlsVideo.propTypes = {
  /**
   * HLS stream URL (m3u8 format).
   * Required for playback to start.
   */
  src: PropTypes.string.isRequired,

  /**
   * Callback fired when video metadata is loaded and ready to play.
   * Receives the video HTMLElement as argument.
   */
  onReady: PropTypes.func,

  /**
   * Label displayed in the top-left corner of the video overlay.
   * Used for logging and UI identification.
   */
  label: PropTypes.string,

  /**
   * If true, attempts to autoplay the stream when ready.
   * Note: Modern browsers may block autoplay without user gesture or mute.
   * Default: false
   */
  autoplay: PropTypes.bool,

  /**
   * Custom Hls.js configuration options.
   * Merged with default config (liveSyncDuration, lowLatencyMode, etc.).
   * Example: { maxBufferLength: 15, lowLatencyMode: false }
   * See https://github.com/video-dev/hls.js/blob/master/docs/API.md#fine-tuning
   */
  hlsConfig: PropTypes.object,
};
