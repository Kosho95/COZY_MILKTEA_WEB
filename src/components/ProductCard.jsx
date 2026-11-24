import React, { useState } from 'react';
import { Plus, Flame, Sparkles, Tag, Heart, Star } from 'lucide-react';
import { formatVND } from '../api';
import FluidButton from '@/components/lightswind/fluid-button';

export default function ProductCard({ product, categoryName, onSelectProduct }) {
  const [imgError, setImgError] = useState(false);
  const [isFav, setIsFav] = useState(false);

  const id = Number(product.id) || 1;
  const catId = Number(product.category_id) || 1;

  // Phân loại nhãn thể loại sản phẩm (không dùng emoji)
  const getCategoryMeta = () => {
    const name = (product.name || '').toLowerCase();
    const cat = (categoryName || '').toLowerCase();

    if (catId === 2 || name.includes('cà phê') || name.includes('bạc xỉu') || name.includes('americano')) {
      return {
        accent: '#5D4037',
        tagText: 'Cà phê',
        fluidVariant: 'coffee'
      };
    }
    if (name.includes('matcha') || catId === 4 || name.includes('đá xay') || cat.includes('matcha')) {
      return {
        accent: '#2D6A4F',
        tagText: 'Matcha & Đá xay',
        fluidVariant: 'matcha'
      };
    }
    if (catId === 3 || name.includes('trà đào') || name.includes('vải') || name.includes('mãng cầu') || name.includes('dâu')) {
      return {
        accent: '#C27848',
        tagText: 'Trà trái cây',
        fluidVariant: 'peach'
      };
    }
    return {
      accent: '#B06C3B',
      tagText: 'Trà sữa',
      fluidVariant: 'milktea'
    };
  };

  const meta = getCategoryMeta();

  // Nhãn badge trạng thái (nhẹ nhàng, không gradient chói)
  const getBadge = () => {
    if (id === 1 || id === 2 || id === 3 || id === 10) {
      return { text: 'Bán chạy', icon: <Flame size={12} color="#fff" />, bg: '#C27848' };
    }
    if (id === 5 || id === 6 || id === 12 || id === 13) {
      return { text: 'Món mới', icon: <Sparkles size={12} color="#fff" />, bg: '#2D6A4F' };
    }
    if (id % 3 === 0) {
      return { text: 'Giảm 15%', icon: <Tag size={12} color="#fff" />, bg: '#8D6E63' };
    }
    return null;
  };

  const badge = getBadge();
  const fallbackImg = "https://images.unsplash.com/photo-1558857563-b37cf5b62b1a?w=500";

  const rating = (4.8 + ((id * 7) % 3) / 10).toFixed(1);
  const salesCount = 450 + (id * 97) % 1200;

  return (
    <div
      className="product-card-item"
      onClick={() => onSelectProduct(product)}
      style={{
        backgroundColor: 'var(--bg-surface)',
        borderRadius: '16px',
        overflow: 'hidden',
        border: '1px solid var(--border-soft)',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        cursor: 'pointer',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 12px 28px -6px rgba(62, 39, 35, 0.12)';
        e.currentTarget.style.borderColor = 'rgba(194, 120, 72, 0.35)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.04)';
        e.currentTarget.style.borderColor = 'var(--border-soft)';
      }}
    >
      {/* ẢNH SẢN PHẨM */}
      <div style={{
        position: 'relative',
        width: '100%',
        paddingTop: '72%',
        overflow: 'hidden',
        backgroundColor: 'var(--bg-surface-soft)'
      }}>
        <img
          src={imgError ? fallbackImg : (product.image_url || fallbackImg)}
          alt={product.name}
          onError={() => setImgError(true)}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.4s ease'
          }}
        />

        {/* Badge góc trên bên trái */}
        {badge && (
          <div
            style={{
              position: 'absolute',
              top: '10px',
              left: '10px',
              backgroundColor: badge.bg,
              color: '#fff',
              fontSize: '11px',
              fontWeight: 600,
              padding: '3px 8px',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              zIndex: 3
            }}
          >
            {badge.icon}
            <span>{badge.text}</span>
          </div>
        )}

        {/* Nhãn loại món góc dưới ảnh */}
        <div style={{
          position: 'absolute',
          bottom: '8px',
          left: '10px',
          backgroundColor: 'rgba(255, 255, 255, 0.92)',
          backdropFilter: 'blur(4px)',
          color: meta.accent,
          fontSize: '10.5px',
          fontWeight: 600,
          padding: '2px 7px',
          borderRadius: '5px',
          zIndex: 2
        }}>
          {meta.tagText}
        </div>

        {/* Nút yêu thích */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsFav(!isFav);
          }}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            width: '30px',
            height: '30px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 3,
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
          }}
          title="Yêu thích món này"
        >
          <Heart
            size={15}
            color={isFav ? '#E07A5F' : '#8D6E63'}
            fill={isFav ? '#E07A5F' : 'none'}
          />
        </button>
      </div>

      {/* THÔNG TIN CHI TIẾT */}
      <div className="product-card-body" style={{
        padding: '14px 16px 16px',
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        justifyContent: 'space-between',
        backgroundColor: 'var(--bg-surface)'
      }}>
        <div>
          {/* Đánh giá & lượt bán */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '6px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Star size={13} color="#F59E0B" fill="#F59E0B" />
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-body)' }}>{rating}</span>
            </div>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              Đã bán {salesCount}+
            </span>
          </div>

          {/* Tên Món */}
          <h3 className="product-card-title" style={{
            fontSize: '15.5px',
            fontWeight: 600,
            color: 'var(--text-dark)',
            lineHeight: 1.35,
            marginBottom: '6px',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            minHeight: '42px'
          }}>
            {product.name}
          </h3>

          {/* Mô tả món */}
          <p className="product-card-desc" style={{
            fontSize: '12px',
            color: 'var(--text-muted)',
            lineHeight: 1.45,
            marginBottom: '14px',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            minHeight: '34px'
          }}>
            {product.description || 'Pha chế tươi mới chuẩn vị từ nguyên liệu tự nhiên.'}
          </p>
        </div>

        {/* CHÂN THẺ: GIÁ & NÚT CHỌN */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: '10px',
          borderTop: '1px solid var(--border-light)',
          marginTop: 'auto'
        }}>
          <div>
            <span style={{ fontSize: '10.5px', color: 'var(--text-muted)', display: 'block' }}>
              Giá từ
            </span>
            <div className="product-card-price" style={{
              fontSize: '16.5px',
              fontWeight: 700,
              color: 'var(--primary-700)'
            }}>
              {formatVND(product.base_price)}
            </div>
          </div>

          <FluidButton
            variant={meta.fluidVariant}
            onClick={(e) => {
              e.stopPropagation();
              onSelectProduct(product);
            }}
          >
            <Plus size={14} strokeWidth={2.5} />
            <span>Chọn món</span>
          </FluidButton>
        </div>
      </div>
    </div>
  );
}
