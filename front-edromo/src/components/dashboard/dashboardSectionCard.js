import React from "react";

/**
 * Componente genérico para las secciones del dashboard.
 * Proporciona un contenedor con título, padding y estilos consistentes.
 * @param {{
 *   titulo: string,
 *   icono?: string,
 *   subtitulo?: string, // <-- CAMBIO: Nueva prop opcional para el subtítulo
 *   children: React.ReactNode
 * }} props
 */
const DashboardSectionCard = ({ titulo, icono, subtitulo, children }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md h-full">
      <div className="flex items-center mb-4">
        {icono && (
          <img
            src={icono}
            alt={`Icono para ${titulo}`}
            className="w-6 h-6 mr-3"
          />
        )}
        <div>
          <h2 className="text-xl font-semibold text-gray-800">{titulo}</h2>
          {subtitulo && (
            <p className="text-xs text-gray-400 mt-1">{subtitulo}</p>
          )}
        </div>
      </div>
      <div>{children}</div>
    </div>
  );
};

export default DashboardSectionCard;
