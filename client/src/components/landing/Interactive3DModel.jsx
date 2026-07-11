import React, { useRef, useEffect, useState } from 'react';
import { FiEdit3, FiRefreshCw, FiMove, FiTrash2 } from 'react-icons/fi';

export default function Interactive3DModel() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [mode, setMode] = useState('draw'); // 'draw' or 'rotate'
  const [activeColor, setActiveColor] = useState('#F26430'); // Orange default
  const [isHovered, setIsHovered] = useState(false);

  const strokesRef = useRef([]); // holds array of strokes: { points: [{x, z}], color }
  const currentStrokeRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0, isDown: false, startX: 0, startY: 0 });
  
  // Angle references
  const rotationRef = useRef({ x: -0.4, y: 0.3, targetX: -0.4, targetY: 0.3 });

  const colors = [
    { value: '#F26430', name: 'Orange' },
    { value: '#F8C537', name: 'Yellow' },
    { value: '#A9C5A0', name: 'Green' },
    { value: '#1c1917', name: 'Charcoal' }
  ];

  const clearDrawings = () => {
    strokesRef.current = [];
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = canvas.width;
    let height = canvas.height;

    const resize = () => {
      const rect = containerRef.current?.getBoundingClientRect() || { width: 400, height: 350 };
      const dpr = window.devicePixelRatio || 1;
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener('resize', resize);

    // 3D projection variables
    const fov = 380;
    const cx = () => width / 2;
    const cy = () => height / 2;
    const pageY = 15; // notepad flat height offset

    // Particle system
    const particles = [];
    for (let i = 0; i < 20; i++) {
      particles.push({
        x: (Math.random() - 0.5) * 350,
        y: (Math.random() - 0.5) * 350,
        z: (Math.random() - 0.5) * 350,
        size: Math.random() * 1.5 + 1,
        speed: Math.random() * 0.01 + 0.002,
        angle: Math.random() * Math.PI * 2
      });
    }

    // Solver to map 2D mouse to 3D page coords (px, pz)
    const get3DPageCoord = (mx, my, rotX, rotY) => {
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);
      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);

      const projectPoint = (px, pz) => {
        let x1 = px * cosY - pz * sinY;
        let z1 = px * sinY + pz * cosY;
        let y2 = pageY * cosX - z1 * sinX;
        let z2 = pageY * sinX + z1 * cosX;
        const depth = z2 + 380;
        const scale = fov / depth;
        return { x: x1 * scale + cx(), y: y2 * scale + cy() };
      };

      let bestX = 0;
      let bestZ = 0;
      let minDist = Infinity;

      // Scan page mesh bounding coordinates to locate closest projection
      for (let px = -80; px <= 80; px += 2.5) {
        for (let pz = -60; pz <= 60; pz += 2.5) {
          const s = projectPoint(px, pz);
          const dist = Math.hypot(s.x - mx, s.y - my);
          if (dist < minDist) {
            minDist = dist;
            bestX = px;
            bestZ = pz;
          }
        }
      }
      return { x: bestX, z: bestZ };
    };

    // Render loop
    const render = (time) => {
      ctx.clearRect(0, 0, width, height);

      const rot = rotationRef.current;
      const mouse = mouseRef.current;

      // Auto-orbit gently if rotating mode is not dragging
      if (mode === 'rotate' && !mouse.isDown) {
        rot.targetY += 0.003;
      }

      // Smooth lerp angles
      rot.x += (rot.targetX - rot.x) * 0.1;
      rot.y += (rot.targetY - rot.y) * 0.1;

      const cosX = Math.cos(rot.x);
      const sinX = Math.sin(rot.x);
      const cosY = Math.cos(rot.y);
      const sinY = Math.sin(rot.y);

      const project = (pt) => {
        let x1 = pt.x * cosY - pt.z * sinY;
        let z1 = pt.x * sinY + pt.z * cosY;
        let y2 = pt.y * cosX - z1 * sinX;
        let z2 = pt.y * sinX + z1 * cosX;
        const depth = z2 + 380;
        const scale = fov / depth;
        return {
          x: x1 * scale + cx(),
          y: y2 * scale + cy(),
          depth
        };
      };

      const draw3DLine = (p1, p2, color, weight = 2) => {
        const s1 = project(p1);
        const s2 = project(p2);
        ctx.beginPath();
        ctx.moveTo(s1.x, s1.y);
        ctx.lineTo(s2.x, s2.y);
        ctx.strokeStyle = color;
        ctx.lineWidth = weight;
        ctx.lineCap = 'round';
        ctx.stroke();
      };

      // Draw background particles
      particles.forEach(p => {
        p.angle += p.speed;
        p.x += Math.sin(p.angle) * 0.1;
        p.y += Math.cos(p.angle) * 0.1;
        const s = project(p);
        ctx.beginPath();
        ctx.arc(s.x, s.y, p.size * (fov / s.depth), 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(250, 249, 246, 0.15)';
        ctx.fill();
      });

      // --- 3D SPIRAL NOTEBOOK ASSEMBLY (SCALED UP BY ~45%) ---

      // 1. Back Cover Shadow Layer (tilted card board)
      const coverY = pageY + 6;
      const coverPts = [
        { x: -84, y: coverY, z: -64 },
        { x: 84, y: coverY, z: -64 },
        { x: 84, y: coverY, z: 64 },
        { x: -84, y: coverY, z: 64 }
      ];

      ctx.beginPath();
      const cStart = project(coverPts[0]);
      ctx.moveTo(cStart.x, cStart.y);
      coverPts.forEach(pt => {
        const s = project(pt);
        ctx.lineTo(s.x, s.y);
      });
      ctx.closePath();
      ctx.fillStyle = '#1c1917'; // warm dark back board
      ctx.fill();
      ctx.strokeStyle = '#FAF9F6';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // 2. Paper Stack Layers (to represent thickness)
      for (let stackY = pageY + 4; stackY >= pageY; stackY -= 2) {
        const stackPts = [
          { x: -80, y: stackY, z: -60 },
          { x: 80, y: stackY, z: -60 },
          { x: 80, y: stackY, z: 60 },
          { x: -80, y: stackY, z: 60 }
        ];

        ctx.beginPath();
        const sStart = project(stackPts[0]);
        ctx.moveTo(sStart.x, sStart.y);
        stackPts.forEach(pt => {
          const s = project(pt);
          ctx.lineTo(s.x, s.y);
        });
        ctx.closePath();
        ctx.fillStyle = stackY === pageY ? '#FAF9F6' : '#e6e4dc'; // cream/stone sheets
        ctx.fill();
        ctx.strokeStyle = '#1c1917';
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // 3. Middle binder seam line
      draw3DLine({ x: 0, y: pageY - 0.5, z: -60 }, { x: 0, y: pageY - 0.5, z: 60 }, 'rgba(28, 25, 23, 0.25)', 1.5);

      // 4. Notebook Spiral Binder Rings
      for (let zRing = -50; zRing <= 50; zRing += 10) {
        const ringPts = [];
        // Draw circular rings looping from left page to right page
        for (let a = 0; a <= Math.PI; a += 0.3) {
          const rad = 8;
          const yOffset = Math.sin(a) * -rad;
          const xOffset = Math.cos(a) * rad;
          ringPts.push({ x: xOffset, y: pageY - 1 + yOffset, z: zRing });
        }
        ctx.beginPath();
        const rStart = project(ringPts[0]);
        ctx.moveTo(rStart.x, rStart.y);
        ringPts.forEach(pt => {
          const s = project(pt);
          ctx.lineTo(s.x, s.y);
        });
        ctx.strokeStyle = '#F26430'; // orange spiral binder rings
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // --- RENDERING SCRIBLES / DRAWINGS ---
      const allStrokes = [...strokesRef.current];
      if (currentStrokeRef.current) {
        allStrokes.push(currentStrokeRef.current);
      }

      allStrokes.forEach(stroke => {
        if (stroke.points.length < 2) return;
        ctx.beginPath();
        const startPt = project({ x: stroke.points[0].x, y: pageY - 0.5, z: stroke.points[0].z });
        ctx.moveTo(startPt.x, startPt.y);
        for (let i = 1; i < stroke.points.length; i++) {
          const pt = project({ x: stroke.points[i].x, y: pageY - 0.5, z: stroke.points[i].z });
          ctx.lineTo(pt.x, pt.y);
        }
        ctx.strokeStyle = stroke.color;
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();
      });

      // --- INTERACTIVE PEN WRITING ---
      let penTip;
      let isPenWriting = false;

      if (mode === 'draw' && (isHovered || mouse.isDown)) {
        // Pen tip matches drawing cursor spot on page
        const p3d = get3DPageCoord(mouse.x, mouse.y, rot.x, rot.y);
        penTip = { x: p3d.x, y: pageY - 1, z: p3d.z };
        isPenWriting = mouse.isDown;
      } else {
        // Ambient pen hover float state
        const floatY = Math.sin(time * 0.015) * 5;
        penTip = { x: 45, y: pageY - 20 + floatY, z: 30 };
      }

      // Pen shaft coordinate
      const penShaft = {
        x: penTip.x + 12,
        y: penTip.y - (isPenWriting ? 28 : 34),
        z: penTip.z - 15
      };

      // Draw Pen body
      draw3DLine(penTip, penShaft, activeColor, 4.5); // Pen color shaft matching ink
      draw3DLine(penShaft, { x: penShaft.x + 4, y: penShaft.y - 10, z: penShaft.z - 5 }, '#1c1917', 4.5); // Black pen cap

      animationFrameId = requestAnimationFrame(render);
    };

    render(0);

    // Mouse handlers
    const handleMouseDown = (e) => {
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      
      mouseRef.current.isDown = true;
      mouseRef.current.startX = e.clientX;
      mouseRef.current.startY = e.clientY;

      if (mode === 'draw') {
        const p3d = get3DPageCoord(mx, my, rotationRef.current.x, rotationRef.current.y);
        // Start a new line stroke
        currentStrokeRef.current = {
          points: [{ x: p3d.x, z: p3d.z }],
          color: activeColor
        };
      } else {
        rotationRef.current.startY = rotationRef.current.targetX;
        rotationRef.current.startX = rotationRef.current.targetY;
      }
    };

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;

      mouseRef.current.x = mx;
      mouseRef.current.y = my;

      if (mouseRef.current.isDown) {
        if (mode === 'draw') {
          if (currentStrokeRef.current) {
            const p3d = get3DPageCoord(mx, my, rotationRef.current.x, rotationRef.current.y);
            // Append coordinate points to active line drawing stroke
            currentStrokeRef.current.points.push({ x: p3d.x, z: p3d.z });
          }
        } else {
          const deltaX = e.clientX - mouseRef.current.startX;
          const deltaY = e.clientY - mouseRef.current.startY;
          rotationRef.current.targetY = rotationRef.current.startX + deltaX * 0.008;
          rotationRef.current.targetX = rotationRef.current.startY - deltaY * 0.008;
        }
      }
    };

    const handleMouseUp = () => {
      mouseRef.current.isDown = false;
      if (mode === 'draw' && currentStrokeRef.current) {
        strokesRef.current.push(currentStrokeRef.current);
        currentStrokeRef.current = null;
      }
    };

    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
      canvas.addEventListener('mousedown', handleMouseDown);
      canvas.addEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [mode, activeColor, isHovered]);

  return (
    <div className="flex flex-col w-full h-full">
      {/* 3D Journal Toolbar controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-850 pb-3 mb-2 px-1 text-xs select-none">
        
        {/* Toggle Mode: Write vs Orbit */}
        <div className="flex border-2 border-stone-950 rounded-lg overflow-hidden text-[9px] font-mono font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          <button
            onClick={() => setMode('draw')}
            className={`px-3 py-1.5 flex items-center gap-1.5 transition-colors uppercase ${
              mode === 'draw' ? 'bg-[#F26430] text-white' : 'bg-stone-805 text-stone-400'
            }`}
          >
            <FiEdit3 className="w-3.5 h-3.5" />
            <span>Draw</span>
          </button>
          <button
            onClick={() => setMode('rotate')}
            className={`px-3 py-1.5 flex items-center gap-1.5 transition-colors uppercase border-l-2 border-stone-950 ${
              mode === 'rotate' ? 'bg-[#F8C537] text-stone-950' : 'bg-stone-805 text-stone-400'
            }`}
          >
            <FiMove className="w-3.5 h-3.5" />
            <span>Orbit</span>
          </button>
        </div>

        {/* Ink Colors & Clear Action */}
        <div className="flex items-center gap-2">
          {mode === 'draw' && (
            <div className="flex items-center gap-1 bg-stone-850 border border-stone-800 rounded-lg p-1">
              {colors.map(c => (
                <button
                  key={c.value}
                  onClick={() => setActiveColor(c.value)}
                  className={`w-3.5 h-3.5 rounded-full border border-stone-950 transition-all ${
                    activeColor === c.value ? 'scale-125 border-white ring-2 ring-stone-950' : 'opacity-70 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: c.value }}
                  title={c.name}
                />
              ))}
            </div>
          )}

          <button
            onClick={clearDrawings}
            className="p-1.5 bg-[#FAF9F6] border-2 border-stone-950 text-stone-950 rounded-lg hover:translate-x-[-1px] hover:translate-y-[-1px] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all flex items-center justify-center"
            title="Clear board drawings"
          >
            <FiTrash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Canvas Canvas Frame */}
      <div 
        ref={containerRef}
        className="relative w-full h-[280px] sm:h-[350px] flex items-center justify-center overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <canvas ref={canvasRef} className="block select-none" />
        <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[8px] font-mono font-bold text-stone-500 uppercase tracking-wider pointer-events-none select-none bg-stone-950 border border-stone-850 px-2 py-0.5 rounded">
          {mode === 'draw' ? 'Drag on page to write/draw with pen' : 'Drag to rotate notebook in 3D'}
        </span>
      </div>
    </div>
  );
}
