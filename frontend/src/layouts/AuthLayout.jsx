import React from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Logo } from '../components/ui/Logo';
import { Search, Shield, Zap } from 'lucide-react';

const AuthLayout = () => {
  return (
    <div className="min-h-screen w-full flex bg-white font-sans overflow-hidden">
      {/* Left side — Form area */}
      <div className="flex flex-col flex-1 items-center justify-center px-6 sm:px-8 lg:flex-none lg:w-[480px] xl:w-[520px] relative z-10 bg-white">
        <div className="w-full max-w-[380px]">
          {/* Logo */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2.5 mb-10"
          >
            <Logo />
          </motion.div>
          
          {/* Form content injected here */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Outlet />
          </motion.div>
          
        </div>
      </div>

      {/* Right side — Premium Visual Panel */}
      <div className="hidden lg:flex relative flex-1 items-center justify-center bg-gray-900 overflow-hidden">
        {/* Animated Mesh Gradients */}
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-indigo-500/30 rounded-full blur-[120px] animate-blob mix-blend-screen"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-purple-500/30 rounded-full blur-[100px] animate-blob animation-delay-2000 mix-blend-screen"></div>
        <div className="absolute top-[40%] right-[30%] w-[30vw] h-[30vw] bg-pink-500/30 rounded-full blur-[120px] animate-blob animation-delay-4000 mix-blend-screen"></div>
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>

        {/* Center Glass Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 w-full max-w-lg p-10 bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl flex flex-col gap-8"
        >
          {/* Floating UI Element 1 */}
          <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="bg-white/90 backdrop-blur-md rounded-2xl p-4 flex items-center gap-4 shadow-lg border border-white/50"
          >
            <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center">
              <Search className="text-indigo-600" size={24} />
            </div>
            <div>
              <p className="text-gray-900 font-semibold text-sm">Semantic Search</p>
              <p className="text-gray-500 text-xs">"Find photos of my dog at the beach"</p>
            </div>
          </motion.div>

          {/* Floating UI Element 2 */}
          <motion.div 
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
            className="bg-white/90 backdrop-blur-md rounded-2xl p-4 flex items-center gap-4 shadow-lg border border-white/50 self-end w-4/5"
          >
            <div className="w-12 h-12 rounded-xl bg-rose-100 flex items-center justify-center">
              <Shield className="text-rose-500" size={24} />
            </div>
            <div>
              <p className="text-gray-900 font-semibold text-sm">Privacy Vault</p>
              <p className="text-gray-500 text-xs">Sensitive documents secured.</p>
            </div>
          </motion.div>
          
          <div className="mt-4 text-center">
            <h2 className="text-3xl font-bold text-white mb-3 tracking-tight">
              Intelligence meets Privacy.
            </h2>
            <p className="text-indigo-100/80 text-[15px] leading-relaxed max-w-sm mx-auto">
              Experience the next generation of photo management. Your memories, beautifully organized and fully private.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthLayout;
