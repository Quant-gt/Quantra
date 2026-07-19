import React from 'react';

interface LogoProps {
  className?: string;
}

export function Logo({ className = "w-8 h-8" }: LogoProps) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Green Sigma */}
      <path 
        d="M 15 20 L 85 20 L 45 50 L 85 80 L 15 80" 
        stroke="#10B981" 
        strokeWidth="22" 
        strokeLinejoin="miter" 
        fill="none" 
      />
      {/* Purple Slash (Parallelogram with horizontal caps) */}
      <path 
        d="M 32 95 L 54 95 L 88 5 L 66 5 Z" 
        fill="#A855F7" 
      />
    </svg>
  );
}
