import React, { useRef, useEffect, useState } from 'react';

export default function Features3DModel({ activeTab }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0, isDown: false, startX: 0, startY: 0 });
  const rotationRef = useRef({ x: -0.2, y: 0.6, targetX: -0.2, targetY: 0.6 });

  // Transition state to handle morphing/fading between models
  const prevTabRef = useRef(activeTab);
  const transitionRef = useRef(1.0); // 0 = old tab, 1 = new tab

  useEffect(() => {
    if (activeTab !== prevTabRef.current) {
      // Start fade transition
      transitionRef.current = 0.0;
    }
  }, [activeTab]);

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

    // Particle system (flame & ambient)
    const particles = [];
    const numParticles = 40;
    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: (Math.random() - 0.5) * 180,
        y: (Math.random() - 0.5) * 180,
        z: (Math.random() - 0.5) * 180,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        vz: (Math.random() - 0.5) * 0.8,
        size: Math.random() * 2 + 1,
        color: i % 2 === 0 ? '#F26430' : '#F8C537'
      });
    }

    // 3D projection utilities
    const fov = 300;
    const cx = () => width / 2;
    const cy = () => height / 2;

    const project = (pt, rotX, rotY) => {
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);
      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);

      // Rotate Y
      let x1 = pt.x * cosY - pt.z * sinY;
      let z1 = pt.x * sinY + pt.z * cosY;
      
      // Rotate X
      let y2 = pt.y * cosX - z1 * sinX;
      let z2 = pt.y * sinX + z1 * cosX;

      const depth = z2 + 300;
      const scale = fov / Math.max(10, depth);
      return {
        x: x1 * scale + cx(),
        y: y2 * scale + cy(),
        depth: depth
      };
    };

    const drawLine = (p1, p2, rotX, rotY, style, width = 2) => {
      const s1 = project(p1, rotX, rotY);
      const s2 = project(p2, rotX, rotY);
      ctx.beginPath();
      ctx.moveTo(s1.x, s1.y);
      ctx.lineTo(s2.x, s2.y);
      ctx.strokeStyle = style;
      ctx.lineWidth = width;
      ctx.lineCap = 'round';
      ctx.stroke();
    };

    // --- DRAWING FUNCTIONS FOR SPECIFIC 3D MODELS ---

    // 1. CLIPBOARD QUIZ (Tab 0)
    const drawQuiz = (rotX, rotY, alpha) => {
      const boardW = 60;
      const boardH = 80;
      const z = 0;

      // Board wireframe
      const corners = [
        { x: -boardW, y: -boardH, z },
        { x: boardW, y: -boardH, z },
        { x: boardW, y: boardH, z },
        { x: -boardW, y: boardH, z }
      ];

      // Outline
      ctx.beginPath();
      const start = project(corners[0], rotX, rotY);
      ctx.moveTo(start.x, start.y);
      corners.forEach((pt) => {
        const s = project(pt, rotX, rotY);
        ctx.lineTo(s.x, s.y);
      });
      ctx.closePath();
      ctx.fillStyle = `rgba(255, 255, 255, ${0.9 * alpha})`;
      ctx.fill();
      ctx.strokeStyle = `rgba(28, 25, 23, ${alpha})`;
      ctx.lineWidth = 3;
      ctx.stroke();

      // Clip at top
      const clip = [
        { x: -20, y: -boardH, z: 4 },
        { x: 20, y: -boardH, z: 4 },
        { x: 15, y: -boardH + 12, z: 4 },
        { x: -15, y: -boardH + 12, z: 4 }
      ];
      ctx.beginPath();
      const cs = project(clip[0], rotX, rotY);
      ctx.moveTo(cs.x, cs.y);
      clip.forEach((pt) => {
        const s = project(pt, rotX, rotY);
        ctx.lineTo(s.x, s.y);
      });
      ctx.closePath();
      ctx.fillStyle = `rgba(242, 100, 48, ${alpha})`; // orange clip
      ctx.fill();
      ctx.strokeStyle = `rgba(28, 25, 23, ${alpha})`;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Checkboxes & Lines
      const drawCheckboxAndText = (yOffset, checked) => {
        // Box
        const box = [
          { x: -boardW + 15, y: yOffset - 6, z: 1 },
          { x: -boardW + 27, y: yOffset - 6, z: 1 },
          { x: -boardW + 27, y: yOffset + 6, z: 1 },
          { x: -boardW + 15, y: yOffset + 6, z: 1 }
        ];
        ctx.beginPath();
        const bs = project(box[0], rotX, rotY);
        ctx.moveTo(bs.x, bs.y);
        box.forEach((pt) => {
          const s = project(pt, rotX, rotY);
          ctx.lineTo(s.x, s.y);
        });
        ctx.closePath();
        ctx.strokeStyle = `rgba(28, 25, 23, ${alpha})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        if (checked) {
          // Checkmark
          const p1 = { x: -boardW + 18, y: yOffset + 1, z: 2 };
          const p2 = { x: -boardW + 21, y: yOffset + 4, z: 2 };
          const p3 = { x: -boardW + 25, y: yOffset - 3, z: 2 };
          drawLine(p1, p2, rotX, rotY, `rgba(169, 197, 160, ${alpha})`, 2.5); // green check
          drawLine(p2, p3, rotX, rotY, `rgba(169, 197, 160, ${alpha})`, 2.5);
        }

        // Text lines next to box
        drawLine({ x: -boardW + 35, y: yOffset - 2, z: 1 }, { x: boardW - 15, y: yOffset - 2, z: 1 }, rotX, rotY, `rgba(120, 113, 108, ${0.4 * alpha})`, 2);
        drawLine({ x: -boardW + 35, y: yOffset + 3, z: 1 }, { x: boardW - 35, y: yOffset + 3, z: 1 }, rotX, rotY, `rgba(120, 113, 108, ${0.4 * alpha})`, 2);
      };

      drawCheckboxAndText(-35, true);
      drawCheckboxAndText(-10, false);
      drawCheckboxAndText(15, true);
      drawCheckboxAndText(40, false);
    };

    // 2. OPEN JOURNAL & PENCIL (Tab 1)
    const drawNotes = (rotX, rotY, alpha, wiggle) => {
      const pageW = 55;
      const pageH = 80;
      const angle = 0.25; // page fold angle

      const getL = (y) => ({ x: -Math.cos(angle) * pageW, y, z: Math.sin(angle) * pageW });
      const getC = (y) => ({ x: 0, y, z: 0 });
      const getR = (y) => ({ x: Math.cos(angle) * pageW, y, z: Math.sin(angle) * pageW });

      // Left page
      ctx.beginPath();
      const startL = project(getL(-pageH), rotX, rotY);
      ctx.moveTo(startL.x, startL.y);
      ctx.lineTo(project(getC(-pageH), rotX, rotY).x, project(getC(-pageH), rotX, rotY).y);
      ctx.lineTo(project(getC(pageH), rotX, rotY).x, project(getC(pageH), rotX, rotY).y);
      ctx.lineTo(project(getL(pageH), rotX, rotY).x, project(getL(pageH), rotX, rotY).y);
      ctx.closePath();
      ctx.fillStyle = `rgba(255, 255, 255, ${0.9 * alpha})`;
      ctx.fill();
      ctx.strokeStyle = `rgba(28, 25, 23, ${alpha})`;
      ctx.lineWidth = 3;
      ctx.stroke();

      // Right page
      ctx.beginPath();
      const startR = project(getC(-pageH), rotX, rotY);
      ctx.moveTo(startR.x, startR.y);
      ctx.lineTo(project(getR(-pageH), rotX, rotY).x, project(getR(-pageH), rotX, rotY).y);
      ctx.lineTo(project(getR(pageH), rotX, rotY).x, project(getR(pageH), rotX, rotY).y);
      ctx.lineTo(project(getC(pageH), rotX, rotY).x, project(getC(pageH), rotX, rotY).y);
      ctx.closePath();
      ctx.fillStyle = `rgba(255, 255, 255, ${0.95 * alpha})`;
      ctx.fill();
      ctx.strokeStyle = `rgba(28, 25, 23, ${alpha})`;
      ctx.lineWidth = 3;
      ctx.stroke();

      // Text lines
      for (let y = -pageH + 15; y <= pageH - 15; y += 12) {
        drawLine(getL(y), getC(y), rotX, rotY, `rgba(120, 113, 108, ${0.3 * alpha})`, 1.5);
        drawLine(getC(y), getR(y), rotX, rotY, `rgba(120, 113, 108, ${0.3 * alpha})`, 1.5);
      }

      // Wiggling pencil
      const px = -20 + wiggle * 5;
      const py = -10 - wiggle * 15;
      const pz = 40 + Math.abs(wiggle) * 10;

      const pTip = { x: px, y: py, z: pz };
      const pTop = { x: px + 15, y: py - 40, z: pz + 10 };

      // Draw pencil line
      drawLine(pTip, pTop, rotX, rotY, `rgba(248, 197, 55, ${alpha})`, 5); // yellow pencil
      drawLine(pTip, { x: px + 3, y: py - 8, z: pz + 2 }, rotX, rotY, `rgba(28, 25, 23, ${alpha})`, 5); // pencil tip lead
    };

    // 3. CALENDAR CUBE (Tab 2)
    const drawCalendar = (rotX, rotY, alpha, pulse) => {
      const size = 50;
      
      // 8 cube points
      const v = [
        { x: -size, y: -size, z: -size }, // 0
        { x: size, y: -size, z: -size },  // 1
        { x: size, y: size, z: -size },   // 2
        { x: -size, y: size, z: -size },  // 3
        { x: -size, y: -size, z: size },  // 4
        { x: size, y: -size, z: size },   // 5
        { x: size, y: size, z: size },    // 6
        { x: -size, y: size, z: size }     // 7
      ];

      // Draw faces in depth order
      const faces = [
        [0, 1, 2, 3], // back
        [4, 5, 6, 7], // front
        [0, 1, 5, 4], // top
        [2, 3, 7, 6], // bottom
        [0, 3, 7, 4], // left
        [1, 2, 6, 5]  // right
      ];

      // Sort faces based on average depth
      const sortedFaces = faces.map((indices, faceIndex) => {
        const pts = indices.map(idx => v[idx]);
        const projected = pts.map(pt => project(pt, rotX, rotY));
        const avgDepth = projected.reduce((sum, p) => sum + p.depth, 0) / 4;
        return { indices, avgDepth, faceIndex };
      }).sort((a, b) => b.avgDepth - a.avgDepth);

      sortedFaces.forEach(face => {
        ctx.beginPath();
        const startPt = project(v[face.indices[0]], rotX, rotY);
        ctx.moveTo(startPt.x, startPt.y);
        for (let i = 1; i < 4; i++) {
          const pt = project(v[face.indices[i]], rotX, rotY);
          ctx.lineTo(pt.x, pt.y);
        }
        ctx.closePath();
        
        // Give front face different details
        if (face.faceIndex === 1) { // Front face
          ctx.fillStyle = `rgba(255, 255, 255, ${0.95 * alpha})`;
        } else {
          ctx.fillStyle = `rgba(245, 243, 240, ${0.7 * alpha})`;
        }
        ctx.fill();
        ctx.strokeStyle = `rgba(28, 25, 23, ${alpha})`;
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // Draw calendar grid inside the front face
        if (face.faceIndex === 1) {
          // Top calendar header color bar
          const hb1 = { x: -size + 4, y: -size + 4, z: size + 0.5 };
          const hb2 = { x: size - 4, y: -size + 4, z: size + 0.5 };
          const hb3 = { x: size - 4, y: -size + 18, z: size + 0.5 };
          const hb4 = { x: -size + 4, y: -size + 18, z: size + 0.5 };
          
          ctx.beginPath();
          ctx.moveTo(project(hb1, rotX, rotY).x, project(hb1, rotX, rotY).y);
          ctx.lineTo(project(hb2, rotX, rotY).x, project(hb2, rotX, rotY).y);
          ctx.lineTo(project(hb3, rotX, rotY).x, project(hb3, rotX, rotY).y);
          ctx.lineTo(project(hb4, rotX, rotY).x, project(hb4, rotX, rotY).y);
          ctx.closePath();
          ctx.fillStyle = `rgba(44, 94, 250, ${alpha})`; // Blue calendar header
          ctx.fill();

          // Lined grid
          for (let y = -size + 28; y < size - 5; y += 14) {
            drawLine({ x: -size + 8, y, z: size + 0.5 }, { x: size - 8, y, z: size + 0.5 }, rotX, rotY, `rgba(120, 113, 108, ${0.4 * alpha})`, 1);
          }
          for (let x = -size + 16; x < size - 5; x += 16) {
            drawLine({ x, y: -size + 24, z: size + 0.5 }, { x, y: size - 8, z: size + 0.5 }, rotX, rotY, `rgba(120, 113, 108, ${0.4 * alpha})`, 1);
          }

          // Pulsing study target circle (active day)
          const targetDay = { x: size - 22, y: size - 20, z: size + 0.8 };
          const s = project(targetDay, rotX, rotY);
          ctx.beginPath();
          ctx.arc(s.x, s.y, (4 + Math.sin(pulse) * 1.5) * (fov / s.depth), 0, Math.PI * 2);
          ctx.fillStyle = `rgba(242, 100, 48, ${alpha})`; // Orange target bullet
          ctx.fill();
        }
      });
    };

    // 4. DOCUMENT FOLDER (Tab 3)
    const drawFolder = (rotX, rotY, alpha, float) => {
      // Front tab, back tab
      const fw = 60;
      const fh = 45;

      // Folder Back face
      const back = [
        { x: -fw, y: -fh, z: -8 },
        { x: fw - 20, y: -fh, z: -8 },
        { x: fw - 10, y: -fh + 10, z: -8 }, // tab notch
        { x: fw, y: -fh + 10, z: -8 },
        { x: fw, y: fh, z: -8 },
        { x: -fw, y: fh, z: -8 }
      ];

      ctx.beginPath();
      const s0 = project(back[0], rotX, rotY);
      ctx.moveTo(s0.x, s0.y);
      back.forEach(pt => {
        const s = project(pt, rotX, rotY);
        ctx.lineTo(s.x, s.y);
      });
      ctx.closePath();
      ctx.fillStyle = `rgba(169, 197, 160, ${0.8 * alpha})`; // green folder back
      ctx.fill();
      ctx.strokeStyle = `rgba(28, 25, 23, ${alpha})`;
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Document sliding out inside
      const doc = [
        { x: -fw + 10, y: -fh - 15 + float * 5, z: 0 },
        { x: fw - 10, y: -fh - 15 + float * 5, z: 0 },
        { x: fw - 10, y: fh - 10 + float * 5, z: 0 },
        { x: -fw + 10, y: fh - 10 + float * 5, z: 0 }
      ];
      ctx.beginPath();
      const sDoc = project(doc[0], rotX, rotY);
      ctx.moveTo(sDoc.x, sDoc.y);
      doc.forEach(pt => {
        const s = project(pt, rotX, rotY);
        ctx.lineTo(s.x, s.y);
      });
      ctx.closePath();
      ctx.fillStyle = `rgba(255, 255, 255, ${0.95 * alpha})`;
      ctx.fill();
      ctx.strokeStyle = `rgba(28, 25, 23, ${alpha})`;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Lines on document
      for (let y = -fh - 5 + float * 5; y < fh - 20 + float * 5; y += 8) {
        drawLine({ x: -fw + 20, y, z: 0.2 }, { x: fw - 20, y, z: 0.2 }, rotX, rotY, `rgba(120, 113, 108, ${0.3 * alpha})`, 1.5);
      }

      // Folder Front flap (lower)
      const front = [
        { x: -fw, y: -fh + 15, z: 8 },
        { x: fw, y: -fh + 15, z: 8 },
        { x: fw, y: fh, z: 8 },
        { x: -fw, y: fh, z: 8 }
      ];
      ctx.beginPath();
      const sFront = project(front[0], rotX, rotY);
      ctx.moveTo(sFront.x, sFront.y);
      front.forEach(pt => {
        const s = project(pt, rotX, rotY);
        ctx.lineTo(s.x, s.y);
      });
      ctx.closePath();
      ctx.fillStyle = `rgba(169, 197, 160, ${alpha})`; // folder front
      ctx.fill();
      ctx.strokeStyle = `rgba(28, 25, 23, ${alpha})`;
      ctx.lineWidth = 3;
      ctx.stroke();
    };

    // 5. STREAK FLAME (Tab 4)
    const drawFlame = (rotX, rotY, alpha, timeVal) => {
      // Draw a 3D cage / shape representing a stylized flame plus ascending fire particles
      const segments = 12;
      const height = 100;
      
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#F26430';

      // Draw concentric glowing flame loops
      for (let scale = 0.4; scale <= 1.0; scale += 0.3) {
        ctx.beginPath();
        const baseRadius = 35 * scale;
        
        for (let i = 0; i <= segments; i++) {
          const t = i / segments;
          const theta = t * Math.PI * 2;
          
          // Flame shape: wider at base, narrowing towards top
          const y = (t - 0.5) * height;
          // Radius narrows as y goes up
          const progress = (y + height/2) / height; // 0 (bottom) to 1 (top)
          const radius = baseRadius * Math.sin(progress * Math.PI) * (1 - progress * 0.5);

          // Add wiggle oscillation to coordinates
          const wiggleOffset = Math.sin(timeVal * 5 + y * 0.05) * 5 * progress;
          
          const pt = {
            x: Math.cos(theta) * radius + wiggleOffset,
            y: -y,
            z: Math.sin(theta) * radius
          };

          const s = project(pt, rotX, rotY);
          if (i === 0) ctx.moveTo(s.x, s.y);
          else ctx.lineTo(s.x, s.y);
        }

        ctx.strokeStyle = `rgba(242, 100, 48, ${alpha * (1.4 - scale)})`;
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // Inside core flame ring (Yellow)
      ctx.shadowColor = '#F8C537';
      ctx.beginPath();
      for (let i = 0; i <= segments; i++) {
        const t = i / segments;
        const theta = t * Math.PI * 2;
        const y = (t - 0.5) * 80;
        const progress = (y + 40) / 80;
        const radius = 15 * Math.sin(progress * Math.PI) * (1 - progress * 0.6);
        const wiggleOffset = Math.sin(timeVal * 8 + y * 0.08) * 3 * progress;

        const pt = {
          x: Math.cos(theta) * radius + wiggleOffset,
          y: -y - 10,
          z: Math.sin(theta) * radius
        };
        const s = project(pt, rotX, rotY);
        if (i === 0) ctx.moveTo(s.x, s.y);
        else ctx.lineTo(s.x, s.y);
      }
      ctx.strokeStyle = `rgba(248, 197, 55, ${alpha * 0.95})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.shadowBlur = 0; // Reset glow
    };

    // Main animation loop
    const render = (time) => {
      ctx.clearRect(0, 0, width, height);

      // Lerp mouse and rotation inputs
      const mouse = mouseRef.current;
      const rot = rotationRef.current;

      if (!mouse.isDown) {
        rot.targetY += 0.003;
        if (isHovered) {
          rot.targetY = 0.6 + (mouse.x / width) * 0.6;
          rot.targetX = -0.2 + (mouse.y / height) * 0.6;
        }
      }

      rot.x += (rot.targetX - rot.x) * 0.1;
      rot.y += (rot.targetY - rot.y) * 0.1;

      // Handle transitions
      if (transitionRef.current < 1.0) {
        transitionRef.current += 0.06;
        if (transitionRef.current > 1.0) {
          transitionRef.current = 1.0;
          prevTabRef.current = activeTab;
        }
      }

      const activeAlpha = transitionRef.current;
      const prevAlpha = 1.0 - transitionRef.current;

      const wiggle = Math.sin(time * 0.008);
      const pulse = time * 0.005;
      const float = Math.sin(time * 0.004);

      // Draw active and previous models during fade
      if (prevAlpha > 0.01 && prevTabRef.current !== activeTab) {
        drawModel(prevTabRef.current, rot.x, rot.y, prevAlpha, wiggle, pulse, float, time * 0.002);
      }
      drawModel(activeTab, rot.x, rot.y, activeAlpha, wiggle, pulse, float, time * 0.002);

      animationFrameId = requestAnimationFrame(render);
    };

    const drawModel = (tabIndex, rx, ry, alpha, wiggle, pulse, float, timeVal) => {
      switch (tabIndex) {
        case 0:
          drawQuiz(rx, ry, alpha);
          break;
        case 1:
          drawNotes(rx, ry, alpha, wiggle);
          break;
        case 2:
          drawCalendar(rx, ry, alpha, pulse);
          break;
        case 3:
          drawFolder(rx, ry, alpha, float);
          break;
        case 4:
          drawFlame(rx, ry, alpha, timeVal);
          break;
        default:
          break;
      }
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
  }, [activeTab, isHovered]);

  return (
    <div 
      ref={containerRef} 
      className="relative w-full h-[320px] sm:h-[380px] flex items-center justify-center cursor-grab active:cursor-grabbing z-10"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <canvas 
        ref={canvasRef} 
        className="block select-none"
      />
      <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[9px] font-mono font-black text-stone-500 uppercase tracking-widest bg-white border border-stone-200 px-2.5 py-1 rounded-md shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] pointer-events-none select-none">
        ← Drag to Orbit Doodle →
      </span>
    </div>
  );
}
