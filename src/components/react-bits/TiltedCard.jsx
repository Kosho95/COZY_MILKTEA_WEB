import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

/**
 * TiltedCardLayer Component from React Bits
 * Dùng để bọc các layer con (chữ, badge, nút) muốn nổi 3D (Z-depth) lên phía trước thẻ.
 */
export function TiltedCardLayer({ depth = 20, children, style = {}, className = '' }) {
  return (
    <div
      className={className}
      style={{
        transform: `translateZ(${depth}px)`,
        transformStyle: 'preserve-3d',
        pointerEvents: 'auto',
        ...style
      }}
    >
      {children}
    </div>
  );
}

/**
 * TiltedCard Component from React Bits
 * Thẻ 3D nghiêng theo vị trí con trỏ chuột với hiệu ứng ánh sáng (glare) và đổ bóng nổi bật.
 */
export default function TiltedCard({
  imageSrc,
  altText = 'Card Image',
  captionText,
  containerHeight = '320px',
  containerWidth = '320px',
  imageHeight = '320px',
  imageWidth = '320px',
  rotateAmplitude = 14,
  scaleOnHover = 1.05,
  glare = 0.5,
  shadow = 0.5,
  backContent = null,
  children,
  className = '',
  style = {},
  onClick
}) {
  const cardRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);

  // Motion values cho vị trí chuột (-0.5 đến 0.5)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Cấu hình spring để chuyển động nghiêng siêu mượt
  const springConfig = { damping: 20, stiffness: 260 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  // Góc xoay 3D
  const rotateX = useTransform(smoothMouseY, [-0.5, 0.5], [rotateAmplitude, -rotateAmplitude]);
  const rotateY = useTransform(smoothMouseX, [-0.5, 0.5], [-rotateAmplitude, rotateAmplitude]);

  // Vị trí tia sáng glare
  const glareX = useTransform(smoothMouseX, [-0.5, 0.5], [0, 100]);
  const glareY = useTransform(smoothMouseY, [-0.5, 0.5], [0, 100]);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  const handleClick = (e) => {
    if (backContent) {
      setIsFlipped(!isFlipped);
    }
    if (onClick) {
      onClick(e);
    }
  };

  const glareOpacity = typeof glare === 'number' ? glare : glare ? 0.45 : 0;
  const shadowMultiplier = typeof shadow === 'number' ? shadow : shadow ? 0.4 : 0;

  return (
    <div
      style={{
        perspective: '1000px',
        width: containerWidth,
        height: containerHeight,
        display: 'inline-block',
        ...style
      }}
      className={`tilted-card-perspective-wrapper ${className}`}
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        animate={{
          scale: isHovered ? scaleOnHover : 1
        }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        style={{
          width: imageWidth,
          height: imageHeight,
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
          cursor: backContent || onClick ? 'pointer' : 'default',
          position: 'relative',
          borderRadius: '20px',
          boxShadow: isHovered
            ? `0 24px 48px -12px rgba(62, 39, 35, ${shadowMultiplier * 1.5})`
            : `0 10px 24px -6px rgba(62, 39, 35, ${shadowMultiplier})`,
          transition: 'box-shadow 0.3s ease',
          overflow: 'hidden',
          backgroundColor: 'var(--bg-surface, #fff)'
        }}
      >
        {/* LỚP HÌNH ẢNH MẶT TRƯỚC */}
        {imageSrc && (
          <img
            src={imageSrc}
            alt={altText}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: '20px',
              display: isFlipped ? 'none' : 'block'
            }}
          />
        )}

        {/* LỚP TIA SÁNG GLARE NỔI BẬT */}
        {glareOpacity > 0 && !isFlipped && (
          <motion.div
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '20px',
              pointerEvents: 'none',
              background: useTransform(
                [glareX, glareY],
                ([gx, gy]) =>
                  `radial-gradient(circle at ${gx}% ${gy}%, rgba(255, 255, 255, ${glareOpacity}) 0%, rgba(255, 255, 255, 0) 65%)`
              ),
              zIndex: 10
            }}
          />
        )}

        {/* LỚP MẶT SAU (NẾU CÓ) */}
        {backContent && isFlipped && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '20px',
              backgroundColor: 'var(--bg-surface, #ffffff)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px',
              boxSizing: 'border-box',
              zIndex: 5
            }}
          >
            {backContent}
          </div>
        )}

        {/* CÁC LAYER 3D VÀ NỘI DUNG NẰM TRONG (CHILDREN) */}
        {!isFlipped && children && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              transformStyle: 'preserve-3d',
              zIndex: 15
            }}
          >
            {children}
          </div>
        )}

        {/* CAPTION TEXT Ở ĐÁY */}
        {captionText && !isFlipped && (
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              padding: '16px 18px',
              background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)',
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: 700,
              borderRadius: '0 0 20px 20px',
              zIndex: 12
            }}
          >
            {captionText}
          </div>
        )}
      </motion.div>
    </div>
  );
}
