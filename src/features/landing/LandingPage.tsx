import React, { useState, useEffect } from 'react';
import { Camera, Sparkles, Users, ShieldCheck, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { STICKER_CATALOGUE } from '@/lib/stickers/catalogue';
import { ModeSelectModal } from '@/features/session/ModeSelectModal';

export const LandingPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [initialRoomCode, setInitialRoomCode] = useState<string | undefined>(undefined);

  // Check URL parameters for room code to auto-join
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const room = params.get('room') || params.get('join');
    if (room) {
      setInitialRoomCode(room);
      setIsModalOpen(true);
    }
  }, []);

  const handleStartBooth = () => {
    setIsModalOpen(true);
  };

  const mascots = STICKER_CATALOGUE.filter((s) => s.category === 'mascots');

  return (
    <div className="flex flex-col items-center gap-12 sm:gap-16 pb-8">
      {/* Mode Selection & Remote Booth Dialog */}
      <ModeSelectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialRoomCode={initialRoomCode}
      />

      {/* Hero Section */}
      <section className="text-center max-w-2xl mx-auto flex flex-col items-center pt-2 sm:pt-6">
        {/* Main Title & Tagline */}
        <h1 className="text-4xl sm:text-6xl font-display font-bold text-ink leading-tight tracking-tight mb-4">
          Capturing moments,{' '}
          <span className="text-pink-deep underline decoration-pink/40 decoration-wavy decoration-2">
            together.
          </span>
        </h1>

        <p className="text-base sm:text-lg text-muted font-body max-w-lg mb-8 leading-relaxed">
          Step into our retro-cute photo booth! Take 3 candid shots side-by-side or from two devices anywhere in the world, decorate with aesthetic frames, cute stickers, and pastel filters, and download your classic strip.
        </p>

        {/* Primary CTA */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Button
            size="pill-lg"
            isPulse
            rightIcon={<ArrowRight className="w-5 h-5" />}
            onClick={handleStartBooth}
            className="w-full sm:w-auto text-base"
          >
            Step Inside the Booth ♡
          </Button>
        </div>

        {/* Reassurance Chips */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-6 text-xs text-muted font-medium">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-mint" /> No signup required
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-pink" /> 100% In-Browser Privacy
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-butter" /> Free JPG, PNG & PDF
          </span>
        </div>
      </section>

      {/* Visual Photobooth Strip Showcase */}
      <section className="w-full max-w-3xl mx-auto relative px-4">
        <div className="bg-gradient-to-b from-pink/20 to-lavender/20 p-6 sm:p-10 rounded-panel border-2 border-pink/30 shadow-booth relative overflow-hidden">
          {/* Booth Curtain Decor */}
          <div className="absolute top-0 left-0 right-0 h-4 bg-pink-deep opacity-80" />
          <div className="absolute top-4 left-0 right-0 h-2 bg-pink opacity-50" />

          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            {/* Illustrated Preview Strip */}
            <div className="w-56 sm:w-64 bg-surface rounded-card p-3 shadow-booth-hover border-2 border-pink/40 rotate-[-2deg] transition-transform hover:rotate-0 duration-300">
              <div className="text-center font-display text-xs font-bold text-ink mb-2">
                TWOGETHER ♡
              </div>
              <div className="grid grid-cols-2 gap-1.5 mb-2">
                {/* 3 sample rows */}
                <div className="aspect-[3/4] bg-pink/20 rounded flex items-center justify-center text-xl">
                  🥰
                </div>
                <div className="aspect-[3/4] bg-lavender/25 rounded flex items-center justify-center text-xl">
                  ✌️
                </div>
                <div className="aspect-[3/4] bg-mint/30 rounded flex items-center justify-center text-xl">
                  💖
                </div>
                <div className="aspect-[3/4] bg-butter/40 rounded flex items-center justify-center text-xl">
                  🥳
                </div>
                <div className="aspect-[3/4] bg-pink/25 rounded flex items-center justify-center text-xl">
                  🌸
                </div>
                <div className="aspect-[3/4] bg-lavender/30 rounded flex items-center justify-center text-xl">
                  ✨
                </div>
              </div>
              <div className="border-t border-dashed border-pink/40 pt-1.5 text-center">
                <span className="text-[10px] font-display font-semibold text-pink-deep">
                  BESTIES FOREVER ♡
                </span>
              </div>
            </div>

            {/* Mascot welcoming speech */}
            <div className="flex-1 text-center md:text-left">
              <span className="text-xs font-display font-bold text-pink-deep uppercase tracking-wider">
                Meet our original mascot crew
              </span>
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-ink mt-1 mb-3">
                Stick, stamp & style your memories!
              </h2>
              <p className="text-sm text-muted mb-6 leading-relaxed">
                Add Boba Bunny, Mochi Bear, Kiki Cat, and Twinkle Star to your strip alongside custom washi tapes, retro heart sunglasses, and romantic captions.
              </p>

              {/* Mascot Icons Row */}
              <div className="flex items-center justify-center md:justify-start gap-3">
                {mascots.slice(0, 4).map((m) => (
                  <div
                    key={m.id}
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-card bg-surface p-2 shadow-subtle border border-pink/30 hover:scale-110 hover:-translate-y-1 transition-transform cursor-pointer flex items-center justify-center overflow-hidden"
                    title={m.name}
                  >
                    {m.imageUrl ? (
                      <img
                        src={m.imageUrl}
                        alt={m.name}
                        className="w-full h-full object-contain pointer-events-none select-none"
                      />
                    ) : (
                      <div
                        className="w-full h-full pointer-events-none flex items-center justify-center"
                        dangerouslySetInnerHTML={{ __html: m.svg || '' }}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="w-full max-w-4xl mx-auto px-4">
        <div className="text-center mb-8 sm:mb-10">
          <span className="text-xs font-display font-bold text-pink-deep uppercase tracking-wider">
            Simple & Fun
          </span>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-ink mt-1">
            How Twogether Works
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-pink/20 text-pink-deep flex items-center justify-center mb-4 font-display font-bold text-lg">
              1
            </div>
            <div className="w-10 h-10 rounded-full bg-pink-deep/10 text-pink-deep flex items-center justify-center mb-3">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-lg text-ink mb-2">Get In Frame</h3>
            <p className="text-xs sm:text-sm text-muted leading-relaxed">
              Grab your favorite person! Position side-by-side in dual panels or take turns with our built-in camera guide.
            </p>
          </Card>

          <Card className="text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-lavender/30 text-lavender-deep flex items-center justify-center mb-4 font-display font-bold text-lg">
              2
            </div>
            <div className="w-10 h-10 rounded-full bg-lavender-deep/10 text-lavender-deep flex items-center justify-center mb-3">
              <Camera className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-lg text-ink mb-2">3-2-1 Strike a Pose</h3>
            <p className="text-xs sm:text-sm text-muted leading-relaxed">
              Hit shutter for a synchronized countdown, screen flash, and real camera capture across 3 fun rounds.
            </p>
          </Card>

          <Card className="text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-mint/40 text-emerald-600 flex items-center justify-center mb-4 font-display font-bold text-lg">
              3
            </div>
            <div className="w-10 h-10 rounded-full bg-mint/30 text-emerald-600 flex items-center justify-center mb-3">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-lg text-ink mb-2">Customise & Export</h3>
            <p className="text-xs sm:text-sm text-muted leading-relaxed">
              Pick your film filter, stamp cute stickers, write your personal caption, and download in print-quality JPG, PNG, or PDF!
            </p>
          </Card>
        </div>
      </section>

      {/* Privacy First Feature Callout */}
      <section className="w-full max-w-4xl mx-auto px-4">
        <Card variant="dashed" className="flex flex-col sm:flex-row items-center gap-6 p-6 sm:p-8">
          <div className="w-16 h-16 rounded-full bg-pink/20 text-pink-deep flex items-center justify-center shrink-0">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-display font-bold text-ink mb-1">
              Your Photos Are Always Private
            </h3>
            <p className="text-xs sm:text-sm text-muted leading-relaxed">
              Every photo you take is processed locally inside your browser’s canvas. We never send your pictures to any server, database, or analytics platform. When you close the tab, everything in memory is discarded.
            </p>
          </div>
        </Card>
      </section>
    </div>
  );
};
