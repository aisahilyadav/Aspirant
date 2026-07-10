import React, { useState, useEffect } from 'react';
import MorningScene from '../components/landing/MorningScene';
import FeaturesSection from '../components/landing/FeaturesSection';
import ContributeSection from '../components/landing/ContributeSection';
import FooterScene from '../components/landing/FooterScene';
import Contact from './Contact';
import About from './About';

export default function LandingPage() {
  const [scrollProgress, setScrollProgress] = useState(0);

  // Track window scroll progress for drawing the pencil line
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollTop / (docHeight || 1);
      setScrollProgress(progress);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Smooth scroll to hash anchor on mount
  useEffect(() => {
    if (window.location.hash) {
      const id = window.location.hash.substring(1);
      const el = document.getElementById(id);
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 300);
      }
    }
  }, []);

  // Soft background transitions based on scroll progress
  let currentBg = 'bg-[#FDFBF6]'; // Default morning paper
  let textColor = 'text-stone-850';

  if (scrollProgress > 0.8) {
    currentBg = 'bg-[#18181b]'; // Deep night lofi charcoal
    textColor = 'text-stone-300';
  } else if (scrollProgress > 0.5) {
    currentBg = 'bg-[#EFE6D8]'; // Warm sunset beige
  } else if (scrollProgress > 0.25) {
    currentBg = 'bg-[#F5EFE6]'; // Afternoon soft cream
  }

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
    <div className={`relative min-h-screen ${currentBg} ${textColor} transition-colors duration-1000 overflow-x-hidden pt-0`}>
      
      {/* SVG Handdrawn Rough Line Filter */}
      <svg className="absolute w-0 h-0" aria-hidden="true" style={{ position: 'absolute', width: 0, height: 0 }}>
        <defs>
          <filter id="handdrawn" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="2.5" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>

      {/* Global Background Notebook grid pattern */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.25] paper-grid" />

      {/* Drawing Pencil Guide Line sidebar */}
      <div className="fixed left-4 sm:left-12 top-0 bottom-0 w-8 z-30 pointer-events-none hidden sm:block">
        <svg className="w-full h-full text-stone-900 stroke-current" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'url(#handdrawn)' }}>
          {/* Continuous snaking pencil line down the sidebar */}
          <path
            d="M 15 0 C 30 150, 0 350, 15 500 C 30 650, 0 850, 15 1000 C 30 1150, 0 1350, 15 1500 C 30 1650, 0 1850, 15 2000 C 30 2150, 0 2350, 15 2500 L 15 3500"
            strokeDasharray="4000"
            strokeDashoffset={4000 - scrollProgress * 4000}
            className="transition-all duration-300"
          />
        </svg>
      </div>

      {/* Scene Blocks Compositions */}
      <div className="relative z-10">
        
        <div id="morning">
          <MorningScene onCtaClick={() => scrollToSection('features')} />
        </div>

        <div id="features">
          <FeaturesSection />
        </div>

        <div id="about">
          <About />
        </div>

        <div id="contact">
          <Contact />
        </div>

        <div id="contribute">
          <ContributeSection />
        </div>

        <div id="ending">
          <FooterScene onReset={handleReset} />
        </div>

      </div>

    </div>
  );
}