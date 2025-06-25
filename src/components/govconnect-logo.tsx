import * as React from "react"

export function GovConnectLogo({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="GovConnect Logo"
    >
      <g>
        <path d="M 20,80 L 20,25 L 50,10 L 80,25 L 80,80 L 20,80 Z" fill="hsl(var(--primary))" />
        <path d="M 20,80 L 50,95 L 80,80" fill="none" stroke="hsl(var(--accent))" strokeWidth="5" />
        <circle cx="50" cy="45" r="15" fill="hsl(var(--background))" />
        <path d="M 45,45 L 55,45" stroke="hsl(var(--primary))" strokeWidth="4" />
        <path d="M 50,40 L 50,50" stroke="hsl(var(--primary))" strokeWidth="4" />
      </g>
    </svg>
  );
}
