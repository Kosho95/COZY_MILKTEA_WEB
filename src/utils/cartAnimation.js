import gsap from 'gsap';
import confetti from 'canvas-confetti';

/**
 * Hiệu ứng GSAP: Hạt trân châu / Ly trà sữa bay theo hình vòng cung Parabol vào Giỏ hàng
 * @param {MouseEvent|HTMLElement|{x: number, y: number}} start - Vị trí bấm hoặc phần tử bắt đầu
 * @param {Object} options - Tùy chọn icon, màu sắc, callback
 */
export function flyBobaToCart(start, options = {}) {
  const {
    icon = '🧋',
    duration = 0.85,
    onComplete = null
  } = options;

  // 1. Tìm phần tử đích (Nút Giỏ Hàng trên Navbar)
  const cartBtn = document.querySelector('#nav-cart-btn') || 
                  document.querySelector('.nav-cart-btn-target') ||
                  document.querySelector('[data-nav-cart]');

  if (!cartBtn) {
    if (onComplete) onComplete();
    return;
  }

  // 2. Tính toạ độ xuất phát (startX, startY)
  let startX = window.innerWidth / 2;
  let startY = window.innerHeight / 2;

  if (start && typeof start.clientX === 'number') {
    startX = start.clientX;
    startY = start.clientY;
  } else if (start && typeof start.getBoundingClientRect === 'function') {
    const rect = start.getBoundingClientRect();
    startX = rect.left + rect.width / 2;
    startY = rect.top + rect.height / 2;
  } else if (start && typeof start.x === 'number' && typeof start.y === 'number') {
    startX = start.x;
    startY = start.y;
  }

  // 3. Tính toạ độ giỏ hàng (endX, endY)
  const cartRect = cartBtn.getBoundingClientRect();
  const endX = cartRect.left + cartRect.width / 2;
  const endY = cartRect.top + cartRect.height / 2;

  // 4. Tạo phần tử DOM bay
  const flyer = document.createElement('div');
  flyer.className = 'flying-boba-node';
  flyer.style.position = 'fixed';
  flyer.style.left = '0px';
  flyer.style.top = '0px';
  flyer.style.zIndex = '99999';
  flyer.style.pointerEvents = 'none';
  flyer.style.transform = `translate(${startX}px, ${startY}px)`;
  flyer.innerHTML = `
    <div style="
      font-size: 26px;
      line-height: 1;
      filter: drop-shadow(0 6px 14px rgba(93, 64, 55, 0.45));
      display: inline-block;
    ">${icon}</div>
  `;

  document.body.appendChild(flyer);

  // 5. Tính đỉnh vòng cung parabol (uốn lượn mềm mại lên trên)
  const arcHeight = Math.max(80, Math.abs(startY - endY) * 0.4 + 40);
  const midY = Math.min(startY, endY) - arcHeight;

  // 6. GSAP Timeline bay parabol
  const tl = gsap.timeline({
    onComplete: () => {
      if (flyer.parentNode) {
        flyer.parentNode.removeChild(flyer);
      }

      // Nảy giỏ hàng đàn hồi (Elastic Pop)
      gsap.fromTo(cartBtn,
        { scale: 0.8 },
        {
          scale: 1.25,
          duration: 0.22,
          ease: 'back.out(3.5)',
          yoyo: true,
          repeat: 1,
          onComplete: () => {
            gsap.set(cartBtn, { clearProps: 'transform' });
          }
        }
      );

      // Pháo hoa li ti kẹo ngọt bùng nổ nhẹ tại icon giỏ hàng
      try {
        const normX = endX / window.innerWidth;
        const normY = endY / window.innerHeight;
        confetti({
          particleCount: 16,
          spread: 45,
          startVelocity: 16,
          ticks: 50,
          origin: { x: normX, y: normY },
          colors: ['#FF8FA3', '#F4A261', '#FFD166', '#52B788', '#FFFFFF'],
          disableForReducedMotion: true
        });
      } catch {}

      if (onComplete) onComplete();
    }
  });

  // Di chuyển trục X
  tl.to(flyer, {
    x: endX - 13,
    duration: duration,
    ease: 'power1.inOut'
  }, 0);

  // Bay vồng lên đỉnh parabol
  tl.to(flyer, {
    y: midY,
    duration: duration * 0.45,
    ease: 'power1.out'
  }, 0);

  // Lao xuống giỏ hàng
  tl.to(flyer, {
    y: endY - 13,
    duration: duration * 0.55,
    ease: 'power2.in'
  }, duration * 0.45);

  // Xoay 360 độ và thu nhỏ dần khi tiếp đất
  tl.to(flyer, {
    rotation: 360,
    duration: duration,
    ease: 'power1.out'
  }, 0);

  tl.fromTo(flyer, 
    { scale: 0.7 },
    { scale: 1.3, duration: duration * 0.35, ease: 'back.out(2)' },
    0
  );

  tl.to(flyer, {
    scale: 0.4,
    opacity: 0.85,
    duration: duration * 0.4,
    ease: 'power1.in'
  }, duration * 0.6);
}
