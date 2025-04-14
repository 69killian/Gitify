import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, X, AlertCircle } from 'lucide-react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  duration?: number;
  onClose?: () => void;
}

export const Toast = ({ 
  message, 
  type = 'info', 
  duration = 5000, 
  onClose
}: ToastProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onClose) onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) onClose();
  };

  const bgColor = 
    type === 'success' ? 'bg-green-800/50 border-green-500' :
    type === 'error' ? 'bg-red-800/50 border-red-500' :
    'bg-violet-800/50 border-violet-500';

  const textColor = 
    type === 'success' ? 'text-green-300' :
    type === 'error' ? 'text-red-300' :
    'text-violet-300';

  const Icon = 
    type === 'success' ? CheckCircle :
    type === 'error' ? AlertCircle :
    CheckCircle;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`fixed top-4 right-4 z-50 flex items-center p-4 mb-4 rounded-md shadow-lg border ${bgColor}`}
          role="alert"
        >
          <div className="flex items-center">
            <Icon className={`w-5 h-5 mr-2 ${textColor}`} />
            <span className="text-white">{message}</span>
          </div>
          <button
            type="button"
            className="ml-4 text-gray-400 hover:text-white"
            onClick={handleClose}
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

interface ToastProviderProps {
  children: React.ReactNode;
}

interface ToastData {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
  duration?: number;
}

export const ToastProvider = ({ children }: ToastProviderProps) => {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const addToast = (toast: Omit<ToastData, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prevToasts) => [...prevToasts, { ...toast, id }]);
    return id;
  };

  const removeToast = (id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  // Exposer les méthodes via window pour permettre un accès global
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.showToast = (message: string, type: 'success' | 'error' | 'info' = 'info', duration = 5000) => {
        return addToast({ message, type, duration });
      };
      
      window.hideToast = (id: string) => {
        removeToast(id);
      };
    }
  }, []);

  return (
    <>
      {children}
      <div className="fixed top-0 right-0 z-50 p-4 space-y-4">
        <AnimatePresence>
          {toasts.map((toast) => (
            <Toast
              key={toast.id}
              message={toast.message}
              type={toast.type}
              duration={toast.duration}
              onClose={() => removeToast(toast.id)}
            />
          ))}
        </AnimatePresence>
      </div>
    </>
  );
};

// Ajouter les types pour l'accès global
declare global {
  interface Window {
    showToast: (message: string, type?: 'success' | 'error' | 'info', duration?: number) => string;
    hideToast: (id: string) => void;
  }
} 