import React from "react";

/**
 * Muestra una fila con la información de ocupación de un local.
 * @param {{
 *   local: { nombre: string, diasOcupados: number, tasaOcupacion: number }
 * }} props
 */
const OcupacionLocalRow = ({ local }) => {
  return (
    <div className="grid grid-cols-3 gap-4 items-center py-2 text-sm text-gray-600">
      {/* Columna 1: Nombre del Local */}
      <div className="col-span-1">
        <span>{local.nombre}</span>
      </div>

      {/* Columna 2: Días Ocupados */}
      <div className="col-span-1 text-center">
        <span>{local.diasOcupados}</span>
      </div>

      {/* Columna 3: Tasa de Ocupación con Barra */}
      <div className="col-span-1 flex items-center">
        <span className="w-10 mr-2 text-right font-semibold">
          {local.tasaOcupacion.toFixed(1)}%
        </span>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-blue-600 h-2.5 rounded-full"
            style={{ width: `${local.tasaOcupacion}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default OcupacionLocalRow;
