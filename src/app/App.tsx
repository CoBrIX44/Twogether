import React from 'react';
import { useSessionStore } from '@/stores/sessionStore';
import { Layout } from './Layout';
import { LandingPage } from '@/features/landing/LandingPage';
import { CaptureScreen } from '@/features/capture/CaptureScreen';
import { ReviewScreen } from '@/features/review/ReviewScreen';
import { EditorScreen } from '@/features/editor/EditorScreen';
import { ExportScreen } from '@/features/export/ExportScreen';

export const App: React.FC = () => {
  const { step } = useSessionStore();

  const renderCurrentStep = () => {
    switch (step) {
      case 'landing':
        return <LandingPage />;
      case 'capture':
        return <CaptureScreen />;
      case 'review':
        return <ReviewScreen />;
      case 'editor':
        return <EditorScreen />;
      case 'export':
        return <ExportScreen />;
      default:
        return <LandingPage />;
    }
  };

  return <Layout>{renderCurrentStep()}</Layout>;
};

export default App;
