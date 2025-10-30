import React, { useState, useEffect, useRef } from 'react';

// Opciones hardcodeadas
const ciudadesDisponibles = ['Tacna', 'Ica', 'Puno', 'Lima', 'Pucalpa', 'Iquitos','Arequipa', 'Cusco', 'Trujillo', 'Chiclayo'];

// Acepta buttonRef
const CiudadModal = ({ onClose, onApply, onClear, buttonRef }) => {
  const [selectedCiudad, setSelectedCiudad] = useState(null);
  const [position, setPosition] = useState({ top: -9999, left: -9999 }); // Estado de posición
  const popoverRef = useRef(null); // Ref para el popover

  // Calcula la posición
  useEffect(() => {
    if (buttonRef.current && popoverRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      setPosition({
        top: buttonRect.bottom + window.scrollY + 5,
        left: buttonRect.left + window.scrollX,
      });
    }
  }, [buttonRef]);

  // Detecta clics fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popoverRef.current &&
          !popoverRef.current.contains(event.target) &&
          buttonRef.current &&
          !buttonRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose, buttonRef]);


  const handleApply = () => {
    onApply({ tipo: 'ciudad', valor: selectedCiudad });
    onClose();
  };

  const handleClear = () => {
    onClear('ciudad');
    onClose();
  };

  return (
    <div
      ref={popoverRef} // Asigna ref
      className="absolute bg-gray-100 p-6 rounded-lg shadow-xl w-full max-w-sm z-50 transition-opacity duration-100 opacity-100" // Posicionamiento y estilos
      style={{ top: `${position.top}px`, left: `${position.left}px` }} // Aplica posición
    >
      {/* Botones de Ciudad */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {ciudadesDisponibles.map((ciudad) => (
          <button
            key={ciudad}
            onClick={() => setSelectedCiudad(ciudad)}
            className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
              selectedCiudad === ciudad
              ? 'bg-white border-[#00C49A] text-[#00C49A] ring-1 ring-[#00C49A]'
              : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
            }`}
          >
            {ciudad}
          </button>
        ))}
      </div>

      {/* Botones de Acción */}
      <div className="flex justify-between items-center mt-6">
        <button
          onClick={handleClear}
          className="text-red-600 hover:text-red-800 text-sm font-medium transition-colors"
        >
          Eliminar Filtro
        </button>
        <button
          onClick={handleApply}
          disabled={!selectedCiudad}
          className={`px-6 py-2 bg-[#00C49A] text-white rounded-full hover:bg-[#00b08a] transition-colors text-sm font-medium ${!selectedCiudad ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          Aplicar
        </button>
      </div>
    </div>
  );
};

export default CiudadModal;
