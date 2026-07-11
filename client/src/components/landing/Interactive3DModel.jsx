import React, { useRef, useEffect, useState } from 'react';

export default function Interactive3DModel() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0, isDown: false, startX: 0, startY: 0 });
  const rotationRef = useRef({ x: -0.2, y: 0.5, targetX: -0.2, targetY: 0.5 });

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

    // Particle system (floating study bubbles / thoughts)
    const particles = [];
    const numParticles = 35;
    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: (Math.random() - 0.5) * 350,
        y: (Math.random() - 0.5) * 350,
        z: (Math.random() - 0.5) * 350,
        size: Math.random() * 2 + 1,
        speed: Math.random() * 0.015 + 0.005,
        angle: Math.random() * Math.PI * 2,
        color: i % 2 === 0 ? '#F26430' : '#F8C537' // Orange / Yellow thoughts
      });
    }

    // 3D projection parameters
    const fov = 350;
    const cx = () => width / 2;
    const cy = () => height / 2 - 10; // Slightly adjust vertical center

    // Render loop
    const render = (time) => {
      ctx.clearRect(0, 0, width, height);

      // Lerp mouse and rotation inputs
      const mouse = mouseRef.current;
      const rot = rotationRef.current;

      if (!mouse.isDown) {
        rot.targetY += 0.003;
        if (isHovered) {
          rot.targetY = 0.5 + (mouse.x / width) * 0.8;
          rot.targetX = -0.2 + (mouse.y / height) * 0.8;
        } else {
          rot.targetX += (-0.2 - rot.targetX) * 0.05;
        }
      }

      rot.x += (rot.targetX - rot.x) * 0.1;
      rot.y += (rot.targetY - rot.y) * 0.1;

      const cosX = Math.cos(rot.x);
      const sinX = Math.sin(rot.x);
      const cosY = Math.cos(rot.y);
      const sinY = Math.sin(rot.y);

      const project = (pt) => {
        // Rotate around Y axis
        let x1 = pt.x * cosY - pt.z * sinY;
        let z1 = pt.x * sinY + pt.z * cosY;

        // Rotate around X axis
        let y2 = pt.y * cosX - z1 * sinX;
        let z2 = pt.y * sinX + z1 * cosX;

        const depthOffset = z2 + 380;
        const scale = fov / depthOffset;

        return {
          x: x1 * scale + cx(),
          y: y2 * scale + cy(),
          depth: depthOffset
        };
      };

      const draw3DCurve = (points, strokeStyle, lineWidth = 2) => {
        if (points.length < 2) return;
        ctx.beginPath();
        const start = project(points[0]);
        ctx.moveTo(start.x, start.y);
        for (let i = 1; i < points.length; i++) {
          const pt = project(points[i]);
          ctx.lineTo(pt.x, pt.y);
        }
        ctx.strokeStyle = strokeStyle;
        ctx.lineWidth = lineWidth;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();
      };

      // Draw floating thoughts
      particles.forEach((p) => {
        p.angle += p.speed;
        p.x += Math.sin(p.angle) * 0.15;
        p.y += Math.cos(p.angle) * 0.15;

        if (isHovered) {
          const targetX = (mouse.x - cx()) * 0.7;
          const targetY = (mouse.y - cy()) * 0.7;
          p.x += (targetX - p.x) * 0.015;
          p.y += (targetY - p.y) * 0.015;
        }

        const s = project(p);
        ctx.beginPath();
        ctx.arc(s.x, s.y, p.size * (fov / s.depth), 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      });

      // --- MODEL GEOMETRY: BRAIN WITH LIMBS ---

      // A. Brain Hemispheres (Left & Right Folds)
      const renderBrainLobe = (sideOffset, color, longLines = 6, latRings = 6) => {
        // center of sphere is sideOffset, radius is 32
        const radius = 32;
        const center = { x: sideOffset, y: -25, z: 0 };

        // Generate latitudinal rings (convolutions / ripples)
        for (let i = 1; i < latRings; i++) {
          const lat = (i / latRings) * Math.PI;
          const ringPts = [];
          const segments = 20;
          
          for (let j = 0; j <= segments; j++) {
            const theta = (j / segments) * Math.PI * 2;
            
            // Add sinusoidal ripples representing brain fold convolutions
            const foldOffset = Math.sin(theta * 5.5 + lat * 2.5) * 3.5;
            
            const r = Math.sin(lat) * radius + foldOffset;
            const y = Math.cos(lat) * radius;

            ringPts.push({
              x: center.x + Math.cos(theta) * r,
              y: center.y + y,
              z: center.z + Math.sin(theta) * r
            });
          }
          draw3DCurve(ringPts, color, 1.2);
        }

        // Generate longitudinal ribs
        for (let j = 0; j < longLines; j++) {
          const theta = (j / longLines) * Math.PI * 2;
          const ribPts = [];
          const segments = 16;

          for (let i = 0; i <= segments; i++) {
            const lat = (i / segments) * Math.PI;
            
            const foldOffset = Math.sin(theta * 4.5 + lat * 3.0) * 3.0;
            const r = Math.sin(lat) * radius + foldOffset;
            const y = Math.cos(lat) * radius;

            ribPts.push({
              x: center.x + Math.cos(theta) * r,
              y: center.y + y,
              z: center.z + Math.sin(theta) * r
            });
          }
          draw3DCurve(ribPts, color, 0.8);
        }
      };

      // Draw Left Lobe (Burnt Orange) and Right Lobe (Warm Yellow)
      renderBrainLobe(-14, '#F26430', 5, 5);
      renderBrainLobe(14, '#F8C537', 5, 5);

      // B. Study Desk page (Under the brain)
      const deskY = 55;
      const pagePts = [
        { x: -50, y: deskY, z: -35 },
        { x: 50, y: deskY, z: -35 },
        { x: 55, y: deskY + 5, z: 45 },
        { x: -45, y: deskY + 5, z: 45 }
      ];

      // Draw paper sheet outline
      ctx.beginPath();
      const pStart = project(pagePts[0]);
      ctx.moveTo(pStart.x, pStart.y);
      pagePts.forEach(pt => {
        const s = project(pt);
        ctx.lineTo(s.x, s.y);
      });
      ctx.closePath();
      ctx.fillStyle = '#FAF9F6'; // off white sheet
      ctx.fill();
      ctx.strokeStyle = '#1c1917';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Draw writing lines on sheet
      for (let z = -20; z <= 30; z += 12) {
        drawLineOnPage(z, 'rgba(120, 113, 108, 0.25)', 1.5);
      }
      // Highlight orange line
      drawLineOnPage(10, 'rgba(242, 100, 48, 0.45)', 4.5);

      function drawLineOnPage(zVal, color, weight) {
        const p1 = { x: -35, y: deskY + 1, z: zVal };
        const p2 = { x: 35, y: deskY + 1, z: zVal };
        draw3DCurve([p1, p2], color, weight);
      }

      // C. Stick Legs (standing on the desk)
      // Left leg
      const legL = [
        { x: -14, y: -2, z: 0 },         // Hip
        { x: -18, y: 25, z: 12 },        // Knee
        { x: -16, y: deskY + 1, z: 10 }  // Foot
      ];
      draw3DCurve(legL, '#FAF9F6', 3.5);

      // Right leg
      const legR = [
        { x: 14, y: -2, z: 0 },          // Hip
        { x: 18, y: 25, z: 12 },         // Knee
        { x: 22, y: deskY + 1, z: 10 }   // Foot
      ];
      draw3DCurve(legR, '#FAF9F6', 3.5);

      // D. Arms (left arm holding page, right arm writing notes)
      // Left arm (relaxed, holding paper edge)
      const armL = [
        { x: -36, y: -20, z: -5 },       // Shoulder
        { x: -44, y: 15, z: 10 },        // Elbow
        { x: -38, y: deskY - 2, z: 20 }  // Hand
      ];
      draw3DCurve(armL, '#FAF9F6', 2.8);

      // Right arm (holding pencil, wiggling / writing)
      // Wiggle offset over time to simulate active writing
      const writeWiggleX = Math.sin(time * 0.015) * 8;
      const writeWiggleZ = Math.cos(time * 0.015) * 5;

      const armR = [
        { x: 36, y: -20, z: -5 },        // Shoulder
        { x: 44, y: 12, z: 10 },         // Elbow
        { x: 10 + writeWiggleX, y: deskY - 8, z: 15 + writeWiggleZ } // Writing hand position
      ];
      draw3DCurve(armR, '#FAF9F6', 2.8);

      // Pencil (held by writing hand)
      const handPt = armR[2];
      const pencilTip = { x: handPt.x - 3, y: deskY + 1, z: handPt.z + 5 };
      const pencilBack = { x: handPt.x + 12, y: handPt.y - 15, z: handPt.z - 10 };
      draw3DCurve([pencilTip, pencilBack], '#FAF9F6', 3.2); // White pencil holder
      draw3DCurve([pencilTip, { x: handPt.x - 1, y: handPt.y + 4, z: handPt.z + 2 }], '#F26430', 3.2); // Burnt orange lead tip

      animationFrameId = requestAnimationFrame(render);
    };

    render(0);

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      mouseRef.current.x = x;
      mouseRef.current.y = y;

      if (mouseRef.current.isDown) {
        const deltaX = e.clientX - mouseRef.current.startX;
        const deltaY = e.clientY - mouseRef.current.startY;
        rotationRef.current.targetY = rotationRef.current.startY + deltaX * 0.008;
        rotationRef.current.targetX = rotationRef.current.startX - deltaY * 0.008;
      }
    };

    const handleMouseDown = (e) => {
      mouseRef.current.isDown = true;
      mouseRef.current.startX = e.clientX;
      mouseRef.current.startY = e.clientY;
      rotationRef.current.startX = rotationRef.current.targetY;
      rotationRef.current.startY = rotationRef.current.targetX;
    };

    const handleMouseUp = () => {
      mouseRef.current.isDown = false;
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isHovered]);

  return (
    <div 
      ref={containerRef} 
      className="relative w-full h-[320px] sm:h-[400px] flex items-center justify-center cursor-grab active:cursor-grabbing"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <canvas 
        ref={canvasRef} 
        className="block select-none"
      />
      <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[9px] font-mono font-black text-stone-400 uppercase tracking-widest bg-stone-850 border border-stone-750 px-2.5 py-1 rounded-md shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] pointer-events-none select-none">
        ← Drag to Orbit Brain mascot →
      </span>
    </div>
  );
}
