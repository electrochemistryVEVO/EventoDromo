import React, { useState, useEffect, useRef } from 'react';

// --- FUNCIÓN AUXILIAR PARA CALCULAR RANGOS DE FECHA ---
// (Movida aquí desde service.js)
function calculateDateRange(relativeDateString) {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Establecer al inicio del día

    let startDate = new Date(today);
    let endDate = new Date(today);

    switch (relativeDateString) {
        case 'Hoy':
            endDate.setHours(23, 59, 59, 999);
            break;
        case 'Mañana':
            startDate.setDate(today.getDate() + 1);
            endDate.setDate(today.getDate() + 1);
            endDate.setHours(23, 59, 59, 999);
            break;
        case 'Esta semana':
            const dayOfWeek = today.getDay(); // Domingo = 0, Lunes = 1
            const diffStart = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
            startDate.setDate(diffStart);
            endDate.setDate(startDate.getDate() + 6);
            endDate.setHours(23, 59, 59, 999);
            break;
        case 'Fin de semana':
             const currentDay = today.getDay();
             let diffToSat = 6 - currentDay;
             if (currentDay === 0) diffToSat = -1; // Ajusta según necesites
             if (currentDay === 6) diffToSat = 0;

             startDate.setDate(today.getDate() + diffToSat); // Sábado
             endDate.setDate(startDate.getDate() + 1); // Domingo
             endDate.setHours(23, 59, 59, 999);
            break;
        case 'Este Mes':
            startDate.setDate(1);
            endDate.setMonth(today.getMonth() + 1);
            endDate.setDate(0);
            endDate.setHours(23, 59, 59, 999);
            break;
        case 'Próximo Mes':
            startDate.setMonth(today.getMonth() + 1);
            startDate.setDate(1);
            endDate = new Date(startDate);
            endDate.setMonth(startDate.getMonth() + 1);
            endDate.setDate(0);
            endDate.setHours(23, 59, 59, 999);
            break;
        default:
            return { inicio: null, fin: null };
    }
    // Devuelve las fechas como strings YYYY-MM-DD
    const inicioStr = startDate.toISOString().split('T')[0];
    const finStr = endDate.toISOString().split('T')[0];
    return { inicio: inicioStr, fin: finStr };
}
// --- FIN FUNCIÓN AUXILIAR ---


const opcionesFechaRapida = ['Hoy', 'Mañana', 'Esta semana', 'Fin de semana', 'Este Mes', 'Próximo Mes'];

const FechasModal = ({ onClose, onApply, onClear, buttonRef, initialFilters }) => {
  // Estado inicial desde initialFilters (ya no lee 'fecha')
  const [selectedFechaRapida, setSelectedFechaRapida] = useState(null); // Solo para estilo del botón
  const [fechaInicio, setFechaInicio] = useState(initialFilters?.fechaInicio || '');
  const [fechaFin, setFechaFin] = useState(initialFilters?.fechaFin || '');

  const [position, setPosition] = useState({ top: -9999, left: -9999 });
  const popoverRef = useRef(null);

  // Efecto para inicializar estado si hay filtro 'fecha' en URL (legado, podría quitarse)
  useEffect(() => {
      if(initialFilters?.fecha && !initialFilters.fechaInicio && !initialFilters.fechaFin) {
          const range = calculateDateRange(initialFilters.fecha);
          if (range.inicio && range.fin) {
              setFechaInicio(range.inicio);
              setFechaFin(range.fin);
              setSelectedFechaRapida(initialFilters.fecha); // Marcar botón
          }
      }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Solo al montar


  // Calcula posición (sin cambios)
  useEffect(() => {
    // ... (lógica de posicionamiento) ...
    const timer = setTimeout(() => {
        if (buttonRef.current && popoverRef.current) {
            // ... (cálculo de top/left igual que antes) ...
             const buttonRect = buttonRef.current.getBoundingClientRect();
             popoverRef.current.style.opacity = '0';
             popoverRef.current.style.display = 'block';
             const popoverRect = popoverRef.current.getBoundingClientRect();
             popoverRef.current.style.opacity = '1';
             const viewportWidth = window.innerWidth;
             const scrollX = window.scrollX;
             const scrollY = window.scrollY;
             const margin = 10;
             const calculatedTop = buttonRect.bottom + scrollY + 5;
             let calculatedLeft = buttonRect.left + scrollX;
             const rightEdgeIfAlignedLeft = calculatedLeft + popoverRect.width;
             if (rightEdgeIfAlignedLeft > viewportWidth - margin) {
                 calculatedLeft = buttonRect.right + scrollX - popoverRect.width;
                 if (calculatedLeft < margin) calculatedLeft = margin;
                 if (calculatedLeft + popoverRect.width > viewportWidth - margin) {
                      calculatedLeft = viewportWidth - popoverRect.width - margin;
                 }
             }
              if (calculatedLeft < margin) calculatedLeft = margin;
             setPosition({ top: calculatedTop, left: calculatedLeft });
        }
    }, 0);
    return () => clearTimeout(timer);
  }, [buttonRef]);

  // Detecta clics fuera (sin cambios)
  useEffect(() => {
    // ... (lógica handleClickOutside) ...
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

  // --- onApply AHORA SOLO ENVÍA INICIO/FIN ---
  const handleApply = () => {
    // Validar rango si ambas fechas están presentes
    if (fechaInicio && fechaFin && new Date(fechaInicio) > new Date(fechaFin)) {
        alert("La fecha de inicio no puede ser posterior a la fecha de fin.");
        return;
    }
    // Envía inicio y fin (serán null/vacío si no hay selección)
    onApply({ tipo: 'fecha', inicio: fechaInicio || null, fin: fechaFin || null });
    onClose();
  };

  // handleClear (sin cambios)
  const handleClear = () => {
    onClear('fecha');
    onClose();
  };

  // --- handleFechaRapidaClick AHORA CALCULA Y SETEA FECHAS ---
  const handleFechaRapidaClick = (opcion) => {
      // Si la opción clickeada ya estaba seleccionada, la deselecciona Y limpia fechas
      if (selectedFechaRapida === opcion) {
          setSelectedFechaRapida(null);
          setFechaInicio('');
          setFechaFin('');
      } else {
          // Si no, calcula el rango y setea los estados
          const range = calculateDateRange(opcion);
          if (range.inicio && range.fin) {
              setSelectedFechaRapida(opcion); // Marca el botón
              setFechaInicio(range.inicio);   // Setea fecha inicio
              setFechaFin(range.fin);       // Setea fecha fin
          } else { // Si calculateDateRange falla, limpia todo
              setSelectedFechaRapida(null);
              setFechaInicio('');
              setFechaFin('');
          }
      }
  };

  // Deselecciona botón rápido si se edita rango
  const handleDateInputChange = (e) => {
    setSelectedFechaRapida(null); // Desmarca cualquier botón rápido
    if (e.target.type === 'date' && e.target.name === 'fechaInicio') {
      setFechaInicio(e.target.value);
    } else if (e.target.type === 'date' && e.target.name === 'fechaFin') {
      setFechaFin(e.target.value);
    }
  }

  return (
    <div
      ref={popoverRef}
      className={`absolute bg-gray-100 p-6 rounded-lg shadow-xl w-full max-w-lg z-50 transition-opacity duration-100 ${position.top === -9999 ? 'opacity-0' : 'opacity-100'}`}
      style={{ top: `${position.top}px`, left: `${position.left}px`, visibility: position.top === -9999 ? 'hidden' : 'visible' }}
    >
      {/* Botones Rápidos con onClick actualizado */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {opcionesFechaRapida.map((opcion) => (
          <button
            key={opcion}
            onClick={() => handleFechaRapidaClick(opcion)} // Usa la nueva función
            className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
              selectedFechaRapida === opcion // El estilo depende de selectedFechaRapida
              ? 'bg-white border-[#00C49A] text-[#00C49A] ring-1 ring-[#00C49A]'
              : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
            }`}
          >
            {opcion}
          </button>
        ))}
      </div>

      {/* Inputs Personalizados, ahora usan handleDateInputChange */}
      <h3 className="text-md font-semibold my-4 text-gray-800">Ingresa una fecha personalizada aquí</h3>
      <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 mb-6">
        <input
          type="date"
          name="fechaInicio" // Añadido name
          value={fechaInicio} // Controlado por estado
          onChange={handleDateInputChange} // Llama a la nueva función
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#00C49A] text-sm text-gray-500 appearance-none"
        />
         <span className="hidden sm:inline text-gray-500">-</span>
        <input
          type="date"
          name="fechaFin" // Añadido name
          value={fechaFin} // Controlado por estado
          onChange={handleDateInputChange} // Llama a la nueva función
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#00C49A] text-sm text-gray-500 appearance-none"
          min={fechaInicio || undefined}
        />
      </div>

      {/* Botones de Acción (sin cambios) */}
      <div className="flex justify-between items-center mt-6">
        <button
          onClick={handleClear}
          className="text-red-600 hover:text-red-800 text-sm font-medium transition-colors"
        >
          Eliminar Filtro
        </button>
        <button
          onClick={handleApply}
          className={`px-6 py-2 bg-[#00C49A] text-white rounded-full hover:bg-[#00b08a] transition-colors text-sm font-medium`}
        >
          Aplicar
        </button>
      </div>
    </div>
  );
};

export default FechasModal;

