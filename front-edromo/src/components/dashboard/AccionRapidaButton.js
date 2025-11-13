import React from "react";
import Link from "next/link";

/**
 * Botón para las acciones rápidas en el dashboard.
 * @param {{
 *   icono: React.ReactNode,
 *   texto: string,
 *   href?: string,
 *   onClick: () => void
 * }} props
 */
const AccionRapidaButton = ({ icono, texto, href, onClick }) => {
  // Contenido del botón, que es el mismo en ambos casos
  const buttonContent = (
    <>
      <div className="mb-2">
        <img src={icono} alt={`Icono para ${texto}`} className="w-8 h-8" />
      </div>
      <span className="text-lg font-semibold text-gray-700">{texto}</span>
    </>
  );

  // 3. Lógica condicional: si hay 'href', renderizamos un Link
  if (href) {
    return (
      <Link
        href={href}
        className="w-full bg-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors h-full"
      >
        {buttonContent}
      </Link>
    );
  }

  // Si no hay 'href', renderizamos un botón normal
  return (
    <button
      onClick={onClick}
      className="w-full bg-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors h-full"
    >
      {buttonContent}
    </button>
  );
};

export default AccionRapidaButton;
