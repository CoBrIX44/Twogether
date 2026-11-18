/**
 * Audio effects for photo booth shutter and countdown using Web Audio API.
 * 100% offline and zero external asset dependencies.
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Plays a cute retro camera shutter sound
 */
export function playShutterSound(isMuted: boolean = false): void {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  // 1. Shutter "click" (high frequency snap)
  const clickOsc = ctx.createOscillator();
  const clickGain = ctx.createGain();
  clickOsc.type = 'triangle';
  clickOsc.frequency.setValueAtTime(800, now);
  clickOsc.frequency.exponentialRampToValueAtTime(80, now + 0.08);

  clickGain.gain.setValueAtTime(0.3, now);
  clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

  clickOsc.connect(clickGain);
  clickGain.connect(ctx.destination);
  clickOsc.start(now);
  clickOsc.stop(now + 0.09);

  // 2. Camera mechanical motor / release "whir"
  const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 0.15, ctx.sampleRate);
  const output = noiseBuffer.getChannelData(0);
  for (let i = 0; i < noiseBuffer.length; i++) {
    output[i] = Math.random() * 2 - 1;
  }

  const whiteNoise = ctx.createBufferSource();
  whiteNoise.buffer = noiseBuffer;

  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(1200, now + 0.04);
  filter.Q.setValueAtTime(2, now + 0.04);

  const noiseGain = ctx.createGain();
  noiseGain.gain.setValueAtTime(0.01, now);
  noiseGain.gain.setValueAtTime(0.2, now + 0.04);
  noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

  whiteNoise.connect(filter);
  filter.connect(noiseGain);
  noiseGain.connect(ctx.destination);

  whiteNoise.start(now + 0.04);
  whiteNoise.stop(now + 0.2);
}

/**
 * Plays a countdown beep tone (higher pitch on "1")
 */
export function playCountdownBeep(count: number, isMuted: boolean = false): void {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  // Final count is higher pitched
  const freq = count === 1 ? 880 : 587;
  osc.frequency.setValueAtTime(freq, now);

  gain.gain.setValueAtTime(0.2, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.13);
}
