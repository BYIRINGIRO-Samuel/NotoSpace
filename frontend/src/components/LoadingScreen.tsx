import React, { useEffect, useState } from 'react';
import { GraduationCap, Sparkles, BookOpen, Users, Brain } from 'lucide-react';

const InnovativeLoader: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress >= 100) {
          clearInterval(timer);
          setTimeout(() => setIsClosing(true), 500);
          return 100;
        }
        const diff = Math.random() * 8;
        return Math.min(oldProgress + diff, 100);
      });
    }, 150);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <div className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white transition-all duration-1000 ${isClosing ? 'opacity-0 scale-110 pointer-events-none' : 'opacity-100 scale-100'}`}>
      
      {/* Dynamic Background Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div 
            key={i}
            className="absolute bg-[#349156]/10 rounded-full animate-float"
            style={{
              width: `${Math.random() * 150 + 80}px`,
              height: `${Math.random() * 150 + 80}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDuration: `${Math.random() * 10 + 10}s`,
              animationDelay: `${Math.random() * 5}s`,
              filter: 'blur(50px)'
            }}
          />
        ))}
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#349156 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      {/* Main Loader Content */}
      <div className="relative flex flex-col items-center">
        
        {/* Large Innovative Circular Section */}
        <div className="relative w-80 h-80 md:w-96 md:h-96 flex items-center justify-center">
          {/* Pulsing Outer Glow */}
          <div className="absolute inset-0 bg-[#349156]/5 rounded-full animate-pulse scale-125 blur-3xl" />
          
          {/* Orbiting Icons - Larger Orbit */}
          <div className="absolute inset-[-40px] animate-[spin_12s_linear_infinite]">
             <BookOpen className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-8 text-[#349156]/30" />
          </div>
          <div className="absolute inset-[-40px] animate-[spin_18s_linear_infinite_reverse]">
             <Users className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-8 text-[#349156]/30" />
          </div>
          <div className="absolute inset-[-40px] animate-[spin_15s_linear_infinite] delay-1000">
             <Brain className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-8 text-[#349156]/30" />
          </div>

          {/* Concentric Spinning Rings - More Detailed */}
          <div className="absolute inset-0 border-[2px] border-[#349156]/5 rounded-full shadow-[inset_0_0_20px_rgba(52,145,86,0.05)]" />
          <div className="absolute inset-6 border-[2px] border-[#349156]/10 rounded-full border-t-[#349156] animate-spin" style={{ animationDuration: '3s' }} />
          <div className="absolute inset-12 border-[1px] border-[#349156]/20 rounded-full border-b-[#349156] animate-[spin_4s_linear_infinite_reverse]" />
          <div className="absolute inset-16 border-[1px] border-[#349156]/10 rounded-full" />
          
          {/* Central Logo Container - Circular Frame */}
          <div className="relative w-44 h-44 bg-white rounded-full shadow-[0_30px_70px_rgba(52,145,86,0.2)] flex items-center justify-center group overflow-hidden border border-gray-100/80 backdrop-blur-md">
            <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-[#f0f9f4]" />
            <GraduationCap className="w-20 h-20 text-[#349156] relative z-10 animate-bounce" style={{ animationDuration: '2s' }} />
            
            {/* Liquid Progress Fill */}
            <div 
              className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-[#349156]/25 to-[#349156]/10 transition-all duration-700 ease-out" 
              style={{ height: `${progress}%` }} 
            />

            {/* Shine Effect */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-transparent via-white/40 to-transparent -translate-x-full animate-[shimmer_3s_infinite]" />

            {/* Sparkle effect when nearly done */}
            {progress > 85 && (
              <Sparkles className="absolute top-4 right-4 w-6 h-6 text-[#349156] animate-ping" />
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(40px, -60px) scale(1.1); }
          66% { transform: translate(-30px, 50px) scale(0.9); }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%) rotate(45deg); }
          100% { transform: translateX(100%) rotate(45deg); }
        }
        .animate-float {
          animation: float 20s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default InnovativeLoader;
