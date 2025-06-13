import { useState, useEffect } from 'react';

export default function StreakMeter({ 
  value = 0, 
  height = 'h-6', 
  barColor = 'bg-blue-500',
  backgroundColor = 'bg-gray-400',
  duration = 1000,
  className = ''
}) {
  const [currentValue, setCurrentValue] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentValue(Math.min(Math.max(value, 0), 100));
    }, 100);

    return () => clearTimeout(timer);
  }, [value]);

  return (
    <div className={`w-full ${backgroundColor} rounded-lg overflow-hidden ${className}`}>
      <div 
        className={`${height} ${barColor} relative overflow-hidden transition-all duration-1000 ease-out`}
        style={{ 
          width: `${currentValue}%`,
          transitionDuration: `${duration}ms`
        }}
      >
        {/* Diagonal stripes */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `repeating-linear-gradient(
              45deg,
              transparent,
              transparent 10px,
              rgba(255,255,255,0.5) 10px,
              rgba(255,255,255,0.5) 20px
            )`
          }}
        />
        
        {/* Shine animation */}
        <div 
          className="absolute inset-0 animate-pulse"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
            animation: 'shine 2s infinite'
          }}
        />
      </div>
      
      <style jsx>{`
        @keyframes shine {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        .animate-shine {
          animation: shine 2s infinite;
        }
      `}</style>
    </div>
  );
};
