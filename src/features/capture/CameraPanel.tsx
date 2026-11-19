import React, { useEffect, useRef } from 'react';
import { Camera, Sparkles, Wifi } from 'lucide-react';

interface CameraPanelProps {
  personLabel: string;
  videoRef?: React.RefObject<HTMLVideoElement>;
  stream?: MediaStream | null;
  isMirrored?: boolean;
  isActive?: boolean;
  capturedPreview?: string | null;
  isLoading?: boolean;
  statusBadge?: string;
  roleBadge?: string;
}

export const CameraPanel: React.FC<CameraPanelProps> = ({
  personLabel,
  videoRef,
  stream,
  isMirrored = true,
  isActive = true,
  capturedPreview,
  isLoading = false,
  statusBadge,
  roleBadge,
}) => {
  const internalVideoRef = useRef<HTMLVideoElement>(null);

  // If a stream is passed (e.g. remote stream or local stream), attach to video element
  useEffect(() => {
    const videoEl = videoRef ? videoRef.current : internalVideoRef.current;
    if (videoEl && stream) {
      if (videoEl.srcObject !== stream) {
        videoEl.srcObject = stream;
      }
      videoEl.play().catch((err) => {
        console.warn('Auto-play stream caught:', err);
      });
    }
  }, [stream, videoRef]);

  return (
    <div className="flex-1 flex flex-col items-center w-full">
      {/* Label Badge */}
      <div className="flex items-center justify-between w-full max-w-[340px] px-2 mb-2">
        <span className="font-display font-semibold text-xs sm:text-sm text-ink flex items-center gap-1.5">
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              isActive ? 'bg-pink-deep animate-pulse' : 'bg-muted'
            }`}
          />
          <span className="truncate max-w-[160px]">{personLabel}</span>
          {roleBadge && (
            <span className="text-[10px] font-mono bg-pink/15 text-pink-deep px-1.5 py-0.2 rounded-pill">
              {roleBadge}
            </span>
          )}
        </span>

        <div className="flex items-center gap-1.5">
          {statusBadge && (
            <span className="text-[10px] font-body bg-mint/30 text-emerald-700 px-2 py-0.5 rounded-pill border border-emerald-300 flex items-center gap-1">
              <Wifi className="w-2.5 h-2.5" />
              {statusBadge}
            </span>
          )}
          {isMirrored && (
            <span className="text-[10px] font-body bg-pink/15 text-pink-deep px-2 py-0.5 rounded-pill border border-pink/20">
              Mirrored
            </span>
          )}
        </div>
      </div>

      {/* Camera Viewport (3:4 ratio container) */}
      <div className="relative w-full max-w-[340px] aspect-[3/4] bg-surface rounded-panel overflow-hidden border-2 border-pink/30 shadow-booth flex items-center justify-center">
        {/* Loading Spinner */}
        {isLoading && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-bg/90 backdrop-blur-xs">
            <Camera className="w-8 h-8 text-pink-deep animate-bounce mb-2" />
            <span className="text-xs font-display font-medium text-muted">
              Starting camera...
            </span>
          </div>
        )}

        {/* Video feed or preview */}
        {capturedPreview ? (
          <img
            src={capturedPreview}
            alt={`${personLabel} capture preview`}
            className="w-full h-full object-cover"
          />
        ) : (
          <video
            ref={videoRef || internalVideoRef}
            autoPlay
            playsInline
            muted
            onLoadedMetadata={(e) => {
              const v = e.currentTarget;
              v.play().catch((err) => console.warn('play caught:', err));
            }}
            className={`w-full h-full object-cover transition-transform ${
              isMirrored ? 'scale-x-[-1]' : 'scale-x-100'
            }`}
          />
        )}

        {/* Framing Guide Lines */}
        <div className="absolute inset-4 pointer-events-none border border-dashed border-white/40 rounded-card flex flex-col justify-between p-2">
          <div className="flex justify-between items-center text-white/70">
            <Sparkles className="w-3.5 h-3.5" />
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div className="flex justify-between items-center text-white/70">
            <Sparkles className="w-3.5 h-3.5" />
            <Sparkles className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>
    </div>
  );
};
