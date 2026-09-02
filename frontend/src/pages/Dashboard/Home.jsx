import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ShieldAlert, Image as ImageIcon, UploadCloud, ArrowRight } from 'lucide-react';
import { photoAPI } from '../../services/api';

const Home = () => {
  const [user, setUser] = useState({ name: 'User' });
  const [photos, setPhotos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('pixmind_user');
    if (stored) {
      setUser(JSON.parse(stored));
    }
    fetchPhotos();

    const handlePhotoUploaded = (e) => {
      const newPhoto = e.detail;
      setPhotos((prev) => [newPhoto, ...prev]);
    };
    
    window.addEventListener('photoUploaded', handlePhotoUploaded);
    return () => window.removeEventListener('photoUploaded', handlePhotoUploaded);
  }, []);

  const fetchPhotos = async () => {
    try {
      setIsLoading(true);
      const res = await photoAPI.getAll();
      if (res.data.success) {
        setPhotos(res.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch photos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="max-w-6xl mx-auto space-y-10"
    >
      {/* Greeting */}
      <motion.div variants={itemVariants} className="flex flex-col gap-1">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight flex items-center gap-2">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600">
            Good evening, {user.name.split(' ')[0]}
          </span>
          <span className="inline-block origin-bottom-right animate-wave text-gray-900">👋</span>
        </h1>
        <p className="text-gray-500 font-medium">Here's what's happening with your memories today.</p>
      </motion.div>

      {/* AI Suggestions Row */}
      {photos.length > 0 && (
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div 
            whileHover={{ scale: 1.02, y: -4 }}
            className="relative bg-gradient-to-br from-amber-50 via-orange-50/50 to-white p-6 rounded-3xl border border-amber-200/60 shadow-lg shadow-amber-900/5 overflow-hidden group cursor-pointer"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700"></div>
            <div className="relative flex items-start gap-5">
              <div className="p-3 bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm text-amber-500 border border-amber-100">
                <Sparkles size={24} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-amber-900">Smart Cleanup</h3>
                <p className="text-sm text-amber-700/80 mt-1 mb-4">Found 24 duplicate photos. Reclaim 142 MB.</p>
                <button className="text-sm font-semibold text-amber-600 group-hover:text-amber-700 flex items-center gap-1 transition-colors">
                  Review matches <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.02, y: -4 }}
            className="relative bg-gradient-to-br from-rose-50 via-pink-50/50 to-white p-6 rounded-3xl border border-rose-200/60 shadow-lg shadow-rose-900/5 overflow-hidden group cursor-pointer"
          >
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-2xl translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700"></div>
            <div className="relative flex items-start gap-5">
              <div className="p-3 bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm text-rose-500 border border-rose-100">
                <ShieldAlert size={24} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-rose-900">Privacy Alerts</h3>
                <p className="text-sm text-rose-700/80 mt-1 mb-4">3 potentially sensitive documents detected.</p>
                <button className="text-sm font-semibold text-rose-600 group-hover:text-rose-700 flex items-center gap-1 transition-colors">
                  Secure in Vault <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Recent Photos Grid */}
      <motion.div variants={itemVariants} className="pt-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <ImageIcon size={20} className="text-[#6c5ce7]" /> Recent Uploads
          </h2>
          {photos.length > 0 && (
            <button className="text-sm font-semibold text-[#6c5ce7] hover:text-[#5a4bd1] transition-colors">
              View all
            </button>
          )}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="aspect-square bg-gray-200/60 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : photos.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {photos.map((photo, i) => (
              <motion.div 
                key={photo._id} 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="aspect-square rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-xl border border-gray-100 group relative cursor-pointer z-10"
              >
                <img 
                  src={`${API_URL}${photo.url}`} 
                  alt="Memory" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <span className="text-white text-xs font-medium backdrop-blur-md bg-white/20 px-2 py-1 rounded-lg">View Details</span>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div 
            whileHover={{ scale: 1.01 }}
            className="relative bg-white border border-gray-200 border-dashed rounded-3xl p-16 text-center flex flex-col items-center justify-center shadow-sm overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 opacity-50"></div>
            <div className="relative z-10 flex flex-col items-center">
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="w-20 h-20 bg-white shadow-lg shadow-indigo-100 rounded-2xl flex items-center justify-center mb-6 text-[#6c5ce7] border border-indigo-50"
              >
                <UploadCloud size={36} strokeWidth={2.5} />
              </motion.div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Your vault is empty</h3>
              <p className="text-gray-500 text-base max-w-md mb-8">
                Upload your first photo to let PixMind's AI automatically tag, organize, and secure your memories.
              </p>
              <motion.button 
                whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(108, 92, 231, 0.4)" }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3.5 bg-gradient-to-r from-[#6c5ce7] to-[#8e44ad] text-white text-base font-semibold rounded-xl transition-all"
                onClick={() => {
                  const uploadBtn = document.querySelector('header button.bg-\\[\\#6c5ce7\\]');
                  if (uploadBtn) uploadBtn.click();
                }}
              >
                Upload first photo
              </motion.button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default Home;
