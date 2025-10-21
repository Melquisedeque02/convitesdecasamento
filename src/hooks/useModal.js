// src/hooks/useModal.js
import { useState, useCallback } from 'react';

export function useModal() {
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Confirmar',
    cancelText: 'Cancelar',
    type: 'confirm',
    onConfirm: null,
    onCancel: null,
  });

  const openModal = useCallback((config) => {
    setModalState(prev => ({
      ...prev,
      isOpen: true,
      title: config.title || 'Confirmação',
      message: config.message || '',
      confirmText: config.confirmText || 'Confirmar',
      cancelText: config.cancelText || 'Cancelar',
      type: config.type || 'confirm',
      onConfirm: config.onConfirm || null,
      onCancel: config.onCancel || null,
    }));
  }, []);

  const closeModal = useCallback(() => {
    setModalState(prev => ({
      ...prev,
      isOpen: false,
    }));
  }, []);

  const confirm = useCallback((config) => {
    return new Promise((resolve) => {
      openModal({
        ...config,
        onConfirm: () => {
          if (config.onConfirm) config.onConfirm();
          closeModal();
          resolve(true);
        },
        onCancel: () => {
          if (config.onCancel) config.onCancel();
          closeModal();
          resolve(false);
        },
      });
    });
  }, [openModal, closeModal]);

  return {
    ...modalState,
    openModal,
    closeModal,
    confirm,
  };
}