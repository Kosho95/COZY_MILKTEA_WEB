import React from 'react';
import { motion } from 'framer-motion';

export default function CategoryTabs({
  categories,
  selectedCategoryId,
  onSelectCategory,
  totalProductsCount,
  isDark = false
}) {
  return (
    <div
      className="category-tabs-sticky"
      style={{
        position: 'sticky',
        top: '70px',
        zIndex: 30,
        backgroundColor: isDark ? 'rgba(24, 17, 14, 0.96)' : 'rgba(255, 251, 245, 0.96)',
        backdropFilter: 'blur(12px)',
        padding: '12px 0',
        borderBottom: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(121, 85, 72, 0.1)',
        marginBottom: '24px',
        transition: 'background-color 0.25s ease, border-color 0.25s ease'
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          overflowX: 'auto',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          paddingBottom: '2px'
        }}
      >
        {/* Nút Tất Cả Món */}
        <button
          type="button"
          onClick={() => onSelectCategory(null)}
          style={{
            whiteSpace: 'nowrap',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            borderRadius: '8px',
            backgroundColor: selectedCategoryId === null
              ? (isDark ? '#C27848' : '#3E2723')
              : (isDark ? '#261B16' : '#FFFFFF'),
            color: selectedCategoryId === null
              ? '#FFFFFF'
              : (isDark ? '#E6DDD8' : '#4B5563'),
            fontWeight: 600,
            fontSize: '13px',
            border: selectedCategoryId === null
              ? `1px solid ${isDark ? '#C27848' : '#3E2723'}`
              : `1px solid ${isDark ? 'rgba(255, 255, 255, 0.12)' : 'var(--border-soft)'}`,
            boxShadow: selectedCategoryId === null
              ? '0 2px 8px rgba(62, 39, 35, 0.18)'
              : 'none',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          <span>Tất cả món</span>
          {totalProductsCount > 0 && (
            <span
              style={{
                fontSize: '11px',
                padding: '2px 7px',
                borderRadius: '6px',
                backgroundColor: selectedCategoryId === null
                  ? 'rgba(255,255,255,0.2)'
                  : (isDark ? 'rgba(255,255,255,0.08)' : '#F3F4F6'),
                color: selectedCategoryId === null
                  ? '#fff'
                  : (isDark ? '#C7B9B4' : '#6B7280'),
                fontWeight: 600
              }}
            >
              {totalProductsCount}
            </span>
          )}
        </button>

        {/* Các Danh Mục Đồ Uống */}
        {categories.map((cat) => {
          const isSelected = selectedCategoryId === cat.id;

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelectCategory(cat.id)}
              style={{
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: '8px',
                backgroundColor: isSelected
                  ? (isDark ? '#C27848' : '#3E2723')
                  : (isDark ? '#261B16' : '#FFFFFF'),
                color: isSelected
                  ? '#FFFFFF'
                  : (isDark ? '#E6DDD8' : '#4B5563'),
                fontWeight: 600,
                fontSize: '13px',
                border: isSelected
                  ? `1px solid ${isDark ? '#C27848' : '#3E2723'}`
                  : `1px solid ${isDark ? 'rgba(255, 255, 255, 0.12)' : 'var(--border-soft)'}`,
                boxShadow: isSelected
                  ? '0 2px 8px rgba(62, 39, 35, 0.18)'
                  : 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
