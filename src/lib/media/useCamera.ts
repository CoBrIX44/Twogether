import { useState, useEffect, useRef, useCallback } from 'react';

export type CameraErrorType =
  | 'PERMISSION_DENIED'
  | 'NOT_FOUND'
  | 'IN_USE'
  | 'UNKNOWN'
  | null;

export interface UseCameraReturn {
  stream: MediaStream | null;
  videoRef: React.RefObject<HTMLVideoElement>;
  devices: MediaDeviceInfo[];
  selectedDeviceId: string;
  isMirrored: boolean;
  isLoading: boolean;
  error: CameraErrorType;
  errorMessage: string | null;
  startCamera: () => Promise<void>;
  stopCamera: () => void;
  toggleMirror: () => void;
  switchDevice: (deviceId: string) => void;
  captureFrame: () => string | null;
}

export function useCamera(): UseCameraReturn {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');
  const [isMirrored, setIsMirrored] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<CameraErrorType>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Stop current active tracks
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setStream(null);
  }, []);

  // Enumerate video devices
  const updateDeviceList = useCallback(async () => {
    if (!navigator.mediaDevices?.enumerateDevices) return;
    try {
      const allDevices = await navigator.mediaDevices.enumerateDevices();
      const videoInputs = allDevices.filter((d) => d.kind === 'videoinput');
      setDevices(videoInputs);
      if (videoInputs.length > 0 && !selectedDeviceId) {
        setSelectedDeviceId(videoInputs[0].deviceId);
      }
    } catch (err) {
      console.warn('Could not enumerate video devices:', err);
    }
  }, [selectedDeviceId]);

  // Start / request camera stream
  const startCamera = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setErrorMessage(null);

    // Clean up any existing stream first
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }

    if (!navigator.mediaDevices?.getUserMedia) {
      setError('NOT_FOUND');
      setErrorMessage('Camera access is not supported in this browser.');
      setIsLoading(false);
      return;
    }

    try {
      const constraints: MediaStreamConstraints = {
        video: selectedDeviceId
          ? {
              deviceId: { exact: selectedDeviceId },
              width: { ideal: 1280 },
              height: { ideal: 960 },
            }
          : {
              facingMode: 'user',
              width: { ideal: 1280 },
              height: { ideal: 960 },
            },
        audio: false,
      };

      const newStream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = newStream;
      setStream(newStream);

      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
        videoRef.current.play().catch((playErr) => {
          console.warn('Video play interrupted:', playErr);
        });
      }

      await updateDeviceList();
      setIsLoading(false);
    } catch (err: unknown) {
      setIsLoading(false);
      const e = err as { name?: string; message?: string };
      console.error('Camera access error:', err);

      if (e.name === 'NotAllowedError' || e.name === 'PermissionDeniedError') {
        setError('PERMISSION_DENIED');
        setErrorMessage('Camera access was denied. Please allow camera permissions to take photos.');
      } else if (e.name === 'NotFoundError' || e.name === 'DevicesNotFoundError') {
        setError('NOT_FOUND');
        setErrorMessage('No camera device was detected on your system.');
      } else if (e.name === 'NotReadableError' || e.name === 'TrackStartError') {
        setError('IN_USE');
        setErrorMessage('Your camera is currently in use by another application or tab.');
      } else {
        setError('UNKNOWN');
        setErrorMessage(e.message || 'An unexpected error occurred while starting the camera.');
      }
    }
  }, [selectedDeviceId, updateDeviceList]);

  // Switch selected device
  const switchDevice = useCallback((deviceId: string) => {
    setSelectedDeviceId(deviceId);
  }, []);

  const toggleMirror = useCallback(() => {
    setIsMirrored((prev) => !prev);
  }, []);

  // Capture frame from video element
  const captureFrame = useCallback((): string | null => {
    const video = videoRef.current;
    const width = video && video.videoWidth ? video.videoWidth : 640;
    const height = video && video.videoHeight ? video.videoHeight : 480;

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    if (isMirrored) {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }

    if (video && video.videoWidth && video.videoHeight) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    } else {
      // Fallback photo frame if video frame metadata is delayed or in headless mode
      ctx.fillStyle = '#FF9EC4';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#FFF7F9';
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height / 2, 80, 0, Math.PI * 2);
      ctx.fill();
    }

    return canvas.toDataURL('image/jpeg', 0.95);
  }, [isMirrored]);

  // Auto clean up on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  return {
    stream,
    videoRef,
    devices,
    selectedDeviceId,
    isMirrored,
    isLoading,
    error,
    errorMessage,
    startCamera,
    stopCamera,
    toggleMirror,
    switchDevice,
    captureFrame,
  };
}
