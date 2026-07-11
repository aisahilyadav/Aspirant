import React, { useRef, useEffect, useState } from 'react';

export default function Interactive3DModel() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0, isDown: false, startX: 0, startY: 0 });
  const rotationRef = useRef({ x: -0.3, y: 0.5, targetX: -0.3, targetY: 0.5 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = canvas.width;
    let height = canvas.height;

    // Resize canvas to match display size and account for high-DPI screens
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

    // Define 3D points for an open book
    const bookWidth = 130;
    const bookHeight = 170;
    const pageCurve = 25; // Depth of curvature
    const thickness = 12; // Cover thickness/back pages

    // Generate page surface curves (left and right page)
    const getPagePoints = (side, progressY, zOffset = 0) => {
      const points = [];
      const steps = 10;
      const h = (progressY - 0.5) * bookHeight;
      
      for (let i = 0; i <= steps; i++) {
        const t = i / steps; // 0 to 1
        const w = side === 'left' ? -t * bookWidth : t * bookWidth;
        // Curve shape: sin curve for page arc
        const curveZ = Math.sin(t * Math.PI * 0.5) * pageCurve + zOffset;
        points.push({ x: w, y: h, z: curveZ });
      }
      return points;
    };

    // Particles system
    const particles = [];
    const numParticles = 45;
    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: (Math.random() - 0.5) * 400,
        y: (Math.random() - 0.5) * 400,
        z: (Math.random() - 0.5) * 400,
        size: Math.random() * 2 + 1.5,
        speed: Math.random() * 0.02 + 0.005,
        angle: Math.random() * Math.PI * 2,
        color: i % 3 === 0 ? '#2C5EFA' : i % 3 === 1 ? '#F26430' : '#F8C537'
      });
    }

    // Main 3D projection & rendering loop
    const render = (time) => {
      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      // Smoothly update rotation values towards targets (lerp)
      const mouse = mouseRef.current;
      const rot = rotationRef.current;

      if (!mouse.isDown) {
        // Auto rotate slightly over time if user is not actively dragging
        rot.targetY += 0.003;
        
        // Add cursor hover response
        if (isHovered) {
          rot.targetY = 0.5 + (mouse.x / width) * 0.8;
          rot.targetX = -0.3 + (mouse.y / height) * 0.8;
        } else {
          // Return to home angle slowly
          rot.targetX += (-0.3 - rot.targetX) * 0.05;
        }
      }

      rot.x += (rot.targetX - rot.x) * 0.1;
      rot.y += (rot.targetY - rot.y) * 0.1;

      // Projection parameters
      const fov = 350; // Camera perspective distance
      const cx = width / 2;
      const cy = height / 2;

      // Rotation matrix values
      const cosX = Math.cos(rot.x);
      const sinX = Math.sin(rot.x);
      const cosY = Math.cos(rot.y);
      const sinY = Math.sin(rot.y);

      // Project 3D point to 2D screen coordinates
      const project = (pt) => {
        // Rotate around Y axis
        let x1 = pt.x * cosY - pt.z * sinY;
        let z1 = pt.x * sinY + pt.z * cosY;
        
        // Rotate around X axis
        let y2 = pt.y * cosX - z1 * sinX;
        let z2 = pt.y * sinX + z1 * cosX;

        // Apply perspective projection offset (push into screen)
        const depthOffset = z2 + 380; 
        const scale = fov / depthOffset;
        
        return {
          x: x1 * scale + cx,
          y: y2 * scale + cy,
          depth: depthOffset
        };
      };

      // Draw Grid / Particles in background (depth sorted)
      particles.forEach((p) => {
        // Orbit motion
        p.angle += p.speed;
        p.x += Math.sin(p.angle) * 0.2;
        p.y += Math.cos(p.angle) * 0.2;

        // Drift towards mouse pointer if hovering
        if (isHovered) {
          const targetX = (mouse.x - cx) * 0.8;
          const targetY = (mouse.y - cy) * 0.8;
          p.x += (targetX - p.x) * 0.02;
          p.y += (targetY - p.y) * 0.02;
        }

        const screenPt = project(p);

        // Render particle
        ctx.beginPath();
        ctx.arc(screenPt.x, screenPt.y, p.size * (fov / screenPt.depth), 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.shadowBlur = 0; // Reset shadow
      });

      // Assemble all book curves
      const draw3DCurve = (points, strokeStyle, lineWidth = 2) => {
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

      // Draw thick neo-brutalist spine backing / cover edges
      const spineCoverPts = [
        { x: 0, y: -bookHeight/2 - 4, z: -thickness },
        { x: 0, y: bookHeight/2 + 4, z: -thickness }
      ];
      draw3DCurve(spineCoverPts, '#1c1917', 5);

      // Book cover (Left cover & Right cover backing)
      const drawCover = () => {
        const coverL = [
          { x: -bookWidth - 4, y: -bookHeight/2 - 4, z: pageCurve - 2 },
          { x: 0, y: -bookHeight/2 - 4, z: -2 },
          { x: 0, y: bookHeight/2 + 4, z: -2 },
          { x: -bookWidth - 4, y: bookHeight/2 + 4, z: pageCurve - 2 }
        ];
        const coverR = [
          { x: 0, y: -bookHeight/2 - 4, z: -2 },
          { x: bookWidth + 4, y: -bookHeight/2 - 4, z: pageCurve - 2 },
          { x: bookWidth + 4, y: bookHeight/2 + 4, z: pageCurve - 2 },
          { x: 0, y: bookHeight/2 + 4, z: -2 }
        ];

        // Draw cover fills with thick outlines
        const drawPolygon = (pts, fillStyle) => {
          ctx.beginPath();
          const p0 = project(pts[0]);
          ctx.moveTo(p0.x, p0.y);
          for (let i = 1; i < pts.length; i++) {
            const p = project(pts[i]);
            ctx.lineTo(p.x, p.y);
          }
          ctx.closePath();
          ctx.fillStyle = fillStyle;
          ctx.fill();
          ctx.strokeStyle = '#1c1917';
          ctx.lineWidth = 3;
          ctx.stroke();
        };

        drawPolygon(coverL, '#F26430'); // Orange Left cover backing
        drawPolygon(coverR, '#2C5EFA'); // Blue Right cover backing
      };

      drawCover();

      // Render book base pages layers (thickness simulation)
      for (let zOffset = -6; zOffset <= 0; zOffset += 3) {
        const color = zOffset === 0 ? '#FFFFFF' : '#E5E5E7';
        // Left Page Base
        const topL = getPagePoints('left', 0, zOffset);
        const bottomL = getPagePoints('left', 1, zOffset);
        
        // Draw page sheet polygon
        ctx.beginPath();
        const pStartL = project(topL[0]);
        ctx.moveTo(pStartL.x, pStartL.y);
        for (let i = 1; i < topL.length; i++) {
          const p = project(topL[i]);
          ctx.lineTo(p.x, p.y);
        }
        for (let i = bottomL.length - 1; i >= 0; i--) {
          const p = project(bottomL[i]);
          ctx.lineTo(p.x, p.y);
        }
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();
        ctx.strokeStyle = '#1c1917';
        ctx.lineWidth = zOffset === 0 ? 3 : 1;
        ctx.stroke();

        // Right Page Base
        const topR = getPagePoints('right', 0, zOffset);
        const bottomR = getPagePoints('right', 1, zOffset);
        
        ctx.beginPath();
        const pStartR = project(topR[0]);
        ctx.moveTo(pStartR.x, pStartR.y);
        for (let i = 1; i < topR.length; i++) {
          const p = project(topR[i]);
          ctx.lineTo(p.x, p.y);
        }
        for (let i = bottomR.length - 1; i >= 0; i--) {
          const p = project(bottomR[i]);
          ctx.lineTo(p.x, p.y);
        }
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();
        ctx.strokeStyle = '#1c1917';
        ctx.lineWidth = zOffset === 0 ? 3 : 1;
        ctx.stroke();
      }

      // Draw central binding seam
      const spinePts = [
        { x: 0, y: -bookHeight/2, z: 0 },
        { x: 0, y: bookHeight/2, z: 0 }
      ];
      draw3DCurve(spinePts, '#1c1917', 2);

      // Render book text lines on top page (zOffset = 0)
      const drawTextLines = () => {
        // Horizontal lines representing lined pages
        for (let y = 0.15; y <= 0.85; y += 0.1) {
          const lineL = getPagePoints('left', y, 0.5);
          const lineR = getPagePoints('right', y, 0.5);

          // Left page study lines
          draw3DCurve(lineL, 'rgba(120, 113, 108, 0.25)', 1.5);
          // Right page study lines
          draw3DCurve(lineR, 'rgba(120, 113, 108, 0.25)', 1.5);
        }

        // Draw some "written text" markings (highlight blocks in yellow/blue)
        // Draw a simulated yellow highlight block on Left Page
        const highlightL1 = getPagePoints('left', 0.35, 1).slice(3, 8);
        draw3DCurve(highlightL1, 'rgba(248, 197, 55, 0.7)', 6);

        // Draw a simulated blue highlight block on Right Page
        const highlightR1 = getPagePoints('right', 0.55, 1).slice(2, 6);
        draw3DCurve(highlightR1, 'rgba(44, 94, 250, 0.4)', 6);

        // Draw some dark scribbles representing notes text
        const scribbleL1 = getPagePoints('left', 0.25, 1).slice(2, 7);
        draw3DCurve(scribbleL1, '#44403c', 2);

        const scribbleL2 = getPagePoints('left', 0.45, 1).slice(1, 5);
        draw3DCurve(scribbleL2, '#44403c', 2);

        const scribbleR1 = getPagePoints('right', 0.35, 1).slice(3, 8);
        draw3DCurve(scribbleR1, '#44403c', 2);

        const scribbleR2 = getPagePoints('right', 0.65, 1).slice(2, 7);
        draw3DCurve(scribbleR2, '#44403c', 2);
      };

      drawTextLines();

      // Bookmark ribbon hanging down
      const bookmarkPts = [
        { x: 0, y: -bookHeight/2 + 20, z: 2 },
        { x: 2, y: 0, z: 8 },
        { x: 10, y: bookHeight/2 + 10, z: 15 },
        { x: 12, y: bookHeight/2 + 35, z: 8 }
      ];
      draw3DCurve(bookmarkPts, '#F26430', 4); // Orange ribbon highlight

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    // Mouse handlers inside local coordinate scope
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      mouseRef.current.x = x;
      mouseRef.current.y = y;

      if (mouseRef.current.isDown) {
        const deltaX = e.clientX - mouseRef.current.startX;
        const deltaY = e.clientY - mouseRef.current.startY;
        rotationRef.current.targetY = rotationRef.current.startY + deltaX * 0.007;
        rotationRef.current.targetX = rotationRef.current.startX - deltaY * 0.007;
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
      {/* Decorative prompt label below canvas */}
      <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[9px] font-mono font-black text-stone-500 uppercase tracking-widest bg-white border border-stone-200 px-2.5 py-1 rounded-md shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] pointer-events-none select-none">
        ← Drag to Spin 3D Journal →
      </span>
    </div>
  );
}
