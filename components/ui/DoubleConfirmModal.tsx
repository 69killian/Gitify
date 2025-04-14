import React, { useState } from 'react';

interface DoubleConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmMessage: string;
  cancelLabel?: string;
  confirmLabel?: string;
  finalConfirmLabel?: string;
}

const DoubleConfirmModal: React.FC<DoubleConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmMessage,
  cancelLabel = "Annuler",
  confirmLabel = "Continuer",
  finalConfirmLabel = "Confirmer la suppression"
}) => {
  const [step, setStep] = useState(1);

  if (!isOpen) return null;

  const handleFirstConfirm = () => {
    setStep(2);
  };

  const handleFinalConfirm = () => {
    onConfirm();
    setStep(1);
    onClose();
  };

  const handleCancel = () => {
    setStep(1);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm" 
        onClick={handleCancel}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-md p-6 bg-[#1B1B1B] rounded-lg shadow-xl border border-gray-700">
        <h2 className="text-xl font-bold text-white mb-4">{title}</h2>
        
        {step === 1 ? (
          <>
            <p className="text-gray-300 mb-6">{message}</p>
            <div className="flex justify-end gap-4">
              <button 
                className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                onClick={handleCancel}
              >
                {cancelLabel}
              </button>
              <button 
                className="px-4 py-2 bg-violet-800 hover:bg-violet-700 text-white rounded-md transition-colors"
                onClick={handleFirstConfirm}
              >
                {confirmLabel}
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="text-red-400 mb-6 font-medium">{confirmMessage}</p>
            <div className="flex justify-end gap-4">
              <button 
                className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                onClick={handleCancel}
              >
                {cancelLabel}
              </button>
              <button 
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
                onClick={handleFinalConfirm}
              >
                {finalConfirmLabel}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DoubleConfirmModal; 