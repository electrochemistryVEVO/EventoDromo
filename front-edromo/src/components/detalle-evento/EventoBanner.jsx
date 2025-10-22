import React from "react";
import "@/css/detalle-Evento/EventoBanner.css";

/**
 * Componente que muestra el banner principal del evento.
 * La imagen ya contiene el título y los nombres de los artistas.
 * @param {object} props - Propiedades del componente.
 * @param {string} props.imageUrl - La URL de la imagen del banner.
 * @param {string} props.eventName - El nombre del evento para el texto alternativo.
 */
const EventBanner = ({ imageUrl, eventName }) => {
  return (
    <section className="banner-container">
      <img
        src={imageUrl}
        alt={`Banner del evento ${eventName}`}
        className="banner-image"
      />
    </section>
  );
};

export default EventBanner;
