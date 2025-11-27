/**
 * @file Modal.jsx
 * @description Componente de modal genérico y reutilizable.
 */

import React from "react";

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) {
    return null;
  }

  return (
    // Fondo oscuro semi-transparente
    <div className="fixed inset-0 z-50 flex justify-center items-center backdrop-blur-[1px]">
      <div className="absolute inset-0 bg-transparent" onClick={onClose}></div>
      {/* Contenedor del modal */}
      <div className="bg-white rounded-lg shadow-2xl border border-gray-200 w-full max-w-md m-4 relative z-10">
        {/* Encabezado del modal */}
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            aria-label="Cerrar modal"
          >
            {/* Icono de 'X' para cerrar */}
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>
        {/* Contenido del modal */}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
