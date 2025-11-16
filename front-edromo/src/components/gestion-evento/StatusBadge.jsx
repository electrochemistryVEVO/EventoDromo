/**
 * @file StatusBadge.jsx
 * @description Componente para mostrar una insignia de estado coloreada.
 */

import React from "react";

const StatusBadge = ({ status }) => {
  // Normalizar el estado a minúsculas para las clases CSS
  const getStatusClass = () => {
    switch (status) {
      case "Creado":
        return "creado";
      case "Publicado":
        return "publicado";
      case "En venta":
        return "publicado"; // Mismo estilo que publicado
      case "Concluido":
        return "finalizado";
      case "Cancelado":
        return "cancelado";
      default:
        return "inactivo";
    }
  };

  return (
    <span className={`status-badge ${getStatusClass()}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
