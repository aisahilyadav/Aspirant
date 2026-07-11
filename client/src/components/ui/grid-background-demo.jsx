import { cn } from "@/lib/utils";
import React from "react";

export default function GridBackgroundDemo({ children, className }) {
  return (
    <div className={cn("relative flex w-full items-center justify-center bg-[#FAF9F6]", className)}>
      <div
        className={cn(
          "absolute inset-0 z-0",
          "[background-size:50px_50px]",
          "[background-image:linear-gradient(to_right,rgba(120,113,108,0.12)_1px,transparent_1px),linear-gradient(to_bottom,rgba(120,113,108,0.12)_1px,transparent_1px)]",
        )}
      />
      {/* Radial gradient for the container to give a faded look */}
      <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center bg-[#FAF9F6] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
      <div className="relative z-10 w-full">
        {children}
      </div>
    </div>
  );
}
