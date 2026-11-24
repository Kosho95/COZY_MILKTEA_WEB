import React from 'react';
import { Tag, Sparkles, Zap, ShieldCheck, Clock, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import TiltedCard, { TiltedCardLayer } from './TiltedCard';

export default function HeroBanner({ onApplyCoupon, activeCoupon }) {
  const coupons = [
    { code: 'GIAM15K', title: 'Giảm 15.000đ', desc: 'Đơn từ 60.000đ', color: '#C27848' },
    { code: 'FREESHIP', title: 'Freeship đơn 50K', desc: 'Tối đa 25.000đ', color: '#2D6A4F' },
    { code: 'BANMOI', title: 'Giảm 20% đơn đầu', desc: 'Dành cho khách mới', color: '#B06C3B' }
  ];

  const handleApplyCoupon = (code) => {
    if (onApplyCoupon) onApplyCoupon(code);
  };

  return (
    <div style={{ marginTop: '16px', marginBottom: '28px', position: 'relative', width: '100%' }}>
      <div className="container" style={{ padding: '0 14px' }}>
        {/* Main Hero Card */}
        <div
          className="hero-card"
          style={{
            backgroundColor: '#261713',
            borderRadius: '20px',
            padding: '38px 34px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: '0 16px 36px -8px rgba(38, 23, 19, 0.35)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '32px',
            position: 'relative',
            overflow: 'hidden',
            width: '100%',
            boxSizing: 'border-box'
          }}
        >
          {/* Subtle warm ambient glow behind product */}
          <div
            style={{
              position: 'absolute',
              right: '280px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '320px',
              height: '320px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(194, 120, 72, 0.12) 0%, transparent 70%)',
              pointerEvents: 'none'
            }}
          />

          {/* KHỐI NỘI DUNG BÊN TRÁI */}
          <div className="hero-left-col" style={{ flex: '1 1 340px', minWidth: 0, maxWidth: '100%', zIndex: 2 }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '5px 12px',
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                borderRadius: '8px',
                color: '#E6DDD8',
                fontSize: '12px',
                fontWeight: 500,
                marginBottom: '14px',
                border: '1px solid rgba(255, 255, 255, 0.12)'
              }}
            >
              <Sparkles size={13} color="#F4A261" />
              <span>Trà lá nguyên bản & kem tươi thủ công mỗi ngày</span>
            </div>

            <h1
              className="hero-title"
              style={{
                fontSize: '32px',
                fontWeight: 600,
                color: '#FFF8F0',
                lineHeight: 1.3,
                marginBottom: '12px',
                letterSpacing: '-0.02em'
              }}
            >
              Thưởng thức vị trà nguyên bản, <br />
              <span style={{ color: '#F4A261' }}>lớp kem sánh mịn</span> và trân châu dẻo bùi.
            </h1>

            <p
              style={{
                fontSize: '14px',
                color: '#C7B9B4',
                maxWidth: '480px',
                lineHeight: 1.6,
                marginBottom: '24px'
              }}
            >
              Pha chế thủ công theo từng đơn đặt hàng. Tự do điều chỉnh mức đường, lượng đá và phủ đầy topping ưa thích.
            </p>

            {/* QUICK FEATURE CHIPS */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '7px',
                  fontSize: '12px',
                  color: '#E6DDD8',
                  fontWeight: 500,
                  backgroundColor: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  padding: '6px 12px',
                  borderRadius: '8px'
                }}
              >
                <Zap size={13} color="#52B788" />
                <span>Giao nhanh 20 phút</span>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '7px',
                  fontSize: '12px',
                  color: '#E6DDD8',
                  fontWeight: 500,
                  backgroundColor: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  padding: '6px 12px',
                  borderRadius: '8px'
                }}
              >
                <ShieldCheck size={13} color="#F4A261" />
                <span>100% lá trà mộc tự nhiên</span>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '7px',
                  fontSize: '12px',
                  color: '#E6DDD8',
                  fontWeight: 500,
                  backgroundColor: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  padding: '6px 12px',
                  borderRadius: '8px'
                }}
              >
                <Clock size={13} color="#E76F51" />
                <span>Kem cheese đánh mới trong ngày</span>
              </div>
            </div>
          </div>

          {/* KHỐI 3D TILTED CARD - SIGNATURE DRINK */}
          <div className="hero-tilted-spotlight" style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2
          }}>
            <TiltedCard
              imageSrc="https://images.unsplash.com/photo-1558857563-b37cf5b62b1a?w=600&q=80&auto=format&fit=crop"
              altText="Trà Sữa Nướng Trân Châu Hoàng Kim"
              captionText="Trà Sữa Nướng Hoàng Kim"
              containerHeight="220px"
              containerWidth="195px"
              imageHeight="220px"
              imageWidth="195px"
              rotateAmplitude={12}
              scaleOnHover={1.05}
              glare={0.4}
              shadow={0.3}
            >
              <TiltedCardLayer depth={28}>
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  left: '12px',
                  backgroundColor: 'rgba(38, 23, 19, 0.85)',
                  color: '#F4A261',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontSize: '11px',
                  fontWeight: 600,
                  border: '1px solid rgba(244, 162, 97, 0.3)',
                  backdropFilter: 'blur(6px)'
                }}>
                  Món đặc trưng
                </div>
              </TiltedCardLayer>
              <TiltedCardLayer depth={18}>
                <div style={{
                  position: 'absolute',
                  bottom: '44px',
                  right: '12px',
                  backgroundColor: 'rgba(38, 23, 19, 0.85)',
                  color: '#FFF8F0',
                  padding: '3px 8px',
                  borderRadius: '6px',
                  fontSize: '11.5px',
                  fontWeight: 600,
                  backdropFilter: 'blur(4px)',
                  border: '1px solid rgba(255, 255, 255, 0.15)'
                }}>
                  32.000đ
                </div>
              </TiltedCardLayer>
            </TiltedCard>
          </div>

          {/* KHỐI MÃ GIẢM GIÁ BÊN PHẢI */}
          <div className="hero-right-col" style={{ flex: '1 1 290px', minWidth: 0, maxWidth: '100%', zIndex: 2 }}>
            <div
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderRadius: '16px',
                padding: '20px',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
                border: '1px solid var(--border-soft)'
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '13.5px',
                  fontWeight: 600,
                  color: 'var(--text-dark)',
                  marginBottom: '14px'
                }}
              >
                <Tag size={15} color="#C27848" />
                <span>Mã ưu đãi hôm nay</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {coupons.map((c) => {
                  const isApplied = activeCoupon === c.code;
                  return (
                    <div
                      key={c.code}
                      onClick={() => handleApplyCoupon(c.code)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 12px',
                        backgroundColor: isApplied ? 'var(--accent-orange-light)' : 'var(--bg-surface-soft)',
                        borderRadius: '10px',
                        border: `1px solid ${isApplied ? c.color : 'var(--border-soft)'}`,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span
                            style={{
                              fontFamily: 'monospace',
                              fontWeight: 700,
                              backgroundColor: 'var(--bg-surface)',
                              border: `1px solid ${isApplied ? c.color : 'var(--border-soft)'}`,
                              color: isApplied ? c.color : 'var(--text-dark)',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              fontSize: '11px'
                            }}
                          >
                            {c.code}
                          </span>
                          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-dark)' }}>
                            {c.title}
                          </span>
                        </div>
                        <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '3px' }}>
                          {c.desc}
                        </div>
                      </div>

                      <button
                        type="button"
                        style={{
                          fontSize: '11.5px',
                          fontWeight: 600,
                          padding: '5px 12px',
                          borderRadius: '6px',
                          backgroundColor: isApplied ? c.color : '#3E2723',
                          color: '#fff',
                          border: 'none',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        {isApplied ? (
                          <>
                            <Check size={12} strokeWidth={2.5} />
                            <span>Đã dùng</span>
                          </>
                        ) : (
                          'Áp dụng'
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
