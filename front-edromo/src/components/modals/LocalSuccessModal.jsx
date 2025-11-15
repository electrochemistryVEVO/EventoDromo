import React from 'react';
import PropTypes from 'prop-types';
import { FiX, FiCheck } from 'react-icons/fi';

const LocalSuccessModal = ({ isOpen, onClose, count = 1 }) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-full transition-colors duration-200"
          aria-label="Cerrar modal"
        >
          <FiX className="w-6 h-6 text-gray-500" />
        </button>

        <div className="p-8 flex flex-col items-center justify-center">
          <div className="w-32 h-32 bg-green-500 rounded-full flex items-center justify-center mb-6">
            <FiCheck className="w-20 h-20 text-white" strokeWidth={3} />
          </div>

          <h2 className="text-2xl font-bold text-gray-800 text-center">
            {count} nuevo {count === 1 ? 'evento' : 'eventos'} han sido creado.
          </h2>
        </div>
      </div>
    </div>
  );
};

LocalSuccessModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  count: PropTypes.number,
};

export default LocalSuccessModal;
