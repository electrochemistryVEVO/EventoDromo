import React from 'react';
import PropTypes from 'prop-types';
import { FiX, FiCheck, FiUpload } from 'react-icons/fi';

const EventCSVUploadSuccessModal = ({ isOpen, onClose, count = 0 }) => {
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
          <div className="flex items-center gap-3 mb-6">
            <FiUpload className="text-2xl text-gray-700" />
            <h3 className="text-xl font-bold text-gray-800">
              Cargar Eventos por CSV
            </h3>
          </div>

          <div className="w-32 h-32 bg-green-500 rounded-full flex items-center justify-center mb-6">
            <FiCheck className="w-20 h-20 text-white" strokeWidth={3} />
          </div>

          <h2 className="text-2xl font-bold text-gray-800 text-center">
            Carga completa! <strong>{count} Evento{count !== 1 ? 's' : ''}</strong> {count !== 1 ? 'han' : 'ha'} sido cargado{count !== 1 ? 's' : ''}.
          </h2>
        </div>
      </div>
    </div>
  );
};

EventCSVUploadSuccessModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  count: PropTypes.number,
};

export default EventCSVUploadSuccessModal;
