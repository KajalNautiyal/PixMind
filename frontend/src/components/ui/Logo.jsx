import React from 'react';
import { BrainCircuit } from 'lucide-react';
export const Logo = ({ className = '', iconSize = 28, textClass = 'text-2xl font-bold' }) => {
  return (
    <div className={`flex items-center gap-2 group cursor-default ${className}`}>
      <div className="relative flex items-center justify-center bg-gradient-to-br from-[#6c5ce7] to-[#a29bfe] text-white rounded-xl p-1.5 shadow-sm">
        <BrainCircuit size={iconSize} strokeWidth={2.5} />
      </div>
      <span className={`tracking-tight text-gray-900 ${textClass}`}>
        Pix<span className="text-[#6c5ce7]">Mind</span>
      </span>
    </div>
  );
};
