import gsap from 'gsap';

/**
 * Hiệu ứng GSAP: Chấm tròn món đồ uống bay mượt mà theo hình vòng cung Parabol vào Giỏ hàng
 * @param {MouseEvent|HTMLElement|{x: number, y: number}} start - Vị trí bấm hoặc phần tử bắt đầu
 * @param {Object} options - Tùy chọn icon, màu sắc, callback
 */
export function flyBobaToCart(start, options = {}) {
  const {
    duration = 0.75,
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

  // 4. Tạo phần tử DOM bay - thiết kế viên ngọc trà sữa ấm tối giản
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
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background: radial-gradient(circle at 35% 35%, #F4A261 0%, #C27848 60%, #3E2723 100%);
      box-shadow: 0 4px 12px rgba(62, 39, 35, 0.45);
      border: 1.5px solid rgba(255, 255, 255, 0.85);
    "></div>
  `;

  document.body.appendChild(flyer);

  // 5. Đỉnh vòng cung parabol
  const arcHeight = Math.max(70, Math.abs(startY - endY) * 0.35 + 30);
  const midY = Math.min(startY, endY) - arcHeight;

  // 6. GSAP Timeline bay parabol
  const tl = gsap.timeline({
    onComplete: () => {
      if (flyer.parentNode) {
        flyer.parentNode.removeChild(flyer);
      }

      // Giỏ hàng nảy nhẹ đàn hồi tinh tế
      gsap.fromTo(cartBtn,
        { scale: 0.9 },
        {
          scale: 1.15,
          duration: 0.18,
          ease: 'power2.out',
          yoyo: true,
          repeat: 1,
          onComplete: () => {
            gsap.set(cartBtn, { clearProps: 'transform' });
          }
        }
      );

      if (onComplete) onComplete();
    }
  });

  // Tọa độ X chạy đều mượt mà
  tl.to(flyer, {
    x: endX,
    duration: duration,
    ease: 'power1.inOut'
  }, 0);

  // Tọa độ Y uốn lượn parabol
  tl.to(flyer, {
    y: midY,
    duration: duration * 0.45,
    ease: 'power1.out'
  }, 0);

  tl.to(flyer, {
    y: endY,
    duration: duration * 0.55,
    ease: 'power2.in'
  }, duration * 0.45);

  // Thu nhỏ dần khi sắp chạm giỏ hàng
  tl.to(flyer, {
    scale: 0.6,
    opacity: 0.85,
    duration: duration * 0.3,
    ease: 'power2.in'
  }, duration * 0.7);
}
