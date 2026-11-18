import React from 'react';
import { CameraOff, AlertCircle, RefreshCw, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { CameraErrorType } from '@/lib/media/useCamera';

interface PermissionScreenProps {
  errorType: CameraErrorType;
  errorMessage: string | null;
  onRetry: () => void;
}

export const PermissionScreen: React.FC<PermissionScreenProps> = ({
  errorType,
  errorMessage,
  onRetry,
}) => {
  return (
    <div className="w-full max-w-lg mx-auto py-8 px-4 flex flex-col items-center text-center">
      <div className="w-16 h-16 rounded-full bg-danger/10 text-danger flex items-center justify-center mb-5 animate-bounce">
        <CameraOff className="w-8 h-8" />
      </div>

      <h2 className="text-2xl sm:text-3xl font-display font-bold text-ink mb-2">
        {errorType === 'PERMISSION_DENIED'
          ? 'Camera Permission Needed'
          : errorType === 'IN_USE'
          ? 'Camera Is In Use'
          : 'Camera Not Found'}
      </h2>

      <p className="text-sm text-muted mb-6 max-w-md">
        {errorMessage ||
          'To take photos in Twogether, please allow camera access in your browser.'}
      </p>

      {/* Helpful Instructions Card */}
      <Card variant="dashed" className="text-left w-full mb-6 p-4 sm:p-5">
        <div className="flex items-center gap-2 font-display font-semibold text-sm text-ink mb-2">
          <HelpCircle className="w-4 h-4 text-pink-deep" />
          <span>How to enable your camera:</span>
        </div>
        <ul className="text-xs text-muted space-y-2 list-disc list-inside">
          <li>
            <strong>Chrome / Edge:</strong> Click the camera icon or padlock in the address bar and select &quot;Allow&quot;.
          </li>
          <li>
            <strong>Safari (iOS):</strong> Tap the &quot;aA&quot; or settings icon in the address bar → Website Settings → Camera → Allow.
          </li>
          <li>
            <strong>Firefox:</strong> Click the permissions icon next to the URL and clear the blocked status.
          </li>
        </ul>
      </Card>

      <div className="flex items-center gap-3">
        <Button
          size="lg"
          leftIcon={<RefreshCw className="w-4 h-4" />}
          onClick={onRetry}
        >
          Try Again
        </Button>
      </div>

      <div className="mt-8 flex items-center gap-2 text-xs text-muted">
        <AlertCircle className="w-4 h-4 text-pink-deep" />
        <span>Photos stay on your device — no video is recorded or streamed anywhere.</span>
      </div>
    </div>
  );
};
