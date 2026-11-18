import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Camera, FlipHorizontal, Timer, Sparkles } from 'lucide-react';
import { useSessionStore } from '@/stores/sessionStore';
import { useCamera } from '@/lib/media/useCamera';
import { playShutterSound, playCountdownBeep } from '@/lib/media/sound';
import { CameraPanel } from './CameraPanel';
import { PermissionScreen } from './PermissionScreen';

const POSE_PROMPTS = [
  'Pose 1: Give your sweetest smile! ✨',
  'Pose 2: Make a heart together ♡',
  'Pose 3: Wild silly face or peace signs! ✌️',
];

export const CaptureScreen: React.FC = () => {
  const {
    subMode,
    setSubMode,
    currentRound,
    setCurrentRound,
    currentPersonTurn,
    setCurrentPersonTurn,
    addFrame,
    replaceRoundFrames,
    isMuted,
    timerDuration,
    setTimerDuration,
    retakeTargetRound,
    setRetakeTargetRound,
    setStep,
  } = useSessionStore();

  const {
    videoRef,
    devices,
    selectedDeviceId,
    isMirrored,
    isLoading,
    error,
    errorMessage,
    startCamera,
    toggleMirror,
    switchDevice,
    captureFrame,
  } = useCamera();

  const [isCountingDown, setIsCountingDown] = useState(false);
  const [countdownValue, setCountdownValue] = useState<number | null>(null);
  const [isFlashing, setIsFlashing] = useState(false);
  const [betweenRoundMessage, setBetweenRoundMessage] = useState<string | null>(null);
  const [isPausedBetweenRounds, setIsPausedBetweenRounds] = useState(false);

  // Buffer for current round when taking turns
  const [turnBufferFrame, setTurnBufferFrame] = useState<string | null>(null);

  const countdownTimerRef = useRef<number | null>(null);

  // Initialize camera on mount
  useEffect(() => {
    startCamera();
  }, [startCamera]);

  // Execute the snapshot capture
  const takeSnapshot = useCallback(() => {
    setIsFlashing(true);
    playShutterSound(isMuted);

    const dataUrl = captureFrame();
    setTimeout(() => setIsFlashing(false), 200);

    if (!dataUrl) {
      console.warn('Could not capture frame from video');
      return;
    }

    const roundToCapture = retakeTargetRound !== null ? retakeTargetRound : currentRound;

    if (subMode === 'same-frame') {
      // Both person slots get the synchronized captured moment
      const frame1 = {
        round: roundToCapture,
        slot: 0,
        dataUrl,
        timestamp: Date.now(),
      };
      const frame2 = {
        round: roundToCapture,
        slot: 1,
        dataUrl,
        timestamp: Date.now(),
      };

      if (retakeTargetRound !== null) {
        replaceRoundFrames(roundToCapture, [frame1, frame2]);
        setRetakeTargetRound(null);
        setStep('review');
        return;
      }

      addFrame(frame1);
      addFrame(frame2);

      // Check if finished 3 rounds
      if (roundToCapture >= 2) {
        setTimeout(() => {
          setStep('review');
        }, 800);
      } else {
        // Pause and proceed to next round
        setIsPausedBetweenRounds(true);
        setBetweenRoundMessage(POSE_PROMPTS[roundToCapture + 1]);
        setTimeout(() => {
          setIsPausedBetweenRounds(false);
          setBetweenRoundMessage(null);
          setCurrentRound(roundToCapture + 1);
        }, 2200);
      }
    } else {
      // Taking turns mode
      if (currentPersonTurn === 0) {
        // Person 1 just shot, save to buffer and switch to Person 2
        setTurnBufferFrame(dataUrl);
        setCurrentPersonTurn(1);
        setIsPausedBetweenRounds(true);
        setBetweenRoundMessage('Great! Now Person 2, get ready! 📸');
        setTimeout(() => {
          setIsPausedBetweenRounds(false);
          setBetweenRoundMessage(null);
        }, 1800);
      } else {
        // Person 2 just shot, combine with Person 1
        const frame1 = {
          round: roundToCapture,
          slot: 0,
          dataUrl: turnBufferFrame || dataUrl,
          timestamp: Date.now(),
        };
        const frame2 = {
          round: roundToCapture,
          slot: 1,
          dataUrl,
          timestamp: Date.now(),
        };

        if (retakeTargetRound !== null) {
          replaceRoundFrames(roundToCapture, [frame1, frame2]);
          setRetakeTargetRound(null);
          setCurrentPersonTurn(0);
          setTurnBufferFrame(null);
          setStep('review');
          return;
        }

        addFrame(frame1);
        addFrame(frame2);
        setCurrentPersonTurn(0);
        setTurnBufferFrame(null);

        if (roundToCapture >= 2) {
          setTimeout(() => {
            setStep('review');
          }, 800);
        } else {
          setIsPausedBetweenRounds(true);
          setBetweenRoundMessage(POSE_PROMPTS[roundToCapture + 1]);
          setTimeout(() => {
            setIsPausedBetweenRounds(false);
            setBetweenRoundMessage(null);
            setCurrentRound(roundToCapture + 1);
          }, 2200);
        }
      }
    }
  }, [
    isMuted,
    captureFrame,
    retakeTargetRound,
    currentRound,
    subMode,
    replaceRoundFrames,
    setRetakeTargetRound,
    setStep,
    addFrame,
    setCurrentRound,
    currentPersonTurn,
    turnBufferFrame,
    setCurrentPersonTurn,
  ]);

  // Start the 3-2-1 countdown
  const startCountdown = useCallback(() => {
    if (isCountingDown || isPausedBetweenRounds || isLoading || error) return;

    setIsCountingDown(true);
    let count = timerDuration;
    setCountdownValue(count);
    playCountdownBeep(count, isMuted);

    const stepCountdown = () => {
      count -= 1;
      if (count > 0) {
        setCountdownValue(count);
        playCountdownBeep(count, isMuted);
        countdownTimerRef.current = window.setTimeout(stepCountdown, 1000);
      } else {
        setCountdownValue(null);
        setIsCountingDown(false);
        takeSnapshot();
      }
    };

    countdownTimerRef.current = window.setTimeout(stepCountdown, 1000);
  }, [isCountingDown, isPausedBetweenRounds, isLoading, error, timerDuration, isMuted, takeSnapshot]);

  // Spacebar hotkey to snap
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !isCountingDown && !isPausedBetweenRounds && !error) {
        e.preventDefault();
        startCountdown();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isCountingDown, isPausedBetweenRounds, error, startCountdown]);

  // Clean up timer on unmount only
  useEffect(() => {
    return () => {
      if (countdownTimerRef.current) clearTimeout(countdownTimerRef.current);
    };
  }, []);

  if (error) {
    return <PermissionScreen errorType={error} errorMessage={errorMessage} onRetry={startCamera} />;
  }

  const activeRound = retakeTargetRound !== null ? retakeTargetRound : currentRound;

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto relative select-none">
      {/* Flash Overlay */}
      {isFlashing && (
        <div className="fixed inset-0 z-50 bg-white pointer-events-none animate-flash" />
      )}

      {/* Screen Reader Live Region for Countdown */}
      <div aria-live="assertive" className="sr-only">
        {countdownValue ? `Countdown ${countdownValue}` : ''}
        {isFlashing ? 'Photo captured!' : ''}
      </div>

      {/* Top Controls Bar */}
      <div className="w-full flex flex-wrap items-center justify-between gap-3 bg-surface/80 backdrop-blur-sm p-3 rounded-card border border-pink/20 shadow-subtle mb-4">
        {/* Round Progress Tracker */}
        <div className="flex items-center gap-2">
          <span className="font-display font-semibold text-xs sm:text-sm text-ink">
            {retakeTargetRound !== null
              ? `Retaking Shot ${retakeTargetRound + 1}`
              : `Round ${activeRound + 1} of 3`}
          </span>
          <div className="flex items-center gap-1.5 ml-1">
            {[0, 1, 2].map((idx) => (
              <span
                key={idx}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  idx === activeRound
                    ? 'bg-pink-deep scale-125 ring-2 ring-pink/40'
                    : idx < activeRound
                    ? 'bg-pink-deep'
                    : 'bg-pink/25'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Workflow mode: Same-Frame vs Taking-Turns */}
        <div className="flex items-center bg-bg rounded-pill p-1 border border-pink/25 text-xs">
          <button
            onClick={() => setSubMode('same-frame')}
            className={`px-3 py-1 rounded-pill font-display transition-colors ${
              subMode === 'same-frame'
                ? 'bg-pink-deep text-white shadow-subtle font-semibold'
                : 'text-muted hover:text-ink'
            }`}
          >
            Same Frame
          </button>
          <button
            onClick={() => setSubMode('taking-turns')}
            className={`px-3 py-1 rounded-pill font-display transition-colors ${
              subMode === 'taking-turns'
                ? 'bg-pink-deep text-white shadow-subtle font-semibold'
                : 'text-muted hover:text-ink'
            }`}
          >
            Take Turns
          </button>
        </div>

        {/* Device, Mirror & Timer controls */}
        <div className="flex items-center gap-1.5">
          {/* Mirror toggle */}
          <button
            onClick={toggleMirror}
            aria-label="Toggle camera mirror"
            title="Toggle mirror view"
            className={`p-2 rounded-full border transition-colors ${
              isMirrored
                ? 'bg-pink/20 text-pink-deep border-pink/40'
                : 'bg-surface text-muted border-pink/20 hover:text-ink'
            }`}
          >
            <FlipHorizontal className="w-4 h-4" />
          </button>

          {/* Camera switch if multiple devices */}
          {devices.length > 1 && (
            <select
              value={selectedDeviceId}
              onChange={(e) => switchDevice(e.target.value)}
              className="text-xs bg-surface border border-pink/30 rounded-pill px-2.5 py-1 text-ink focus:outline-none"
              aria-label="Select camera device"
            >
              {devices.map((d, index) => (
                <option key={d.deviceId || index} value={d.deviceId}>
                  {d.label || `Camera ${index + 1}`}
                </option>
              ))}
            </select>
          )}

          {/* Timer setting (3s / 5s) */}
          <button
            onClick={() => setTimerDuration(timerDuration === 3 ? 5 : timerDuration === 5 ? 10 : 3)}
            aria-label={`Timer: ${timerDuration} seconds`}
            title={`Timer: ${timerDuration}s`}
            className="flex items-center gap-1 text-xs font-display font-medium bg-surface text-ink border border-pink/30 rounded-pill px-2.5 py-1 hover:border-pink-deep"
          >
            <Timer className="w-3.5 h-3.5 text-pink-deep" />
            <span>{timerDuration}s</span>
          </button>
        </div>
      </div>

      {/* Dual Camera Panels View */}
      <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 relative">
        <CameraPanel
          personLabel="Person 1"
          videoRef={videoRef}
          isMirrored={isMirrored}
          isActive={subMode === 'same-frame' || currentPersonTurn === 0}
          isLoading={isLoading}
        />
        <CameraPanel
          personLabel="Person 2"
          videoRef={videoRef}
          isMirrored={isMirrored}
          isActive={subMode === 'same-frame' || currentPersonTurn === 1}
          isLoading={isLoading}
        />

        {/* Countdown Floating Display Overlay */}
        {countdownValue !== null && (
          <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none">
            <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-surface/95 border-4 border-pink-deep text-pink-deep shadow-booth flex items-center justify-center animate-bounce">
              <span className="font-display text-7xl sm:text-8xl font-black drop-shadow-md">
                {countdownValue}
              </span>
            </div>
          </div>
        )}

        {/* Between Rounds Interstitial Banner */}
        {betweenRoundMessage && (
          <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none p-4">
            <div className="bg-surface/95 text-ink px-6 py-4 rounded-panel border-2 border-pink-deep shadow-booth flex items-center gap-3 animate-slide-down">
              <Sparkles className="w-6 h-6 text-pink-deep animate-spin" />
              <span className="font-display text-base sm:text-lg font-bold text-pink-deep">
                {betweenRoundMessage}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Shutter Button & Keyboard Hint */}
      <div className="flex flex-col items-center mt-6 sm:mt-8 gap-3">
        <button
          onClick={startCountdown}
          disabled={isCountingDown || isPausedBetweenRounds || isLoading}
          aria-label="Capture photo shutter button"
          className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-pink-deep text-white border-4 border-white shadow-booth hover:shadow-booth-hover hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all flex flex-col items-center justify-center relative group"
        >
          {/* Shutter inner concentric circle */}
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-white/60 flex items-center justify-center">
            <Camera className="w-7 h-7 sm:w-8 sm:h-8" />
          </div>
        </button>

        <span className="text-xs text-muted font-body flex items-center gap-1.5">
          <span>Tap shutter or press</span>
          <kbd className="px-2 py-0.5 text-[11px] font-mono bg-surface border border-pink/30 rounded-md text-ink shadow-2xs">
            Space
          </kbd>
        </span>
      </div>
    </div>
  );
};
