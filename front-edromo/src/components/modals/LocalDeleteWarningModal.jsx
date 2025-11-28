import React from 'react';
import PropTypes from 'prop-types';

const LocalDeleteWarningModal = ({ isOpen, onClose, localData }) => {
  if (!isOpen || !localData) return null;

  return (
    <div className="fixed z-[999] inset-0 bg-black/50 grid h-screen w-screen place-items-center">
      <div className="relative max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        {/* Botón Cerrar */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Cerrar modal"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        {/* Título */}
        <h2 className="text-2xl font-bold text-red-600 mb-4">
          No se puede inactivar este local
        </h2>

        {/* Mensaje */}
        <p className="text-gray-700 text-lg mb-6">
          El local <strong>{localData.nombre}</strong> no puede ser puesto en estado inactivo porque tiene <strong>{localData.eventos} eventos activos</strong>
        </p>

        {/* Caja de advertencia */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-red-800 text-lg mb-1">
                Eventos activos: {localData.eventos}
              </h3>
              <p className="text-red-700 text-sm">
                Para bloquear este local, primero debe cancelar o finalizar todos los eventos activos
              </p>
            </div>
          </div>
        </div>

        {/* Botón */}
        <div className="flex justify-end">
          <button 
            onClick={onClose}
            className="px-8 py-2.5 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

LocalDeleteWarningModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  localData: PropTypes.shape({
    nombre: PropTypes.string.isRequired,
    eventos: PropTypes.number.isRequired,
  }),
};

export default LocalDeleteWarningModal;
