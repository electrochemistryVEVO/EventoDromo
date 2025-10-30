import React, { useState, useEffect, useRef } from 'react';

const ciudadesDisponibles = ['Tacna', 'Ica', 'Puno', 'Lima', 'Pucalpa', 'Iquitos','Arequipa', 'Cusco', 'Trujillo', 'Chiclayo'];

const CiudadModal = ({ onClose, onApply, onClear, buttonRef, initialFilters }) => {
  // Estado inicial desde initialFilters
  const initialSelected = initialFilters?.ciudad ? initialFilters.ciudad.split(',') : [];
  const [selectedCiudades, setSelectedCiudades] = useState(initialSelected);

  const [position, setPosition] = useState({ top: -9999, left: -9999 });
  const popoverRef = useRef(null);

  // Calcula posición (sin cambios)
  useEffect(() => {
    if (buttonRef.current && popoverRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const popoverRect = popoverRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const scrollX = window.scrollX;
      const scrollY = window.scrollY;
      const margin = 10;

      const calculatedTop = buttonRect.bottom + scrollY + 5;
      let calculatedLeft = buttonRect.left + scrollX;
      const rightEdgeIfAlignedLeft = calculatedLeft + popoverRect.width;

      if (rightEdgeIfAlignedLeft > viewportWidth - margin) {
          calculatedLeft = viewportWidth - popoverRect.width - margin;
      }
      if (calculatedLeft < margin) {
          calculatedLeft = margin;
      }

      setPosition({
        top: calculatedTop,
        left: calculatedLeft,
      });
    }
  }, [buttonRef]);

  // Detecta clics fuera (sin cambios)
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

  // Selección Múltiple
  const toggleCiudad = (ciudad) => {
    setSelectedCiudades(prevSelected => {
      if (prevSelected.includes(ciudad)) {
        return prevSelected.filter(c => c !== ciudad);
      } else {
        return [...prevSelected, ciudad];
      }
    });
  };

  // onApply envía array unido por comas o null
  const handleApply = () => {
    const valorParaUrl = selectedCiudades.length > 0 ? selectedCiudades.join(',') : null;
    onApply({ tipo: 'ciudad', valor: valorParaUrl });
    onClose();
  };

  // handleClear llama a onClear
  const handleClear = () => {
    onClear('ciudad');
    onClose();
  };

  return (
    <div
      ref={popoverRef}
      className="absolute bg-gray-100 p-6 rounded-lg shadow-xl w-full max-w-sm z-50 transition-opacity duration-100 opacity-100"
      style={{ top: `${position.top}px`, left: `${position.left}px` }}
    >
      {/* Botones de Ciudad */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {ciudadesDisponibles.map((ciudad) => {
          const isSelected = selectedCiudades.includes(ciudad);
          return (
            <button
              key={ciudad}
              onClick={() => toggleCiudad(ciudad)}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                isSelected
                ? 'bg-white border-[#00C49A] text-[#00C49A] ring-1 ring-[#00C49A]'
                : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
              }`}
            >
              {ciudad}
            </button>
          );
        })}
      </div>

      {/* Botones de Acción */}
      <div className="flex justify-between items-center mt-6">
        <button
          onClick={handleClear} // Botón para limpiar este filtro
          className="text-red-600 hover:text-red-800 text-sm font-medium transition-colors"
        >
          Eliminar Filtro
        </button>
        <button
          onClick={handleApply} // Aplica estado actual (incluyendo vacío)
          className={`px-6 py-2 bg-[#00C49A] text-white rounded-full hover:bg-[#00b08a] transition-colors text-sm font-medium`}
        >
          Aplicar
        </button>
      </div>
    </div>
  );
};

export default CiudadModal;