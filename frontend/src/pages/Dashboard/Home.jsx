import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ShieldAlert, Image as ImageIcon, UploadCloud, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PhotoModal from '../../components/ui/PhotoModal';
import { photoAPI } from '../../services/api';

const Home = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: 'User' });
  const [photos, setPhotos] = useState([]);
  const [duplicateCount, setDuplicateCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  
  const privacyAlertsCount = photos.filter(p => p.privacyFindings && p.privacyFindings.length > 0).length;

  useEffect(() => {
    const stored = localStorage.getItem("pixmind_user");
    if (stored) {
      setUser(JSON.parse(stored));
    }
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    try {
      setIsLoading(true);
      const res = await photoAPI.getAll();
      if (res.data.success) {
        const photoList = res.data.data;
        setPhotos(photoList);
        
        // Count duplicate photos
        const count = photoList.filter((photo) => photo.isDuplicate).length;
        setDuplicateCount(count);
      }
    } catch (error) {
      console.error("Failed to fetch photos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div className="max-w-6xl mx-auto space-y-8">
      {/* Greeting */}
      <div>
        <h1 className="text-3xl font-bold">
          Good evening, {user.name.split(" ")[0]} 👋
        </h1>
        <p className="text-gray-500">
          Here's what's happening with your memories today.
        </p>
      </div>

      {/* AI Suggestions Row */}
      {photos.length > 0 && (
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div 
            whileHover={{ scale: 1.02, y: -4 }}
            onClick={() => navigate('/dashboard/cleanup')}
            className="relative bg-gradient-to-br from-amber-50 via-orange-50/50 to-white p-6 rounded-3xl border border-amber-200/60 shadow-lg shadow-amber-900/5 overflow-hidden group cursor-pointer"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700"></div>
            <div className="relative flex items-start gap-5">
              <div className="p-3 bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm text-amber-500 border border-amber-100">
                <Sparkles size={24} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-amber-900">Smart Cleanup</h3>
                <p className="text-sm text-amber-700/80 mt-1 mb-4">
                  {duplicateCount > 0
                    ? `Found ${duplicateCount} duplicate photo(s).`
                    : "No duplicate photos found."}
                </p>
                <button className="text-sm font-semibold text-amber-600 group-hover:text-amber-700 flex items-center gap-1 transition-colors">
                  Review matches <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.02, y: -4 }}
            onClick={() => navigate('/dashboard/privacy')}
            className="relative bg-gradient-to-br from-rose-50 via-pink-50/50 to-white p-6 rounded-3xl border border-rose-200/60 shadow-lg shadow-rose-900/5 overflow-hidden group cursor-pointer"
          >
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-2xl translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700"></div>
            <div className="relative flex items-start gap-5">
              <div className="p-3 bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm text-rose-500 border border-rose-100">
                <ShieldAlert size={24} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-rose-900">Privacy Alerts</h3>
                <p className="text-sm text-rose-700/80 mt-1 mb-4">{privacyAlertsCount} potentially sensitive documents detected.</p>
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
            <button className="text-sm font-semibold text-[#6c5ce7] hover:text-[#5a4bd1] transition-colors" onClick={() => navigate('/dashboard/photos')}>
              View all
            </button>
          )}
        </div>

        {isLoading ? (
          <div className="flex justify-center p-12"><p>Loading photos...</p></div>
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
                {photo.isDuplicate && (
                  <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full z-20 shadow-md">
                    Duplicate
                  </span>
                )}
                <img 
                  src={`${API_URL}${photo.url}`} 
                  alt="Memory" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                <div 
                  onClick={() => setSelectedPhoto(photo)}
                  className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4 cursor-pointer"
                >
                  <span className="text-white text-xs font-medium backdrop-blur-md bg-white/20 px-2 py-1 rounded-lg shadow-sm">View Details</span>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center border border-dashed border-gray-200 rounded-3xl p-16 bg-gray-50/50">
            <UploadCloud className="mx-auto text-purple-400 mb-4" size={48} />
            <h3 className="text-xl font-bold text-gray-700">No photos uploaded yet</h3>
            <p className="text-gray-500 mt-2">Click upload in the top right to get started</p>
          </div>
        )}
      </motion.div>

      <PhotoModal 
        photo={selectedPhoto} 
        onClose={() => setSelectedPhoto(null)} 
        onNext={() => {
          const idx = photos.findIndex(p => p._id === selectedPhoto?._id);
          if (idx !== -1 && idx < photos.length - 1) setSelectedPhoto(photos[idx + 1]);
        }}
        onPrev={() => {
          const idx = photos.findIndex(p => p._id === selectedPhoto?._id);
          if (idx > 0) setSelectedPhoto(photos[idx - 1]);
        }}
        hasNext={photos.findIndex(p => p._id === selectedPhoto?._id) !== -1 && photos.findIndex(p => p._id === selectedPhoto?._id) < photos.length - 1}
        hasPrev={photos.findIndex(p => p._id === selectedPhoto?._id) > 0}
      />
    </motion.div>
  );
};

export default Home;