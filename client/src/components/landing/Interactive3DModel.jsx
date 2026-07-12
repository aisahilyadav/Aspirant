import React, { useState, useEffect, useRef } from 'react';
import { FiSave, FiFileText, FiTrash2, FiCircle } from 'react-icons/fi';

export default function Interactive3DModel() {
  const [text, setText] = useState('');
  const [textColor, setTextColor] = useState('purple'); // 'green', 'blue', or 'purple'
  const [isAutoTyping, setIsAutoTyping] = useState(true);
  const textareaRef = useRef(null);
  const charIndexRef = useRef(0);

  const defaultText = `> ACCESSING ASPIRANT STUDY OS...
> INITIALIZING AI ACTIVE RECALL ENGINE...
> Topic: Quantum Physics & Mechanics

1. Wave-Particle Duality
   - Light exhibits properties of both waves and particles.
   - De Broglie wavelength: λ = h / p.

2. Schrödinger Equation
   - Describes how the quantum state of a physical system changes with time.
   - Hψ = Eψ (Time-independent equation).

3. Heisenberg Uncertainty Principle
   - It is impossible to assert with absolute precision both the position and momentum of a particle.
   - Δx * Δp >= h_bar / 2.

> NOTE: Click anywhere in this window to type and edit your own study notes!
`;

  // Auto-typing character stream
  useEffect(() => {
    if (!isAutoTyping) return;

    const interval = setInterval(() => {
      if (charIndexRef.current < defaultText.length) {
        const nextChar = defaultText[charIndexRef.current];
        setText(prev => prev + nextChar);
        charIndexRef.current += 1;

        // Auto-scroll textarea to bottom during typing
        if (textareaRef.current) {
          textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
        }
      } else {
        setIsAutoTyping(false);
        clearInterval(interval);
      }
    }, 25);

    return () => clearInterval(interval);
  }, [isAutoTyping]);

  const handleTextChange = (e) => {
    setIsAutoTyping(false); // Pause auto-typing instantly on user keystroke
    setText(e.target.value);
  };

  const clearNotepad = () => {
    setIsAutoTyping(false);
    setText('');
    charIndexRef.current = 0;
  };

  const resetNotepad = () => {
    setText('');
    charIndexRef.current = 0;
    setIsAutoTyping(true);
  };

  // Color mappings
  const colorClasses = {
    green: 'text-[#22c55e] caret-[#22c55e] border-[#22c55e]/20 focus:border-[#22c55e]/60 selection:bg-[#22c55e]/20',
    blue: 'text-[#60a5fa] caret-[#60a5fa] border-[#60a5fa]/20 focus:border-[#60a5fa]/60 selection:bg-[#60a5fa]/20',
    purple: 'text-[#c084fc] caret-[#c084fc] border-[#c084fc]/20 focus:border-[#c084fc]/60 selection:bg-[#c084fc]/20'
  };

  const glowShadows = {
    green: 'shadow-[6px_6px_0px_0px_#22c55e]',
    blue: 'shadow-[6px_6px_0px_0px_#60a5fa]',
    purple: 'shadow-[6px_6px_0px_0px_#bd00ff]'
  };

  return (
    <div 
      className={`w-full bg-[#0C0A10] border-2 border-stone-900 rounded-2xl p-4 transition-all duration-300 ${glowShadows[textColor]} flex flex-col h-[340px]`}
    >
      {/* macOS Window Titlebar */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3 select-none text-xs">
        
        {/* Left: Window controls */}
        <div className="flex items-center space-x-1.5">
          <div onClick={clearNotepad} className="w-3 h-3 rounded-full bg-[#FF6B6B] border border-stone-950 flex items-center justify-center cursor-pointer hover:opacity-80" title="Clear notes" />
          <div onClick={resetNotepad} className="w-3 h-3 rounded-full bg-[#FFD93D] border border-stone-950 flex items-center justify-center cursor-pointer hover:opacity-80" title="Reset typing" />
          <div className="w-3 h-3 rounded-full bg-[#6BCB77] border border-stone-950" />
        </div>

        {/* Center: File Tab Info */}
        <div className="flex items-center gap-1.5 text-stone-400 font-mono text-[10px] font-bold">
          <FiFileText className="w-3.5 h-3.5 text-[#bd00ff]" />
          <span>study_notes.txt</span>
          {isAutoTyping && <span className="animate-pulse text-[#22c55e] text-[8px] font-mono">[ typing... ]</span>}
        </div>

        {/* Right: Popper Color Toggles */}
        <div className="flex items-center gap-1.5 bg-stone-900 border border-white/5 rounded-lg p-1">
          <button 
            onClick={() => setTextColor('green')}
            className={`w-3.5 h-3.5 rounded-full bg-[#22c55e] border transition-all ${
              textColor === 'green' ? 'scale-125 border-white ring-2 ring-stone-950' : 'opacity-65 hover:opacity-100'
            }`}
            title="Green ink"
          />
          <button 
            onClick={() => setTextColor('blue')}
            className={`w-3.5 h-3.5 rounded-full bg-[#60a5fa] border transition-all ${
              textColor === 'blue' ? 'scale-125 border-white ring-2 ring-stone-950' : 'opacity-65 hover:opacity-100'
            }`}
            title="Blue ink"
          />
          <button 
            onClick={() => setTextColor('purple')}
            className={`w-3.5 h-3.5 rounded-full bg-[#c084fc] border transition-all ${
              textColor === 'purple' ? 'scale-125 border-white ring-2 ring-stone-950' : 'opacity-65 hover:opacity-100'
            }`}
            title="Purple ink"
          />
        </div>
      </div>

      {/* Code Editor TextArea */}
      <div className="flex-1 w-full relative">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleTextChange}
          placeholder="Start typing your notes here..."
          className={`w-full h-full bg-[#050408] border rounded-xl p-4 font-mono text-xs sm:text-sm font-bold leading-relaxed focus:outline-none transition-all resize-none overflow-y-auto scrollbar-thin ${colorClasses[textColor]}`}
        />
        
        {/* Helper bottom hint overlay */}
        <div className="absolute bottom-2 right-4 text-[8px] font-mono font-bold text-stone-500 bg-stone-900/80 border border-white/5 px-2 py-0.5 rounded select-none pointer-events-none">
          CTRL+A to edit all
        </div>
      </div>

    </div>
  );
}
