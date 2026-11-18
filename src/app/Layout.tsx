import React, { useState } from 'react';
import { Volume2, VolumeX, RotateCcw, ShieldCheck, Heart } from 'lucide-react';
import { useSessionStore } from '@/stores/sessionStore';
import { useEditorStore } from '@/stores/editorStore';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Stepper } from '@/components/ui/Stepper';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { step, isMuted, toggleMute, resetSession, frames } = useSessionStore();
  const { resetEditor } = useEditorStore();
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleStartOverClick = () => {
    if (frames.length > 0 && step !== 'landing') {
      setShowResetConfirm(true);
    } else {
      resetSession();
      resetEditor();
    }
  };

  const confirmReset = () => {
    resetSession();
    resetEditor();
    setShowResetConfirm(false);
  };

  const isSessionActive = step !== 'landing';

  return (
    <div className="min-h-screen flex flex-col bg-bg text-ink relative">
      {/* Photo Booth Curtain Motif (Top Accent Bar) */}
      <div className="w-full h-3 bg-gradient-to-r from-pink via-pink-deep to-lavender shadow-sm" />

      {/* Header */}
      <header className="w-full max-w-5xl mx-auto px-4 py-3 sm:py-4 flex items-center justify-between z-20">
        <div
          role="button"
          tabIndex={0}
          onClick={handleStartOverClick}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') handleStartOverClick();
          }}
          className="flex items-center gap-2.5 cursor-pointer select-none group focus-visible:outline-none rounded-pill px-2 py-1"
        >
          <div className="w-10 h-10 rounded-full bg-pink-deep flex items-center justify-center text-white shadow-booth group-hover:scale-105 transition-transform">
            <Heart className="w-5 h-5 fill-white" />
          </div>
          <div>
            <span className="font-display text-xl sm:text-2xl font-bold tracking-tight text-ink flex items-center gap-1">
              Twogether
              <span className="text-pink-deep text-lg animate-pulse">♡</span>
            </span>
            <span className="hidden sm:block text-[11px] text-muted -mt-1 font-body">
              Capturing moments, together
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Audio toggle */}
          <button
            onClick={toggleMute}
            aria-label={isMuted ? 'Unmute sounds' : 'Mute sounds'}
            title={isMuted ? 'Unmute sounds' : 'Mute sounds'}
            className="w-10 h-10 rounded-full bg-surface border border-pink/30 flex items-center justify-center text-muted hover:text-pink-deep hover:border-pink-deep shadow-subtle transition-all"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Reset / Start Over if in session */}
          {isSessionActive && (
            <Button
              variant="outline"
              size="sm"
              leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
              onClick={handleStartOverClick}
            >
              Start Over
            </Button>
          )}
        </div>
      </header>

      {/* Stepper progress (when inside capture, review, editor, export) */}
      {isSessionActive && (
        <div className="w-full py-1">
          <Stepper currentStep={step} />
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col w-full max-w-5xl mx-auto px-4 py-4 sm:py-6">
        {children}
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-pink/15 bg-surface/60 backdrop-blur-sm py-4 px-4 text-center mt-auto">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted">
          <div className="flex items-center gap-1.5 font-medium">
            <ShieldCheck className="w-4 h-4 text-pink-deep" />
            <span>100% Client-Side Privacy: Your photos never leave your device.</span>
          </div>
          <div className="flex items-center gap-4">
            <span>Twogether v1.0</span>
            <span>•</span>
            <span className="text-pink-deep font-semibold">Crafted with ♡</span>
          </div>
        </div>
      </footer>

      {/* Reset Confirmation Modal */}
      <Modal
        isOpen={showResetConfirm}
        onClose={() => setShowResetConfirm(false)}
        title="Start a new session?"
      >
        <p className="text-sm text-muted mb-6">
          Starting over will discard your current photos and decorations. Are you sure you want to return to the beginning?
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => setShowResetConfirm(false)}>
            Keep Creating
          </Button>
          <Button variant="danger" onClick={confirmReset}>
            Yes, Start Over
          </Button>
        </div>
      </Modal>
    </div>
  );
};
