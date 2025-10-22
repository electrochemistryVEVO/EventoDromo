import React from "react";
import "@/css/detalle-Evento/EventoInfo.css";

/**
 * Muestra el nombre y la descripción del evento.
 * @param {object} props - Propiedades del componente.
 * @param {string} props.eventName - El nombre del evento.
 * @param {string} props.description - El texto de descripción del evento.
 *                                     Puede contener saltos de línea para separar párrafos.
 */
const EventInfo = ({ eventName, description }) => {
  // Para manejar múltiples párrafos, dividimos la descripción por dobles saltos de línea.
  // Esto convierte "Párrafo 1.\n\nPárrafo 2." en un array: ["Párrafo 1.", "Párrafo 2."]
  // Si no hay dobles saltos de línea, simplemente devolverá un array con un solo elemento.
  const paragraphs = description.split("\n\n");

  return (
    <section className="info-section-container">
      <h2 className="info-event-name">{eventName}</h2>
      <hr className="info-divider" />
      <div className="info-description-block">
        <h3 className="info-description-title">Descripción del evento</h3>
        {paragraphs.map((paragraph, index) => (
          <p key={index} className="info-description-paragraph">
            {paragraph}
          </p>
        ))}
      </div>
    </section>
  );
};

export default EventInfo;
