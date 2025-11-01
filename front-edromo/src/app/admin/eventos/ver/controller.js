/**
 * @file useEventViewer.js
 * @description Custom hook (controlador) para la lógica de la página de VISUALIZACIÓN de eventos.
 *              Su única función es cargar todos los datos de un evento para mostrarlos.
 */

import { useState, useEffect } from "react";
// Reutilizamos los servicios que ya existen
import {
  getLocales,
  getEventTypes,
} from "@/services/gestionEvento.services.js";
import { getEventById } from "@/services/ModificarEvento.services.js";

// La estructura inicial es la misma, para mantener la consistencia
const initialEventInfo = {
  nombre: "",
  descripcion: "",
  imagenPreview: "",
  localId: "",
  capacidad: "",
  tipoEventoId: "",
  fechaPublicacion: "",
  fechaCompra: "",
};

/**
 * @hook useEventViewer
 * @param {string|number} eventId - El ID del evento que se va a visualizar.
 */
export const useEventViewer = (eventId) => {
  // --- ESTADOS PARA ALMACENAR DATOS ---
  const [eventInfo, setEventInfo] = useState(initialEventInfo);
  const [fechas, setFechas] = useState([]);
  const [tiposEntrada, setTiposEntrada] = useState([]);
  const [locales, setLocales] = useState([]);
  const [eventTypes, setEventTypes] = useState([]);

  // --- ESTADOS DE UI (Solo para la carga inicial) ---
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- EFECTO PARA CARGAR TODOS LOS DATOS ---
  useEffect(() => {
    // Si no hay eventId, no hacemos nada.
    if (!eventId) {
      setError("No se ha proporcionado un ID de evento.");
      setIsLoading(false);
      return;
    }

    const fetchAllData = async () => {
      try {
        // Obtenemos todo en paralelo para máxima eficiencia
        const [eventData, localesData, eventTypesData] = await Promise.all([
          getEventById(eventId),
          getLocales(),
          getEventTypes(),
        ]);

        // --- POBLAMOS EL ESTADO CON LOS DATOS CARGADOS ---
        setEventInfo({
          nombre: eventData.nombre,
          descripcion: eventData.descripcion,
          imagenPreview: eventData.imagenURL, // Usamos la URL de la imagen existente
          localId: eventData.localId,
          capacidad: eventData.capacidad,
          tipoEventoId: eventData.tipoEventoId,
          fechaPublicacion: eventData.fechaPublicacion,
          fechaCompra: eventData.fechaCompra,
        });

        setFechas(eventData.horarios);
        setTiposEntrada(eventData.entradas);
        setLocales(localesData);
        setEventTypes(eventTypesData);
      } catch (err) {
        console.error("Error fetching data for viewer:", err);
        setError("No se pudieron cargar los datos del evento.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, [eventId]); // Se ejecuta solo si el eventId cambia.

  // --- RETORNO DEL HOOK ---
  // Devolvemos solo los estados que la UI necesita para mostrar la información.
  return {
    eventInfo,
    fechas,
    tiposEntrada,
    locales,
    eventTypes,
    isLoading,
    error,
  };
};
