import React, { useState, useEffect } from 'react';
import {
  Users,
  Wifi,
  Copy,
  Check,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Loader2,
  AlertCircle,
  Share2,
} from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useSessionStore } from '@/stores/sessionStore';
import { useRemoteStore } from '@/stores/remoteStore';
import { remoteManager } from '@/lib/remote/remoteManager';

interface ModeSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialRoomCode?: string;
}

export const ModeSelectModal: React.FC<ModeSelectModalProps> = ({
  isOpen,
  onClose,
  initialRoomCode,
}) => {
  const { setMode, setStep } = useSessionStore();
  const {
    roomCode,
    status,
    userName,
    partnerName,
    errorMessage,
    setUserName,
  } = useRemoteStore();

  const [view, setView] = useState<'select' | 'remote-create' | 'remote-join'>('select');
  const [joinCodeInput, setJoinCodeInput] = useState<string>(initialRoomCode || '');
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If initial room code is passed (e.g. from URL ?room=XYZ), switch directly to join view
  useEffect(() => {
    if (initialRoomCode) {
      setJoinCodeInput(initialRoomCode);
      setView('remote-join');
    }
  }, [initialRoomCode]);

  // When remote connection is successfully established, enter photo booth capture!
  useEffect(() => {
    if (status === 'connected' && (view === 'remote-create' || view === 'remote-join')) {
      const timer = setTimeout(() => {
        setMode('together-remote');
        setStep('capture');
        onClose();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [status, view, setMode, setStep, onClose]);

  const handleSelectSameDevice = () => {
    setMode('same-device');
    setStep('capture');
    onClose();
  };

  const handleStartCreateRoom = async () => {
    setIsSubmitting(true);
    try {
      await remoteManager.createRoom();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleJoinRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCodeInput.trim()) return;

    setIsSubmitting(true);
    try {
      await remoteManager.joinRoom(joinCodeInput.trim(), userName);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyCode = () => {
    if (!roomCode) return;
    navigator.clipboard.writeText(roomCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyLink = () => {
    if (!roomCode) return;
    const inviteUrl = `${window.location.origin}${window.location.pathname}?room=${encodeURIComponent(
      roomCode
    )}`;
    navigator.clipboard.writeText(inviteUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        remoteManager.disconnect();
        onClose();
      }}
      title={
        view === 'select'
          ? 'Choose Photo Booth Mode'
          : view === 'remote-create'
          ? 'Host a Remote Photo Booth'
          : 'Join a Remote Photo Booth'
      }
      maxWidth="lg"
    >
      {/* View 1: Mode Selection */}
      {view === 'select' && (
        <div className="flex flex-col gap-5 py-1">
          <p className="text-sm sm:text-base text-muted font-body leading-relaxed">
            How would you like to take your photos today?
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Option A: Same Device */}
            <button
              onClick={handleSelectSameDevice}
              className="text-left bg-surface hover:bg-pink/10 p-5 rounded-panel border-2 border-pink/30 hover:border-pink-deep transition-all shadow-subtle hover:shadow-booth group cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-full bg-pink/20 text-pink-deep flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="font-display font-bold text-lg text-ink mb-1.5 flex items-center justify-between">
                  <span>Same Device</span>
                  <span className="text-xs bg-pink/15 text-pink-deep px-2 py-0.5 rounded-pill font-normal">
                    Single Camera
                  </span>
                </h3>
                <p className="text-xs sm:text-sm text-muted leading-relaxed">
                  For two people sharing the same phone, tablet, or webcam in the same room.
                </p>
              </div>

              <div className="mt-5 flex items-center text-xs font-semibold text-pink-deep gap-1.5 group-hover:translate-x-1 transition-transform">
                <span>Start Booth</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </button>

            {/* Option B: Invite Someone */}
            <button
              onClick={() => {
                setView('remote-create');
                handleStartCreateRoom();
              }}
              className="text-left bg-surface hover:bg-lavender/20 p-5 rounded-panel border-2 border-lavender/60 hover:border-lavender-deep transition-all shadow-subtle hover:shadow-booth group cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-full bg-lavender/30 text-lavender-deep flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Wifi className="w-6 h-6" />
                </div>
                <h3 className="font-display font-bold text-lg text-ink mb-1.5 flex items-center justify-between">
                  <span>Invite Someone</span>
                  <span className="text-xs bg-lavender/30 text-lavender-deep px-2 py-0.5 rounded-pill font-normal">
                    Two Devices
                  </span>
                </h3>
                <p className="text-xs sm:text-sm text-muted leading-relaxed">
                  Join from two separate devices or locations with synchronized cameras & countdown.
                </p>
              </div>

              <div className="mt-5 flex items-center text-xs font-semibold text-lavender-deep gap-1.5 group-hover:translate-x-1 transition-transform">
                <span>Create or Join Room</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </button>
          </div>

          <div className="text-center pt-2">
            <button
              onClick={() => setView('remote-join')}
              className="text-xs text-muted hover:text-pink-deep underline font-medium transition-colors"
            >
              Already have a room code from a friend? Join here →
            </button>
          </div>
        </div>
      )}

      {/* View 2: Remote Create / Host */}
      {view === 'remote-create' && (
        <div className="flex flex-col gap-4 py-1">
          <div className="flex items-center justify-between">
            <button
              onClick={() => {
                remoteManager.disconnect();
                setView('select');
              }}
              className="text-xs text-muted hover:text-ink flex items-center gap-1 font-medium"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to options
            </button>
            <button
              onClick={() => setView('remote-join')}
              className="text-xs text-pink-deep hover:underline font-semibold"
            >
              Switch to Join Room
            </button>
          </div>

          {/* User Name Config */}
          <div className="bg-bg p-3.5 rounded-card border border-pink/20">
            <label className="block text-xs font-display font-semibold text-ink mb-1">
              Your Display Name
            </label>
            <input
              type="text"
              maxLength={20}
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="e.g. Alex"
              className="w-full px-3 py-1.5 rounded-md bg-surface border border-pink/30 text-ink text-sm focus:outline-none focus:border-pink-deep"
            />
          </div>

          {/* Room Code & Link Box */}
          {roomCode ? (
            <Card className="bg-gradient-to-b from-pink/10 to-lavender/10 border-2 border-pink/40 text-center p-6 flex flex-col items-center">
              <span className="text-xs font-display font-bold uppercase tracking-wider text-pink-deep mb-1">
                Your Photo Booth Room Code
              </span>
              <div className="text-3xl sm:text-4xl font-mono font-bold text-ink tracking-widest my-2 bg-surface px-6 py-2 rounded-card border-2 border-pink/40 shadow-xs select-all">
                {roomCode}
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2 mt-3 w-full">
                <Button
                  size="sm"
                  variant="outline"
                  leftIcon={copiedCode ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  onClick={handleCopyCode}
                >
                  {copiedCode ? 'Code Copied!' : 'Copy Code'}
                </Button>
                <Button
                  size="sm"
                  variant="primary"
                  leftIcon={copiedLink ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
                  onClick={handleCopyLink}
                >
                  {copiedLink ? 'Link Copied!' : 'Copy Invite Link'}
                </Button>
              </div>

              {/* Waiting Status Indicator */}
              <div className="mt-6 flex flex-col items-center">
                {status === 'waiting-for-peer' && (
                  <div className="flex items-center gap-2 text-xs font-medium text-pink-deep bg-surface px-4 py-2 rounded-pill shadow-xs border border-pink/30 animate-pulse">
                    <Loader2 className="w-4 h-4 animate-spin text-pink-deep" />
                    <span>Waiting for your friend to enter the booth...</span>
                  </div>
                )}

                {status === 'connected' && (
                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 bg-mint/30 px-4 py-2 rounded-pill shadow-xs border border-emerald-300">
                    <Check className="w-4 h-4" />
                    <span>{partnerName} connected! Entering photo booth...</span>
                  </div>
                )}

                <p className="text-[11px] text-muted mt-3 max-w-xs">
                  Share the link or code with your friend. Once they open it on their device, both of your camera feeds will appear!
                </p>
              </div>
            </Card>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 gap-3">
              <Loader2 className="w-8 h-8 text-pink-deep animate-spin" />
              <span className="text-sm text-muted">Generating secure photo booth room...</span>
            </div>
          )}

          {errorMessage && (
            <div className="p-3 bg-danger/10 border border-danger/30 rounded-card flex items-center gap-2 text-xs text-danger">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>
      )}

      {/* View 3: Remote Join */}
      {view === 'remote-join' && (
        <form onSubmit={handleJoinRoom} className="flex flex-col gap-4 py-1">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                remoteManager.disconnect();
                setView('select');
              }}
              className="text-xs text-muted hover:text-ink flex items-center gap-1 font-medium"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to options
            </button>
            <button
              type="button"
              onClick={() => {
                setView('remote-create');
                handleStartCreateRoom();
              }}
              className="text-xs text-pink-deep hover:underline font-semibold"
            >
              Create New Room Instead
            </button>
          </div>

          <div className="bg-bg p-4 rounded-card border border-pink/20 flex flex-col gap-3">
            <div>
              <label className="block text-xs font-display font-semibold text-ink mb-1">
                Enter Room Code
              </label>
              <input
                type="text"
                required
                maxLength={10}
                value={joinCodeInput}
                onChange={(e) => setJoinCodeInput(e.target.value.toUpperCase())}
                placeholder="e.g. TW-8492"
                className="w-full px-3.5 py-2.5 rounded-card bg-surface border border-pink/30 text-ink text-base font-mono tracking-wider uppercase focus:outline-none focus:border-pink-deep"
              />
            </div>

            <div>
              <label className="block text-xs font-display font-semibold text-ink mb-1">
                Your Display Name
              </label>
              <input
                type="text"
                maxLength={20}
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="e.g. Sam"
                className="w-full px-3 py-2 rounded-md bg-surface border border-pink/30 text-ink text-sm focus:outline-none focus:border-pink-deep"
              />
            </div>
          </div>

          <Button
            type="submit"
            size="pill-lg"
            disabled={isSubmitting || !joinCodeInput.trim()}
            isLoading={isSubmitting || status === 'joining'}
            rightIcon={<Sparkles className="w-4 h-4" />}
            className="w-full"
          >
            {status === 'joining' ? 'Connecting to Room...' : 'Enter Photo Booth ♡'}
          </Button>

          {status === 'connected' && (
            <div className="p-3 bg-mint/30 border border-emerald-300 rounded-card flex items-center gap-2 text-xs font-semibold text-emerald-700 justify-center">
              <Check className="w-4 h-4" />
              <span>Connected! Entering photo booth...</span>
            </div>
          )}

          {errorMessage && (
            <div className="p-3 bg-danger/10 border border-danger/30 rounded-card flex items-center gap-2 text-xs text-danger">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}
        </form>
      )}
    </Modal>
  );
};
