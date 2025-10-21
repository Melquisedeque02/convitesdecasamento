// src/components/Common/Modal.jsx
import React from 'react';

const Modal = ({ isOpen, title, message, onConfirm, onCancel, confirmText = 'Confirmar', cancelText = 'Cancelar', type = 'confirm' }) => {
  if (!isOpen) return null;

  const getTypeStyles = () => {
    switch (type) {
      case 'danger':
        return {
          titleColor: 'text-red-600',
          buttonColor: 'bg-red-600 hover:bg-red-700',
          icon: '⚠️'
        };
      case 'success':
        return {
          titleColor: 'text-green-600',
          buttonColor: 'bg-green-600 hover:bg-green-700',
          icon: '✓'
        };
      case 'info':
        return {
          titleColor: 'text-blue-600',
          buttonColor: 'bg-blue-600 hover:bg-blue-700',
          icon: 'ℹ️'
        };
      default:
        return {
          titleColor: 'text-gray-800',
          buttonColor: 'bg-blue-600 hover:bg-blue-700',
          icon: '❓'
        };
    }
  };

  const styles = getTypeStyles();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-sm w-full mx-4">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">{styles.icon}</span>
            <h2 className={`text-xl font-bold ${styles.titleColor}`}>{title}</h2>
          </div>
          
          <p className="text-gray-600 mb-6">{message}</p>

          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition font-semibold"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className={`flex-1 text-white px-4 py-2 rounded-lg transition font-semibold ${styles.buttonColor}`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;