import React, { useState } from 'react';
import { HeroSection } from './components/HeroSection';
import { AboutSection } from './components/AboutSection';
import { FeaturesSection } from './components/FeaturesSection';
import { LiquidHeroSection } from './components/LiquidHeroSection';
import { AsmeAboutSection } from './components/AsmeAboutSection';
import { PhilosophySection } from './components/PhilosophySection';
import { StoryImageSection } from './components/StoryImageSection';
import { VelorahSection } from './components/VelorahSection';
import { LibraryModal } from './components/LibraryModal';
import { AboutUsModal } from './components/AboutUsModal';
import { trackEvent } from './lib/analytics';
import { Analytics } from '@vercel/analytics/react';

export default function App() {
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  const handleOpenLibrary = () => {
    trackEvent('Navigation', 'Open Library', 'Digital Library Modal');
    setIsLibraryOpen(true);
  };

  const handleOpenAbout = () => {
    trackEvent('Navigation', 'Open About', 'About Us Modal');
    setIsAboutOpen(true);
  };

  return (
    <main className="bg-black min-h-screen text-[#E1E0CC] selection:bg-[#DEDBC8] selection:text-black relative">
      {/* --- THEWAQARMIND CREATIVE STUDIO --- */}
      {/* Section 1: Hero */}
      <HeroSection
        onOpenLibrary={handleOpenLibrary}
        onOpenAboutUs={handleOpenAbout}
      />

      {/* About Us Overlay Modal */}
      <AboutUsModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
      />

      {/* Digital Library Modal View */}
      <LibraryModal
        isOpen={isLibraryOpen}
        onClose={() => setIsLibraryOpen(false)}
      />

      {/* Section 2: About */}
      <AboutSection />

      {/* Section 3: Features */}
      <FeaturesSection />

      {/* --- ASME LIQUID GLASS SHOWCASE --- */}
      {/* Section 4: Liquid Hero */}
      <LiquidHeroSection />

      {/* Section 5: Asme About */}
      <AsmeAboutSection />

      {/* Section 6: Philosophy */}
      <PhilosophySection />

      {/* Story Image Section */}
      <StoryImageSection />

      {/* --- VELORAH HERO SECTION --- */}
      {/* Section 8: Velorah */}
      <VelorahSection onOpenLibrary={handleOpenLibrary} />

      {/* Footer */}
      <footer className="bg-black border-t border-white/5 py-12 px-6 text-center text-xs text-gray-500 space-y-2">
        <p className="font-bold text-white text-sm tracking-wide">Waqar Developer</p>
        <p>© {new Date().getFullYear()} TheWaqarMind, All rights reserved.</p>
        <p className="text-gray-600">Built with purpose. Driven by passion.</p>
      </footer>
      <Analytics />
    </main>
  );
}

