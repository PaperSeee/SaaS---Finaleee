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
        viewBox="0 0 240 80" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        width={width}
        height={height}
      >
        {/* Modern Kritiqo Logo */}
        
        {/* Logo icon - stylized K with star */}
        <path 
          d="M25 20C25 20 25 60 25 60H35V45L45 60H60L45 40L60 20H45L35 35V20H25Z" 
          fill="#2563EB" 
        />
        
        <circle cx="50" cy="30" r="5" fill="#3B82F6" />
        
        {/* Text: Kritiqo */}
        <path 
          d="M70 30H80L80 60H70V30Z" 
          fill="#1E40AF" 
        />
        
        <path 
          d="M85 30H95V35C96.5 31.5 100 29.5 104 30C110 30.5 114 35 114 42V60H104V44C104 41 102 39 99 39C96 39 95 41 95 44V60H85V30Z" 
          fill="#1E40AF" 
        />
        
        <path 
          d="M120 30H130V35C131.5 31.5 135 29.5 139 30C145 30.5 149 35 149 42V60H139V44C139 41 137 39 134 39C131 39 130 41 130 44V60H120V30Z" 
          fill="#1E40AF" 
        />
        
        <path 
          d="M155 45C155 36 162 29 171 29C180 29 187 36 187 45C187 54 180 61 171 61C162 61 155 54 155 45ZM177 45C177 41 174 38 171 38C168 38 165 41 165 45C165 49 168 52 171 52C174 52 177 49 177 45Z" 
          fill="#1E40AF" 
        />
        
        {/* Dot on "i" */}
        <circle cx="195" cy="35" r="5" fill="#3B82F6" />
        
        <path 
          d="M190 45V60H200V45H190Z" 
          fill="#1E40AF" 
        />
        
        <path 
          d="M205 45C205 36 212 29 221 29C230 29 237 36 237 45C237 54 230 61 221 61C212 61 205 54 205 45ZM227 45C227 41 224 38 221 38C218 38 215 41 215 45C215 49 218 52 221 52C224 52 227 49 227 45Z" 
          fill="#1E40AF" 
        />
        
        {/* Stars for decoration */}
        <path 
          d="M50 65L52 70H57L53 73L55 78L50 75L45 78L47 73L43 70H48L50 65Z" 
          fill="#3B82F6" 
          opacity="0.7"
        />
        
        <path 
          d="M210 20L211 23H214L212 25L213 28L210 26L207 28L208 25L206 23H209L210 20Z" 
          fill="#3B82F6" 
          opacity="0.7"
        />
      </svg>
    </div>
  );
};
