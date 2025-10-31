/**
 * @file EventDatesForm.jsx
 * @description Componente para añadir dinámicamente las fechas del evento.
 */
import React from "react";

// Sub-componente para una sola fila de fecha/hora
const DateField = ({
  fechaData,
  index,
  onRemove,
  onChange,
  fechaCompra,
  isReadOnly = false,
}) => {
  // Extraemos solo la parte de la fecha (YYYY-MM-DD) de la fecha de compra para usarla en el 'min'.
  const minDate = fechaCompra ? fechaCompra.substring(0, 10) : "";
  let minTime = ""; // Por defecto, no hay hora mínima.

  // Solo calculamos una hora mínima si...
  // 1. Hay una fecha de compra definida.
  // 2. La fecha del evento (fechaData.fecha) es igual a la fecha de compra (minDate).
  if (fechaCompra && fechaData.fecha === minDate) {
    const fechaCompraObj = new Date(fechaCompra);
    // Añadimos 1 minuto a la hora de compra.
    fechaCompraObj.setMinutes(fechaCompraObj.getMinutes() + 1);

    // Formateamos la nueva hora a "HH:mm" para el input.
    const hours = String(fechaCompraObj.getHours()).padStart(2, "0");
    const minutes = String(fechaCompraObj.getMinutes()).padStart(2, "0");
    minTime = `${hours}:${minutes}`;
  }
  return (
    <div className="p-4 border rounded-lg bg-white relative flex items-center gap-4">
      <span className="font-semibold text-gray-600">Fecha {index + 1}</span>
      <div className="flex-1">
        <label className="text-xs text-gray-500">FECHA</label>
        <input
          type="date"
          value={fechaData.fecha}
          readOnly={isReadOnly}
          onChange={(e) => onChange(fechaData.id, "fecha", e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
          min={minDate} // Aquí aplicamos la restricción en la UI
        />
      </div>
      <div className="flex-1">
        <label className="text-xs text-gray-500">HORA</label>
        <input
          type="time"
          value={fechaData.hora}
          readOnly={isReadOnly}
          onChange={(e) => onChange(fechaData.id, "hora", e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
          min={minTime}
        />
      </div>
      <button
        onClick={() => onRemove(fechaData.id)}
        className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
      >
        &times;
      </button>
    </div>
  );
};

export const EventDatesForm = ({
  fechas,
  addFecha,
  removeFecha,
  handleFechaChange,
  fechaCompra,
  isReadOnly = false,
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mt-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Fechas de evento</h2>
          <p className="text-sm text-gray-500">
            Configura una o más fechas para el evento
          </p>
        </div>
        <button
          onClick={addFecha}
          disabled={!fechaCompra || isReadOnly}
          className="bg-[#00C49A] text-white font-semibold px-4 py-2 rounded-lg hover:bg-[#00A37E] flex items-center gap-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
          title={
            !fechaCompra
              ? "Primero debe seleccionar una Fecha de Compra"
              : "Añadir nueva fecha"
          }
        >
          + Ingresar Fecha
        </button>
      </div>

      <div className="space-y-4">
        {fechas.map((fecha, index) => (
          <DateField
            key={fecha.id}
            fechaData={fecha}
            index={index}
            onRemove={removeFecha}
            onChange={handleFechaChange}
            fechaCompra={fechaCompra}
            isReadOnly={isReadOnly}
          />
        ))}
      </div>
    </div>
  );
};
