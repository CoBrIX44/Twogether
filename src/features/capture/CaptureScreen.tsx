import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Camera, FlipHorizontal, Timer, Sparkles, Wifi } from 'lucide-react';
import { useSessionStore } from '@/stores/sessionStore';
import { useRemoteStore } from '@/stores/remoteStore';
import { useCamera } from '@/lib/media/useCamera';
import { playShutterSound, playCountdownBeep } from '@/lib/media/sound';
import { remoteManager } from '@/lib/remote/remoteManager';
import { CameraPanel } from './CameraPanel';
import { PermissionScreen } from './PermissionScreen';

const ROUND_TRANSITION_MESSAGES = [
  'Round 1 complete! Preparing for Round 2... ✨',
  'Round 2 complete! Final round coming up! 🎉',
];

export const CaptureScreen: React.FC = () => {
  const {
    mode,
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
    roomCode,
    role,
    status: remoteStatus,
    userName,
    partnerName,
    remoteStream,
  } = useRemoteStore();

  const {
    stream,
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

  // Buffer for current round when taking turns in same-device mode
  const [turnBufferFrame, setTurnBufferFrame] = useState<string | null>(null);

  const countdownTimerRef = useRef<number | null>(null);

  // Initialize camera on mount
  useEffect(() => {
    startCamera();
  }, [startCamera]);

  // Feed camera stream to remote manager whenever ready
  useEffect(() => {
    if (stream) {
      remoteManager.setLocalStream(stream);
    }
  }, [stream]);

  // Execute snapshot capture
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

    // REMOTE BOOTH CAPTURE FLOW
    if (mode === 'together-remote') {
      const mySlot = role === 'host' ? 0 : 1;
      const myFrame = {
        round: roundToCapture,
        slot: mySlot,
        dataUrl,
        timestamp: Date.now(),
      };

      addFrame(myFrame);

      // Send local captured frame to partner
      remoteManager.send({
        type: 'CAPTURE_FRAME',
        round: roundToCapture,
        slot: mySlot,
        dataUrl,
      });

      if (retakeTargetRound !== null) {
        setRetakeTargetRound(null);
        setTimeout(() => {
          setStep('review');
          remoteManager.send({ type: 'PROCEED_STEP', step: 'review' });
        }, 800);
        return;
      }

      if (roundToCapture >= 2) {
        setTimeout(() => {
          setStep('review');
          remoteManager.send({ type: 'PROCEED_STEP', step: 'review' });
        }, 1200);
      } else {
        setIsPausedBetweenRounds(true);
        setBetweenRoundMessage(ROUND_TRANSITION_MESSAGES[roundToCapture]);
        setTimeout(() => {
          setIsPausedBetweenRounds(false);
          setBetweenRoundMessage(null);
          setCurrentRound(roundToCapture + 1);
        }, 2200);
      }
      return;
    }

    // SAME DEVICE FLOW
    if (subMode === 'same-frame') {
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

      if (roundToCapture >= 2) {
        setTimeout(() => {
          setStep('review');
        }, 800);
      } else {
        setIsPausedBetweenRounds(true);
        setBetweenRoundMessage(ROUND_TRANSITION_MESSAGES[roundToCapture]);
        setTimeout(() => {
          setIsPausedBetweenRounds(false);
          setBetweenRoundMessage(null);
          setCurrentRound(roundToCapture + 1);
        }, 2200);
      }
    } else {
      // Taking turns mode
      if (currentPersonTurn === 0) {
        setTurnBufferFrame(dataUrl);
        setCurrentPersonTurn(1);
        setIsPausedBetweenRounds(true);
        setBetweenRoundMessage('Great shot! Partner 2, get ready! 📸');
        setTimeout(() => {
          setIsPausedBetweenRounds(false);
          setBetweenRoundMessage(null);
        }, 1800);
      } else {
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
          setBetweenRoundMessage(ROUND_TRANSITION_MESSAGES[roundToCapture]);
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
    mode,
    role,
    subMode,
    addFrame,
    replaceRoundFrames,
    setRetakeTargetRound,
    setStep,
    setCurrentRound,
    currentPersonTurn,
    setCurrentPersonTurn,
    turnBufferFrame,
  ]);

  // Run the animated countdown
  const runCountdownSequence = useCallback(
    (duration: number) => {
      setIsCountingDown(true);
      let count = duration;
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
    },
    [isMuted, takeSnapshot]
  );

  // Bind remote manager callbacks
  useEffect(() => {
    remoteManager.setCountdownCallback((duration) => {
      runCountdownSequence(duration);
    });
    remoteManager.setFlashCallback(() => {
      setIsFlashing(true);
      setTimeout(() => setIsFlashing(false), 200);
    });
    return () => {
      remoteManager.setCountdownCallback(null);
      remoteManager.setFlashCallback(null);
    };
  }, [runCountdownSequence]);

  // Start countdown trigger
  const handleStartCountdown = useCallback(() => {
    if (isCountingDown || isPausedBetweenRounds || isLoading || error) return;

    if (mode === 'together-remote') {
      remoteManager.send({
        type: 'START_COUNTDOWN',
        duration: timerDuration,
        timestamp: Date.now(),
      });
    }

    runCountdownSequence(timerDuration);
  }, [
    isCountingDown,
    isPausedBetweenRounds,
    isLoading,
    error,
    mode,
    timerDuration,
    runCountdownSequence,
  ]);

  // Spacebar hotkey to snap
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !isCountingDown && !isPausedBetweenRounds && !error) {
        e.preventDefault();
        handleStartCountdown();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isCountingDown, isPausedBetweenRounds, error, handleStartCountdown]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (countdownTimerRef.current) clearTimeout(countdownTimerRef.current);
    };
  }, []);

  if (error) {
    return (
      <PermissionScreen
        errorType={error}
        errorMessage={errorMessage}
        onRetry={startCamera}
      />
    );
  }

  const activeRound = retakeTargetRound !== null ? retakeTargetRound : currentRound;

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto relative select-none">
      {/* Flash Overlay */}
      {isFlashing && (
        <div className="fixed inset-0 z-50 bg-white pointer-events-none animate-flash" />
      )}

      {/* Screen Reader Live Region */}
      <div aria-live="assertive" className="sr-only">
        {countdownValue ? `Countdown ${countdownValue}` : ''}
        {isFlashing ? 'Photo captured!' : ''}
      </div>

      {/* Top Controls Bar */}
      <div className="w-full flex flex-wrap items-center justify-between gap-3 bg-surface/85 backdrop-blur-sm p-3.5 rounded-card border border-pink/20 shadow-subtle mb-4">
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

        {/* Remote Status Banner OR Same-Device Mode Switcher */}
        {mode === 'together-remote' ? (
          <div className="flex items-center gap-2 bg-pink/10 border border-pink/30 px-3 py-1 rounded-pill">
            <span className="text-xs font-mono font-bold text-pink-deep">
              Room {roomCode}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-pink-deep" />
            <span className="text-xs font-medium text-ink flex items-center gap-1">
              <Wifi className="w-3 h-3 text-emerald-600" />
              {remoteStatus === 'connected' ? `${partnerName} Connected` : 'Connecting...'}
            </span>
          </div>
        ) : (
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
        )}

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
            onClick={() =>
              setTimerDuration(timerDuration === 3 ? 5 : timerDuration === 5 ? 10 : 3)
            }
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
        {mode === 'together-remote' ? (
          <>
            {/* Panel 1: Host always on Left (Slot 0) */}
            <CameraPanel
              personLabel={role === 'host' ? `${userName} (You)` : (partnerName || 'Partner')}
              roleBadge="Slot 1"
              videoRef={role === 'host' ? videoRef : undefined}
              stream={role === 'host' ? stream : remoteStream}
              isMirrored={role === 'host' ? isMirrored : false}
              isActive={true}
              isLoading={role === 'host' ? (isLoading || !stream) : (remoteStatus !== 'connected' || !remoteStream)}
              statusBadge={role === 'host' ? 'Host' : (remoteStream ? 'Live' : 'Connecting...')}
            />

            {/* Panel 2: Guest always on Right (Slot 1) */}
            <CameraPanel
              personLabel={role === 'guest' ? `${userName} (You)` : (partnerName || 'Partner')}
              roleBadge="Slot 2"
              videoRef={role === 'guest' ? videoRef : undefined}
              stream={role === 'guest' ? stream : remoteStream}
              isMirrored={role === 'guest' ? isMirrored : false}
              isActive={true}
              isLoading={role === 'guest' ? (isLoading || !stream) : (remoteStatus !== 'connected' || !remoteStream)}
              statusBadge={role === 'guest' ? 'You' : (remoteStream ? 'Live' : 'Connecting...')}
            />
          </>
        ) : (
          <>
            <CameraPanel
              personLabel="Person 1"
              videoRef={videoRef}
              stream={stream}
              isMirrored={isMirrored}
              isActive={subMode === 'same-frame' || currentPersonTurn === 0}
              isLoading={isLoading || !stream}
            />
            <CameraPanel
              personLabel="Person 2"
              stream={stream}
              isMirrored={isMirrored}
              isActive={subMode === 'same-frame' || currentPersonTurn === 1}
              isLoading={isLoading || !stream}
            />
          </>
        )}

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
          onClick={handleStartCountdown}
          disabled={isCountingDown || isPausedBetweenRounds || isLoading}
          aria-label="Capture photo shutter button"
          className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-pink-deep text-white border-4 border-white shadow-booth hover:shadow-booth-hover hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all flex flex-col items-center justify-center relative group"
        >
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
