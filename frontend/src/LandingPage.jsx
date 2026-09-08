import React, { useEffect, useRef } from 'react';
import { Shield } from 'lucide-react';

const TOTAL_FRAMES = 300;
const FRAMES = Array.from({ length: TOTAL_FRAMES }, (_, i) => 
  `/frames/ezgif-frame-${String(i + 1).padStart(3, '0')}.jpg`
);

export default function LandingPage({ onStart }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const images = [];
    
    // Start loading all images immediately
    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = FRAMES[i];
      images.push(img);
    }
    
    let frame = 0;
    
    const render = () => {
      const img = images[frame];
      
      // Only draw if the image has finished loading
      // This prevents flickering since the canvas retains the last drawn frame
      if (img.complete && img.naturalWidth !== 0) {
        // Calculate dimensions to simulate 'object-fit: cover'
        const canvasRatio = canvas.width / canvas.height;
        const imgRatio = img.width / img.height;
        let w, h, x, y;
        
        if (canvasRatio > imgRatio) {
          w = canvas.width;
          h = canvas.width / imgRatio;
          x = 0;
          y = (canvas.height - h) / 2;
        } else {
          w = canvas.height * imgRatio;
          h = canvas.height;
          x = (canvas.width - w) / 2;
          y = 0;
        }
        
        ctx.drawImage(img, x, y, w, h);
      }
      
      frame = (frame + 1) % TOTAL_FRAMES;
    };
    
    // Handle resizing to keep canvas crisp
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      // Force an immediate render on resize so it doesn't blank out
      render(); 
    };
    
    window.addEventListener('resize', handleResize);
    handleResize(); // Set initial size
    
    // Play at ~30 FPS
    const intervalId = setInterval(render, 33);
    
    return () => {
      clearInterval(intervalId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans overflow-hidden bg-slate-950">
      
      {/* High-Performance Canvas Animation */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 z-0 w-full h-full"
      />
      
      {/* Dark overlay to ensure the login form is readable */}
      <div className="absolute inset-0 z-0 bg-slate-900/70 backdrop-blur-[2px]" />

      {/* Foreground Login Form */}
      <div className="relative z-10 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center items-center space-x-2">
          <div className="p-2 bg-indigo-500 rounded-lg shadow-sm">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">TextGuard</h2>
        </div>
        <h2 className="mt-6 text-center text-2xl font-bold text-white">
          Sign in to your workspace
        </h2>
      </div>

      <div className="relative z-10 mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-slate-900/50 backdrop-blur-xl py-8 px-4 shadow-2xl sm:rounded-2xl sm:px-10 border border-slate-700/50 ring-1 ring-white/10">
          <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); onStart(); }}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-200">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="you@company.com"
                  className="appearance-none block w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl shadow-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-200">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  placeholder="••••••••"
                  className="appearance-none block w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl shadow-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-indigo-500 bg-slate-800 border-slate-600 rounded focus:ring-indigo-500 focus:ring-offset-slate-900"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-300">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
                  Forgot your password?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 rounded-xl shadow-md text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-indigo-500 transition-all active:scale-95"
              >
                Sign in
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
