import React, { useState, useEffect } from 'react';
import MorningScene from '../components/landing/MorningScene';
import FeaturesSection from '../components/landing/FeaturesSection';
import ContributeSection from '../components/landing/ContributeSection';
import FooterScene from '../components/landing/FooterScene';
import Contact from './Contact';
import About from './About';
import { ScrollVelocityContainer, ScrollVelocityRow } from '../components/ui/scroll-based-velocity';

// Floating Paper Plane Scroll Progress Indicator
function PaperPlaneScrollIndicator() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isScrollingDown, setIsScrollingDown] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight <= 0) return;
      const progress = window.scrollY / totalHeight;
      setScrollProgress(progress);

      const currentScrollY = window.scrollY;
      setIsScrollingDown(currentScrollY > lastScrollY);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Flight calculations
  const swayX = Math.sin(scrollProgress * Math.PI * 10) * 12; // sways left/right by 12px
  const baseRotation = 45; // original SVG direction pointing down-right
  const swayAngle = Math.cos(scrollProgress * Math.PI * 10) * 15; // banking angle
  const directionPitch = isScrollingDown ? 15 : -10; // pitch adjustments based on scroll direction
  
  const finalRotation = baseRotation + swayAngle + directionPitch;

  return (
    <div className="fixed right-3 sm:right-6 top-[15%] bottom-[15%] w-8 z-50 pointer-events-none hidden sm:flex flex-col items-center select-none">
      {/* Dashed flight track line */}
      <div className="absolute inset-y-0 w-0 border-l-2 border-dashed border-stone-400 opacity-20" />

      {/* Flying Paper Plane SVG */}
      <div 
        className="absolute w-8 h-8 transition-transform duration-100 ease-out"
        style={{
          top: `${scrollProgress * 100}%`,
          transform: `translate(-50%, -50%) translate3d(${swayX}px, 0, 0) rotate(${finalRotation}deg)`,
          left: '50%'
        }}
      >
        <svg 
          className="w-8 h-8 text-stone-900 fill-[#FAF9F6] stroke-[2.2] drop-shadow-[2px_2px_0px_rgba(0,0,0,0.15)]" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path d="M2 21L23 2L12 23L10 14L2 21Z M10 14L23 2L2 21" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
}

export default function LandingPage() {

  // Smooth scroll to element helper
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleReset = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen bg-[#FAF9F6] text-stone-900 overflow-x-hidden pt-0 font-sans">
      
      {/* Interactive Paper Plane scroll follower */}
      <PaperPlaneScrollIndicator />

      {/* Scene Blocks */}
      <div className="relative z-10">
        
        <div id="morning">
          <MorningScene onCtaClick={() => scrollToSection('features')} />
        </div>

        {/* Scroll-Based Velocity Marquee Divider (Aspirant Theme) */}
        <div className="relative w-full bg-[#F8C537] border-y-4 border-stone-900 py-6 overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] my-8 select-none">
          <ScrollVelocityContainer className="text-3xl md:text-5xl font-black tracking-tighter">
            <ScrollVelocityRow baseVelocity={1.5} direction={1}>
              Aspirant • Study OS • Active Recall • Open Source • Self-Learners •
            </ScrollVelocityRow>
            <ScrollVelocityRow baseVelocity={1.5} direction={-1}>
              Aspirant • Built for Self-Learners • Interactive 3D Doodles •
            </ScrollVelocityRow>
          </ScrollVelocityContainer>
        </div>

        {/* Features playground */}
        <div id="features">
          <FeaturesSection />
        </div>

        {/* About section */}
        <div id="about">
          <About />
        </div>

        {/* Contact section */}
        <div id="contact">
          <Contact />
        </div>

        {/* Contribute section */}
        <div id="contribute">
          <ContributeSection />
        </div>

        {/* Ending section and board game */}
        <div id="ending">
          <FooterScene onReset={handleReset} />
        </div>

      </div>

    </div>
  );
}