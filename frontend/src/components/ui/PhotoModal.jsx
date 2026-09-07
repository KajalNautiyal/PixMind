import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, HardDrive, ShieldAlert, FileImage, ShieldCheck, ChevronLeft, ChevronRight, FileText, Trash2 } from 'lucide-react';
import { photoAPI } from '../../services/api';
import toast from 'react-hot-toast';

export default function PhotoModal({ photo, onClose, onNext, onPrev, hasNext, hasPrev }) {
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && hasNext) onNext();
      if (e.key === 'ArrowLeft' && hasPrev) onPrev();
    };
    if (photo) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [photo, onClose, onNext, onPrev, hasNext, hasPrev]);

  // Prevent background scrolling when open
  useEffect(() => {
    if (photo) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [photo]);

  if (!photo) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md"
        onClick={onClose}
      >
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row w-full max-w-6xl max-h-[90vh]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Left: Image Viewer */}
          <div className="flex-1 bg-gray-50 flex items-center justify-center relative overflow-hidden group min-h-[300px] md:min-h-[500px]">
            {/* Checkerboard pattern for transparent images */}
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
            
            {hasPrev && (
              <button 
                onClick={(e) => { e.stopPropagation(); onPrev(); }}
                className="absolute left-4 z-20 p-2 md:p-3 bg-white/50 hover:bg-white text-gray-800 rounded-full backdrop-blur-md shadow-sm hover:shadow-md transition-all -translate-x-full opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
              >
                <ChevronLeft size={24} />
              </button>
            )}

            <img 
              src={`${API_URL}${photo.url}`} 
              alt={photo.filename}
              className="max-w-full max-h-full object-contain relative z-10 drop-shadow-xl p-4"
            />

            {hasNext && (
              <button 
                onClick={(e) => { e.stopPropagation(); onNext(); }}
                className="absolute right-4 z-20 p-2 md:p-3 bg-white/50 hover:bg-white text-gray-800 rounded-full backdrop-blur-md shadow-sm hover:shadow-md transition-all translate-x-full opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
              >
                <ChevronRight size={24} />
              </button>
            )}
            
            {/* Close button floating on image for mobile */}
            <button 
              onClick={(e) => { e.stopPropagation(); onClose(); }}
              className="md:hidden absolute top-4 right-4 z-20 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full backdrop-blur-md transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Right: Details Panel */}
          <div className="w-full md:w-80 lg:w-96 bg-white border-l border-gray-100 flex flex-col max-h-[90vh] overflow-y-auto">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white/90 backdrop-blur-sm z-10">
              <h3 className="font-bold text-gray-900 text-lg">Details</h3>
              <div className="flex gap-2">
                <button 
                  onClick={async () => {
                    if (window.confirm("Move this photo to Trash?")) {
                      try {
                        const res = await photoAPI.deleteBulk([photo._id]);
                        if (res.data.success) {
                          toast.success('Moved to Trash');
                          window.dispatchEvent(new CustomEvent('photoDeleted', { detail: [photo._id] }));
                          onClose();
                        }
                      } catch (error) {
                        toast.error("Failed to move to trash");
                      }
                    }
                  }}
                  className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-full transition-colors"
                  title="Move to Trash"
                >
                  <Trash2 size={20} />
                </button>
                <button 
                  onClick={onClose}
                  className="hidden md:flex p-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="p-5 space-y-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 text-gray-400"><FileImage size={18} /></div>
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-0.5">Filename</p>
                    <p className="text-sm font-medium text-gray-900 break-all">{photo.filename}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-0.5 text-gray-400"><Calendar size={18} /></div>
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-0.5">Uploaded on</p>
                    <p className="text-sm font-medium text-gray-900">{formatDate(photo.createdAt)}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-0.5 text-gray-400"><HardDrive size={18} /></div>
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-0.5">File Size</p>
                    <p className="text-sm font-medium text-gray-900">{formatSize(photo.size)}</p>
                  </div>
                </div>
              </div>

              <hr className="border-gray-100" />

              {/* Privacy Status */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Security & Privacy</p>
                
                {photo.isPrivate ? (
                  <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 flex gap-3">
                    <ShieldCheck className="text-indigo-600 shrink-0" size={20} />
                    <div>
                      <p className="text-sm font-bold text-indigo-900">Secured in Vault</p>
                      <p className="text-xs text-indigo-700/80 mt-1">This photo is hidden from the main gallery.</p>
                    </div>
                  </div>
                ) : photo.privacyFindings && photo.privacyFindings.length > 0 ? (
                  <div className="bg-rose-50 border border-rose-100 rounded-xl p-4 space-y-3">
                    <div className="flex gap-2 text-rose-600 font-bold items-center mb-2">
                      <ShieldAlert size={18} />
                      <span className="text-sm">Sensitive Data Detected</span>
                    </div>
                    <div className="space-y-3">
                      {photo.privacyFindings.map((finding, idx) => (
                        <div key={idx} className="bg-white rounded-xl p-3 border border-rose-100 shadow-sm flex items-start gap-3">
                          <div className="p-2 bg-rose-100 text-rose-600 rounded-lg shrink-0">
                            <FileText size={16} />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900">{finding.label}</p>
                            <p className="text-xs font-mono text-gray-500 mt-1 bg-gray-50 p-1 rounded inline-block">{finding.redacted_text}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {!photo.isPrivate && (
                      <div className="mt-4 pt-4 border-t border-rose-100">
                        <p className="text-xs text-rose-600 mb-2">
                          Our AI detected sensitive info. You can secure this photo in your Privacy Vault to hide it from your main gallery.
                        </p>
                        <button 
                          onClick={async () => {
                            try {
                              const token = localStorage.getItem('pixmind_token');
                              const res = await fetch(`${API_URL}/api/v1/privacy/${photo._id}/move-to-vault`, {
                                method: 'PATCH',
                                headers: {
                                  'Authorization': `Bearer ${token}`
                                }
                              });
                              
                              if (res.ok) {
                                // Tell the parent (Home.jsx) to remove it from the list
                                window.dispatchEvent(new CustomEvent('photoVaulted', { detail: photo._id }));
                                alert('Photo secured in Vault successfully!');
                                onClose();
                              } else {
                                const data = await res.json();
                                alert(`Failed: ${data.message || 'Server error'}`);
                              }
                            } catch (error) {
                              console.error('Failed to move to vault', error);
                              alert('Network error. Failed to move to vault.');
                            }
                          }}
                          className="w-full bg-slate-900 hover:bg-slate-800 text-white py-2 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2 shadow-md shadow-slate-900/20"
                        >
                          <ShieldAlert size={16} />
                          Move to Secure Vault
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-green-50 border border-green-100 rounded-xl p-4 flex gap-3">
                    <ShieldCheck className="text-green-600 shrink-0" size={20} />
                    <div>
                      <p className="text-sm font-bold text-green-900">No Privacy Threats</p>
                      <p className="text-xs text-green-700/80 mt-1">AI scan found no sensitive documents.</p>
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
