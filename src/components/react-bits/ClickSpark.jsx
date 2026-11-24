import React, { useRef, useEffect, useCallback } from 'react';

/**
 * ClickSpark Component from React Bits
 * Tạo hiệu ứng bắn tia sáng / ngôi sao / bọt nước lung linh khi nhấp chuột.
 */
export default function ClickSpark({
  sparkColor = '#FF8FA3',
  shape = 'line',
  sparkCount = 8,
  sparkSize = 14,
  sparkRadius = 32,
  duration = 500,
  children,
  className = '',
  style = {}
}) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const sparksRef = useRef([]);
  const animFrameId = useRef(null);

  // Resize canvas theo container và Retina display
  const updateCanvasSize = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const rect = container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.scale(dpr, dpr);
    }
  }, []);

  useEffect(() => {
    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    return () => {
      window.removeEventListener('resize', updateCanvasSize);
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, [updateCanvasSize]);

  // Vòng lặp render các tia sáng
  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const now = performance.now();
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    sparksRef.current = sparksRef.current.filter((spark) => {
      const elapsed = now - spark.startTime;
      if (elapsed >= duration) return false;

      const progress = elapsed / duration;
      // Easing out cubic: 1 - (1 - progress)^3
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const currentRadius = easeProgress * sparkRadius;
      const opacity = 1 - progress;

      ctx.save();
      ctx.globalAlpha = opacity;
      ctx.strokeStyle = spark.color;
      ctx.fillStyle = spark.color;
      ctx.lineWidth = 2.2;
      ctx.lineCap = 'round';

      const x = spark.x + Math.cos(spark.angle) * currentRadius;
      const y = spark.y + Math.sin(spark.angle) * currentRadius;

      if (shape === 'line') {
        const lineLen = sparkSize * (1 - progress * 0.5);
        const x2 = x + Math.cos(spark.angle) * lineLen;
        const y2 = y + Math.sin(spark.angle) * lineLen;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      } else if (shape === 'star') {
        drawStar(ctx, x, y, 4, sparkSize * (1 - progress * 0.4), sparkSize * 0.4 * (1 - progress * 0.4));
      } else if (shape === 'heart') {
        drawHeart(ctx, x, y, (sparkSize * 0.6) * (1 - progress * 0.3));
      } else {
        // Circle / Dot
        ctx.beginPath();
        ctx.arc(x, y, (sparkSize * 0.35) * (1 - progress), 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
      return true;
    });

    if (sparksRef.current.length > 0) {
      animFrameId.current = requestAnimationFrame(animate);
    }
  }, [duration, shape, sparkRadius, sparkSize]);

  // Vẽ hình ngôi sao 4 cánh lấp lánh
  const drawStar = (ctx, cx, cy, spikes, outerRadius, innerRadius) => {
    let rot = (Math.PI / 2) * 3;
    let x = cx;
    let y = cy;
    const step = Math.PI / spikes;

    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);
    for (let i = 0; i < spikes; i++) {
      x = cx + Math.cos(rot) * outerRadius;
      y = cy + Math.sin(rot) * outerRadius;
      ctx.lineTo(x, y);
      rot += step;

      x = cx + Math.cos(rot) * innerRadius;
      y = cy + Math.sin(rot) * innerRadius;
      ctx.lineTo(x, y);
      rot += step;
    }
    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
    ctx.fill();
  };

  // Vẽ hình trái tim ngọt ngào
  const drawHeart = (ctx, x, y, size) => {
    ctx.beginPath();
    const topCurveHeight = size * 0.3;
    ctx.moveTo(x, y + topCurveHeight);
    ctx.bezierCurveTo(x, y, x - size / 2, y, x - size / 2, y + topCurveHeight);
    ctx.bezierCurveTo(x - size / 2, y + (size + topCurveHeight) / 2, x, y + (size + topCurveHeight) / 1.5, x, y + size);
    ctx.bezierCurveTo(x, y + (size + topCurveHeight) / 1.5, x + size / 2, y + (size + topCurveHeight) / 2, x + size / 2, y + topCurveHeight);
    ctx.bezierCurveTo(x + size / 2, y, x, y, x, y + topCurveHeight);
    ctx.closePath();
    ctx.fill();
  };

  // Bắt sự kiện click
  const handleClick = (e) => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const colors = Array.isArray(sparkColor)
      ? sparkColor
      : [sparkColor, '#FFD166', '#FF8FA3', '#FFFFFF', '#52B788'];

    const newSparks = [];
    for (let i = 0; i < sparkCount; i++) {
      const baseAngle = (Math.PI * 2 * i) / sparkCount;
      const angle = baseAngle + (Math.random() - 0.5) * 0.4;
      const color = colors[i % colors.length];

      newSparks.push({
        x,
        y,
        angle,
        color,
        startTime: performance.now()
      });
    }

    sparksRef.current = [...sparksRef.current, ...newSparks];

    if (!animFrameId.current || sparksRef.current.length === newSparks.length) {
      animFrameId.current = requestAnimationFrame(animate);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`click-spark-container ${className}`}
      onClick={handleClick}
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100%',
        ...style
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 9999
        }}
      />
      {children}
    </div>
  );
}
