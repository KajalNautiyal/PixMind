import React, { useState, useRef } from 'react';
import { UploadCloud, X, Image as ImageIcon } from 'lucide-react';
import { Button } from './ui/Button';
import { photoAPI } from '../services/api';

const UploadModal = ({ isOpen, onClose, onUploadSuccess }) => {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  if (!isOpen) return null;

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    setError('');
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    setError('');
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFiles = (selectedFiles) => {
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    let validFiles = [];
    let hasError = false;

    // Limit to 10 files max
    const totalFiles = files.length + selectedFiles.length;
    if (totalFiles > 10) {
      setError('You can only upload up to 10 photos at once');
      return;
    }

    selectedFiles.forEach((f) => {
      if (!validTypes.includes(f.type)) {
        hasError = true;
        setError('Please upload only valid images (JPEG, PNG, WEBP)');
      } else if (f.size > 10 * 1024 * 1024) {
        hasError = true;
        setError('One or more files exceed the 10MB limit');
      } else {
        validFiles.push(f);
      }
    });

    if (!hasError && validFiles.length > 0) {
      setFiles((prev) => [...prev, ...validFiles]);
    }
  };

  const removeFile = (indexToRemove) => {
    setFiles(files.filter((_, index) => index !== indexToRemove));
  };

  const handleUpload = async () => {
    if (files.length === 0) return;

    setIsUploading(true);
    setError('');
    
    const formData = new FormData();
    files.forEach((f) => formData.append('images', f));

    try {
      const res = await photoAPI.upload(formData);
      if (res.data.success) {
        setFiles([]);
        
        // Show success/duplicate message if there are duplicates skipped
        if (res.data.duplicates && res.data.duplicates.length > 0) {
          alert(`Uploaded ${res.data.uploaded.length} photo(s). Skipped ${res.data.duplicates.length} duplicate(s).`);
        }

        // Backend returns the array of created photos inside res.data.uploaded
        onUploadSuccess(res.data.uploaded || []);
        onClose();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload photos');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Upload Photo</h2>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-600 text-sm border border-red-100">
              {error}
            </div>
          )}

          {files.length === 0 ? (
            <div 
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${
                dragActive ? 'border-[#6c5ce7] bg-[#6c5ce7]/5' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => inputRef.current?.click()}
            >
              <input 
                ref={inputRef}
                type="file" 
                multiple
                accept="image/jpeg, image/png, image/webp" 
                onChange={handleChange} 
                className="hidden" 
              />
              <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center mx-auto mb-4 text-[#6c5ce7]">
                <UploadCloud size={24} />
              </div>
              <p className="text-sm font-medium text-gray-900">Click to upload or drag and drop multiple files</p>
              <p className="text-xs text-gray-500 mt-1">JPEG, PNG or WEBP (max 10MB each, up to 10 files)</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">{files.length} photo(s) selected</span>
                {files.length < 10 && (
                  <button 
                    onClick={() => inputRef.current?.click()} 
                    className="text-xs font-semibold text-[#6c5ce7] hover:text-[#5a4bd1]"
                  >
                    + Add more
                  </button>
                )}
                <input 
                  ref={inputRef}
                  type="file" 
                  multiple
                  accept="image/jpeg, image/png, image/webp" 
                  onChange={handleChange} 
                  className="hidden" 
                />
              </div>
              {files.map((f, i) => (
                <div key={i} className="border border-gray-200 rounded-xl p-3 flex items-center gap-4 bg-gray-50">
                  <div className="w-10 h-10 rounded-lg bg-gray-200 flex-shrink-0 flex items-center justify-center overflow-hidden">
                    <img src={URL.createObjectURL(f)} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{f.name}</p>
                    <p className="text-xs text-gray-500">{(f.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                  <button 
                    onClick={() => removeFile(i)}
                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose} disabled={isUploading}>
            Cancel
          </Button>
          <Button 
            className="bg-[#6c5ce7] hover:bg-[#5a4bd1]" 
            onClick={handleUpload} 
            disabled={files.length === 0 || isUploading}
            isLoading={isUploading}
          >
            Upload
          </Button>
        </div>
        
      </div>
    </div>
  );
};

export default UploadModal;
