import React from 'react';
import './ShinyText.css';

/**
 * ShinyText Component from React Bits
 * Tạo hiệu ứng vệt sáng kim loại/ánh ngọc lướt qua chữ lấp lánh sang trọng.
 */
export default function ShinyText({
  text = '',
  disabled = false,
  speed = 2.5,
  className = '',
  color = '#b5b5b5',
  shineColor = '#ffffff',
  shineWidth = 40,
  softness = 0.8,
  trigger = 'loop',
  style = {},
  children
}) {
  const content = text || children;
  const duration = `${speed}s`;

  // Tính toán dải gradient với độ rộng vệt sáng (shineWidth) và độ chuyển mềm (softness)
  const halfWidth = shineWidth / 2;
  const softOffset = halfWidth * softness;

  const gradient = `linear-gradient(120deg, 
    ${color} 0%, 
    ${color} calc(50% - ${halfWidth + softOffset}px), 
    ${shineColor} 50%, 
    ${color} calc(50% + ${halfWidth + softOffset}px), 
    ${color} 100%
  )`;

  return (
    <span
      className={`shiny-text-root ${disabled ? '' : trigger === 'hover' ? 'shiny-text-hover' : 'shiny-text-loop'} ${className}`}
      style={{
        backgroundImage: gradient,
        backgroundSize: '250% 100%',
        '--shiny-speed': duration,
        ...style
      }}
    >
      {content}
    </span>
  );
}
