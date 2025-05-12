import { useState } from 'react';
import Image from 'next/image';

type AvatarProps = {
  src?: string | null;
  alt: string;
  size?: number;
  className?: string;
};

export default function Avatar({ src, alt, size = 40, className = '' }: AvatarProps) {
  const [error, setError] = useState(false);
  
  // Generate initials for fallback
  const initials = alt
    .split(' ')
    .map(name => name[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
  
  const fallbackSrc = '/default-avatar.png';
  
  if (!src || error) {
    // Return text-based avatar if no image or error loading
    return (
      <div 
        className={`flex items-center justify-center bg-blue-100 text-blue-600 rounded-full ${className}`}
        style={{ width: size, height: size }}
      >
        <span className="font-medium" style={{ fontSize: size * 0.4 }}>
          {initials || '?'}
        </span>
      </div>
    );
  }
  
  return (
    <Image
      src={src}
      alt={alt}
      width={size}
      height={size}
      className={`rounded-full object-cover ${className}`}
      onError={() => setError(true)}
      priority={false}
    />
  );
}
