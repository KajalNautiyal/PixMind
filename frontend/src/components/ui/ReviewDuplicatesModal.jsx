import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, CheckCircle2 } from 'lucide-react';
import { photoAPI } from '../../services/api';
import toast from 'react-hot-toast';

export default function ReviewDuplicatesModal({ photoGroup, onClose, onSuccess }) {
  // photoGroup is the primary photo, with photoGroup.duplicates array
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  
  // All photos in the stack
  const allPhotos = [photoGroup, ...photoGroup.duplicates];
  
  // By default, select all duplicates (but keep primary unchecked)
  const [selectedIds, setSelectedIds] = useState(photoGroup.duplicates.map(d => d._id));
  const [isDeleting, setIsDeleting] = useState(false);

  const toggleSelection = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(prev => prev.filter(pid => pid !== id));
    } else {
      setSelectedIds(prev => [...prev, id]);
    }
  };

  const handleMoveToTrash = async () => {
    if (selectedIds.length === 0) return;
    setIsDeleting(true);
    try {
      const res = await photoAPI.deleteBulk(selectedIds);
      if (res.data.success) {
        toast.success(`Moved ${selectedIds.length} photo(s) to Trash`);
        onSuccess(selectedIds);
      }
    } catch (error) {
      toast.error('Failed to move photos to trash');
    } finally {
      setIsDeleting(false);
    }
  };

  if (!photoGroup) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-3xl overflow-hidden w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white z-10 sticky top-0">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Review Duplicates</h2>
              <p className="text-sm text-gray-500">Select which copies you want to move to trash.</p>
            </div>
            <button 
              onClick={onClose}
              className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto flex-1 bg-gray-50/50">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {allPhotos.map((photo, index) => {
                const isSelected = selectedIds.includes(photo._id);
                const isPrimary = index === 0;
                
                return (
                  <div 
                    key={photo._id} 
                    onClick={() => toggleSelection(photo._id)}
                    className={`relative aspect-square rounded-2xl overflow-hidden bg-white shadow-sm border-2 cursor-pointer transition-all ${isSelected ? 'border-red-500 scale-95 opacity-80' : 'border-gray-200 hover:border-gray-300 hover:shadow-md'}`}
                  >
                    {isPrimary && (
                      <span className="absolute top-2 left-2 z-20 bg-indigo-500 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm">
                        Original
                      </span>
                    )}

                    <button 
                      className={`absolute top-2 right-2 z-20 p-1 rounded-full backdrop-blur-md shadow-sm transition-all ${isSelected ? 'bg-red-500 text-white' : 'bg-white/70 text-gray-400 hover:bg-white hover:text-gray-600'}`}
                    >
                      <CheckCircle2 size={20} className={isSelected ? 'fill-current text-white' : ''} />
                    </button>
                    
                    <img 
                      src={`${API_URL}${photo.url}`} 
                      alt="Duplicate" 
                      className="w-full h-full object-cover"
                    />
                    
                    {isSelected && (
                      <div className="absolute inset-0 bg-red-500/10 z-10 flex items-center justify-center">
                        <Trash2 className="text-red-500 w-12 h-12 opacity-50" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-100 bg-white flex justify-between items-center">
            <div className="text-sm font-medium text-gray-700">
              <span className="text-red-600 font-bold">{selectedIds.length}</span> of {allPhotos.length} selected
            </div>
            <div className="flex gap-3">
              <button 
                onClick={onClose}
                className="px-5 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleMoveToTrash}
                disabled={selectedIds.length === 0 || isDeleting}
                className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-xl text-sm font-medium transition-all shadow-md disabled:opacity-50 disabled:hover:bg-red-500"
              >
                <Trash2 size={16} />
                {isDeleting ? 'Moving...' : `Move ${selectedIds.length} to Trash`}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
