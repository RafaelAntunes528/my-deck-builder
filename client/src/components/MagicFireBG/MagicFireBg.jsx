import React from 'react';
import '../../index.css';

const FireSparks = () => {
  const totalSparks = 10; // Reduzido para performance
  const specialSparks = 2; // Reduzido para performance

  const colorOptions = [
    { class: 'bg-white', shadow: 'rgba(255, 255, 255, 0.6)' },
    { class: 'bg-black', shadow: 'rgba(0, 0, 0, 0.6)' },
    { class: 'bg-blue-500', shadow: 'rgba(59, 130, 246, 0.6)' },
    { class: 'bg-green-400', shadow: 'rgba(74, 222, 128, 0.6)' },
    { class: 'bg-red-500', shadow: 'rgba(239, 68, 68, 0.6)' },
    { class: 'bg-[rgb(192,192,192)]', shadow: 'rgba(192, 192, 192, 0.6)' }, // prata
    { class: 'bg-[rgb(255,215,0)]', shadow: 'rgba(255, 215, 0, 0.6)' },     // dourado
  ];

  const renderSpark = (i, isSpecial = false) => {
    const { class: colorClass, shadow } = colorOptions[Math.floor(Math.random() * colorOptions.length)];
    const size = isSpecial ? 8 + Math.random() * 6 : 2 + Math.random() * 4;
    const duration = isSpecial ? 6 + Math.random() * 4 : 3 + Math.random() * 3;

    return (
      <div
        key={`spark-${i}-${isSpecial ? 'special' : 'normal'}`}
        className={`spark absolute bottom-10 ${colorClass} opacity-80 animate-spark animate-twinkle animate-color-shift`}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          left: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 5}s`,
          animationDuration: `${duration}s`,
          transform: `scale(${0.25 + Math.random()})`,
          filter: `drop-shadow(0 0 5px ${shadow}) blur(${Math.random() * 7 + 4}px)`,
          borderRadius: `${Math.random() * 50}% ${Math.random() * 50}% ${Math.random() * 50}% ${Math.random() * 50}%`,
        }}
      />
    );
  };

  return (
    <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
      {Array.from({ length: totalSparks }).map((_, i) => renderSpark(i))}
      {Array.from({ length: specialSparks }).map((_, i) => renderSpark(i, true))}
    </div>
  );
};

export default FireSparks;

