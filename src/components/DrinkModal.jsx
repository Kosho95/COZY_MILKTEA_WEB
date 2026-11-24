import React, { useState } from 'react';
import { X, Plus, Minus, Check, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatVND } from '../api';
import FluidButton from '@/components/lightswind/fluid-button';

export default function DrinkModal({
  product,
  toppings,
  onClose,
  onAddToCart
}) {
  if (!product) return null;

  const [selectedSize, setSelectedSize] = useState('M'); // 'M' hoặc 'L'
  const [selectedSugar, setSelectedSugar] = useState('100%');
  const [selectedIce, setSelectedIce] = useState('100%');
  const [selectedToppings, setSelectedToppings] = useState([]);
  const [itemNote, setItemNote] = useState('');
  const [quantity, setQuantity] = useState(1);

  // Phụ thu theo Size
  const sizePrice = selectedSize === 'L' ? 10000 : 0;

  // Tính tổng tiền topping đã chọn
  const toppingsPrice = selectedToppings.reduce((sum, topName) => {
    const top = toppings.find(t => t.name === topName);
    return sum + (top ? Number(top.price) : 0);
  }, 0);

  // Đơn giá 1 ly sau khi tùy biến
  const unitPrice = Number(product.base_price) + sizePrice + toppingsPrice;
  // Tổng cộng
  const subtotal = unitPrice * quantity;

  // Toggle Topping
  const handleToggleTopping = (name) => {
    if (selectedToppings.includes(name)) {
      setSelectedToppings(selectedToppings.filter(t => t !== name));
    } else {
      setSelectedToppings([...selectedToppings, name]);
    }
  };

  const handleConfirm = (e) => {
    onAddToCart({
      id: `${product.id}-${selectedSize}-${selectedSugar}-${selectedIce}-${selectedToppings.sort().join(',')}`,
      product_id: product.id,
      name: product.name,
      image_url: product.image_url,
      size: selectedSize,
      sugar: selectedSugar,
      ice: selectedIce,
      toppings: selectedToppings,
      item_note: itemNote.trim(),
      quantity: quantity,
      unit_price: unitPrice,
      subtotal: subtotal
    }, e);
    onClose();
  };

  const sugarLevels = ['0%', '30%', '50%', '70%', '100%'];
  const iceLevels = ['Không đá', '30% đá', '50% đá', '100% đá'];

  const [imgErr, setImgErr] = useState(false);
  const fallbackImg = "https://images.unsplash.com/photo-1558857563-b37cf5b62b1a?w=500";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      data-lenis-prevent
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(38, 23, 19, 0.65)',
        backdropFilter: 'blur(6px)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        overflowY: 'auto',
        overscrollBehavior: 'contain'
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="drink-modal-box"
        data-lenis-prevent
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '840px',
          maxHeight: '90vh',
          display: 'flex',
          overflow: 'hidden',
          boxShadow: '0 20px 48px -10px rgba(38, 23, 19, 0.35)',
          border: '1px solid var(--border-soft)',
          position: 'relative'
        }}
      >
        {/* Nút đóng góc phải */}
        <button
          type="button"
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: 'var(--bg-surface-soft)',
            color: 'var(--text-dark)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 15,
            border: '1px solid var(--border-soft)',
            cursor: 'pointer'
          }}
        >
          <X size={16} />
        </button>

        {/* CỘT TRÁI: Ảnh ly & Giới thiệu hương vị */}
        <div
          className="drink-modal-left"
          style={{
            backgroundColor: 'var(--bg-surface-soft)',
            padding: '32px 24px 24px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            borderRight: '1px solid var(--border-light)',
            position: 'relative'
          }}
        >
          <div
            className="drink-img-box"
            style={{
              width: '190px',
              height: '190px',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 6px 18px rgba(0, 0, 0, 0.08)',
              marginBottom: '16px',
              border: '1px solid var(--border-soft)'
            }}
          >
            <img
              src={imgErr ? fallbackImg : (product.image_url || fallbackImg)}
              alt={product.name}
              onError={() => setImgErr(true)}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          <h2 style={{
            fontSize: '18px',
            fontWeight: 600,
            color: 'var(--text-dark)',
            textAlign: 'center',
            marginBottom: '6px'
          }}>
            {product.name}
          </h2>

          <div style={{
            fontSize: '17px',
            fontWeight: 700,
            color: 'var(--primary-700)',
            marginBottom: '10px'
          }}>
            {formatVND(unitPrice)} <span style={{ fontSize: '12px', color: 'var(--text-light)', fontWeight: 400 }}>/ ly</span>
          </div>

          <p style={{
            fontSize: '12.5px',
            color: 'var(--text-muted)',
            textAlign: 'center',
            lineHeight: 1.5,
            maxWidth: '220px'
          }}>
            {product.description || 'Pha chế tươi mới chuẩn công thức đặc quyền.'}
          </p>
        </div>

        {/* CỘT PHẢI: Tùy biến Size, Đường, Đá & Topping */}
        <div
          className="drink-modal-right"
          data-lenis-prevent
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            maxHeight: '90vh',
            minHeight: 0
          }}
        >
          <div
            data-lenis-prevent
            style={{
              padding: '28px 26px 20px',
              flex: 1,
              overflowY: 'auto',
              overscrollBehavior: 'contain',
              minHeight: 0
            }}
          >
            {/* 1. CHỌN SIZE */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-dark)', marginBottom: '8px' }}>
                1. Chọn kích cỡ ly <span style={{ color: 'var(--accent-orange)' }}>*</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div
                  onClick={() => setSelectedSize('M')}
                  style={{
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: `1.5px solid ${selectedSize === 'M' ? 'var(--primary-600)' : 'var(--border-soft)'}`,
                    backgroundColor: selectedSize === 'M' ? 'var(--primary-600)' : 'var(--bg-surface)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div>
                    <div style={{ fontSize: '13.5px', fontWeight: 600, color: selectedSize === 'M' ? '#fff' : 'var(--text-dark)' }}>Size Vừa (M)</div>
                    <div style={{ fontSize: '11px', color: selectedSize === 'M' ? 'rgba(255,255,255,0.85)' : 'var(--text-muted)' }}>Tiêu chuẩn 500ml</div>
                  </div>
                  <span style={{ fontSize: '12.5px', fontWeight: 600, color: selectedSize === 'M' ? '#fff' : 'var(--text-muted)' }}>+0đ</span>
                </div>

                <div
                  onClick={() => setSelectedSize('L')}
                  style={{
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: `1.5px solid ${selectedSize === 'L' ? 'var(--primary-600)' : 'var(--border-soft)'}`,
                    backgroundColor: selectedSize === 'L' ? 'var(--primary-600)' : 'var(--bg-surface)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div>
                    <div style={{ fontSize: '13.5px', fontWeight: 600, color: selectedSize === 'L' ? '#fff' : 'var(--text-dark)' }}>Size Lớn (L)</div>
                    <div style={{ fontSize: '11px', color: selectedSize === 'L' ? 'rgba(255,255,255,0.85)' : 'var(--text-muted)' }}>700ml</div>
                  </div>
                  <span style={{ fontSize: '12.5px', fontWeight: 600, color: selectedSize === 'L' ? '#fff' : 'var(--accent-orange)' }}>+10.000đ</span>
                </div>
              </div>
            </div>

            {/* 2. CHỌN MỨC ĐƯỜNG */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-dark)', marginBottom: '8px' }}>
                2. Lượng đường
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {sugarLevels.map((lvl) => {
                  const isSel = selectedSugar === lvl;
                  return (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setSelectedSugar(lvl)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '6px',
                        border: `1.5px solid ${isSel ? 'var(--primary-600)' : 'var(--border-soft)'}`,
                        backgroundColor: isSel ? 'var(--primary-600)' : 'var(--bg-surface)',
                        color: isSel ? '#fff' : 'var(--text-body)',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {lvl}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. CHỌN MỨC ĐÁ */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-dark)', marginBottom: '8px' }}>
                3. Lượng đá
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {iceLevels.map((lvl) => {
                  const isSel = selectedIce === lvl;
                  return (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setSelectedIce(lvl)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '6px',
                        border: `1.5px solid ${isSel ? 'var(--primary-600)' : 'var(--border-soft)'}`,
                        backgroundColor: isSel ? 'var(--primary-600)' : 'var(--bg-surface)',
                        color: isSel ? '#fff' : 'var(--text-body)',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {lvl}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 4. CHỌN TOPPING */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-dark)' }}>
                  4. Topping ({selectedToppings.length} đã chọn)
                </span>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Tự do chọn nhiều loại</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '8px' }}>
                {toppings && toppings.map((top) => {
                  const isChecked = selectedToppings.includes(top.name);
                  return (
                    <div
                      key={top.id || top.name}
                      onClick={() => handleToggleTopping(top.name)}
                      style={{
                        padding: '9px 12px',
                        borderRadius: '8px',
                        border: `1.5px solid ${isChecked ? 'var(--accent-orange)' : 'var(--border-soft)'}`,
                        backgroundColor: isChecked ? 'var(--accent-orange-light)' : 'var(--bg-surface)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{
                          width: '16px',
                          height: '16px',
                          borderRadius: '4px',
                          border: `1.5px solid ${isChecked ? 'var(--accent-orange)' : 'var(--border-soft)'}`,
                          backgroundColor: isChecked ? 'var(--accent-orange)' : 'var(--bg-surface-soft)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          {isChecked && <Check size={11} color="#fff" strokeWidth={3} />}
                        </div>
                        <div>
                          <div style={{ fontSize: '12.5px', fontWeight: 500, color: 'var(--text-dark)' }}>
                            {top.name}
                          </div>
                          <div style={{ fontSize: '11px', color: 'var(--accent-orange)', fontWeight: 600 }}>
                            +{formatVND(top.price)}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 5. GHI CHÚ RIÊNG CHO QUÁN */}
            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-dark)', display: 'block', marginBottom: '6px' }}>
                5. Lời nhắn cho Barista (Không bắt buộc)
              </label>
              <input
                type="text"
                placeholder="VD: Để riêng đá giúp mình, cho ít ngọt..."
                value={itemNote}
                onChange={(e) => setItemNote(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-soft)',
                  backgroundColor: 'var(--bg-surface-soft)',
                  fontSize: '12.5px',
                  color: 'var(--text-dark)',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          {/* THANH DƯỚI CÙNG: Số lượng & Nút Thêm vào giỏ */}
          <div style={{
            padding: '16px 26px',
            borderTop: '1px solid var(--border-light)',
            backgroundColor: 'var(--bg-surface)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px'
          }}>
            {/* Bộ đếm số lượng */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'var(--bg-surface-soft)',
              borderRadius: '8px',
              padding: '3px',
              border: '1px solid var(--border-soft)'
            }}>
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '6px',
                  backgroundColor: 'var(--bg-surface)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-dark)',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                <Minus size={13} />
              </button>
              <span style={{ minWidth: '36px', textAlign: 'center', fontWeight: 600, fontSize: '14px' }}>
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '6px',
                  backgroundColor: 'var(--bg-surface)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-dark)',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                <Plus size={13} />
              </button>
            </div>

            {/* Nút Thêm Vào Giỏ */}
            <div style={{ flex: 1, display: 'flex' }}>
              <FluidButton
                type="button"
                variant="milktea"
                onClick={handleConfirm}
                style={{
                  width: '100%',
                  padding: '12px 20px',
                  fontSize: '14px',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <ShoppingBag size={16} />
                <span>Thêm vào giỏ hàng • {formatVND(subtotal)}</span>
              </FluidButton>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
