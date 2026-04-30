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
      
      <div className="relative w-64 h-64 flex items-center justify-center">
        
        {/* The Animated Trail & Pencil */}
        <div className="absolute inset-0 animate-[spin_4s_linear_infinite]">
          
          {/* Dynamic "Ink" Trail - Spaced dots starting from the pencil's rubber part */}
          {[...Array(22)].map((_, i) => (
            <div 
              key={i}
              className="absolute bg-[#349156] rounded-full"
              style={{
                width: `${Math.max(12 - i * 0.5, 2)}px`,
                height: `${Math.max(12 - i * 0.5, 2)}px`,
                top: '50%',
                left: '50%',
                transform: `rotate(${255 - i * 10}deg) translateY(-110px) translateX(-50%)`,
                opacity: Math.max(1 - i * 0.04, 0),
              }}
            />
          ))}

          {/* The Flying Pencil - Rubber part leading the trail */}
          <div 
            className="absolute top-1/2 left-1/2"
            style={{ transform: `rotate(290deg) translateY(-110px) translateX(-50%) translateY(-50%)` }}
          >
            <div className="relative">
                <Pencil className="w-14 h-14 text-[#349156] -rotate-[45deg]" />
                <div className="absolute top-1 right-1 w-4 h-4 bg-[#349156]/20 rounded-full blur-sm" />
            </div>
          </div>
        </div>

        {/* Center Text - Reduced size and added smooth animation */}
        <div className="flex items-center justify-center gap-1">
          {"LOADING".split("").map((char, index) => (
            <span 
              key={index}
              className="text-[#349156] font-black text-lg tracking-widest uppercase opacity-20 animate-text-fade"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {char}
            </span>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes text-fade {
          0%, 100% { opacity: 0.2; transform: scale(1); filter: blur(0px); }
          50% { opacity: 0.5; transform: scale(1.1); filter: blur(1px); }
        }
        .animate-text-fade {
          animation: text-fade 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default InnovativeLoader;
