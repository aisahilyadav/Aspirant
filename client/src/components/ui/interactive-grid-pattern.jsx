"use client";
import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

export function InteractiveGridPattern({
  className,
  width = 40,
  height = 40,
  ...props
}) {
  const [hoveredSquare, setHoveredSquare] = useState(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleGlobalMouseMove = (e) => {
      const svg = containerRef.current;
      if (!svg) return;

      const rect = svg.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Check if mouse cursor is within the grid area boundary
      if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
        const col = Math.floor(x / width);
        const row = Math.floor(y / height);
        setHoveredSquare({ x: col, y: row });
      } else {
        setHoveredSquare(null);
      }
    };

    window.addEventListener("mousemove", handleGlobalMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleGlobalMouseMove);
    };
  }, [width, height]);

  return (
    <svg
      ref={containerRef}
      className={cn(
        "absolute inset-0 h-full w-full pointer-events-none",
        className
      )}
      {...props}
    >
      <defs>
        <pattern
          id="interactive-grid"
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
          x="-1"
          y="-1"
        >
          <path
            d={`M ${width} 0 L 0 0 0 ${height}`}
            fill="none"
            stroke="rgba(120, 113, 108, 0.22)"
            strokeWidth="1"
          />
        </pattern>
      </defs>

      {/* Base Grid */}
      <rect width="100%" height="100%" fill="url(#interactive-grid)" strokeWidth="0" />

      {/* Active cell highlight (with warm yellow theme glow) */}
      {hoveredSquare && (
        <rect
          x={hoveredSquare.x * width}
          y={hoveredSquare.y * height}
          width={width}
          height={height}
          className="fill-[#F8C537]/20 stroke-[#F8C537]/60 stroke-2 transition-all duration-75 ease-out"
        />
      )}
    </svg>
  );
}
