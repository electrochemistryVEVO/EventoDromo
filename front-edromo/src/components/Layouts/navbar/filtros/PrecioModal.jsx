import React, { useState, useEffect, useRef } from 'react';

// Acepta una nueva prop: buttonRef (la referencia al botón)
const PrecioModal = ({ onClose, onApply, onClear, buttonRef }) => {
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  // Inicializa la posición con valores que no sean 0 para evitar el if (opcional, pero ayuda)
  const [position, setPosition] = useState({ top: -9999, left: -9999 }); 
  const popoverRef = useRef(null); // Referencia al div del popover

  // Calcula la posición inicial cuando se monta O cuando cambia el botón de referencia
  useEffect(() => {
    // Solo calcula si el popover está visible y las referencias existen
    if (buttonRef.current && popoverRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      // Asegúrate que el cálculo tenga sentido incluso si el scroll es 0
      const calculatedTop = buttonRect.bottom + window.scrollY + 5;
      const calculatedLeft = buttonRect.left + window.scrollX;
      
      setPosition({
        top: calculatedTop, 
        left: calculatedLeft,
      });
      // console.log("Calculated Position:", { top: calculatedTop, left: calculatedLeft }); // Descomenta para depurar
    }
  }, [buttonRef]); // Depende solo de buttonRef para recalcular si el botón cambia

  // Efecto para detectar clics fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popoverRef.current && 
          !popoverRef.current.contains(event.target) &&
          buttonRef.current && 
          !buttonRef.current.contains(event.target) ) {
        onClose(); 
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose, buttonRef]); 


  const handleApply = () => {
    onApply({ tipo: 'precio', min: minPrice || null, max: maxPrice || null });
    onClose();
  };

  const handleClear = () => {
    onClear('precio');
    onClose();
  };

  // --- LÍNEA PROBLEMÁTICA COMENTADA ---
  // if (!position.top) return null; // <--- Comentado temporalmente

  // Si aún así no aparece, podemos devolver algo simple para confirmar que se renderiza
  // if(position.top === -9999) return <div className="absolute top-10 left-10 bg-red-500 p-4 z-50">Rendering...</div>

  return (
    <div
      ref={popoverRef} 
      // Añadido 'opacity' y 'transition' para suavizar el salto inicial si ocurre
      className="absolute bg-gray-100 p-6 rounded-lg shadow-xl w-full max-w-sm z-50 transition-opacity duration-100 opacity-100" 
      // Aplica posición, incluso si es la inicial (-9999)
      style={{ top: `${position.top}px`, left: `${position.left}px` }} 
    >
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Ingresa un rango de precios</h3>

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

      <div className="flex justify-between items-center mt-6">
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
