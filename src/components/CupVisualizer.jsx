import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function getDrinkVisualTheme(productName = '') {
  const n = productName.toLowerCase();
  if (n.includes('matcha') || n.includes('thái xanh')) {
    return { liquid: '#6B9E68', foam: '#E9F2E4', straw: '#2D5A3D', label: 'Trà xanh' };
  }
  if (n.includes('khoai môn')) {
    return { liquid: '#B592C6', foam: '#F4EDF7', straw: '#7A5492', label: 'Khoai môn' };
  }
  if (n.includes('đào') || n.includes('vải') || n.includes('trái cây') || n.includes('mãng cầu')) {
    return { liquid: '#E89B6C', foam: '#FFF3EA', straw: '#C85A32', label: 'Trà trái cây' };
  }
  if (n.includes('cà phê') || n.includes('bạc xỉu') || n.includes('americano') || n.includes('phin')) {
    return { liquid: '#7B4F35', foam: '#F5EBDC', straw: '#4A2C1A', label: 'Cà phê' };
  }
  if (n.includes('sữa tươi')) {
    return { liquid: '#F3EAD8', foam: '#FFFFFF', straw: '#B86B2B', label: 'Sữa tươi' };
  }
  return { liquid: '#C99B6B', foam: '#FAF3E8', straw: '#8C5828', label: 'Trà sữa' };
}

export default function CupVisualizer({
  productName = '',
  size = 'M',
  sugar = '100%',
  ice = '100% đá',
  selectedToppings = [],
}) {
  const theme = getDrinkVisualTheme(productName);
  const scale = size === 'L' ? 1.12 : 0.96;

  const iceCount = ice.includes('Không')
    ? 0
    : ice.includes('30%')
      ? 2
      : ice.includes('50%')
        ? 4
        : 6;

  const hasCheese = selectedToppings.some((t) => t.toLowerCase().includes('cheese'));
  const bobaCount = Math.min(selectedToppings.length * 4, 16);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      padding: '18px 12px 14px',
      borderRadius: '14px',
      backgroundColor: 'var(--bg-surface)',
      border: '1px solid var(--border-soft)',
      marginBottom: '14px',
    }}>
      <div style={{
        height: '165px',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        paddingBottom: '6px',
      }}>
        <motion.div
          animate={{ scale }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            transformOrigin: 'bottom center',
          }}
        >
          {/* Ống hút */}
          <div style={{
            position: 'absolute',
            top: '-24px',
            right: '22px',
            width: '9px',
            height: '44px',
            borderRadius: '5px',
            backgroundColor: theme.straw,
            transform: 'rotate(13deg)',
            zIndex: 1,
          }} />

          {/* Nắp ly */}
          <div style={{
            width: '96px',
            height: '15px',
            borderTopLeftRadius: '12px',
            borderTopRightRadius: '12px',
            backgroundColor: 'rgba(255,255,255,0.9)',
            border: '2px solid #D6CBB8',
            position: 'relative',
            zIndex: 2,
          }} />

          {/* Thân ly */}
          <div style={{
            width: '84px',
            height: '110px',
            borderBottomLeftRadius: '20px',
            borderBottomRightRadius: '20px',
            border: '2px solid #D6CBB8',
            borderTop: 'none',
            backgroundColor: '#FFFDF9',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}>
            {/* Lớp kem cheese hoặc bọt sữa */}
            {hasCheese ? (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 22, opacity: 1 }}
                style={{
                  backgroundColor: '#FFF3CC',
                  borderBottom: '1px solid #EEDB9D',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '9px',
                  fontWeight: 700,
                  color: '#946B1E',
                }}
              >
                Kem Cheese
              </motion.div>
            ) : (
              <div style={{ height: '12px', backgroundColor: theme.foam }} />
            )}

            {/* Nước trà */}
            <div style={{
              flex: 1,
              backgroundColor: theme.liquid,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: '7px',
              transition: 'background-color 0.3s ease',
            }}>
              {/* Đá viên */}
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '4px',
                justifyContent: 'center',
              }}>
                <AnimatePresence>
                  {Array.from({ length: iceCount }).map((_, idx) => (
                    <motion.div
                      key={`ice-${idx}`}
                      initial={{ scale: 0, y: -10, opacity: 0 }}
                      animate={{ scale: 1, y: 0, opacity: 1, rotate: (idx % 2 === 0 ? 1 : -1) * (10 + idx * 5) }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                      style={{
                        width: '14px',
                        height: '14px',
                        borderRadius: '3px',
                        backgroundColor: 'rgba(255, 255, 255, 0.58)',
                        border: '1px solid rgba(255, 255, 255, 0.9)',
                      }}
                    />
                  ))}
                </AnimatePresence>
              </div>

              {/* Topping ở đáy ly */}
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '3px',
                justifyContent: 'center',
              }}>
                <AnimatePresence>
                  {Array.from({ length: bobaCount }).map((_, idx) => (
                    <motion.div
                      key={`boba-${idx}`}
                      initial={{ scale: 0, y: -12 }}
                      animate={{ scale: 1, y: 0 }}
                      exit={{ scale: 0 }}
                      transition={{ type: 'spring', stiffness: 320, damping: 16 }}
                      style={{
                        width: '9px',
                        height: '9px',
                        borderRadius: '50%',
                        backgroundColor:
                          idx % 3 === 1 ? '#F7EFE2' : idx % 3 === 2 ? '#B86B2B' : '#251B18',
                        border: idx % 3 === 1 ? '1px solid #D2C2AE' : 'none',
                      }}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Thông số nhanh bên dưới ly */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '6px',
        justifyContent: 'center',
        marginTop: '8px',
      }}>
        <span style={badgeStyle}>Size {size}</span>
        <span style={badgeStyle}>Đường {sugar}</span>
        <span style={badgeStyle}>{ice}</span>
        <span style={badgeStyle}>{selectedToppings.length} topping</span>
      </div>
    </div>
  );
}

const badgeStyle = {
  fontSize: '11px',
  fontWeight: 600,
  padding: '3px 8px',
  borderRadius: '999px',
  backgroundColor: 'var(--bg-surface-soft)',
  border: '1px solid var(--border-soft)',
  color: 'var(--text-dark)',
};
