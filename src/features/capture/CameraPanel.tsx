import React from 'react';
import { Camera, Sparkles } from 'lucide-react';

interface CameraPanelProps {
  personLabel: string;
  videoRef?: React.RefObject<HTMLVideoElement>;
  isMirrored?: boolean;
  isActive?: boolean;
  capturedPreview?: string | null;
  isLoading?: boolean;
}

export const CameraPanel: React.FC<CameraPanelProps> = ({
  personLabel,
  videoRef,
  isMirrored = true,
  isActive = true,
  capturedPreview,
  isLoading = false,
}) => {
  return (
    <div className="flex-1 flex flex-col items-center w-full">
      {/* Label Badge */}
      <div className="flex items-center justify-between w-full max-w-[340px] px-2 mb-2">
        <span className="font-display font-semibold text-xs sm:text-sm text-ink flex items-center gap-1.5">
          <span className={`w-2.5 h-2.5 rounded-full ${isActive ? 'bg-pink-deep animate-pulse' : 'bg-muted'}`} />
          {personLabel}
        </span>
        {isMirrored && (
          <span className="text-[10px] font-body bg-pink/15 text-pink-deep px-2 py-0.5 rounded-pill border border-pink/20">
            Mirrored
          </span>
        )}
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
            ref={videoRef}
            autoPlay
            playsInline
            muted
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
