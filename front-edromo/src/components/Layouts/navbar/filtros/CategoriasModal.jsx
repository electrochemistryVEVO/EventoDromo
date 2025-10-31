import React, { useState, useEffect, useRef } from 'react';

const categoriasDisponibles = ['Fútbol', 'Concierto', 'Festival', 'Teatro', 'Deporte', 'Niños'];

const CategoriasModal = ({ onClose, onApply, onClear, buttonRef, initialFilters }) => {
  // Estado inicial desde initialFilters (maneja string con comas)
  const initialSelected = initialFilters?.categoria ? initialFilters.categoria.split(',') : [];
  const [selectedCategorias, setSelectedCategorias] = useState(initialSelected);

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

  // Lógica de Selección Múltiple
  const toggleCategoria = (categoria) => {
    setSelectedCategorias(prevSelected => {
      if (prevSelected.includes(categoria)) {
        return prevSelected.filter(c => c !== categoria);
      } else {
        return [...prevSelected, categoria];
      }
    });
  };

  // onApply envía array unido por comas o null si está vacío
  const handleApply = () => {
    const valorParaUrl = selectedCategorias.length > 0 ? selectedCategorias.join(',') : null;
    onApply({ tipo: 'categoria', valor: valorParaUrl });
    onClose();
  };

  // handleClear llama a onClear para este tipo de filtro
  const handleClear = () => {
    onClear('categoria');
    onClose();
  };

  return (
    <div
      ref={popoverRef}
      className="absolute bg-gray-100 p-6 rounded-lg shadow-xl w-full max-w-sm z-50 transition-opacity duration-100 opacity-100"
      style={{ top: `${position.top}px`, left: `${position.left}px` }}
    >
      {/* Botones de Categoría */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {categoriasDisponibles.map((cat) => {
          const isSelected = selectedCategorias.includes(cat);
          return (
            <button
              key={cat}
              onClick={() => toggleCategoria(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                isSelected
                ? 'bg-white border-[#00C49A] text-[#00C49A] ring-1 ring-[#00C49A]'
                : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
              }`}
            >
              {cat}
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
          onClick={handleApply} // Aplica el estado actual (incluyendo vacío)
          className={`px-6 py-2 bg-[#00C49A] text-white rounded-full hover:bg-[#00b08a] transition-colors text-sm font-medium`}
        >
          Aplicar
        </button>
      </div>
    </div>
  );
};

export default CategoriasModal;