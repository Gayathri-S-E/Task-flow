import React, { useEffect } from "react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-dark-950/80 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className="glass-panel w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl relative z-10 animate-slide-up bg-dark-900 border border-dark-800">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-dark-800/80 bg-dark-950/40">
          {title && <h3 className="text-lg font-bold text-white tracking-wide">{title}</h3>}
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-dark-400 hover:text-dark-100 hover:bg-dark-800/60 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        {/* Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
