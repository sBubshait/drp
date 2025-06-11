export default function Flame({ className }) {
  return (
    <div className={className}>
      <div className="relative">
        {/* Main flame body */}
        <div className="flame-container relative">
          {/* Outer flame */}
          <div className="flame-outer absolute bottom-0 left-1/2 -translate-x-1/2 transform w-16 h-20 bg-gradient-to-t from-red-600 via-red-500 to-orange-400 rounded-full opacity-90 animate-flicker-outer"></div>
          
          {/* Middle flame */}
          <div className="flame-middle absolute bottom-1 left-1/2 -translate-x-1/2 transform w-12 h-16 bg-gradient-to-t from-red-500 via-orange-500 to-yellow-400 rounded-full opacity-95 animate-flicker-middle"></div>
          
          {/* Inner flame */}
          <div className="flame-inner absolute bottom-2 left-1/2 -translate-x-1/2 transform w-8 h-12 bg-gradient-to-t from-orange-500 via-yellow-400 to-yellow-300 rounded-full animate-flicker-inner"></div>
          
          {/* Core flame */}
          <div className="flame-core absolute bottom-3 left-1/2 -translate-x-1/2 transform w-4 h-8 bg-gradient-to-t from-yellow-400 to-yellow-200 rounded-full animate-flicker-core"></div>
        </div>
        
        {/* Flame base/wick effect */}
        <div className="absolute bottom-[-15px] left-1/2 z-[-1] transform -translate-x-1/2 w-2 h-7 bg-orange-800 rounded-sm"></div>
      </div>
      
      <style jsx>{`
        @keyframes flicker-outer {
          0%, 100% { 
            transform: scaleY(1) scaleX(1);
            opacity: 0.9;
          }
          25% { 
            transform: scaleY(1.1) scaleX(0.95);
            opacity: 0.85;
          }
          50% { 
            transform: scaleY(0.95) scaleX(1.05);
            opacity: 0.9;
          }
          75% { 
            transform: scaleY(1.05) scaleX(0.9);
            opacity: 0.88;
          }
        }
        
        @keyframes flicker-middle {
          0%, 100% { 
            transform: scaleY(1) scaleX(1);
            opacity: 0.95;
          }
          20% { 
            transform: scaleY(1.08) scaleX(0.92);
            opacity: 0.9;
          }
          40% { 
            transform: scaleY(0.92) scaleX(1.08);
            opacity: 0.95;
          }
          80% { 
            transform: scaleY(1.05) scaleX(0.88);
            opacity: 0.92;
          }
        }
        
        @keyframes flicker-inner {
          0%, 100% { 
            transform: scaleY(1) scaleX(1);
          }
          30% { 
            transform: scaleY(1.15) scaleX(0.85);
          }
          60% { 
            transform: scaleY(0.88) scaleX(1.12);
          }
          90% { 
            transform: scaleY(1.08) scaleX(0.92);
          }
        }
        
        @keyframes flicker-core {
          0%, 100% { 
            transform: scaleY(1) scaleX(1);
          }
          15% { 
            transform: scaleY(1.2) scaleX(0.8);
          }
          45% { 
            transform: scaleY(0.85) scaleX(1.15);
          }
          70% { 
            transform: scaleY(1.1) scaleX(0.9);
          }
        }
        
        .animate-flicker-outer {
          animation: flicker-outer 2s ease-in-out infinite;
        }
        
        .animate-flicker-middle {
          animation: flicker-middle 1.8s ease-in-out infinite 0.2s;
        }
        
        .animate-flicker-inner {
          animation: flicker-inner 1.5s ease-in-out infinite 0.4s;
        }
        
        .animate-flicker-core {
          animation: flicker-core 1.2s ease-in-out infinite 0.6s;
        }
      `}</style>
    </div>
  );
};

