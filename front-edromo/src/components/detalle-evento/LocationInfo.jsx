import React from "react";
import "@/css/detalle-Evento/LocationInfo.css";

/**
 * Muestra la información de la ubicación del evento y el mapa de Google.
 * @param {object} props - Propiedades del componente.
 * @param {string} props.city - La ciudad y país del evento (ej: "Lima, PE").
 * @param {string} props.venue - El nombre del lugar (ej: "Teatro Municipal de Lima").
 * @param {string} props.address - La dirección completa del lugar.
 * @param {string} props.googleMapsEmbed - El código HTML del iframe de Google Maps.
 */
const LocationInfo = ({ city, venue, address, googleMapsEmbed }) => {
  // React normalmente no renderiza HTML desde strings para prevenir ataques (XSS).
  // 'dangerouslySetInnerHTML' es la forma oficial de hacerlo cuando confías en la
  // fuente del HTML (en este caso, nuestro propio JSON).
  // Lo usamos para que el <iframe> del mapa se inserte correctamente en la página.
  const mapHtml = { __html: googleMapsEmbed };

  return (
    <div className="location-panel">
      <div className="location-text-info">
        <p className="location-city">{city}</p>
        <h3 className="location-venue">{venue}</h3>
        {/* En una app real, podrías hacer que esta dirección sea un enlace a Google Maps */}
        <p className="location-address">{address}</p>
      </div>
      <div
        className="location-map-container"
        dangerouslySetInnerHTML={mapHtml}
      />
    </div>
  );
};

export default LocationInfo;
