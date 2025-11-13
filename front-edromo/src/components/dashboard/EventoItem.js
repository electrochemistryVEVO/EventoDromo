import React from "react";

/**
 * Muestra una fila con la información de un evento en la lista de más vendidos.
 * @param {{
 *   evento: { nombre: string, ubicacion: string, precio: number, entradasVendidas: number }
 * }} props
 */
const EventoItem = ({ evento }) => {
  // Formateador de moneda para Soles (PEN)
  const formatoMoneda = new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
  });

  return (
    <div className="flex justify-between items-center py-3 border-b border-gray-200 last:border-b-0">
      <div>
        <p className="font-semibold text-gray-800">{evento.nombre}</p>
        <p className="text-sm text-gray-500">{evento.ubicacion}</p>
      </div>
      <div className="text-right">
        <p className="font-semibold text-gray-800">
          {formatoMoneda.format(evento.precio)}
        </p>
        <p className="text-sm text-gray-500">
          {evento.entradasVendidas} entradas
        </p>
      </div>
    </div>
  );
};

export default EventoItem;
