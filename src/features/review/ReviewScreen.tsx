import React from 'react';
import { Sparkles, RotateCcw } from 'lucide-react';
import { useSessionStore } from '@/stores/sessionStore';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export const ReviewScreen: React.FC = () => {
  const { frames, setStep, setRetakeTargetRound, setCurrentRound } = useSessionStore();

  const handleRetakeRound = (roundIndex: number) => {
    setRetakeTargetRound(roundIndex);
    setCurrentRound(roundIndex);
    setStep('capture');
  };

  const handleProceedToEditor = () => {
    setStep('editor');
  };

  // Group frames by round (0, 1, 2)
  const rounds = [0, 1, 2].map((round) => {
    const slot0 = frames.find((f) => f.round === round && f.slot === 0);
    const slot1 = frames.find((f) => f.round === round && f.slot === 1);
    return { round, slot0, slot1 };
  });

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col items-center pb-6">
      <div className="text-center mb-6">
        <span className="text-xs font-display font-bold text-pink-deep uppercase tracking-wider">
          Step 2 • Review Your Shots
        </span>
        <h2 className="text-2xl sm:text-3xl font-display font-bold text-ink mt-1">
          Look at your lovely moments! ♡
        </h2>
        <p className="text-xs sm:text-sm text-muted mt-1">
          Happy with how they look? Tap any round to retake, or continue to decorate with stickers.
        </p>
      </div>

      {/* 3 Rounds Contact Sheet */}
      <div className="w-full flex flex-col gap-4 mb-8">
        {rounds.map(({ round, slot0, slot1 }) => (
          <Card
            key={round}
            className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-2 border-pink/20 hover:border-pink-deep/40 transition-all"
          >
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-pink/20 text-pink-deep font-display font-bold text-sm flex items-center justify-center">
                {round + 1}
              </span>
              <span className="font-display font-semibold text-sm text-ink">
                Round {round + 1}
              </span>
            </div>

            {/* Photos Preview */}
            <div className="flex items-center gap-3">
              <div className="w-20 h-28 sm:w-24 sm:h-32 rounded-card overflow-hidden bg-bg border border-pink/30 shadow-subtle">
                {slot0 ? (
                  <img
                    src={slot0.dataUrl}
                    alt={`Round ${round + 1} Person 1`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-muted">
                    Missing
                  </div>
                )}
              </div>

              <div className="w-20 h-28 sm:w-24 sm:h-32 rounded-card overflow-hidden bg-bg border border-pink/30 shadow-subtle">
                {slot1 ? (
                  <img
                    src={slot1.dataUrl}
                    alt={`Round ${round + 1} Person 2`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-muted">
                    Missing
                  </div>
                )}
              </div>
            </div>

            {/* Retake this round action */}
            <Button
              variant="outline"
              size="sm"
              leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
              onClick={() => handleRetakeRound(round)}
            >
              Retake Round {round + 1}
            </Button>
          </Card>
        ))}
      </div>

      {/* Navigation Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
        <Button
          size="pill-lg"
          rightIcon={<Sparkles className="w-5 h-5" />}
          onClick={handleProceedToEditor}
          className="w-full sm:w-auto"
        >
          Looks Great! Decorate Strip ♡
        </Button>
      </div>
    </div>
  );
};
