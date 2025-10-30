/**
 * @file StatusBadge.jsx
 * @description Componente para mostrar una insignia de estado coloreada.
 */

import React from "react";

const StatusBadge = ({ status }) => {
  const getStatusStyles = () => {
    switch (status) {
      case "Creado":
        return "bg-green-100 text-green-800";
      case "Publicado":
        return "bg-blue-100 text-blue-800";
      case "En venta":
        return "bg-purple-100 text-purple-800";
      case "Concluido":
        return "bg-yellow-100 text-yellow-800";
      case "Cancelado":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <span
      className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusStyles()}`}
    >
      {status}
    </span>
  );
};

export default StatusBadge;
