import { useState } from 'react';

export function useEditMode() {
  const [isEditMode, setIsEditMode] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const unlock = () => {
    setIsEditMode(true);
  };

  const lock = () => {
    setIsEditMode(false);
  };

  return {
    isEditMode,
    showModal,
    setShowModal,
    unlock,
    lock,
  };
}
