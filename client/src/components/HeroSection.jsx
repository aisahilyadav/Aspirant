import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../store/auth';
import { 
  FiArrowRight, 
  FiFileText, 
  FiClock, 
  FiAward, 
  FiCompass, 
  FiCheck, 
  FiChevronDown, 
  FiSend 
} from 'react-icons/fi';

export default function HeroSection() {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  // Interactive study desk sequence state
  const [activeStep, setActiveStep] = useState(0);
  const steps = [
    { name: "Coffee & Morning", label: "☕ Wakes up & brews coffee" },
    { name: "Opens Notebook", label: "📖 Opens clean study journal" },
    { name: "Study Session", label: "💻 Reads chapters & writes notes" },
    { name: "AI Practice Quiz", label: "📝 Takes active recall quizzes" },
    { name: "Rest & Sleep", label: "🌙 Sleeps peacefully & registers progress" }
  ];

  // Auto-advance interactive sequence
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  // FAQ Accordion State
  const [faqOpen, setFaqOpen] = useState([false, false, false, false]);
  const toggleFaq = (index) => {
    setFaqOpen(prev => {
      const copy = [...prev];
      copy[index] = !copy[index];
      return copy;
    });
  };

  return (
    <div className="relative min-h-screen bg-[#FAF9F6] text-stone-850 font-sans selection:bg-stone-200 selection:text-stone-900 overflow-x-hidden">
      
      {/* SVG Handdrawn Rough Line Filter */}
      <svg className="absolute w-0 h-0" aria-hidden="true" style={{ position: 'absolute', width: 0, height: 0 }}>
        <defs>
          <filter id="handdrawn" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="2.5" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>

      {/* Global Background Grid Pattern */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-50 paper-grid" />

      {/* Hero Section Container */}
      <section className="relative min-h-screen flex flex-col justify-center pt-24 pb-16 z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Content Layout Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">
          
          {/* Left Column: Heading & CTAs */}
          <div className="lg:col-span-6 space-y-8 text-left">
            
            <div className="space-y-4">
              <span className="font-handwritten text-lg text-stone-500 block rotate-[-2deg]">
                [ an ai study companion that feels like paper ]
              </span>
              <h1 className="text-4xl sm:text-6xl font-serif-book font-extrabold tracking-tight text-stone-900 leading-[1.1]">
                An AI study companion 
                <br />
                built for <span className="underline decoration-stone-400 decoration-wavy decoration-2">self-learners</span>.
              </h1>
              <p className="text-stone-605 text-sm sm:text-base max-w-lg leading-relaxed">
                Plan your learning roadmap, organize personal knowledge, generate practice exams, and stay consistent—all within a warm, minimal study journal.
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              {isLoggedIn ? (
                <>
                  <Link
                    to="/home"
                    className="px-6 py-3.5 bg-stone-850 text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-stone-950 transition-transform hover:-translate-y-0.5 shadow-md flex items-center gap-2"
                    style={{ filter: 'url(#handdrawn)' }}
                  >
                    Go to Dashboard
                    <FiArrowRight className="w-4 h-4" />
                  </Link>
                  <a
                    href="#features"
                    className="px-6 py-3.5 border border-stone-300 text-stone-700 hover:text-stone-900 hover:border-stone-900 rounded-xl font-bold text-xs uppercase tracking-wider transition-all"
                  >
                    Explore Journal
                  </a>
                </>
              ) : (
                <>
                  <Link
                    to="/signup"
                    className="px-6 py-3.5 bg-stone-850 text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-stone-950 transition-transform hover:-translate-y-0.5 shadow-md flex items-center gap-2"
                    style={{ filter: 'url(#handdrawn)' }}
                  >
                    Start Learning Free
                    <FiArrowRight className="w-4 h-4" />
                  </Link>
                  <a
                    href="#about"
                    className="px-6 py-3.5 border border-stone-300 text-stone-700 hover:text-stone-900 hover:border-stone-800 rounded-xl font-bold text-xs uppercase tracking-wider transition-all"
                  >
                    Read Philosophy
                  </a>
                </>
              )}
            </div>

            {/* Note Marker label */}
            <div className="flex items-center gap-2 text-stone-450 font-handwritten text-sm pt-2">
              <span>✍️ No credit card required.</span>
              <span>•</span>
              <span>📓 Over 10,000 journals created.</span>
            </div>

          </div>

          {/* Right Column: Interactive Sketchbook Desk Illustration */}
          <div className="lg:col-span-6 flex flex-col items-center">
            
            {/* The Sketchbook Desk Wrapper */}
            <div 
              className="w-full max-w-lg bg-[#FAF9F6] border-2 border-stone-300 rounded-2xl p-6 shadow-md relative animate-wiggle select-none"
              style={{ filter: 'url(#handdrawn)' }}
            >
              
              {/* Paper RIng notebook coils top */}
              <div className="absolute top-[-10px] left-10 right-10 flex justify-between pointer-events-none">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="w-3 h-5 border-2 border-stone-400 bg-stone-200 rounded-full" />
                ))}
              </div>

              {/* Rulers lines background */}
              <div className="absolute inset-0 opacity-[0.25] pointer-events-none rounded-2xl" 
                style={{
                  backgroundImage: 'linear-gradient(#c2c2c2 1px, transparent 1px)',
                  backgroundSize: '100% 20px',
                  backgroundPosition: '0 12px'
                }}
              />

              {/* Study Scene Vector SVG */}
              <div className="relative z-10 w-full h-80 flex items-center justify-center pt-4">
                <svg viewBox="0 0 400 300" className="w-full h-full text-stone-800" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  
                  {/* Desk Surface */}
                  <line x1="20" y1="260" x2="380" y2="260" strokeWidth="3" />
                  
                  {/* Study elements depending on the step */}
                  
                  {/* 1. Window & Sky (Day/Night Indicator) */}
                  <rect x="280" y="30" width="80" height="110" strokeDasharray="3 3" />
                  {activeStep === 4 ? (
                    /* Night Moon and Stars */
                    <>
                      <path d="M330 50 a20 20 0 0 1 20 20 a22 22 0 0 0 -18 -20" fill="currentColor" stroke="none" />
                      <circle cx="300" cy="60" r="1.5" fill="currentColor" stroke="none" />
                      <circle cx="315" cy="80" r="1" fill="currentColor" stroke="none" />
                    </>
                  ) : (
                    /* Day Sun */
                    <circle cx="320" cy="65" r="12" fill="none" className="animate-spin" style={{ transformOrigin: '320px 65px', animationDuration: '20s' }} />
                  )}

                  {/* 2. Desk Lamp (Light cone if studying/active) */}
                  <path d="M40 260 L40 160 L70 180" />
                  <path d="M30 260 L50 260" />
                  <path d="M60 180 a10 10 0 0 1 20 -5" />
                  {activeStep >= 1 && activeStep <= 3 && (
                    <polygon points="70,185 180,260 90,260" fill="rgba(251, 191, 36, 0.15)" stroke="none" />
                  )}

                  {/* 3. Coffee Mug (Step 0 highlights) */}
                  <path d="M90 260 L90 240 L110 240 L110 260 Z" fill={activeStep === 0 ? "rgba(139, 92, 26, 0.1)" : "none"} />
                  <path d="M110 245 C115 245 115 255 110 255" />
                  {/* Steam animation paths */}
                  {activeStep === 0 && (
                    <>
                      <path d="M95 233 C95 228 98 228 98 223" strokeWidth="1" className="animate-pulse" />
                      <path d="M102 235 C102 230 105 230 105 225" strokeWidth="1" className="animate-pulse" />
                    </>
                  )}

                  {/* 4. Notebook (Step 1 highlights) */}
                  <path d="M130 260 L140 230 L200 230 L190 260 Z" fill={activeStep === 1 ? "rgba(167, 243, 208, 0.2)" : "none"} />
                  <line x1="145" y1="240" x2="190" y2="240" strokeWidth="1" />
                  <line x1="142" y1="250" x2="182" y2="250" strokeWidth="1" />

                  {/* 5. Laptop Screen (Step 2 highlights) */}
                  <rect x="210" y="170" width="80" height="55" rx="3" fill={activeStep === 2 ? "rgba(191, 219, 254, 0.2)" : "none"} />
                  <polygon points="190,230 310,230 300,225 200,225" />
                  {activeStep === 2 && (
                    <>
                      {/* Laptop Code Doodle lines */}
                      <line x1="220" y1="180" x2="250" y2="180" stroke="rgba(37, 99, 235, 0.5)" strokeWidth="2" />
                      <line x1="220" y1="190" x2="270" y2="190" stroke="rgba(37, 99, 235, 0.5)" strokeWidth="2" />
                      <line x1="220" y1="205" x2="240" y2="205" stroke="rgba(37, 99, 235, 0.5)" strokeWidth="2" />
                      {/* Little AI Sparkle */}
                      <path d="M265 178 L268 183 L273 184 L269 188 L270 193 L265 190 L260 193 L261 188 L257 184 L262 183 Z" fill="none" stroke="stone" strokeWidth="1" />
                    </>
                  )}

                  {/* 6. Quiz Sheet (Step 3 highlights) */}
                  <rect x="140" y="120" width="45" height="60" rx="2" fill={activeStep === 3 ? "rgba(254, 243, 199, 0.3)" : "none"} strokeDasharray={activeStep === 3 ? "" : "2 2"} />
                  {activeStep === 3 ? (
                    <>
                      {/* Little quiz marks */}
                      <circle cx="150" cy="135" r="3" />
                      <circle cx="150" cy="150" r="3" />
                      {/* Checkmarks */}
                      <path d="M160 133 L163 136 L170 130" stroke="rgba(22, 163, 74, 0.8)" strokeWidth="2" />
                      <path d="M160 148 L163 151 L170 145" stroke="rgba(22, 163, 74, 0.8)" strokeWidth="2" />
                      <text x="145" y="172" className="font-handwritten text-[9px] font-bold" stroke="none" fill="currentColor">100%</text>
                    </>
                  ) : (
                    <text x="148" y="152" className="font-handwritten text-[18px] text-stone-400" stroke="none" fill="currentColor">?</text>
                  )}

                  {/* 7. Sleeping Cat on desk (Step 4 highlights) */}
                  <path d="M300 260 C300 245 320 245 325 250 C330 245 345 245 345 260 Z" fill={activeStep === 4 ? "rgba(244, 244, 245, 0.4)" : "none"} />
                  <path d="M345 255 C350 255 352 260 350 263" /> {/* Tail */}
                  {activeStep === 4 ? (
                    <>
                      {/* Sleep annotation ZZZ */}
                      <text x="340" y="235" className="font-handwritten text-[10px] text-stone-400" stroke="none" fill="currentColor">z</text>
                      <text x="348" y="225" className="font-handwritten text-[12px] text-stone-400" stroke="none" fill="currentColor">Z</text>
                    </>
                  ) : (
                    /* Waking cat eyes */
                    <circle cx="312" cy="254" r="1" fill="currentColor" />
                  )}

                </svg>
              </div>

              {/* Steps Navigation Carousel Indicators */}
              <div className="mt-4 pt-4 border-t border-stone-200 flex justify-between items-center">
                <div className="space-y-1">
                  <p className="text-[10px] font-mono font-bold text-stone-450 uppercase tracking-widest">
                    Study sequence status
                  </p>
                  <p className="text-xs font-bold text-stone-800">
                    {steps[activeStep].label}
                  </p>
                </div>
                <div className="flex gap-1.5">
                  {steps.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveStep(idx)}
                      className={`w-2.5 h-2.5 rounded-full transition-all border border-stone-400 ${
                        idx === activeStep ? 'bg-stone-850 scale-110' : 'bg-transparent'
                      }`}
                      title={steps[idx].name}
                    />
                  ))}
                </div>
              </div>

            </div>

          </div>

        </div>

      </section>

      {/* Section 1: About Philosophy */}
      <section id="about" className="relative min-h-screen flex flex-col justify-center py-20 border-t border-stone-200/60 bg-[#FAF9F6]">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-10">
          
          <div className="space-y-4">
            <span className="font-handwritten text-2xl text-stone-500 block rotate-[-1deg]">
              [ the philosophy of independent learning ]
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif-book font-extrabold text-stone-900 tracking-tight">
              Built for People Who Love Learning Independently
            </h2>
          </div>

          <div className="text-stone-650 text-sm sm:text-base leading-relaxed space-y-6 max-w-2xl mx-auto">
            <p>
              Aspirant is not just another productivity dashboard or flashy AI wrapper. It is a carefully handcrafted space designed for self-learners who find joy in studying at their own pace.
            </p>
            <p>
              We believe that true learning requires concentration, active recall, and organization. By combining clean book-like spaces with offline-first local features, Aspirant becomes the supportive journal that accompanies you on your growth.
            </p>
          </div>

          {/* Doodles Layout row */}
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-6 max-w-xl mx-auto pt-8 select-none">
            {[
              { char: '📚', label: 'books' },
              { char: '☕', label: 'coffee' },
              { char: '📝', label: 'notes' },
              { char: '✏️', label: 'pencil' },
              { char: '💡', label: 'ideas' },
              { char: '🎧', label: 'focus' },
              { char: '📅', label: 'plan' },
              { char: '🐱', label: 'companion' }
            ].map((doodle, idx) => (
              <div key={idx} className="flex flex-col items-center gap-1 hover:scale-110 transition-transform">
                <span className="text-2xl">{doodle.char}</span>
                <span className="font-handwritten text-[10px] text-stone-400">{doodle.label}</span>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Section 2: Learning Workflow Loop */}
      <section id="features" className="relative min-h-screen flex flex-col justify-center py-20 border-t border-stone-200/60 bg-[#FAF9F6]">
        <div className="max-w-6xl mx-auto px-4 w-full">
          
          <div className="text-center mb-16 space-y-3">
            <span className="font-handwritten text-lg text-stone-500 block">
              [ how to master any subject ]
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif-book font-extrabold text-stone-900 tracking-tight">
              The Learning Loop
            </h2>
          </div>

          {/* Connect Loop layout cards */}
          <div className="grid grid-cols-2 md:grid-cols-7 gap-6 items-center max-w-5xl mx-auto">
            {[
              { step: '1', title: 'PLAN', desc: 'Create study tasks', char: '📅' },
              { step: '2', title: 'LEARN', desc: 'Study notes/PDFs', char: '📖' },
              { step: '3', title: 'NOTES', desc: 'Write summaries', char: '✍️' },
              { step: '4', title: 'PRACTICE', desc: 'Take AI quizzes', char: '📝' },
              { step: '5', title: 'REVISE', desc: 'Review index cards', char: '🧠' },
              { step: '6', title: 'TRACK', desc: 'Check stats log', char: '⏱' },
              { step: '7', title: 'IMPROVE', desc: 'Boost quiz scores', char: '📈' }
            ].map((node, index) => (
              <React.Fragment key={index}>
                <div 
                  className="bg-white border border-stone-300 rounded-xl p-4 flex flex-col items-center text-center shadow-sm relative group hover:-translate-y-1 transition-transform"
                  style={{ filter: 'url(#handdrawn)' }}
                >
                  <span className="absolute top-2 left-3 font-mono text-[9px] font-extrabold text-stone-300">
                    0{node.step}
                  </span>
                  <span className="text-xl mb-2">{node.char}</span>
                  <h4 className="text-[11px] font-extrabold text-stone-850 uppercase tracking-widest">{node.title}</h4>
                  <p className="text-[10px] text-stone-450 mt-1 leading-normal">{node.desc}</p>
                </div>
                
                {/* Arrow loop separator */}
                {index < 6 && (
                  <div className="hidden md:flex justify-center text-stone-300 select-none">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12 h14 M12 5 l7 7 l-7 7" />
                    </svg>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>

        </div>
      </section>

      {/* Section 3: AI Features Open Spread */}
      <section className="relative min-h-screen flex flex-col justify-center py-20 border-t border-stone-200/60 bg-[#FAF9F6]">
        <div className="max-w-6xl mx-auto px-4 w-full">
          
          <div className="text-center mb-12 space-y-3">
            <span className="font-handwritten text-lg text-stone-500 block">
              [ minimal intelligence, integrated naturally ]
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif-book font-extrabold text-stone-900 tracking-tight">
              A Notebook with AI Powers
            </h2>
          </div>

          {/* Double page notebook open spread */}
          <div className="grid grid-cols-1 lg:grid-cols-2 bg-[#FAF9F6] border-2 border-stone-300 rounded-3xl overflow-hidden shadow-lg relative" style={{ filter: 'url(#handdrawn)' }}>
            
            {/* Center notebook seam divider line */}
            <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-stone-300 hidden lg:block pointer-events-none" />
            <div className="absolute top-0 bottom-0 left-1/2 w-4 bg-gradient-to-r from-stone-200/20 via-stone-200/40 to-stone-200/20 -translate-x-2 hidden lg:block pointer-events-none" />

            {/* Left Page: Material & Study */}
            <div className="p-8 sm:p-12 space-y-8">
              <h3 className="text-xl font-serif-book font-extrabold text-stone-900 border-b border-stone-200 pb-2 uppercase tracking-wide">
                Page Left: Study Companion
              </h3>

              <div className="space-y-6 font-serif-book">
                <div>
                  <h4 className="text-sm font-extrabold text-stone-850 uppercase tracking-widest flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-stone-400"></span>
                    AI Study Assistant
                  </h4>
                  <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                    Upload PDFs or lecture outlines to get summarized concepts. Ask questions directly inside your study workspace.
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-extrabold text-stone-850 uppercase tracking-widest flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-stone-400"></span>
                    AI Quiz Generator
                  </h4>
                  <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                    Test your memory instantly. Aspirant scans your uploaded documents to generate multiple-choice retrieval practice exams.
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-extrabold text-stone-850 uppercase tracking-widest flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-stone-400"></span>
                    Interactive Explanations
                  </h4>
                  <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                    Select any block of text in your note canvas to generate simpler explanations or analogies on the spot.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Page: Goals & Personal Organization */}
            <div className="p-8 sm:p-12 space-y-8 bg-white/50">
              <h3 className="text-xl font-serif-book font-extrabold text-stone-900 border-b border-stone-200 pb-2 uppercase tracking-wide">
                Page Right: Smart Journal
              </h3>

              <div className="space-y-6 font-serif-book">
                <div>
                  <h4 className="text-sm font-extrabold text-stone-850 uppercase tracking-widest flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-stone-400"></span>
                    Rich text Note Canvas
                  </h4>
                  <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                    A clean distraction-free editor with bolding, lists, highlights, and headers to structure summaries comfortably.
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-extrabold text-stone-850 uppercase tracking-widest flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-stone-400"></span>
                    Study Calendar & Todos
                  </h4>
                  <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                    Link tasks directly with due dates and log study minutes automatically to visualize weekly consistency metrics.
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-extrabold text-stone-850 uppercase tracking-widest flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-stone-400"></span>
                    Dynamic Progress Metrics
                  </h4>
                  <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                    A statistics dashboard calculating daily streak values, total study minutes, and accuracy indicators from quizzes taken.
                  </p>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* Section 4: Why Aspirant */}
      <section className="relative min-h-screen flex flex-col justify-center py-20 border-t border-stone-200/60 bg-[#FAF9F6]">
        <div className="max-w-5xl mx-auto px-4 w-full">
          
          <div className="text-center mb-16 space-y-3">
            <span className="font-handwritten text-lg text-stone-500 block">
              [ solving study roadblocks logically ]
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif-book font-extrabold text-stone-900 tracking-tight">
              Designed for Real Study Problems
            </h2>
          </div>

          {/* Testimonial slips and why notes */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { q: "I don't know what to study today.", tag: "Daily Planner & Todos", color: "bg-white", emoji: "📅" },
              { q: "I keep forgetting everything I read.", tag: "AI Quiz Practice", color: "bg-[#FAF9F6]", emoji: "🧠" },
              { q: "I lose track of my actual progress.", tag: "Streak & Duration Logs", color: "bg-white", emoji: "📈" },
              { q: "I struggle with procrastination.", tag: "Integrated Pomodoro Settings", color: "bg-[#FAF9F6]", emoji: "⏱" }
            ].map((card, idx) => (
              <div 
                key={idx}
                className={`${card.color} border border-stone-300 p-6 rounded-2xl flex flex-col justify-between h-56 hover:shadow-md transition-shadow relative group`}
                style={{ filter: 'url(#handdrawn)' }}
              >
                {/* Simulated piece of tape on top */}
                <div className="absolute top-[-8px] left-1/2 -translate-x-1/2 w-16 h-4 bg-stone-200/40 rotate-1 border-x border-stone-300/30" />
                
                <p className="font-handwritten text-lg text-stone-700 italic pt-2">
                  "{card.q}"
                </p>
                
                <div className="border-t border-stone-200 pt-4 flex items-center gap-2">
                  <span className="text-lg">{card.emoji}</span>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-stone-850">
                    {card.tag}
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Section 5: Future Vision */}
      <section className="relative min-h-screen flex flex-col justify-center py-20 border-t border-stone-200/60 bg-[#FAF9F6]">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-12">
          
          <div className="space-y-4">
            <span className="font-handwritten text-2xl text-stone-500 block">
              [ build habits, achieve goals ]
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif-book font-extrabold text-stone-900 tracking-tight">
              A Platform That Grows with You
            </h2>
          </div>

          <p className="text-stone-655 text-sm sm:text-base max-w-xl mx-auto leading-relaxed font-serif-book">
            Aspirant helps you master content systematically. By tracking study habits daily, you build the skillset necessary to reach exams, certificates, and long-term milestones.
          </p>

          {/* Doodles for growth */}
          <div className="flex justify-center items-center gap-8 md:gap-16 pt-6 select-none max-w-lg mx-auto flex-wrap">
            {[
              { char: '🎓', label: 'Graduation' },
              { char: '💻', label: 'Skills' },
              { char: '🏆', label: 'Milestones' },
              { char: '🧠', label: 'Consistency' }
            ].map((milestone, idx) => (
              <div key={idx} className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 bg-white border border-stone-300 rounded-full flex items-center justify-center text-3xl shadow-sm" style={{ filter: 'url(#handdrawn)' }}>
                  {milestone.char}
                </div>
                <span className="font-handwritten text-xs text-stone-500 uppercase tracking-widest">{milestone.label}</span>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Section 6: Testimonials (Sticky Notes Layout) */}
      <section className="relative min-h-screen flex flex-col justify-center py-20 border-t border-stone-200/60 bg-[#FAF9F6]">
        <div className="max-w-5xl mx-auto px-4 w-full">
          
          <div className="text-center mb-16 space-y-3">
            <span className="font-handwritten text-lg text-stone-500 block">
              [ words from other self-learners ]
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif-book font-extrabold text-stone-900 tracking-tight">
              Student Journal Entries
            </h2>
          </div>

          {/* Sticky notes list */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { text: "Aspirant completely replaced my messy text files and folders. The study desk illustration makes me look forward to opening my notes every morning.", author: "Alex, Self-Taught Developer", rotation: "rotate-[-1deg]" },
              { text: "The AI quiz generator is extremely fast. It extracts terms directly from my textbook PDF chapters, and helps me check what I actually understand.", author: "Mei, Medical Student", rotation: "rotate-[1deg]" },
              { text: "I love the focus on minimal style. It doesn't distract me with neon lights or alerts. It feels just like using paper diaries.", author: "Lukas, Philosophy Student", rotation: "rotate-[-1.5deg]" }
            ].map((entry, idx) => (
              <div 
                key={idx}
                className={`bg-white border border-stone-300 p-8 rounded-2xl shadow-sm flex flex-col justify-between h-64 ${entry.rotation} relative hover:scale-[1.02] transition-all`}
                style={{ filter: 'url(#handdrawn)' }}
              >
                {/* Simulated piece of tape */}
                <div className="absolute top-[-6px] left-1/4 w-20 h-4.5 bg-stone-200/40 border-x border-stone-300/20" />
                
                <p className="text-xs sm:text-sm text-stone-650 leading-relaxed font-serif-book italic">
                  "{entry.text}"
                </p>
                
                <div className="border-t border-stone-200 pt-4">
                  <p className="font-handwritten text-sm text-stone-800 font-bold">
                    — {entry.author}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Section 7: FAQ (Notebook unfold) */}
      <section className="relative min-h-screen flex flex-col justify-center py-20 border-t border-stone-200/60 bg-[#FAF9F6]">
        <div className="max-w-3xl mx-auto px-4 w-full">
          
          <div className="text-center mb-12 space-y-3">
            <span className="font-handwritten text-lg text-stone-500 block">
              [ answering your questions ]
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif-book font-extrabold text-stone-900 tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>

          {/* Accordion List */}
          <div className="space-y-4">
            {[
              { q: "Is Aspirant really built for self-learners?", a: "Yes. Every workspace element, checklist todo, notes canvas, and quiz generator is tuned for learners studying independently outside standard class frameworks." },
              { q: "How does the AI quiz generator function?", a: "When you upload a textbook PDF or notes outline, our backend uses standard retrieval systems to locate key concepts and builds test questions based on active recall structures." },
              { q: "Does the system support local notes backups?", a: "Yes. All note text files can be downloaded, and we support local preferences storage alongside standard authenticated sync options." },
              { q: "What models power the AI features?", a: "Aspirant supports Gemini 2.5 Flash for rapid active recall responses, with customizable options for logic-intensive parsing." }
            ].map((faq, idx) => (
              <div 
                key={idx}
                className="bg-white border border-stone-300 rounded-xl overflow-hidden transition-all shadow-sm"
                style={{ filter: 'url(#handdrawn)' }}
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left font-serif-book font-extrabold text-xs sm:text-sm uppercase tracking-wider text-stone-850 hover:bg-stone-50/50"
                >
                  <span>{faq.q}</span>
                  <FiChevronDown className={`w-4 h-4 transition-transform duration-300 ${faqOpen[idx] ? 'rotate-180' : ''}`} />
                </button>
                
                {faqOpen[idx] && (
                  <div className="px-6 pb-5 pt-2 border-t border-stone-100/80 text-xs text-stone-600 leading-relaxed font-serif-book">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Contact Section */}
      <section className="relative min-h-screen flex flex-col justify-center py-20 border-t border-stone-200/60 bg-[#FAF9F6]">
        <div className="max-w-xl mx-auto px-4 w-full">
          
          <div className="bg-white border-2 border-stone-300 rounded-3xl p-6 sm:p-10 shadow-lg relative" style={{ filter: 'url(#handdrawn)' }}>
            
            {/* Ruled lines pattern inside form */}
            <div className="absolute inset-0 opacity-[0.15] pointer-events-none rounded-3xl" 
              style={{
                backgroundImage: 'linear-gradient(#000 1px, transparent 1px)',
                backgroundSize: '100% 24px',
                backgroundPosition: '0 10px'
              }}
            />

            <div className="relative z-10 space-y-6">
              <div className="text-center pb-4 border-b border-stone-200">
                <span className="font-handwritten text-2xl text-stone-500 block">
                  [ contact the team ]
                </span>
                <h3 className="text-2xl font-serif-book font-extrabold text-stone-900 tracking-tight mt-1">
                  Send a Message
                </h3>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); alert("✅ Message received! We will respond shortly."); }} className="space-y-4 font-serif-book">
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold text-stone-500 uppercase tracking-widest block">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full bg-stone-50/50 border border-stone-300 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-stone-800 transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold text-stone-500 uppercase tracking-widest block">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    className="w-full bg-stone-50/50 border border-stone-300 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-stone-800 transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold text-stone-500 uppercase tracking-widest block">
                    Your Message
                  </label>
                  <textarea
                    rows="4"
                    required
                    className="w-full bg-stone-50/50 border border-stone-300 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-stone-800 transition-colors resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-stone-850 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl hover:bg-stone-950 transition-colors flex items-center justify-center gap-2"
                >
                  <FiSend className="w-3.5 h-3.5" />
                  <span>Send Message</span>
                </button>
              </form>
            </div>

          </div>

        </div>
      </section>

      {/* Cozy Footer Section */}
      <footer className="relative py-16 border-t border-stone-200/60 bg-[#FAF9F6] text-stone-600">
        <div className="max-w-6xl mx-auto px-4 z-10 relative">
          
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 border-b border-stone-200 pb-10 mb-8">
            <div className="text-center md:text-left space-y-2">
              <span className="text-xl font-serif-book font-extrabold text-stone-900">
                Aspirant
              </span>
              <p className="font-handwritten text-stone-450 text-sm italic block max-w-xs">
                "Live as if you were to die tomorrow. Learn as if you were to live forever."
              </p>
            </div>

            {/* Footer Navigation links */}
            <div className="flex flex-wrap gap-8 text-xs font-bold uppercase tracking-wider text-stone-500">
              <Link to="/product" className="hover:text-stone-900 transition-colors">Product</Link>
              <Link to="/explore" className="hover:text-stone-900 transition-colors">Explore</Link>
              <Link to="/docs" className="hover:text-stone-900 transition-colors">Docs</Link>
              <Link to="/about" className="hover:text-stone-900 transition-colors">About</Link>
              <Link to="/contact" className="hover:text-stone-900 transition-colors">Contact</Link>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-serif-book text-stone-400">
            <p>© {new Date().getFullYear()} Aspirant study system. All rights reserved.</p>
            
            {/* Tiny sleeping cat & coffee doodles at the bottom */}
            <div className="flex items-center gap-3 text-lg select-none">
              <span title="Sleeping cat">🐱</span>
              <span title="Warm tea">🍵</span>
              <span title="Study moon">🌙</span>
              <span title="Goal stars">⭐</span>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}
