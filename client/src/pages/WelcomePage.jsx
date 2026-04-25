import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Activity } from 'lucide-react';

const images = [
  '/assets/rescue_flood.png',
  '/assets/scout_drone.png',
  '/assets/tech_tablet.png'
];

export default function WelcomePage() {
  const [currentImage, setCurrentImage] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-screen w-full overflow-hidden bg-background flex items-center justify-center">
      {/* Background Slideshow */}
      {images.map((img, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            idx === currentImage ? 'opacity-100' : 'opacity-0 z-0'
          }`}
        >
          <img
            src={img}
            alt={`Slide ${idx}`}
            className="w-full h-full object-cover animate-pulse-slow blur-[2px]"
          />
        </div>
      ))}

      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-100/50 via-blue-900/30 to-slate-100/90 z-10" />

      {/* Main Content Card */}
      <div className="relative z-20 w-fit mx-auto animate-fade-in">
        <div className="glass-panel p-10 md:p-14 text-center max-w-3xl transform hover:scale-[1.02] transition-transform duration-500">
          
          {/* Logo / Heartbeat icon */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <Activity className="w-16 h-16 text-primary animate-pulse" />
              <div className="absolute inset-0 rounded-full border-2 border-primary opacity-50 animate-ping-slow"></div>
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-200 tracking-tight mb-4 drop-shadow-lg">
            ResQ<span className="text-slate-900">Sense</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-blue-700 font-medium mb-8">
            "We find the people who cannot call for help."
          </p>

          <div className="space-y-4 mb-10 text-slate-700 text-lg md:text-xl font-light italic">
            <p className="animate-fade-in" style={{ animationDelay: '1s', opacity: 0 }}>
              In times of chaos, every second matters...
            </p>
            <p className="animate-fade-in" style={{ animationDelay: '2s', opacity: 0 }}>
              Every life matters...
            </p>
            <p className="animate-fade-in font-medium text-slate-900" style={{ animationDelay: '3s', opacity: 0 }}>
              And some voices go unheard.
            </p>
          </div>

          <button
            onClick={() => navigate('/landing')}
            className="group relative inline-flex items-center gap-2 px-8 py-4 bg-primary hover:bg-blue-600 text-slate-900 font-bold rounded-full overflow-hidden shadow-[0_0_20px_rgba(59,130,246,0.6)] transition-all duration-300"
          >
            <span className="relative z-10 flex items-center gap-2">
              Enter System <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
            <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-blue-600 to-cyan-500 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-400 ease-out"></div>
          </button>
        </div>
      </div>
    </div>
  );
}
