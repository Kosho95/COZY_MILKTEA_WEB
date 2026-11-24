import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import HeroBanner from './components/HeroBanner';
import CategoryTabs from './components/CategoryTabs';
import ProductCard from './components/ProductCard';
import DrinkModal from './components/DrinkModal';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import OrderTrackerModal from './components/OrderTrackerModal';
import PrintBillModal from './components/PrintBillModal';
import LoginModal from './components/LoginModal';
import AdminDashboard from './components/AdminDashboard';
import Toast from './components/Toast';
import CreamDrip from './components/CreamDrip';
import { fetchMenuData, getApiBaseUrl, setApiBaseUrl, formatVND } from './api';
import { Sparkles, CupSoda, Heart, Coffee, ShieldCheck, MapPin, Phone, Clock, Settings, RefreshCw } from 'lucide-react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { flyBobaToCart } from './utils/cartAnimation';
import ClickSpark from './components/ClickSpark';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  // State Chế độ Quản Trị Admin SPA
  const [isAdminMode, setIsAdminMode] = useState(false);

  // State Khách hàng Thành viên & Đăng nhập
  // State Chế độ Giao Diện Sáng / Tối (Sun-Moon Walker Toggle)
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('COZY_THEME') === 'dark';
  });

  useEffect(() => {
    if (isDark) {
      document.body.classList.add('dark-mode');
      localStorage.setItem('COZY_THEME', 'dark');
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('COZY_THEME', 'light');
    }
  }, [isDark]);

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('COZY_CURRENT_USER') || 'null');
    } catch (e) {
      return null;
    }
  });
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  // State Dữ liệu Menu & Danh mục
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [toppings, setToppings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dataSource, setDataSource] = useState('');

  // Bộ lọc & Tìm kiếm
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Giỏ hàng & Voucher
  const [cartItems, setCartItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('SAVED_CART_ITEMS') || '[]');
    } catch (e) {
      return [];
    }
  });
  const [couponCode, setCouponCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);

  // Modals & Drawers State
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isTrackerOpen, setIsTrackerOpen] = useState(false);
  const [trackerPhone, setTrackerPhone] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [printBillOrder, setPrintBillOrder] = useState(null);
  const [toast, setToast] = useState(null);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Load Menu khi khởi động
  useEffect(() => {
    loadMenu();
  }, []);

  const lenisRef = useRef(null);

  // Kích hoạt Lenis Smooth Scroll đồng bộ với GSAP Ticker
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.5,
    });
    lenisRef.current = lenis;

    const handleScroll = (scrollYVal, progressVal) => {
      ScrollTrigger.update();
      const currentY = typeof scrollYVal === 'number' ? scrollYVal : window.scrollY;
      const progressBar = document.getElementById('scroll-progress-bar');
      if (progressBar) {
        const scrollMax = document.documentElement.scrollHeight - window.innerHeight;
        const p = typeof progressVal === 'number' ? progressVal * 100 : (scrollMax > 0 ? (currentY / scrollMax) * 100 : 0);
        progressBar.style.width = `${Math.min(100, Math.max(0, p))}%`;
      }

      if (currentY > 350) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };

    lenis.on('scroll', (e) => {
      handleScroll(e.scroll, e.progress);
    });

    const onNativeScroll = () => {
      handleScroll(window.scrollY);
    };
    window.addEventListener('scroll', onNativeScroll, { passive: true });

    const updateTicker = (time) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateTicker);
    gsap.ticker.lagSmoothing(0);

    return () => {
      window.removeEventListener('scroll', onNativeScroll);
      gsap.ticker.remove(updateTicker);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Tạm dừng cuộn nền Lenis khi mở bất kỳ Modal hoặc Drawer nào (Tránh cuộn xuyên nền)
  const isAnyModalOpen = Boolean(
    selectedProduct ||
    isCartOpen ||
    isCheckoutOpen ||
    isTrackerOpen ||
    isLoginOpen ||
    printBillOrder
  );

  useEffect(() => {
    if (isAnyModalOpen) {
      lenisRef.current?.stop();
      document.body.style.overflow = 'hidden';
    } else {
      lenisRef.current?.start();
      document.body.style.overflow = '';
    }
    return () => {
      lenisRef.current?.start();
      document.body.style.overflow = '';
    };
  }, [isAnyModalOpen]);

  // Lưu giỏ hàng vào localStorage mỗi khi thay đổi
  useEffect(() => {
    localStorage.setItem('SAVED_CART_ITEMS', JSON.stringify(cartItems));
  }, [cartItems]);

  // Hiệu ứng GSAP ScrollTrigger: Parallax cho Hero Banner & Reveal chân trang
  useEffect(() => {
    const heroCtx = gsap.context(() => {
      // 1. Trân châu trang trí lơ lửng ngược chiều cuộn tạo chiều sâu 3D
      gsap.to('.hero-boba-decor', {
        yPercent: -75,
        rotation: 45,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero-card',
          start: 'top top',
          end: 'bottom top',
          scrub: 1.2
        }
      });

      // 2. Thẻ 3D spotlight nghiêng nhẹ và trôi chậm khi lướt chuột
      gsap.to('.hero-tilted-spotlight', {
        yPercent: -18,
        rotateZ: 4,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero-card',
          start: 'top top',
          end: 'bottom top',
          scrub: 1.5
        }
      });

      // 3. Khối Hero card co nhẹ tạo cảm giác không gian chiều sâu
      gsap.to('.hero-card', {
        scale: 0.985,
        opacity: 0.94,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero-card',
          start: 'bottom 85%',
          end: 'bottom 15%',
          scrub: 1
        }
      });

      // 4. Reveal mềm mại cho Chân trang Footer
      gsap.fromTo('footer .container', 
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.85,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: 'footer',
            start: 'top 88%'
          }
        }
      );
    });

    return () => {
      heroCtx.revert();
    };
  }, []);

  // Hiệu ứng GSAP Thác Đổ (Stagger Waterfall) cho thẻ sản phẩm khi cuộn chuột tới
  useEffect(() => {
    if (loading) return;

    const timer = setTimeout(() => {
      const cards = document.querySelectorAll('.product-card-item');
      if (!cards.length) return;

      const batchTriggers = ScrollTrigger.batch('.product-card-item', {
        interval: 0.1,
        batchMax: 4, // Từng hàng 4 thẻ so le nhau
        onEnter: (batch) => {
          gsap.fromTo(batch,
            {
              opacity: 0,
              y: 50,
              scale: 0.94
            },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.65,
              stagger: 0.09,
              ease: 'power3.out',
              overwrite: 'auto'
            }
          );
        },
        start: 'top 90%',
        once: true
      });

      ScrollTrigger.refresh();

      return () => {
        batchTriggers.forEach(t => t.kill());
      };
    }, 120);

    return () => clearTimeout(timer);
  }, [products, searchQuery, selectedCategoryId, loading]);

  // Lưu thông tin khách đăng nhập
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('COZY_CURRENT_USER', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('COZY_CURRENT_USER');
    }
  }, [currentUser]);

  // Tính lại mức giảm giá khi mã voucher hoặc giỏ hàng thay đổi
  useEffect(() => {
    const subtotal = cartItems.reduce((s, i) => s + i.subtotal, 0);
    if (!couponCode || subtotal === 0) {
      setDiscountAmount(0);
      return;
    }

    if (couponCode === 'GIAM15K') {
      setDiscountAmount(subtotal >= 60000 ? 15000 : 0);
    } else if (couponCode === 'BANMOI') {
      setDiscountAmount(Math.round(subtotal * 0.2)); // Giảm 20%
    } else if (couponCode === 'FREESHIP') {
      setDiscountAmount(15000); // Tương đương phí ship
    } else {
      setDiscountAmount(0);
    }
  }, [couponCode, cartItems]);

  const loadMenu = async () => {
    setLoading(true);
    const data = await fetchMenuData();
    setCategories(data.categories || []);
    setProducts(data.products || []);
    setToppings(data.toppings || []);
    setDataSource(data.source);
    setLoading(false);
  };

  // Thao tác Thêm món vào Giỏ & Kích hoạt GSAP Boba bay parabol vào giỏ hàng
  const handleAddToCart = (customDrink, eventOrElement) => {
    // 🧋 Hiệu ứng GSAP Parabolic Fly-to-Cart
    flyBobaToCart(eventOrElement, { icon: '🧋' });

    setCartItems((prev) => {
      const existingIndex = prev.findIndex(item => item.id === customDrink.id);
      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex].quantity += customDrink.quantity;
        next[existingIndex].subtotal = next[existingIndex].quantity * next[existingIndex].unit_price;
        return next;
      }
      return [...prev, customDrink];
    });

    setToast({
      message: `Đã thêm ${customDrink.quantity}x ${customDrink.name} (Size ${customDrink.size}) vào giỏ! 🧋`
    });
  };

  // Cập nhật số lượng trong giỏ
  const handleUpdateQuantity = (id, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveItem(id);
      return;
    }
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          quantity: newQuantity,
          subtotal: newQuantity * item.unit_price
        };
      }
      return item;
    }));
  };

  // Xóa món khỏi giỏ
  const handleRemoveItem = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  // Xóa toàn bộ giỏ
  const handleClearCart = () => {
    setCartItems([]);
    setCouponCode('');
  };

  // Áp dụng mã Voucher từ Hero Banner
  const handleApplyCoupon = (code) => {
    setCouponCode(code);
    setIsCartOpen(true);
    setToast({ message: `Đã chọn mã ưu đãi: ${code} 🏷️` });
  };

  // Lọc sản phẩm theo danh mục và tìm kiếm tức thì
  const filteredProducts = products.filter(p => {
    const matchCategory = selectedCategoryId === null || Number(p.category_id) === Number(selectedCategoryId);
    const matchSearch = !searchQuery.trim() ||
      p.name.toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(searchQuery.trim().toLowerCase()));
    return matchCategory && matchSearch;
  });

  // Tính tổng số lượng ly trong giỏ
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cartItems.reduce((sum, item) => sum + item.subtotal, 0);

  // Link Web Quản Trị PHP Dự phòng
  const adminUrl = `${getApiBaseUrl()}/admin.php`;

  // NẾU ĐANG Ở CHẾ ĐỘ QUẢN TRỊ ADMIN SPA: HIỂN THỊ ADMIN DASHBOARD
  if (isAdminMode) {
    return (
      <>
        <AdminDashboard
          onExit={() => {
            setIsAdminMode(false);
            loadMenu(); // Reload menu khi thoát admin
          }}
          onOpenPrintBill={(order) => setPrintBillOrder(order)}
        />

        {/* Modal in hóa đơn thu ngân (nếu cần in từ admin) */}
        <PrintBillModal
          isOpen={Boolean(printBillOrder)}
          onClose={() => setPrintBillOrder(null)}
          orderData={printBillOrder}
        />
      </>
    );
  }

  // GIAO DIỆN BÁN HÀNG DÀNH CHO KHÁCH
  return (
    <ClickSpark
      sparkColor={['#FF8FA3', '#F4A261', '#FFD166', '#52B788', '#FFFFFF']}
      shape="line"
      sparkCount={9}
      sparkSize={15}
      sparkRadius={35}
      duration={480}
    >
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        {/* 1. THANH ĐIỀU HƯỚNG CỐ ĐỊNH (STICKY NAVBAR) */}
        <Navbar
          cartCount={cartCount}
          cartTotal={cartTotal}
          onOpenCart={() => setIsCartOpen(true)}
          onOpenTracker={() => setIsTrackerOpen(true)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          adminUrl={adminUrl}
          currentUser={currentUser}
          onOpenLogin={() => setIsLoginOpen(true)}
          onOpenAdmin={() => setIsAdminMode(true)}
          isDark={isDark}
          onToggleTheme={setIsDark}
        />

        {/* 2. HERO BANNER CHÀO MỪNG & VOUCHER DẠNG COUPON */}
        <HeroBanner
          onApplyCoupon={handleApplyCoupon}
          activeCoupon={couponCode}
        />

        {/* 3. THANH DANH MỤC DÍNH (STICKY CATEGORY TABS) */}
        <CategoryTabs
          categories={categories}
          selectedCategoryId={selectedCategoryId}
          onSelectCategory={(id) => {
            setSelectedCategoryId(id);
            window.scrollTo({ top: 380, behavior: 'smooth' });
          }}
          totalProductsCount={products.length}
        />

        {/* 4. VÙNG HIỂN THỊ DANH SÁCH MÓN ĂN */}
        <main className="container" style={{ flex: 1, paddingBottom: '60px', width: '100%' }}>
          {/* Tiêu đề khu vực món */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '22px'
          }}>
            <div>
              <h2 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-dark)' }}>
                {selectedCategoryId === null
                  ? 'Tất Cả Thức Uống Đặc Sắc'
                  : (categories.find(c => c.id === selectedCategoryId)?.name || 'Thực Đơn')}
              </h2>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                {filteredProducts.length} thức uống thơm ngon sẵn sàng phục vụ bạn
              </p>
            </div>

            {searchQuery && (
              <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                Kết quả tìm kiếm cho: "<strong style={{ color: 'var(--primary-700)' }}>{searchQuery}</strong>"
              </div>
            )}
          </div>

          {/* TRƯỜNG HỢP: SKELETON LOADING KHI ĐANG TẢI DỮ LIỆU */}
          {loading ? (
            <div className="products-grid">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                <div key={n} style={{
                  backgroundColor: 'var(--bg-surface)',
                  borderRadius: 'var(--radius-md)',
                  padding: '16px',
                  border: '1px solid var(--border-light)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}>
                  <div className="skeleton" style={{ width: '100%', height: '180px' }} />
                  <div className="skeleton" style={{ width: '40%', height: '14px' }} />
                  <div className="skeleton" style={{ width: '85%', height: '20px' }} />
                  <div className="skeleton" style={{ width: '100%', height: '32px' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                    <div className="skeleton" style={{ width: '35%', height: '22px' }} />
                    <div className="skeleton" style={{ width: '35%', height: '34px', borderRadius: '20px' }} />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            /* TRƯỜNG HỢP: KHÔNG TÌM THẤY MÓN */
            <div style={{
              textAlign: 'center',
              padding: '70px 20px',
              backgroundColor: 'var(--bg-surface)',
              borderRadius: 'var(--radius-lg)',
              border: '1.5px dashed var(--border-soft)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '14px'
            }}>
              <div style={{ fontSize: '56px' }}>🍃</div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-dark)' }}>
                Chưa tìm thấy món trà sữa nào phù hợp!
              </h3>
              <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', maxWidth: '340px' }}>
                Bạn hãy thử tìm bằng từ khóa khác (ví dụ: Trà sữa, Oolong, Cà phê, Trân châu...) nhé.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategoryId(null);
                }}
                style={{
                  marginTop: '6px',
                  padding: '10px 22px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: 'var(--primary-600)',
                  color: '#fff',
                  fontSize: '13.5px',
                  fontWeight: 700
                }}
              >
                Xem tất cả thực đơn
              </button>
            </div>
          ) : (
            /* GRID SẢN PHẨM HOÀN CHỈNH - 4 CỘT CHUẨN ĐẸP */
            <div className="products-grid">
              {filteredProducts.map((prod) => {
                const catName = categories.find(c => c.id === prod.category_id)?.name;
                return (
                  <ProductCard
                    key={prod.id}
                    product={prod}
                    categoryName={catName}
                    onSelectProduct={(p) => setSelectedProduct(p)}
                  />
                );
              })}
            </div>
          )}
        </main>

        {/* 5. CỬA SỔ TÙY CHỌN LY ĐỒ UỐNG (INTERACTIVE DRINK CUSTOMIZER) */}
        {selectedProduct && (
          <DrinkModal
            product={selectedProduct}
            toppings={toppings}
            onClose={() => setSelectedProduct(null)}
            onAddToCart={handleAddToCart}
          />
        )}

        {/* 6. GIỎ HÀNG TRƯỢT TỪ BÊN PHẢI (SLIDE-OVER CART DRAWER) */}
        <CartDrawer
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          cartItems={cartItems}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
          onClearCart={handleClearCart}
          couponCode={couponCode}
          setCouponCode={setCouponCode}
          discountAmount={discountAmount}
          onProceedCheckout={() => {
            setIsCartOpen(false);
            setIsCheckoutOpen(true);
          }}
        />

        {/* 7. MODAL THANH TOÁN & VIETQR ĐỘNG */}
        <CheckoutModal
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
          cartItems={cartItems}
          discountAmount={discountAmount}
          couponCode={couponCode}
          currentUser={currentUser}
          onOrderSuccess={() => {
            setCartItems([]);
            setCouponCode('');
          }}
          onOpenTracker={(phone) => {
            setTrackerPhone(phone);
            setIsTrackerOpen(true);
          }}
          onOpenPrintBill={(order) => setPrintBillOrder(order)}
        />

        {/* 8. MODAL TRA CỨU & TIẾN TRÌNH ĐƠN HÀNG (LIVE TRACKER) */}
        <OrderTrackerModal
          isOpen={isTrackerOpen}
          onClose={() => setIsTrackerOpen(false)}
          initialPhone={trackerPhone}
          onOpenPrintBill={(order) => setPrintBillOrder(order)}
        />

        {/* 9. MODAL IN HÓA ĐƠN THU NGÂN (K80 THERMAL RECEIPT) */}
        <PrintBillModal
          isOpen={Boolean(printBillOrder)}
          onClose={() => setPrintBillOrder(null)}
          orderData={printBillOrder}
        />

        {/* 10. MODAL ĐĂNG NHẬP & THẺ THÀNH VIÊN COZY CLUB */}
        <LoginModal
          isOpen={isLoginOpen}
          onClose={() => setIsLoginOpen(false)}
          currentUser={currentUser}
          onLogin={(u) => {
            setCurrentUser(u);
            setToast({ message: `Chào mừng ${u.name} đến với Cozy Milk Tea! 🧋` });
          }}
          onLogout={() => {
            setCurrentUser(null);
            setToast({ message: 'Đã đăng xuất tài khoản!' });
          }}
          onOpenTracker={(phone) => {
            setTrackerPhone(phone);
            setIsTrackerOpen(true);
          }}
        />

        {/* 11. TOAST NOTIFICATION TRƯỢT NHẸ */}
        <Toast toast={toast} onClose={() => setToast(null)} />

        {/* LỚP KEM TUYẾT TRẮNG TINH KHÔI CHẢY TRÀN TRÊN ĐỈNH CHÂN TRANG */}
        <div style={{ marginTop: '60px', transform: 'translateY(2px)', lineHeight: 0, position: 'relative', zIndex: 10 }}>
          <CreamDrip height={42} theme="white" />
        </div>

        {/* 12. FOOTER NÂU CÀ PHÊ & CACAO SANG TRỌNG ĐẬM ĐÀ */}
        <footer style={{
          background: 'linear-gradient(180deg, #2D1B16 0%, #1A0D09 100%)',
          color: '#FFFFFF',
          padding: '52px 0 36px',
          position: 'relative',
          zIndex: 5,
          boxShadow: '0 -10px 40px rgba(0,0,0,0.25)'
        }}>
          <div className="container">
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '36px',
              marginBottom: '42px'
            }}>
              {/* Cột 1: Thông tin quán & Giới thiệu */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    backgroundColor: 'rgba(244, 162, 97, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px',
                    border: '1px solid rgba(244, 162, 97, 0.4)'
                  }}>
                    🧋
                  </div>
                  <div>
                    <span style={{ fontSize: '19px', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.01em', display: 'block' }}>
                      Cozy Tea & Coffee
                    </span>
                    <span style={{ fontSize: '12px', color: '#F4A261', fontWeight: 700 }}>
                      Hương vị đậm đà • Pha chế tươi mới
                    </span>
                  </div>
                </div>
                <p style={{ fontSize: '13px', color: '#D7CCC8', lineHeight: 1.65, marginBottom: '16px' }}>
                  Được chắt lọc từ những búp trà tươi cao nguyên phối cùng sữa tươi thanh trùng và trân châu thủ công nấu mới mỗi sớm mai.
                </p>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: 'rgba(82, 183, 136, 0.2)',
                  border: '1px solid rgba(82, 183, 136, 0.4)',
                  fontSize: '12px',
                  color: '#74C69D',
                  fontWeight: 800
                }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#52B788', display: 'inline-block', boxShadow: '0 0 8px #52B788' }} />
                  <span>Đang mở cửa • 08:00 - 22:30 mỗi ngày</span>
                </div>
              </div>

              {/* Cột 2: Cam kết chất lượng 4 tiêu chí vàng */}
              <div>
                <h4 style={{ fontSize: '16px', fontWeight: 800, color: '#F4A261', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>✨</span>
                  <span>Cam Kết Chất Lượng</span>
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '11px', fontSize: '13px', color: '#EFEBE9' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: 'rgba(45, 106, 79, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>🍃</span>
                    <span><strong>100% Trà lá sạch</strong> ủ mới trong ngày</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: 'rgba(224, 122, 95, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>🥛</span>
                    <span><strong>Sữa tươi thanh trùng</strong> béo mịn tự nhiên</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: 'rgba(82, 183, 136, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>🧊</span>
                    <span><strong>Đá bi tinh khiết</strong> lọc chuẩn RO</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: 'rgba(244, 162, 97, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>🛵</span>
                    <span><strong>Giao siêu tốc</strong> giữ trọn độ mát lạnh</span>
                  </div>
                </div>
              </div>

              {/* Cột 3: Liên hệ & Địa chỉ quán */}
              <div>
                <h4 style={{ fontSize: '16px', fontWeight: 800, color: '#F4A261', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>📍</span>
                  <span>Liên Hệ Đặt Hàng</span>
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px', color: '#D7CCC8' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <MapPin size={17} color="#F4A261" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span>Khu phố 5, Phường Trảng Bom, Thành Phố Đồng Nai</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Phone size={17} color="#52B788" style={{ flexShrink: 0 }} />
                    <span>Hotline / Zalo: <strong style={{ color: '#FFFFFF', fontSize: '14.5px', textDecoration: 'underline' }}>0365565270</strong></span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Clock size={17} color="#F4A261" style={{ flexShrink: 0 }} />
                    <span>Thời gian giao hàng: <strong>20 - 30 phút</strong></span>
                  </div>
                </div>
              </div>

              {/* Cột 4: Hệ thống Quản trị & Trạng thái API */}
              <div>
                <h4 style={{ fontSize: '16px', fontWeight: 800, color: '#F4A261', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>🛡️</span>
                  <span>Cổng Quản Trị Quán</span>
                </h4>
                <p style={{ fontSize: '12.5px', color: '#D7CCC8', marginBottom: '14px', lineHeight: 1.5 }}>
                  Xem doanh thu, in bill tính tiền và cập nhật trạng thái đơn hàng thời gian thực.
                </p>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => setIsAdminMode(true)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '9px 18px',
                      borderRadius: 'var(--radius-full)',
                      background: 'linear-gradient(135deg, #E07A5F 0%, #C27848 100%)',
                      color: '#fff',
                      fontSize: '13px',
                      fontWeight: 800,
                      boxShadow: '0 4px 14px rgba(224, 122, 95, 0.4)',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    <ShieldCheck size={16} />
                    <span>Quản Trị SPA</span>
                  </button>

                  <a
                    href={adminUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '9px 16px',
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      color: '#FFFFFF',
                      fontSize: '13px',
                      fontWeight: 700,
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      textDecoration: 'none'
                    }}
                  >
                    <span>admin.php</span>
                    <span>↗</span>
                  </a>
                </div>
                <div style={{ fontSize: '11.5px', color: '#A1887F', marginTop: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>Trạng thái máy chủ:</span>
                  <span style={{ color: dataSource === 'live_api' ? '#74C69D' : '#F4A261', fontWeight: 800 }}>
                    {dataSource === 'live_api' ? '● Online MySQL DB' : '● Dự phòng Offline'}
                  </span>
                </div>
              </div>
            </div>

            {/* DÒNG BẢN QUYỀN ĐÁY CHÂN TRANG */}
            <div style={{
              borderTop: '1px solid rgba(255, 255, 255, 0.12)',
              paddingTop: '24px',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              fontSize: '12.5px',
              color: '#BCAAA4'
            }}>
              <div>
                © 2026 Cozy Tea & Coffee • Dự án Lập trình Mobile & Web • Nguyễn Quốc Thái
              </div>
              <div style={{ display: 'flex', gap: '16px' }}>
                <span>Freeship từ 50K</span>
                <span>•</span>
                <span>Đổi trả nếu không hài lòng</span>
                <span>•</span>
                <span>Hotline 24/7</span>
              </div>
            </div>
          </div>
        </footer>

        {/* 13. THANH GIỎ HÀNG NỔI Ở ĐÁY MÀN HÌNH ĐIỆN THOẠI (MOBILE BOTTOM CART BAR) */}
        {cartCount > 0 && !isAdminMode && (
          <div
            className="mobile-bottom-cart-bar"
            onClick={() => setIsCartOpen(true)}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255,255,255,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px'
              }}>
                🧋
              </div>
              <div>
                <div style={{ fontSize: '13.5px', fontWeight: 800 }}>
                  Giỏ hàng: {cartCount} ly
                </div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.85)' }}>
                  {formatVND(cartTotal)}
                </div>
              </div>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'var(--accent-orange)',
              padding: '7px 15px',
              borderRadius: 'var(--radius-full)',
              fontSize: '13px',
              fontWeight: 800,
              boxShadow: '0 2px 8px rgba(0,0,0,0.18)'
            }}>
              <span>Xem giỏ & Đặt</span>
              <span>➔</span>
            </div>
          </div>
        )}

        {/* NÚT BACK TO TOP HẠT TRÂN CHÂU NẨY ĐÀN HỒI (LENIS SCROLL TO TOP) */}
        <AnimatePresence>
          {showBackToTop && (
            <motion.button
              key="back-to-top"
              initial={{ opacity: 0, scale: 0.5, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.5, y: 20 }}
              whileHover={{ scale: 1.15, y: -4 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 450, damping: 20 }}
              onClick={() => lenisRef.current?.scrollTo(0, { duration: 1.2 })}
              title="Cuộn lên đầu trang"
              style={{
                position: 'fixed',
                bottom: '30px',
                right: '28px',
                zIndex: 85,
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                backgroundColor: 'var(--primary-600)',
                color: '#fff',
                border: '2px solid rgba(255, 255, 255, 0.4)',
                boxShadow: '0 8px 24px rgba(93, 64, 55, 0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontSize: '22px'
              }}
            >
              🧋
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </ClickSpark>
  );
}
