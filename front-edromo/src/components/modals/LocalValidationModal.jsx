import React from 'react';
import PropTypes from 'prop-types';
import { FiX, FiAlertCircle } from 'react-icons/fi';

const LocalValidationModal = ({ isOpen, onClose, errors, localName }) => {
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
      <div className="bg-white rounded-lg shadow-xl w-full max-w-xl mx-4 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-full transition-colors duration-200"
          aria-label="Cerrar modal"
        >
          <FiX className="w-6 h-6 text-gray-500" />
        </button>

        <div className="p-6">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            No se puede crear este local
          </h2>
          
          <p className="text-gray-700 mb-6">
            El local <strong>{localName}</strong> no puede ser creado por que tiene{' '}
            <strong>{errors.length} {errors.length === 1 ? 'dato incorrecto' : 'datos incorrectos'}</strong>
          </p>

          <div className="space-y-3 mb-6">
            {errors.map((error, index) => (
              <div
                key={index}
                className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3"
              >
                <FiAlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-gray-800 text-sm leading-relaxed">
                  {error}
                </p>
              </div>
            ))}
          </div>

          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors duration-200 font-medium"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

LocalValidationModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  errors: PropTypes.arrayOf(PropTypes.string).isRequired,
  localName: PropTypes.string.isRequired,
};

export default LocalValidationModal;
