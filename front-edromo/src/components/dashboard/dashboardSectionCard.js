import React from "react";

/**
 * Componente genérico para las secciones del dashboard.
 * Proporciona un contenedor con título, padding y estilos consistentes.
 * @param {{
 *   titulo: string,
 *   icono?: string, // <-- CAMBIO: Nueva prop opcional para la URL del ícono
 *   children: React.ReactNode
 * }} props
 */
const DashboardSectionCard = ({ titulo, icono, children }) => {
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
        <h2 className="text-xl font-semibold text-gray-800">{titulo}</h2>
      </div>
      <div>{children}</div>
    </div>
  );
};

export default DashboardSectionCard;
