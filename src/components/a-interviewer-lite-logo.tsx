// src/components/a-interviewer-lite-logo.tsx
import type { SVGProps } from 'react';

export function AInterviewerLiteLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 20"
      width="150"
      height="30"
      aria-label="AInterviewer Lite Logo"
      {...props}
    >
      <style>
        {`
          .logo-text {
            font-family: var(--font-geist-sans), Arial, sans-serif;
            font-size: 14px;
            font-weight: 600;
            fill: hsl(var(--primary));
          }
          .logo-ai {
            fill: hsl(var(--accent));
          }
        `}
      </style>
      <text x="0" y="15" className="logo-text">
        A<tspan className="logo-ai">I</tspan>nterviewer Lite
      </text>
    </svg>
  );
}
