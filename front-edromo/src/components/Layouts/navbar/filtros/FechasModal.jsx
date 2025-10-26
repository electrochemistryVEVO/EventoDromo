import React, { useState, useEffect, useRef } from 'react';

// Opciones hardcodeadas
const opcionesFechaRapida = ['Hoy', 'Mañana', 'Esta semana', 'Fin de semana', 'Este Mes', 'Próximo Mes'];

// Acepta buttonRef
const FechasModal = ({ onClose, onApply, onClear, buttonRef }) => {
  const [selectedFechaRapida, setSelectedFechaRapida] = useState(null);
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [position, setPosition] = useState({ top: -9999, left: -9999 }); // Estado de posición
  const popoverRef = useRef(null); // Ref para el popover

  // Calcula la posición
  useEffect(() => {
    if (buttonRef.current && popoverRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const popoverRect = popoverRef.current.getBoundingClientRect(); // Obtener el ancho del popover

      // Calcular la posición vertical
      const calculatedTop = buttonRect.bottom + window.scrollY + 5;

      // Calcular la posición horizontal con ajuste si se sale de la pantalla
      let calculatedLeft = buttonRect.left + window.scrollX;
      const viewportWidth = window.innerWidth;
      const rightEdgeOfPopover = calculatedLeft + popoverRect.width;

      // Si el popover se sale por la derecha, ajusta su posición
      if (rightEdgeOfPopover > viewportWidth - 10) { // Margen de 10px desde el borde derecho
        calculatedLeft = viewportWidth - popoverRect.width - 10;
        // Asegurarse de que no se salga por la izquierda al ajustar
        if (calculatedLeft < 10) { // Margen de 10px desde el borde izquierdo
          calculatedLeft = 10;
        }
      }
      
      setPosition({
        top: calculatedTop,
        left: calculatedLeft,
      });
    }
  }, [buttonRef]); // Depende solo de buttonRef

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
    let filtroAplicado = { tipo: 'fecha' };
    if (selectedFechaRapida) {
      filtroAplicado.valor = selectedFechaRapida;
    } else if (fechaInicio && fechaFin) {
      if (new Date(fechaInicio) > new Date(fechaFin)) {
         alert("La fecha de inicio no puede ser posterior a la fecha de fin."); // Idealmente, usar un mensaje no bloqueante
         return;
      }
      filtroAplicado.inicio = fechaInicio;
      filtroAplicado.fin = fechaFin;
    } else if (fechaInicio && !fechaFin) {
        filtroAplicado.inicio = fechaInicio;
        filtroAplicado.fin = null;
    } else if (!fechaInicio && fechaFin) {
        filtroAplicado.inicio = null;
        filtroAplicado.fin = fechaFin;
    }
    else {
      onClose();
      return;
    }
    onApply(filtroAplicado);
    onClose();
  };

  const handleClear = () => {
    onClear('fecha');
    onClose();
  };

  const handleDateInputChange = () => {
      setSelectedFechaRapida(null);
  }

  return (
    <div
      ref={popoverRef} // Asigna ref
      className="absolute bg-gray-100 p-6 rounded-lg shadow-xl w-full max-w-lg z-50 transition-opacity duration-100 opacity-100" // Posicionamiento y estilos, un poco más ancho
      style={{ top: `${position.top}px`, left: `${position.left}px` }} // Aplica posición
    >
      {/* Botones Rápidos */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {opcionesFechaRapida.map((opcion) => (
          <button
            key={opcion}
            onClick={() => {
                setSelectedFechaRapida(opcion);
                setFechaInicio('');
                setFechaFin('');
            }}
            className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
              selectedFechaRapida === opcion
              ? 'bg-white border-[#00C49A] text-[#00C49A] ring-1 ring-[#00C49A]'
              : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
            }`}
          >
            {opcion}
          </button>
        ))}
      </div>

      {/* Inputs Personalizados */}
      <h3 className="text-md font-semibold my-4 text-gray-800">Ingresa una fecha personalizada aquí</h3>
      <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 mb-6">
        <input
          type="date"
          value={fechaInicio}
          onChange={(e) => { setFechaInicio(e.target.value); handleDateInputChange(); }}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#00C49A] text-sm text-gray-500 appearance-none"
        />
         <span className="hidden sm:inline text-gray-500">-</span>
        <input
          type="date"
          value={fechaFin}
          onChange={(e) => { setFechaFin(e.target.value); handleDateInputChange(); }}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#00C49A] text-sm text-gray-500 appearance-none"
          min={fechaInicio || undefined}
        />
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
          disabled={!selectedFechaRapida && !fechaInicio && !fechaFin}
          className={`px-6 py-2 bg-[#00C49A] text-white rounded-full hover:bg-[#00b08a] transition-colors text-sm font-medium ${(!selectedFechaRapida && !fechaInicio && !fechaFin) ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          Aplicar
        </button>
      </div>
    </div>
  );
};

export default FechasModal;

