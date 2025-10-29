/**
 * @file ActionButton.jsx
 * @description Botón de acción reutilizable con icono opcional.
 */

import React from "react";

const ActionButton = ({
  text,
  iconSrc,
  onClick,
  variant = "primary",
  children,
}) => {
  // Define estilos basados en la variante (primario, secundario, etc.)
  const baseStyles =
    "flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors";
  const variantStyles = {
    primary: "bg-[#00C49A] text-white hover:bg-[#00A37E]",
    secondary: "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50",
    icon: "p-2 text-gray-600 hover:bg-gray-100 rounded-full", // Para botones que son solo un icono
  };

  const handleClick = () => {
    // Por ahora, la función onClick abrirá un modal o realizará una acción.
    // La lógica del modal se implementará más adelante.
    if (onClick) {
      onClick();
    }
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]}`}
      onClick={handleClick}
    >
      {iconSrc && (
        <img src={iconSrc} alt={`${text} icon`} className="h-5 w-5" />
      )}
      {text}
      {children}
    </button>
  );
};

export default ActionButton;
