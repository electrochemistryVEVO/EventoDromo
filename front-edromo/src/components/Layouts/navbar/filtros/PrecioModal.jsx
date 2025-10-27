import React, { useState, useEffect, useRef } from 'react';

const PrecioModal = ({ onClose, onApply, onClear, buttonRef, initialFilters }) => {
  // Estado inicial desde initialFilters
  const [minPrice, setMinPrice] = useState(initialFilters?.precioMin || '');
  const [maxPrice, setMaxPrice] = useState(initialFilters?.precioMax || '');

  const [position, setPosition] = useState({ top: -9999, left: -9999 });
  const popoverRef = useRef(null);

  // Calcula la posición con ajuste anti-desbordamiento
  useEffect(() => {
    if (buttonRef.current && popoverRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const popoverRect = popoverRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const scrollX = window.scrollX;
      const scrollY = window.scrollY;
      const margin = 10; // Margen de los bordes

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
    // Envía null si los campos están vacíos, lo que limpiará el filtro en la URL
    onApply({ tipo: 'precio', min: minPrice || null, max: maxPrice || null });
    onClose();
  };

  // El botón "Eliminar Filtro" llama a esta función directamente
  const handleClear = () => {
    onClear('precio'); // Llama a la función del hook para limpiar este filtro específico
    onClose();
  };

  return (
    <div
      ref={popoverRef}
      className="absolute bg-gray-100 p-6 rounded-lg shadow-xl w-full max-w-sm z-50 transition-opacity duration-100 opacity-100"
      style={{ top: `${position.top}px`, left: `${position.left}px` }}
    >
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Ingresa un rango de precios</h3>
       {/* Inputs */}
       <div className="flex items-center space-x-4 mb-6">
         <span className="font-semibold text-gray-700">S/</span>
         <input
            type="number"
            placeholder="min."
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#00C49A] text-sm"
            min="0"
         />
         <input
            type="number"
            placeholder="max."
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#00C49A] text-sm"
            min="0"
         />
       </div>
       {/* Botones */}
       <div className="flex justify-between items-center mt-6">
         {/* Botón Restaurado */}
         <button
            onClick={handleClear}
            className="text-red-600 hover:text-red-800 text-sm font-medium transition-colors"
         >
           Eliminar Filtro
         </button>
         <button
            onClick={handleApply}
            className="px-6 py-2 bg-[#00C49A] text-white rounded-full hover:bg-[#00b08a] transition-colors text-sm font-medium"
         >
           Aplicar
         </button>
       </div>
    </div>
  );
};

export default PrecioModal;