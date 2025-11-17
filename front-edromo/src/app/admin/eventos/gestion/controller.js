import { useState, useEffect, useCallback } from "react";
import { getEvents, getLocales } from "@/services/gestionEvento.services.js";

// --- NUEVO: Función helper para formatear fechas a YYYY-MM-DD ---
// Este formato es REQUERIDO por el <input type="date"> para su valor (value).
const formatDateToYyyyMmDd = (date) => {
  const year = date.getFullYear();
  // getMonth() es 0-indexado (0=enero), por eso sumamos 1.
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// --- NUEVO: Lógica para calcular las fechas por defecto ---
const today = new Date();
// El "día 0" del mes siguiente nos da el último día del mes actual.
const endDateDefault = new Date(today.getFullYear(), today.getMonth() + 1, 0);
const startDateDefault = new Date(endDateDefault);
// Restamos un año a la fecha de fin para obtener la fecha de inicio.
startDateDefault.setFullYear(startDateDefault.getFullYear() - 1);
// Definimos los estados hardcodeados como se solicitó.
const eventStatuses = [
  "Creado",
  "Publicado",
  "En venta",
  "Concluido",
  "Cancelado",
];

export const useEventManager = () => {
  // --- ESTADOS ---
  // Estado para la lista de eventos que se mostrará en la tabla.
  const [events, setEvents] = useState([]);
  // Estado para la lista de locales para el filtro desplegable.
  const [locales, setLocales] = useState([]);
  // Estado para la información de paginación.
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
  });
  // Estado para controlar si los datos se están cargando.
  const [isLoading, setIsLoading] = useState(false);
  // Estado para manejar cualquier error que ocurra durante la obtención de datos.
  const [error, setError] = useState(null);

  // Estado unificado para todos los filtros.
  const [filters, setFilters] = useState({
    search: "",
    local: 0, // Valor inicial de todos
    status: "Todos",
    startDate: formatDateToYyyyMmDd(startDateDefault),
    endDate: formatDateToYyyyMmDd(endDateDefault),
  });

  // --- FUNCIONES ---

  /**
   * Función para obtener los eventos del servicio.
   * Se usa useCallback para evitar que esta función se recree en cada renderizado,
   * a menos que sus dependencias (filters, pagination.currentPage) cambien.
   */
  const fetchEvents = useCallback(async (pageToFetch = null, customFilters = null) => {
    setIsLoading(true);
    setError(null);
    try {
      const currentPage = pageToFetch || pagination?.currentPage || 1;
      const filtersToUse = customFilters || filters;
      console.log("Enviando filtros al servicio:", {
        ...filtersToUse,
        page: currentPage,
      });
      const response = await getEvents({
        ...filtersToUse,
        page: currentPage,
      });
      console.log("Respuesta RECIBIDA del servicio:", response);
      // Accede a los datos y la paginación desde el objeto anidado "response.data"
      if (response && response.data) {
        
        setEvents(response.data.data); // Antes era response.data
        setPagination(response.data.pagination); // Antes era response.pagination
      } else {
        // Maneja el caso de una respuesta inesperada para evitar errores
        setEvents([]);
        console.error("La respuesta del API no tiene el formato esperado.");
      }
    } catch (err) {
      console.error("Error fetching events:", err);
      setError("No se pudieron cargar los eventos.");
    } finally {
      setIsLoading(false);
    }
  }, [filters, pagination?.currentPage]);

  /**
   * Efecto que se ejecuta cuando los filtros cambian
   */
  useEffect(() => {
    // Solo cargar eventos si los filtros han sido inicializados
    if (filters.startDate && filters.endDate) {
      fetchEvents(pagination.currentPage, filters);
    }
  }, [filters]);

  /**
   * Efecto que se ejecuta una sola vez al montar el componente para cargar los locales.
   */
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const localesData = await getLocales();
        setLocales([{ id: 0, nombre: "Todos" }, ...localesData]);
      } catch (err) {
        console.error("Error fetching locales:", err);
        setError("No se pudieron cargar los locales.");
      }
    };
    fetchInitialData();
  }, []); // El array vacío asegura que se ejecute solo una vez.

  /**
   * Efecto para cargar los eventos cuando la página actual o los filtros cambian.
   * Por ahora, lo llamaremos manualmente con el botón "aplicar filtros".
   * Este es un ejemplo de cómo podría auto-actualizarse:
   *
   * useEffect(() => {
   *   fetchEvents();
   * }, [fetchEvents]);
   */

  /**
   * Manejador para actualizar el estado de los filtros.
   * @param {string} filterName - El nombre del filtro a cambiar (e.g., 'search', 'local').
   * @param {string} value - El nuevo valor del filtro.
   */
  const handleFilterChange = (filterName, value) => {
    // Validación de fechas
    if (filterName === "startDate" && value > filters.endDate) {
      // Si la nueva fecha de inicio es posterior a la de fin, no se actualiza.
      // Opcionalmente, se podría mostrar un mensaje de error.
      console.error(
        "La fecha de inicio no puede ser posterior a la fecha de fin."
      );
      return;
    }
    if (filterName === "endDate" && value < filters.startDate) {
      // Si la nueva fecha de fin es anterior a la de inicio, no se actualiza.
      console.error(
        "La fecha de fin no puede ser anterior a la fecha de inicio."
      );
      return;
    }

    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterName]: filterName === "local" ? parseInt(value, 10) : value,
    }));
  };

  /**
   * Función para aplicar los filtros y buscar los eventos.
   * Resetea a la primera página y llama a fetchEvents.
   */
  const applyFilters = useCallback(() => {
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
    // Llamamos directamente a fetchEvents con página 1 y los filtros actuales
    fetchEvents(1, filters);
  }, [filters, fetchEvents]);

  /**
   * Manejador para cambiar de página.
   * @param {number} pageNumber - El número de página al que se quiere ir.
   */
  const handlePageChange = useCallback((pageNumber) => {
    setPagination((prev) => ({ ...prev, currentPage: pageNumber }));
    // Llamamos directamente con el número de página y los filtros actuales
    fetchEvents(pageNumber, filters);
  }, [filters, fetchEvents]);

  // --- VALORES DEVUELTOS ---
  // El hook devuelve los estados y funciones que el componente de la página necesitará.
  return {
    events,
    locales,
    eventStatuses,
    pagination,
    isLoading,
    error,
    filters,
    handleFilterChange,
    applyFilters,
    handlePageChange,
  };
};
