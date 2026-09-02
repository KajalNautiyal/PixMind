import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Logo } from '../components/ui/Logo';
import { Button } from '../components/ui/Button';
import UploadModal from '../components/UploadModal';
import { 
  Image as ImageIcon, 
  FolderOpen, 
  Search, 
  Clock, 
  Shield, 
  Sparkles, 
  LogOut, 
  Menu, 
  X,
  User
} from 'lucide-react';

const SidebarLink = ({ to, icon: Icon, label, onClick }) => (
  <NavLink
    to={to}
    onClick={onClick}
    end={to === '/dashboard'}
    className={({ isActive }) =>
      `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
        isActive 
          ? 'bg-[#6c5ce7]/10 text-[#6c5ce7]' 
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
      }`
    }
  >
    <Icon size={18} strokeWidth={2} />
    {label}
  </NavLink>
);

const DashboardLayout = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  
  // Safely parse user data
  let user = { name: 'User', email: '' };
  try {
    const storedUser = localStorage.getItem('pixmind_user');
    if (storedUser) user = JSON.parse(storedUser);
  } catch (e) {}

  const handleLogout = () => {
    localStorage.removeItem('pixmind_token');
    localStorage.removeItem('pixmind_user');
    window.location.href = '/login';
  };

  const handleUploadSuccess = (newPhoto) => {
    // We will use a custom event to notify Home component to refresh photos
    window.dispatchEvent(new CustomEvent('photoUploaded', { detail: newPhoto }));
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 lg:hidden" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 
        transition-transform duration-200 ease-in-out flex flex-col
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
      `}>
        <div className="h-16 flex items-center px-6 border-b border-gray-100">
          <Logo iconSize={24} textClass="text-xl font-bold" />
        </div>

        <div className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-6">
          {/* Main Menu */}
          <div>
            <div className="px-3 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Library</div>
            <div className="space-y-1">
              <SidebarLink to="/dashboard" icon={ImageIcon} label="Home" onClick={() => setIsSidebarOpen(false)} />
              <SidebarLink to="/dashboard/search" icon={Search} label="AI Search" onClick={() => setIsSidebarOpen(false)} />
              <SidebarLink to="/dashboard/albums" icon={FolderOpen} label="Albums" onClick={() => setIsSidebarOpen(false)} />
              <SidebarLink to="/dashboard/memories" icon={Clock} label="Memories" onClick={() => setIsSidebarOpen(false)} />
            </div>
          </div>

          {/* Tools Menu */}
          <div>
            <div className="px-3 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Tools</div>
            <div className="space-y-1">
              <SidebarLink to="/dashboard/privacy" icon={Shield} label="Privacy Vault" onClick={() => setIsSidebarOpen(false)} />
              <SidebarLink to="/dashboard/cleanup" icon={Sparkles} label="Smart Cleanup" onClick={() => setIsSidebarOpen(false)} />
            </div>
          </div>
        </div>

        {/* User / Logout */}
        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
          </div>
          <motion.button 
            whileHover={{ scale: 1.03, backgroundColor: 'rgba(254, 226, 226, 1)' }}
            whileTap={{ scale: 0.97 }}
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-red-600 rounded-lg transition-colors"
          >
            <LogOut size={16} /> Logout
          </motion.button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-8 z-10">
          
          <div className="flex items-center gap-4 flex-1">
            <button 
              className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={20} />
            </button>
            
            {/* Global Search Bar Placeholder */}
            <div className="hidden md:flex items-center max-w-md w-full relative">
              <Search className="absolute left-3 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Ask anything about your photos..." 
                className="w-full h-10 pl-10 pr-4 bg-gray-100 border-transparent rounded-full text-sm focus:bg-white focus:border-[#6c5ce7] focus:ring-2 focus:ring-[#6c5ce7]/20 outline-none transition-all"
              />
            </div>
          </div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-4"
          >
            <Button 
              size="sm" 
              className="bg-[#6c5ce7] hover:bg-[#5a4bd1] shadow-md hover:shadow-lg transition-all"
              onClick={() => setIsUploadOpen(true)}
            >
              + Upload
            </Button>
          </motion.div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 lg:p-8">
          <Outlet />
        </main>

      </div>
      
      <UploadModal 
        isOpen={isUploadOpen} 
        onClose={() => setIsUploadOpen(false)} 
        onUploadSuccess={handleUploadSuccess} 
      />
    </div>
  );
};

export default DashboardLayout;
