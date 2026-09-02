import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Search, Shield, Sparkles, FolderOpen, ArrowRight, Image as ImageIcon, Zap } from 'lucide-react';

const Landing = () => {
  const featuresRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);

  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col items-center bg-white overflow-hidden">
      
      {/* Hero Section */}
      <section className="relative w-full min-h-[90vh] flex flex-col justify-center items-center pt-20 pb-32">
        {/* Animated Background Gradients */}
        <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-indigo-400/20 rounded-full blur-[120px] mix-blend-multiply animate-blob"></div>
        <div className="absolute top-[20%] right-[-10%] w-[35vw] h-[35vw] bg-purple-400/20 rounded-full blur-[100px] mix-blend-multiply animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-20%] left-[20%] w-[45vw] h-[45vw] bg-pink-400/20 rounded-full blur-[130px] mix-blend-multiply animate-blob animation-delay-4000"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center text-center">
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-md border border-indigo-100/50 text-indigo-700 text-sm font-semibold mb-8 shadow-sm hover:shadow-md transition-shadow cursor-default"
          >
            <Sparkles size={16} className="text-[#6c5ce7]" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#6c5ce7] to-[#a29bfe]">Next-Gen AI Photo Intelligence</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-gray-900 tracking-tighter max-w-5xl leading-[1.05]"
          >
            Don't just store photos. <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-[#6c5ce7] via-[#8e44ad] to-[#ff7eb3] animate-gradient-x">
              Understand them.
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8 text-xl md:text-2xl text-gray-500/90 max-w-2xl font-light leading-relaxed"
          >
            PixMind is your private, AI-powered vault that automatically tags, organizes, and finds your memories using natural language.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="mt-12 flex flex-col sm:flex-row gap-5 w-full justify-center items-center"
          >
            <Link to="/signup">
              <Button size="lg" className="w-full sm:w-auto text-lg h-14 px-10 bg-gray-900 text-white hover:bg-gray-800 hover:scale-105 transition-all shadow-xl shadow-gray-900/20 rounded-2xl">
                Start for free <ArrowRight size={20} className="ml-2" />
              </Button>
            </Link>
            <button 
              onClick={scrollToFeatures}
              className="group flex items-center justify-center w-full sm:w-auto text-lg h-14 px-10 bg-white border border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50 rounded-2xl transition-all"
            >
              See how it works 
              <motion.div
                animate={{ y: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="ml-2 opacity-50 group-hover:opacity-100"
              >
                ↓
              </motion.div>
            </button>
          </motion.div>

          {/* Floating UI Elements Showcase */}
          <motion.div 
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="mt-24 w-full max-w-6xl mx-auto relative h-[400px] md:h-[500px]"
          >
            {/* Center Main Card */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white/70 backdrop-blur-2xl rounded-3xl border border-white/50 shadow-2xl shadow-indigo-900/10 p-6 z-20">
              <div className="flex items-center gap-4 bg-gray-100/50 p-4 rounded-2xl border border-gray-200/50">
                <Search className="text-[#6c5ce7]" size={24} />
                <div className="flex-1 text-left">
                  <p className="text-gray-900 font-medium text-lg">"Photos from my college trip to Goa"</p>
                </div>
                <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                  <Sparkles size={16} className="text-[#6c5ce7]" />
                </div>
              </div>
              
              <div className="mt-6 grid grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="aspect-square rounded-2xl bg-gray-100 overflow-hidden relative group">
                    <img 
                      src={`https://picsum.photos/seed/${i + 40}/400/400`} 
                      alt="Memory" 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Floating Card Left */}
            <motion.div 
              animate={{ y: [-10, 10, -10], rotate: [-2, 2, -2] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              className="absolute left-[5%] top-[10%] w-64 bg-white/80 backdrop-blur-xl rounded-2xl border border-white/60 shadow-xl shadow-pink-900/5 p-5 z-10 hidden lg:block"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-pink-100 rounded-lg text-pink-600"><Shield size={20} /></div>
                <p className="font-semibold text-gray-900">Privacy Vault</p>
              </div>
              <p className="text-sm text-gray-600">2 sensitive documents secured automatically.</p>
            </motion.div>

            {/* Floating Card Right */}
            <motion.div 
              animate={{ y: [10, -10, 10], rotate: [2, -2, 2] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
              className="absolute right-[5%] bottom-[10%] w-64 bg-white/80 backdrop-blur-xl rounded-2xl border border-white/60 shadow-xl shadow-indigo-900/5 p-5 z-30 hidden lg:block"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600"><Zap size={20} /></div>
                <p className="font-semibold text-gray-900">Smart Cleanup</p>
              </div>
              <p className="text-sm text-gray-600">Found 14 duplicate photos. Reclaim 45MB.</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Bento Grid Features Section */}
      <section ref={featuresRef} className="w-full py-32 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">Intelligence at your fingertips</h2>
            <p className="mt-6 text-xl text-gray-500 font-light">PixMind replaces endless scrolling with state-of-the-art AI. It understands context, faces, and places.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
            
            {/* Semantic Search (Large Span) */}
            <div className="md:col-span-2 bg-white rounded-3xl p-10 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#6c5ce7]/10 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700"></div>
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center mb-6">
                    <Search className="text-[#6c5ce7]" size={28} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Semantic AI Search</h3>
                  <p className="text-gray-500 text-lg max-w-md leading-relaxed">
                    Don't search for dates. Search for "wearing a red shirt", "sunset in mountains", or "playing with a dog".
                  </p>
                </div>
              </div>
            </div>

            {/* Privacy Guardian */}
            <div className="bg-white rounded-3xl p-10 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-rose-500/10 to-transparent rounded-full blur-2xl translate-y-1/2 -translate-x-1/2 group-hover:scale-150 transition-transform duration-700"></div>
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-rose-50 flex items-center justify-center mb-6">
                    <Shield className="text-rose-500" size={28} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Privacy First</h3>
                  <p className="text-gray-500 leading-relaxed">
                    Auto-detects sensitive documents (IDs, cards) and locks them in a secure vault.
                  </p>
                </div>
              </div>
            </div>

            {/* Smart Cleanup */}
            <div className="bg-white rounded-3xl p-10 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-48 h-48 bg-gradient-to-br from-amber-500/10 to-transparent rounded-full blur-2xl -translate-y-1/2 -translate-x-1/2 group-hover:scale-150 transition-transform duration-700"></div>
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center mb-6">
                    <Zap className="text-amber-500" size={28} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Smart Cleanup</h3>
                  <p className="text-gray-500 leading-relaxed">
                    Reclaim gigabytes. AI instantly finds duplicates and blurry shots.
                  </p>
                </div>
              </div>
            </div>

            {/* Automated Memories (Large Span) */}
            <div className="md:col-span-2 bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-10 border border-gray-800 shadow-2xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] pointer-events-none"></div>
              <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-tl from-[#6c5ce7]/30 to-transparent rounded-full blur-3xl translate-y-1/3 translate-x-1/3 group-hover:scale-125 transition-transform duration-700"></div>
              
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 flex items-center justify-center mb-6">
                    <FolderOpen className="text-white" size={28} />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">Automated Memories</h3>
                  <p className="text-gray-300 text-lg max-w-md leading-relaxed">
                    We automatically group related photos into events and timelines, generating beautiful memory albums with AI-written captions.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-32 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-indigo-50/50"></div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">Ready to rediscover your memories?</h2>
          <Link to="/signup">
            <Button size="lg" className="text-lg h-16 px-12 bg-[#6c5ce7] hover:bg-[#5a4bd1] hover:scale-105 transition-all shadow-xl shadow-indigo-900/20 rounded-2xl">
              Create your free vault
            </Button>
          </Link>
          <p className="mt-6 text-gray-500">No credit card required. Start organizing today.</p>
        </div>
      </section>

    </div>
  );
};

export default Landing;
