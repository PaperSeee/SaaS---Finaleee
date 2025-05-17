import React from 'react';

interface CustomLogoProps {
  width?: number;
  height?: number;
  className?: string;
}

export const CustomLogo: React.FC<CustomLogoProps> = ({ 
  width = 100, 
  height = 40, 
  className = "" 
}) => {
  return (
    <div className={`flex items-center ${className}`} style={{ width, height }}>
      <svg
        viewBox="0 0 200 60"
        xmlns="http://www.w3.org/2000/svg"
        width={width}
        height={height}
        fill="none"
      >
        {/* Définitions des couleurs */}
        <defs>
          <linearGradient id="bubbleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2563EB" />
            <stop offset="100%" stopColor="#3B82F6" />
          </linearGradient>
        </defs>

        {/* Bulle simple, similaire à celle du site actuel */}
        <circle cx="30" cy="30" r="25" fill="url(#bubbleGradient)" />

        {/* Le 'K' simple et lisible */}
        <path
          d="M22 17L22 43L28 43L28 32L35 43L43 43L33 30L43 17L35 17L28 29L28 17Z"
          fill="white"
        />

        {/* Texte "Kritiqo" dans un style similaire au site */}
        <text
          x="65"
          y="36"
          fontFamily="Arial, sans-serif"
          fontSize="22"
          fontWeight="700"
          fill="#2563EB"
        >
          Kritiqo
        </text>

        {/* Point décoratif comme sur votre site actuel */}
        <circle cx="144" cy="30" r="3" fill="#2563EB" />
      </svg>
    </div>
  );
};
