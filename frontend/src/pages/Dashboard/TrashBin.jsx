import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, RefreshCcw, AlertTriangle, CheckCircle2 } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function TrashBin() {
  const [photos, setPhotos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPhotoIds, setSelectedPhotoIds] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchTrash();
  }, []);

  const fetchTrash = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/photos/trash');
      setPhotos(res.data.data);
    } catch (error) {
      toast.error('Failed to load trash');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSelection = (e, id) => {
    e.stopPropagation();
    if (selectedPhotoIds.includes(id)) {
      setSelectedPhotoIds(prev => prev.filter(pid => pid !== id));
    } else {
      setSelectedPhotoIds(prev => [...prev, id]);
    }
  };

  const handleRestore = async () => {
    if (selectedPhotoIds.length === 0) return;
    setIsProcessing(true);
    try {
      const res = await api.post('/photos/restore', { photoIds: selectedPhotoIds });
      if (res.data.success) {
        toast.success(`Restored ${selectedPhotoIds.length} photo(s)`);
        setPhotos(prev => prev.filter(p => !selectedPhotoIds.includes(p._id)));
        setSelectedPhotoIds([]);
      }
    } catch (error) {
      toast.error('Failed to restore photos');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEmptyTrash = async (isAll = false) => {
    const idsToDelete = isAll ? [] : selectedPhotoIds;
    if (!isAll && idsToDelete.length === 0) return;

    if (!window.confirm(isAll ? "Are you sure you want to permanently delete ALL photos in trash?" : `Are you sure you want to permanently delete ${idsToDelete.length} photo(s)?`)) return;

    setIsProcessing(true);
    try {
      const res = await api.delete('/photos/empty-trash', { data: { photoIds: idsToDelete } });
      if (res.data.success) {
        toast.success(res.data.message);
        if (isAll || idsToDelete.length === 0) {
          setPhotos([]);
        } else {
          setPhotos(prev => prev.filter(p => !idsToDelete.includes(p._id)));
        }
        setSelectedPhotoIds([]);
      }
    } catch (error) {
      toast.error('Failed to delete photos');
    } finally {
      setIsProcessing(false);
    }
  };

  // Calculate days remaining (Assuming 30 days retention)
  const getDaysRemaining = (deletedAt) => {
    if (!deletedAt) return 30;
    const deletedDate = new Date(deletedAt);
    const expireDate = new Date(deletedDate.getTime() + (30 * 24 * 60 * 60 * 1000));
    const now = new Date();
    const diffTime = expireDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="max-w-6xl mx-auto space-y-8 pb-20"
    >
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight flex items-center gap-3">
          <span className="p-2 bg-gray-100 text-gray-700 rounded-xl">
            <Trash2 className="w-8 h-8" />
          </span>
          Trash Bin
        </h1>
        <p className="text-gray-500 font-medium">
          Items in trash will be permanently deleted after 30 days.
        </p>
      </div>

      {/* Toolbar */}
      <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex gap-2">
          <button
            onClick={() => {
              if (selectedPhotoIds.length === photos.length && photos.length > 0) {
                setSelectedPhotoIds([]);
              } else {
                setSelectedPhotoIds(photos.map(p => p._id));
              }
            }}
            disabled={photos.length === 0}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
          >
            {selectedPhotoIds.length === photos.length && photos.length > 0 ? 'Deselect All' : 'Select All'}
          </button>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleRestore}
            disabled={selectedPhotoIds.length === 0 || isProcessing}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-500 hover:bg-indigo-600 rounded-lg transition-colors shadow-sm disabled:opacity-50"
          >
            <RefreshCcw size={16} /> Restore Selected
          </button>
          <button
            onClick={() => handleEmptyTrash(false)}
            disabled={selectedPhotoIds.length === 0 || isProcessing}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors shadow-sm disabled:opacity-50"
          >
            <Trash2 size={16} /> Delete Selected
          </button>
          <button
            onClick={() => handleEmptyTrash(true)}
            disabled={photos.length === 0 || isProcessing}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors shadow-sm disabled:opacity-50 ml-4"
          >
            <AlertTriangle size={16} /> Empty Trash
          </button>
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="flex justify-center p-12"><p className="text-gray-500">Loading trash...</p></div>
      ) : photos.length === 0 ? (
        <div className="text-center border border-dashed border-gray-200 rounded-3xl p-16 bg-gray-50/50">
          <Trash2 className="mx-auto text-gray-300 mb-4" size={48} />
          <h3 className="text-xl font-bold text-gray-700">Trash is empty</h3>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          <AnimatePresence>
            {photos.map((photo, i) => {
              const isSelected = selectedPhotoIds.includes(photo._id);
              return (
                <motion.div 
                  key={photo._id} 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  onClick={(e) => toggleSelection(e, photo._id)}
                  className={`aspect-square rounded-2xl overflow-hidden bg-white shadow-sm border-2 transition-colors group relative cursor-pointer ${isSelected ? 'border-indigo-500' : 'border-gray-200'}`}
                >
                  <button 
                    className={`absolute top-3 left-3 z-30 p-1 rounded-full backdrop-blur-md shadow-sm transition-all ${isSelected ? 'bg-indigo-500 text-white opacity-100' : 'bg-black/40 text-white opacity-0 group-hover:opacity-100 hover:bg-black/60'}`}
                  >
                    <CheckCircle2 size={20} className={isSelected ? 'fill-current text-white' : ''} />
                  </button>

                  <span className="absolute bottom-3 left-3 z-30 bg-black/60 text-white text-[10px] font-bold px-2 py-1 rounded backdrop-blur-md">
                    {getDaysRemaining(photo.deletedAt)} days left
                  </span>
                  
                  <img 
                    src={`${API_URL}${photo.url}`} 
                    alt="Trashed Item" 
                    className={`w-full h-full object-cover transition-transform duration-500 ${isSelected ? 'scale-105 opacity-80' : 'grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100'}`}
                    loading="lazy"
                  />
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}
