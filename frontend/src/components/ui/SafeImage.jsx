import React from 'react';

const SafeImage = ({ 
  src, 
  alt, 
  fallbackType = 'book', 
  fallbackText = '',
  className = '', 
  width = 400,
  height = 600,
  ...props 
}) => {
  const getFallbackImage = (type, text, customWidth, customHeight) => {
    const colors = {
      book: '4A5568',
      avatar: '2D3748',
      event: '4C51BF',
      club: '2F855A',
      default: '718096'
    };
    
    const getInitials = (name) => {
      if (!name || typeof name !== 'string') return '?';
      const parts = name.trim().split(' ');
      if (parts.length > 1) {
        return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
      }
      return name.charAt(0).toUpperCase();
    };
    
    const textMap = {
      book: text || 'Livre',
      avatar: getInitials(text) || '?',
      event: text || 'Événement',
      club: text || 'Club',
      default: text || 'Image'
    };
    
    const fontSize = {
      book: Math.floor(customWidth / 16),
      avatar: Math.floor(customWidth / 3),
      event: Math.floor(customWidth / 20),
      club: Math.floor(customWidth / 18),
      default: Math.floor(customWidth / 20)
    };
    
    const encodedText = encodeURIComponent(textMap[type] || textMap.default);
    const color = colors[type] || colors.default;
    
    return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${customWidth}' height='${customHeight}' viewBox='0 0 ${customWidth} ${customHeight}'%3E%3Crect width='${customWidth}' height='${customHeight}' fill='%23${color}'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial,sans-serif' font-size='${fontSize[type] || fontSize.default}' fill='white' text-anchor='middle' dy='.3em'%3E${encodedText}%3C/text%3E%3C/svg%3E`;
  };

  const handleError = (e) => {
    e.target.onerror = null;
    e.target.src = getFallbackImage(fallbackType, fallbackText || alt, width, height);
  };

  const safeSrc = src || getFallbackImage(fallbackType, fallbackText || alt, width, height);

  return (
    <img
      src={safeSrc}
      alt={alt}
      className={className}
      onError={handleError}
      {...props}
    />
  );
};

export default SafeImage;