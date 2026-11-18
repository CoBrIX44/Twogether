import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock HTMLCanvasElement.getContext
if (typeof HTMLCanvasElement !== 'undefined') {
  HTMLCanvasElement.prototype.getContext = vi.fn().mockImplementation((contextId: string) => {
    if (contextId === '2d') {
      return {
        fillRect: vi.fn(),
        clearRect: vi.fn(),
        getImageData: vi.fn(() => ({ data: new Uint8ClampedArray(4) })),
        putImageData: vi.fn(),
        createImageData: vi.fn(() => ({ data: new Uint8ClampedArray(4) })),
        setTransform: vi.fn(),
        drawImage: vi.fn(),
        save: vi.fn(),
        fillText: vi.fn(),
        restore: vi.fn(),
        beginPath: vi.fn(),
        moveTo: vi.fn(),
        lineTo: vi.fn(),
        closePath: vi.fn(),
        stroke: vi.fn(),
        fill: vi.fn(),
        arc: vi.fn(),
        clip: vi.fn(),
        translate: vi.fn(),
        scale: vi.fn(),
        rotate: vi.fn(),
        setLineDash: vi.fn(),
        quadraticCurveTo: vi.fn(),
        filter: 'none',
      };
    }
    return null;
  }) as unknown as typeof HTMLCanvasElement.prototype.getContext;

  HTMLCanvasElement.prototype.toDataURL = vi.fn(
    () => 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD'
  );
  HTMLCanvasElement.prototype.toBlob = vi.fn((callback: (blob: Blob | null) => void) => {
    callback(new Blob(['fake-image-bytes'], { type: 'image/png' }));
  });
}

// Mock Web Audio API
window.AudioContext = vi.fn().mockImplementation(() => ({
  currentTime: 0,
  state: 'running',
  resume: vi.fn().mockResolvedValue(undefined),
  createOscillator: vi.fn().mockReturnValue({
    type: 'sine',
    frequency: { setValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn() },
    connect: vi.fn(),
    start: vi.fn(),
    stop: vi.fn(),
  }),
  createGain: vi.fn().mockReturnValue({
    gain: { setValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn() },
    connect: vi.fn(),
  }),
  createBuffer: vi.fn().mockReturnValue({
    length: 100,
    getChannelData: vi.fn().mockReturnValue(new Float32Array(100)),
  }),
  createBufferSource: vi.fn().mockReturnValue({
    buffer: null,
    connect: vi.fn(),
    start: vi.fn(),
    stop: vi.fn(),
  }),
  createBiquadFilter: vi.fn().mockReturnValue({
    type: 'bandpass',
    frequency: { setValueAtTime: vi.fn() },
    Q: { setValueAtTime: vi.fn() },
    connect: vi.fn(),
  }),
  destination: {},
})) as unknown as typeof AudioContext;
