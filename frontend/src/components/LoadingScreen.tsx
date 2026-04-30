import React, { useEffect, useState } from 'react';
import { Pencil } from 'lucide-react';

const InnovativeLoader: React.FC = () => {
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsClosing(true);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white transition-all duration-1000 ${isClosing ? 'opacity-0 scale-110 pointer-events-none' : 'opacity-100 scale-100'}`}>
      
      {/* Centered Container */}
      <div className="relative w-64 h-64 flex items-center justify-center">
        
        {/* The Animated Trail & Pencil */}
        <div className="absolute inset-0 animate-[spin_4s_linear_infinite]">
          
          {/* Dynamic "Ink" Trail - Spaced dots starting from the pencil's rubber part */}
          {[...Array(22)].map((_, i) => (
            <div 
              key={i}
              className="absolute bg-[#349156] rounded-full"
              style={{
                // Dots start large (12px) and shrink
                width: `${Math.max(12 - i * 0.5, 2)}px`,
                height: `${Math.max(12 - i * 0.5, 2)}px`,
                top: '50%',
                left: '50%',
                // Spacing between dots (approx 10 degrees)
                // Positioned behind the pencil's leader position
                transform: `rotate(${268 - i * 10}deg) translateY(-110px) translateX(-50%)`,
                opacity: Math.max(1 - i * 0.04, 0),
              }}
            />
          ))}

          {/* The Flying Pencil - Correctly oriented so the Rubber (top of icon) is at the trail start */}
          <div 
            className="absolute top-1/2 left-1/2"
            style={{ transform: `rotate(270deg) translateY(-110px) translateX(-50%) translateY(-50%)` }}
          >
            <div className="relative">
                {/* Pencil Icon: In Lucide, tip is bottom-left, rubber is top-right. */}
                {/* We rotate it so the rubber part (top) is the point of contact with the trail. */}
                {/* A rotation of -45deg or -135deg might be needed depending on the "upside down" feedback. */}
                {/* Let's try to make it upright-ish like the image. */}
                <Pencil className="w-14 h-14 text-[#349156] -rotate-[45deg]" />
                
                {/* Subtle highlight at the rubber part where dots emerge */}
                <div className="absolute top-1 right-1 w-4 h-4 bg-[#349156]/20 rounded-full blur-sm" />
            </div>
          </div>
        </div>

        {/* Center Text */}
        <div className="text-[#349156] font-black text-4xl tracking-[0.25em] uppercase opacity-30 select-none">
          LOADING
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default InnovativeLoader;
