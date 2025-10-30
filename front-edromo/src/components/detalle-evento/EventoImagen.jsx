import React from "react";
import LazyImage from "@/components/card-evento/lazyImage";
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
      <LazyImage imageUrl={imageUrl} className="event-image-container"/>
    </div>
  );
};

export default EventImage;
