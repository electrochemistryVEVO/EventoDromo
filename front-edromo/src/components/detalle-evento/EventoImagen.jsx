import React from "react";
import "@/css/detalle-Evento/EventoImagen.css";

/**
 * Muestra la imagen principal del evento, nítida y con bordes redondeados.
 * @param {object} props
 * @param {string} props.imageUrl - URL de la imagen.
 * @param {string} props.eventName - Nombre del evento para el texto alternativo.
 */
const EventImage = ({ imageUrl, eventName }) => {
  return (
    <div className="event-image-container">
      <img
        src={imageUrl}
        alt={`Imagen principal de ${eventName}`}
        className="event-image"
      />
    </div>
  );
};

export default EventImage;
