import React from 'react';
import PropTypes from 'prop-types';

const LocalRestoreModal = ({ isOpen, onClose, onConfirm, localData, isLoading }) => {
  if (!isOpen || !localData) return null;

  return (
    <div className="fixed z-[999] inset-0 bg-black/50 grid h-screen w-screen place-items-center">
      <div className="relative max-w-xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        {/* Título */}
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Restaurar Local
        </h2>

        {/* Mensaje */}
        <p className="text-gray-700 text-lg mb-8">
          ¿Estás seguro de que quieres restaurar el local "{localData.nombre}"? El local volverá a estar activo y disponible para eventos.
        </p>

        {/* Botones */}
        <div className="flex justify-end gap-3">
          <button 
            onClick={onClose}
            disabled={isLoading}
            className="px-6 py-2.5 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium disabled:opacity-50"
          >
            Cancelar
          </button>
          <button 
            onClick={onConfirm}
            disabled={isLoading}
            className="px-6 py-2.5 text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50"
          >
            {isLoading ? 'Restaurando...' : 'Restaurar'}
          </button>
        </div>
      </div>
    </div>
  );
};

LocalRestoreModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  localData: PropTypes.shape({
    nombre: PropTypes.string.isRequired,
  }),
  isLoading: PropTypes.bool,
};

export default LocalRestoreModal;
