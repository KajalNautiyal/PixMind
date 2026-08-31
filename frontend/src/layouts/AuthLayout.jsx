import React from 'react';
import { Outlet } from 'react-router-dom';
import { ImageIcon } from 'lucide-react';

const AuthLayout = () => {
  return (
    <div className="min-h-screen w-full flex bg-white">
      {/* Left side — Form area */}
      <div className="flex flex-col flex-1 items-center justify-center px-6 sm:px-8 lg:flex-none lg:w-[480px] xl:w-[520px]">
        <div className="w-full max-w-[380px]">
          {/* Logo */}
          <div className="flex items-center gap-2.5 mb-10">
            <div className="bg-[#6c5ce7] p-2 rounded-xl text-white shadow-md shadow-[#6c5ce7]/20">
              <ImageIcon size={22} strokeWidth={2.5} />
            </div>
            <span className="text-xl font-bold tracking-tight text-gray-900">
              PixMind
            </span>
          </div>
          
          {/* Form content injected here */}
          <Outlet />
          
        </div>
      </div>

      {/* Right side — Visual panel */}
      <div className="hidden lg:flex relative flex-1 items-center justify-center overflow-hidden">
        {/* Background layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#f8f7ff] via-[#ede9fe] to-[#e0d4fc]"></div>
        
        {/* Decorative floating shapes */}
        <div className="absolute top-20 right-20 w-72 h-72 bg-[#6c5ce7]/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-32 left-16 w-56 h-56 bg-[#a29bfe]/15 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 right-1/3 w-40 h-40 bg-[#6c5ce7]/8 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'radial-gradient(circle, #6c5ce7 1px, transparent 1px)',
          backgroundSize: '32px 32px'
        }}></div>

        {/* Content */}
        <div className="relative z-10 text-center max-w-md px-10">
          {/* Decorative photo grid mockup */}
          <div className="mb-10 flex justify-center">
            <div className="grid grid-cols-3 gap-2.5 transform -rotate-3">
              {[
                'bg-gradient-to-br from-rose-200 to-rose-300',
                'bg-gradient-to-br from-sky-200 to-sky-300',
                'bg-gradient-to-br from-amber-200 to-amber-300',
                'bg-gradient-to-br from-emerald-200 to-emerald-300',
                'bg-gradient-to-br from-violet-200 to-violet-300',
                'bg-gradient-to-br from-pink-200 to-pink-300',
              ].map((color, i) => (
                <div
                  key={i}
                  className={`w-20 h-20 rounded-xl ${color} shadow-sm`}
                  style={{ animationDelay: `${i * 0.1}s` }}
                />
              ))}
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-3 leading-tight">
            Your photos, <br />intelligently organized.
          </h2>
          <p className="text-gray-500 text-[15px] leading-relaxed">
            Upload, search, and relive your memories — all in one private, secure space.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
