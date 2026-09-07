import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ShieldAlert, Image as ImageIcon, UploadCloud, ArrowRight, CheckCircle2, Trash2, Layers } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PhotoModal from '../../components/ui/PhotoModal';
import ReviewDuplicatesModal from '../../components/ui/ReviewDuplicatesModal';
import { photoAPI } from '../../services/api';
import toast from 'react-hot-toast';

const Home = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: 'User' });
  const [photos, setPhotos] = useState([]);
  const [duplicateCount, setDuplicateCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [reviewPhotoGroup, setReviewPhotoGroup] = useState(null);
  const [selectedPhotoIds, setSelectedPhotoIds] = useState([]);
  const [isDeletingBulk, setIsDeletingBulk] = useState(false);
  
  const privacyAlertsCount = photos.filter(p => p.privacyFindings && p.privacyFindings.length > 0).length;

  useEffect(() => {
    const stored = localStorage.getItem("pixmind_user");
    if (stored) {
      setUser(JSON.parse(stored));
    }
    fetchPhotos();

    // Listen for new photo uploads from the layout's upload modal
    const handlePhotoUploaded = (e) => {
      const newPhotos = e.detail; // Array of newly uploaded photos
      if (Array.isArray(newPhotos)) {
        setPhotos((prev) => [...newPhotos, ...prev]);
      } else {
        // Fallback just in case
        setPhotos((prev) => [newPhotos, ...prev]);
      }
    };
    window.addEventListener('photoUploaded', handlePhotoUploaded);

    // Listen for photos being moved to vault
    const handlePhotoVaulted = (e) => {
      const vaultedPhotoId = e.detail;
      setPhotos((prev) => prev.filter(p => p._id !== vaultedPhotoId));
    };
    window.addEventListener('photoVaulted', handlePhotoVaulted);

    return () => {
      window.removeEventListener('photoUploaded', handlePhotoUploaded);
      window.removeEventListener('photoVaulted', handlePhotoVaulted);
    };
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

  // Group photos by hash for stacking
  const groupedPhotos = [];
  const hashMap = {};

  photos.forEach((photo) => {
    if (photo.hash) {
      if (!hashMap[photo.hash]) {
        hashMap[photo.hash] = { ...photo, duplicates: [] };
        groupedPhotos.push(hashMap[photo.hash]);
      } else {
        hashMap[photo.hash].duplicates.push(photo);
      }
    } else {
      groupedPhotos.push({ ...photo, duplicates: [] });
    }
  });

  const toggleSelection = (e, photoGroup) => {
    e.stopPropagation();
    const idsToToggle = [photoGroup._id, ...photoGroup.duplicates.map(d => d._id)];
    
    if (selectedPhotoIds.includes(photoGroup._id)) {
      setSelectedPhotoIds(prev => prev.filter(id => !idsToToggle.includes(id)));
    } else {
      setSelectedPhotoIds(prev => [...prev, ...idsToToggle]);
    }
  };

  const handleBulkDelete = async () => {
    if (!window.confirm(`Move ${selectedPhotoIds.length} photo(s) to Trash?`)) return;
    
    setIsDeletingBulk(true);
    try {
      const res = await photoAPI.deleteBulk(selectedPhotoIds);
      if (res.data.success) {
        toast.success(`Moved ${selectedPhotoIds.length} photo(s) to Trash`);
        setPhotos(prev => prev.filter(p => !selectedPhotoIds.includes(p._id)));
        setSelectedPhotoIds([]);
      }
    } catch (error) {
      console.error("Failed to move bulk photos to trash", error);
      toast.error("Failed to move photos to trash.");
    } finally {
      setIsDeletingBulk(false);
    }
  };

  // Listen to single photo deletions from PhotoModal
  useEffect(() => {
    const handlePhotoDeleted = (e) => {
      const deletedIds = e.detail; // Array of IDs
      setPhotos((prev) => prev.filter(p => !deletedIds.includes(p._id)));
    };
    window.addEventListener('photoDeleted', handlePhotoDeleted);
    return () => window.removeEventListener('photoDeleted', handlePhotoDeleted);
  }, []);

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
            {groupedPhotos.map((photoGroup, i) => {
              const isSelected = selectedPhotoIds.includes(photoGroup._id);
              
              return (
                <motion.div 
                  key={photoGroup._id} 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  onClick={() => setSelectedPhoto(photoGroup)}
                  className={`aspect-square rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-xl border-2 transition-colors group relative cursor-pointer z-10 ${isSelected ? 'border-[#6c5ce7]' : 'border-gray-100'}`}
                >
                  {/* Selection Checkbox */}
                  <button 
                    onClick={(e) => toggleSelection(e, photoGroup)}
                    className={`absolute top-3 left-3 z-30 p-1 rounded-full backdrop-blur-md shadow-sm transition-all ${isSelected ? 'bg-[#6c5ce7] text-white opacity-100' : 'bg-white/50 text-gray-400 opacity-0 group-hover:opacity-100 hover:bg-white hover:text-gray-600'}`}
                  >
                    <CheckCircle2 size={20} className={isSelected ? 'fill-current' : ''} />
                  </button>

                  {/* Duplicate Stack Badge */}
                  {photoGroup.duplicates.length > 0 && (
                    <div className="absolute top-3 right-3 z-30 flex items-center gap-1">
                      <span className="bg-white/90 text-[#6c5ce7] font-semibold text-xs px-2 py-1 rounded-full shadow-md backdrop-blur-md flex items-center gap-1 border border-[#6c5ce7]/20">
                        <Layers size={14} /> +{photoGroup.duplicates.length}
                      </span>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setReviewPhotoGroup(photoGroup);
                        }}
                        className="bg-white/90 text-indigo-600 hover:bg-indigo-50 p-1.5 rounded-full shadow-md backdrop-blur-md transition-colors opacity-0 group-hover:opacity-100 border border-indigo-100"
                        title={`Review ${photoGroup.duplicates.length} duplicate(s)`}
                      >
                        <Layers size={14} />
                      </button>
                    </div>
                  )}
                  
                  <img 
                    src={`${API_URL}${photoGroup.url}`} 
                    alt="Memory" 
                    className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${isSelected ? 'scale-105 opacity-90' : ''}`}
                    loading="lazy"
                  />
                  <div 
                    className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-end p-4"
                  >
                    <span className="text-white text-xs font-medium backdrop-blur-md bg-white/20 px-2 py-1 rounded-lg shadow-sm">View Details</span>
                  </div>
                </motion.div>
              );
            })}
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
          const idx = groupedPhotos.findIndex(p => p._id === selectedPhoto?._id);
          if (idx !== -1 && idx < groupedPhotos.length - 1) setSelectedPhoto(groupedPhotos[idx + 1]);
        }}
        onPrev={() => {
          const idx = groupedPhotos.findIndex(p => p._id === selectedPhoto?._id);
          if (idx > 0) setSelectedPhoto(groupedPhotos[idx - 1]);
        }}
        hasNext={groupedPhotos.findIndex(p => p._id === selectedPhoto?._id) !== -1 && groupedPhotos.findIndex(p => p._id === selectedPhoto?._id) < groupedPhotos.length - 1}
        hasPrev={groupedPhotos.findIndex(p => p._id === selectedPhoto?._id) > 0}
      />

      {/* Floating Action Bar for Bulk Deletion */}
      {selectedPhotoIds.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white rounded-full shadow-2xl shadow-indigo-900/20 px-6 py-4 flex items-center gap-6 border border-gray-100 z-50"
        >
          <div className="flex items-center gap-2">
            <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2.5 py-1 rounded-full">
              {selectedPhotoIds.length}
            </span>
            <span className="text-sm font-semibold text-gray-700">Photos Selected</span>
          </div>
          
          <div className="w-px h-8 bg-gray-200"></div>
          
          <button 
            onClick={handleBulkDelete}
            disabled={isDeletingBulk}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-full text-sm font-medium transition-colors shadow-md disabled:opacity-50"
          >
            <Trash2 size={16} />
            {isDeletingBulk ? 'Moving...' : 'Move to Trash'}
          </button>
        </motion.div>
      )}

      {/* Review Duplicates Modal */}
      <ReviewDuplicatesModal 
        photoGroup={reviewPhotoGroup} 
        onClose={() => setReviewPhotoGroup(null)}
        onSuccess={(deletedIds) => {
          setPhotos(prev => prev.filter(p => !deletedIds.includes(p._id)));
          setReviewPhotoGroup(null);
        }}
      />
    </motion.div>
  );
};

export default Home;