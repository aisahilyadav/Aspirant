import React from 'react';
import MorningScene from '../components/landing/MorningScene';
import FeaturesSection from '../components/landing/FeaturesSection';
import ContributeSection from '../components/landing/ContributeSection';
import FooterScene from '../components/landing/FooterScene';
import Contact from './Contact';
import About from './About';
import { ScrollVelocityContainer, ScrollVelocityRow } from '../components/ui/scroll-based-velocity';

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