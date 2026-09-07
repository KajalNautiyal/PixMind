import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, ShieldCheck, Lock, Unlock, Loader2, Eye, Trash2, CheckCircle2 } from 'lucide-react';
import PhotoModal from '../../components/ui/PhotoModal';
import VaultPinPad from '../../components/ui/VaultPinPad';
import api from '../../services/api';
import toast from 'react-hot-toast';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
};

export default function PrivacyVault() {
  const [activeTab, setActiveTab] = useState('alerts'); // 'alerts' | 'vault'
  const [alerts, setAlerts] = useState([]);
  const [vault, setVault] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null); // stores photoId being processed
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  
  // Vault PIN state
  const [isUnlocked, setIsUnlocked] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchData();
    // Lock the vault automatically if they switch away from the vault tab
    if (activeTab !== 'vault') {
      setIsUnlocked(false);
    }
  }, [activeTab]);

  useEffect(() => {
    const handlePhotoDeleted = (e) => {
      const deletedIds = e.detail; // Array of IDs
      setAlerts(prev => prev.filter(p => !deletedIds.includes(p._id)));
      setVault(prev => prev.filter(p => !deletedIds.includes(p._id)));
    };
    window.addEventListener('photoDeleted', handlePhotoDeleted);
    return () => window.removeEventListener('photoDeleted', handlePhotoDeleted);
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      if (activeTab === 'alerts') {
        const res = await api.get('/privacy/alerts');
        setAlerts(res.data.data);
      } else {
        const res = await api.get('/privacy/vault');
        setVault(res.data.data);
      }
    } catch (error) {
      console.error('Error fetching privacy data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMoveToVault = async (photoId) => {
    setActionLoading(photoId);
    try {
      await api.patch(`/privacy/${photoId}/move-to-vault`);
      setAlerts(alerts.filter(a => a._id !== photoId));
      toast.success('Moved to Vault');
    } catch (error) {
      toast.error('Failed to move to vault');
    } finally {
      setActionLoading(null);
    }
  };

  const handleRemoveFromVault = async (photoId) => {
    setActionLoading(photoId);
    try {
      await api.patch(`/privacy/${photoId}/remove-from-vault`);
      setVault(vault.filter(v => v._id !== photoId));
      toast.success('Un-vaulted successfully');
    } catch (error) {
      toast.error('Failed to remove from vault');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="max-w-6xl mx-auto space-y-8 pb-10"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col gap-2">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight flex items-center gap-3">
          <span className="p-2 bg-rose-100 text-rose-600 rounded-xl">
            <Lock className="w-8 h-8" />
          </span>
          Privacy Vault
        </h1>
        <p className="text-gray-500 font-medium">
          PixMind automatically detects sensitive documents and keeps them secure.
        </p>
      </motion.div>

      {/* Tabs */}
      <motion.div variants={itemVariants} className="flex gap-4 border-b border-gray-200 pb-px">
        <button
          onClick={() => setActiveTab('alerts')}
          className={`pb-4 px-2 font-semibold text-sm transition-colors relative ${
            activeTab === 'alerts' ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4" />
            Active Alerts
            {activeTab === 'alerts' && alerts.length > 0 && (
              <span className="bg-rose-100 text-rose-600 py-0.5 px-2 rounded-full text-xs">
                {alerts.length}
              </span>
            )}
          </div>
          {activeTab === 'alerts' && (
            <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('vault')}
          className={`pb-4 px-2 font-semibold text-sm transition-colors relative ${
            activeTab === 'vault' ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" />
            Secured Vault
          </div>
          {activeTab === 'vault' && (
            <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900" />
          )}
        </button>
      </motion.div>

      {/* Content Area */}
      <motion.div variants={itemVariants} className="min-h-[400px]">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {activeTab === 'alerts' ? (
              <motion.div
                key="alerts"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                {alerts.length === 0 ? (
                  <div className="flex flex-col items-center justify-center p-12 bg-gray-50/50 rounded-3xl border border-gray-100/50">
                    <div className="p-4 bg-green-50 text-green-500 rounded-2xl mb-4">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No privacy threats found</h3>
                    <p className="text-gray-500 text-center max-w-sm">
                      Your gallery is clean. We'll alert you if we detect any sensitive documents like Aadhaar, PAN, or Credit Cards.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {alerts.map((photo) => (
                      <div key={photo._id} className="group bg-white rounded-2xl overflow-hidden border border-rose-100 shadow-sm hover:shadow-md transition-shadow relative">
                        {/* Red overlay on image */}
                        <div className="relative aspect-square overflow-hidden bg-gray-100 cursor-pointer" onClick={() => setSelectedPhoto(photo)}>
                          <img 
                            src={`${API_URL}${photo.url}`} 
                            alt="Sensitive Document"
                            className="w-full h-full object-cover blur-[2px] brightness-75 group-hover:blur-0 group-hover:brightness-100 transition-all duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                          <div className="absolute top-3 left-3 flex gap-2">
                            <span className="bg-rose-500 text-white text-xs font-bold px-2 py-1 rounded-md shadow-sm flex items-center gap-1 backdrop-blur-md">
                              <ShieldAlert className="w-3 h-3" />
                              Sensitive
                            </span>
                          </div>
                        </div>

                        {/* Findings list */}
                        <div className="p-4 bg-rose-50/30">
                          <div className="space-y-3">
                            {photo.privacyFindings.map((finding, idx) => (
                              <div key={idx} className="flex justify-between items-center text-sm">
                                <div className="flex items-center gap-2 text-gray-700 font-medium">
                                  <span className="text-base">{finding.type === 'aadhaar' ? '🪪' : finding.type === 'pan' ? '💳' : '📄'}</span>
                                  {finding.label}
                                </div>
                                <div className="font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                  {finding.redacted_text}
                                </div>
                              </div>
                            ))}
                          </div>

                          <div className="flex gap-2 mt-5">
                            <button
                              onClick={() => handleMoveToVault(photo._id)}
                              disabled={actionLoading === photo._id}
                              className="flex-1 bg-gray-900 text-white py-2 px-3 rounded-lg text-sm font-semibold hover:bg-gray-800 transition-colors flex justify-center items-center gap-2 disabled:opacity-70"
                            >
                              {actionLoading === photo._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                              Move to Vault
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            ) : (
                <motion.div
                key="vault"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                {!isUnlocked ? (
                  <VaultPinPad onUnlocked={() => setIsUnlocked(true)} />
                ) : vault.length === 0 ? (
                  <div className="flex flex-col items-center justify-center p-12 bg-gray-50/50 rounded-3xl border border-gray-100/50">
                    <div className="p-4 bg-gray-100 text-gray-400 rounded-2xl mb-4">
                      <Lock className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Vault is empty</h3>
                    <p className="text-gray-500 text-center max-w-sm">
                      When you move photos here from the Alerts tab, they will be hidden from your main gallery and secured.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {vault.map((photo) => (
                      <div key={photo._id} className="group bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm relative aspect-square cursor-pointer" onClick={() => setSelectedPhoto(photo)}>
                        <img 
                          src={`${API_URL}${photo.url}`} 
                          alt="Vaulted item"
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveFromVault(photo._id);
                            }}
                            disabled={actionLoading === photo._id}
                            className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 border border-white/20"
                          >
                            {actionLoading === photo._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Unlock className="w-4 h-4" />}
                            Un-vault
                          </button>
                        </div>
                        {/* Findings list inside vault */}
                        <div className="absolute top-2 left-2 flex flex-col gap-1">
                            {photo.privacyFindings?.map((finding, idx) => (
                              <span key={idx} className="bg-black/50 backdrop-blur-md text-white text-[10px] font-medium px-1.5 py-0.5 rounded flex items-center gap-1">
                                {finding.type === 'aadhaar' ? '🪪' : finding.type === 'pan' ? '💳' : '📄'} {finding.label}
                              </span>
                            ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </motion.div>

      <PhotoModal 
        photo={selectedPhoto} 
        onClose={() => setSelectedPhoto(null)} 
        onNext={() => {
          const list = activeTab === 'alerts' ? alerts : vault;
          const idx = list.findIndex(p => p._id === selectedPhoto?._id);
          if (idx !== -1 && idx < list.length - 1) setSelectedPhoto(list[idx + 1]);
        }}
        onPrev={() => {
          const list = activeTab === 'alerts' ? alerts : vault;
          const idx = list.findIndex(p => p._id === selectedPhoto?._id);
          if (idx > 0) setSelectedPhoto(list[idx - 1]);
        }}
        hasNext={(activeTab === 'alerts' ? alerts : vault).findIndex(p => p._id === selectedPhoto?._id) !== -1 && (activeTab === 'alerts' ? alerts : vault).findIndex(p => p._id === selectedPhoto?._id) < (activeTab === 'alerts' ? alerts : vault).length - 1}
        hasPrev={(activeTab === 'alerts' ? alerts : vault).findIndex(p => p._id === selectedPhoto?._id) > 0}
      />
    </motion.div>
  );
}
