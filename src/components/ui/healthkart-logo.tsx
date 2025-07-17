
import React from 'react';

interface HealthKartLogoProps {
  className?: string;
}

const HealthKartLogo = ({ className = "h-8 w-8" }: HealthKartLogoProps) => {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Health cross background */}
      <circle cx="50" cy="50" r="48" fill="currentColor" className="text-white" />
      
      {/* Health cross */}
      <rect x="40" y="20" width="20" height="60" fill="#22c55e" rx="4" />
      <rect x="20" y="40" width="60" height="20" fill="#22c55e" rx="4" />
      
      {/* Heart symbol */}
      <path
        d="M35 35c-3-3-8-3-8 2 0 3 8 8 8 8s8-5 8-8c0-5-5-5-8-2z"
        fill="#ef4444"
      />
      
      {/* Cart symbol */}
      <path
        d="M60 60h15l2-8h-12m-5 8v4h2m8-4v4h2m-12-4h8"
        stroke="#1f2937"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
      
      {/* Pills/capsules */}
      <ellipse cx="25" cy="65" rx="3" ry="6" fill="#3b82f6" transform="rotate(45 25 65)" />
      <ellipse cx="75" cy="35" rx="3" ry="6" fill="#f59e0b" transform="rotate(-30 75 35)" />
    </svg>
  );
};

export default HealthKartLogo;
