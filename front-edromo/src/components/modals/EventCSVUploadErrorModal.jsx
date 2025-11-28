import React from 'react';
import PropTypes from 'prop-types';
import { FiX, FiUpload } from 'react-icons/fi';

const EventCSVUploadErrorModal = ({ isOpen, onClose, errors, failedCount = 0, successCount = 0 }) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const hasPartialSuccess = successCount > 0;

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
          <div className="flex items-center gap-3 mb-6">
            <FiUpload className="text-2xl text-gray-700" />
            <h3 className="text-xl font-bold text-gray-800">
              Cargar Eventos por CSV
            </h3>
          </div>

          <div className="flex items-center justify-center mb-6">
            <div className={`w-32 h-32 rounded-full flex items-center justify-center ${hasPartialSuccess ? 'bg-yellow-500' : 'bg-red-500'}`}>
              {hasPartialSuccess ? (
                <svg className="w-20 h-20 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              ) : (
                <svg className="w-20 h-20 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="15" y1="9" x2="9" y2="15"></line>
                  <line x1="9" y1="9" x2="15" y2="15"></line>
                </svg>
              )}
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-2">
            {hasPartialSuccess ? 'Carga parcial' : 'Carga fallida'}
          </h2>
          
          {hasPartialSuccess && (
            <p className="text-center text-gray-600 mb-4">
              <span className="text-green-600 font-semibold">{successCount} evento{successCount !== 1 ? 's' : ''}</span> cargado{successCount !== 1 ? 's' : ''} correctamente
            </p>
          )}
          
          <p className="text-center text-gray-600">
            <strong className="text-red-600">{failedCount} Evento{failedCount !== 1 ? 's' : ''}</strong> no {failedCount !== 1 ? 'han' : 'ha'} podido ser cargado{failedCount !== 1 ? 's' : ''}.
          </p>

          {errors && errors.length > 0 && (
            <div className="mt-6 max-h-60 overflow-y-auto">
              <div className="space-y-2">
                {errors.slice(0, 10).map((error, index) => (
                  <div
                    key={index}
                    className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-gray-800"
                  >
                    • {error}
                  </div>
                ))}
                {errors.length > 10 && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700 font-medium">
                    ... y {errors.length - 10} errores más
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex justify-end mt-6">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors duration-200 font-medium"
            >
              Atrás
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

EventCSVUploadErrorModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  errors: PropTypes.arrayOf(PropTypes.string),
  failedCount: PropTypes.number,
  successCount: PropTypes.number,
};

export default EventCSVUploadErrorModal;
