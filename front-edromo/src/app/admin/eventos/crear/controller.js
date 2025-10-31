/**
 * @file useEventCreator.js
 * @description Custom hook (controlador) para gestionar toda la lógica y el estado de la página de creación de eventos.
 *               Este hook encapsula el manejo del formulario, las validaciones y la comunicación con los servicios.
 */

import { useState, useEffect, useMemo } from "react";
import {
  getLocales,
  getEventTypes,
  createEvent,
} from "@/services/gestionEvento.services.js";

// --- DEFINICIONES INICIALES ---

/**
 * @constant initialEventInfo
 * @description Define la estructura y los valores por defecto para la sección principal del formulario.
 *              Esto asegura que el estado siempre tenga una forma predecible.
 */
const initialEventInfo = {
  nombre: "",
  descripcion: "",
  imagenFile: null, // Almacena el objeto File del input para enviarlo al backend.
  imagenPreview: "", // Almacena una URL local (blob) para mostrar la previsualización de la imagen sin subirla.
  localId: "",
  capacidad: "",
  tipoEventoId: "",
  fechaPublicacion: "",
  fechaCompra: "",
};

/**
 * @hook useEventCreator
 * @description El hook principal que centraliza toda la funcionalidad de la página.
 */
export const useEventCreator = () => {
  // --- SECCIÓN DE ESTADOS (useState) ---
  // Estos hooks almacenan los datos del formulario y el estado de la UI.

  // Estado para la sección "Información del evento".
  const [eventInfo, setEventInfo] = useState(initialEventInfo);
  // Estado para la lista dinámica de "Fechas de evento". Es un array de objetos.
  const [fechas, setFechas] = useState([]);
  // Estado para la lista dinámica de "Tipos de entrada". Es un array de objetos.
  const [tiposEntrada, setTiposEntrada] = useState([]);

  // Estado para los datos de los menús desplegables.
  const [locales, setLocales] = useState([]);
  const [eventTypes, setEventTypes] = useState([]);

  // Estado para controlar la UI durante las operaciones asíncronas.
  const [isLoading, setIsLoading] = useState(false); // true cuando se está enviando el formulario.
  const [error, setError] = useState(null); // Almacena mensajes de error de validación o del backend.
  const [isSuccess, setIsSuccess] = useState(false); // true si el evento se creó exitosamente.
  const [minDateTime, setMinDateTime] = useState(null);

  // --- SECCIÓN DE EFECTOS (useEffect) ---
  // Se usa para ejecutar lógica secundaria, como la carga inicial de datos.
  useEffect(() => {
    // Este código solo se ejecuta en el navegador, después de que la hidratación ha terminado.
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    const formattedMinDateTime = now.toISOString().slice(0, 16);

    setMinDateTime(formattedMinDateTime);
  }, []); // El array vacío [] asegura que se ejecute solo una vez, al montar el componente.

  useEffect(() => {
    /**
     * @function fetchDropdownData
     * @description Carga los datos necesarios para los menús desplegables (Locales y Tipos de Evento)
     *              cuando el componente se monta por primera vez.
     */
    const fetchDropdownData = async () => {
      try {
        // Ejecuta ambas peticiones en paralelo para mejorar el tiempo de carga.
        const [localesData, eventTypesData] = await Promise.all([
          getLocales(),
          getEventTypes(),
        ]);
        setLocales(localesData);
        setEventTypes(eventTypesData);
      } catch (err) {
        console.error("Error fetching initial data:", err);
        setError(
          "No se pudieron cargar los datos necesarios para el formulario."
        );
      }
    };
    fetchDropdownData();
  }, []); // El array vacío `[]` asegura que este efecto se ejecute solo una vez.

  // --- SECCIÓN DE MANEJADORES DE EVENTOS (Handlers) ---
  // Funciones que responden a las interacciones del usuario en la UI.

  /**
   * @function handleInfoChange
   * @description Maneja los cambios en todos los inputs de la sección "Información del evento".
   */
  const handleInfoChange = (e) => {
    const { name, value } = e.target;

    // Lógica especial para cuando el usuario selecciona un Local.
    if (name === "localId") {
      const selectedLocal = locales.find(
        (local) => local.id === parseInt(value, 10)
      );
      // Autocompleta la capacidad y la guarda en el estado.
      setEventInfo((prev) => ({
        ...prev,
        localId: value,
        capacidad: selectedLocal?.capacidad ?? "",
      }));
      return;
    }

    // Lógica para la validación cruzada entre Fecha de Publicación y Fecha de Compra.
    setEventInfo((prev) => {
      const newState = { ...prev, [name]: value };
      if (
        name === "fechaPublicacion" &&
        newState.fechaCompra &&
        value > newState.fechaCompra
      ) {
        newState.fechaCompra = ""; // Resetea la fecha de compra si es inválida.
      }
      if (
        name === "fechaCompra" &&
        newState.fechaPublicacion &&
        value < newState.fechaPublicacion
      ) {
        newState.fechaPublicacion = ""; // Resetea la fecha de publicación si es inválida.
      }
      return newState;
    });
    if (name === "fechaCompra" && value) {
      setFechas((currentFechas) =>
        currentFechas.filter((f) => {
          if (!f.fecha || !f.hora) return true;
          return `${f.fecha}T${f.hora}` > value;
        })
      );
    }
  };

  /**
   * @function handleImageChange
   * @description Maneja la selección de un archivo de imagen.
   */
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEventInfo((prev) => ({
        ...prev,
        imagenFile: file,
        imagenPreview: URL.createObjectURL(file),
      }));
    }
  };

  // --- Lógica para "Fechas de evento" (Añadir, Quitar, Modificar) ---
  const addFecha = () =>
    setFechas((prev) => [...prev, { id: Date.now(), fecha: "", hora: "" }]);
  const removeFecha = (id) =>
    setFechas((prev) => prev.filter((f) => f.id !== id));
  const handleFechaChange = (id, field, value) =>
    setFechas((prev) =>
      prev.map((f) => (f.id === id ? { ...f, [field]: value } : f))
    );

  // --- Lógica para "Tipos de entrada" (Añadir, Quitar, Modificar) ---
  const addTipoEntrada = () =>
    setTiposEntrada((prev) => [
      ...prev,
      {
        id: Date.now(),
        nombre: "",
        precio: "",
        cantidad: "",
        limiteCompra: "",
        puntos: "",
      },
    ]);
  const removeTipoEntrada = (id) =>
    setTiposEntrada((prev) => prev.filter((t) => t.id !== id));
  const handleTipoEntradaChange = (id, field, value) =>
    setTiposEntrada((prev) =>
      prev.map((t) => (t.id === id ? { ...t, [field]: value } : t))
    );

  // --- SECCIÓN DE ESTADO DERIVADO (useMemo) ---
  // Calcula valores que dependen de otros estados de forma optimizada.

  /**
   * @constant aforoRestante
   * @description Calcula la capacidad restante del evento en tiempo real.
   *              `useMemo` asegura que este cálculo solo se rehaga si la capacidad o los tipos de entrada cambian.
   */
  const aforoRestante = useMemo(() => {
    const capacidadTotal = parseInt(eventInfo.capacidad, 10) || 0;
    const aforoAsignado = tiposEntrada.reduce(
      (sum, tipo) => sum + (parseInt(tipo.cantidad, 10) || 0),
      0
    );
    return capacidadTotal - aforoAsignado;
  }, [eventInfo.capacidad, tiposEntrada]);

  // --- SECCIÓN DE ACCIONES PRINCIPALES ---

  /**
   * @function handleSubmit
   * @description Orquesta la validación y el envío del formulario completo.
   */
  const handleSubmit = async () => {
    setError(null);
    setIsSuccess(false);

    // --- LÓGICA DE VALIDACIÓN ---
    const validationErrors = [];
    if (!eventInfo.nombre.trim()) validationErrors.push("Nombre del Evento");
    if (!eventInfo.descripcion.trim()) validationErrors.push("Descripción");
    if (!eventInfo.imagenFile) validationErrors.push("Imagen");
    if (!eventInfo.localId) validationErrors.push("Local");
    if (!eventInfo.tipoEventoId) validationErrors.push("Tipo evento");
    if (!eventInfo.fechaPublicacion)
      validationErrors.push("Fecha de Publicación");
    if (!eventInfo.fechaCompra) validationErrors.push("Fecha de Compra");

    if (fechas.length === 0) {
      validationErrors.push("al menos una Fecha de evento");
    } else {
      if (fechas.some((f) => !f.fecha || !f.hora))
        validationErrors.push("completar todas las Fechas y Horas");
      if (
        eventInfo.fechaCompra &&
        fechas.some((f) => `${f.fecha}T${f.hora}` <= eventInfo.fechaCompra)
      )
        validationErrors.push(
          "las Fechas de evento deben ser posteriores a la Fecha de Compra"
        );
      if (fechas.length > 1) {
        const uniqueDateTimes = new Set(
          fechas.map((f) => `${f.fecha}T${f.hora}`)
        );
        if (uniqueDateTimes.size < fechas.length)
          validationErrors.push("no puede haber Fechas de evento duplicadas");
      }
    }

    if (tiposEntrada.length === 0) {
      validationErrors.push("al menos un Tipo de entrada");
    } else if (
      tiposEntrada.some(
        (t) =>
          !t.nombre.trim() ||
          !t.precio ||
          !t.cantidad ||
          !t.limiteCompra ||
          !t.puntos
      )
    ) {
      validationErrors.push(
        "completar todos los campos de los Tipos de entrada"
      );
    }

    if (validationErrors.length > 0) {
      setError(
        `Por favor, corrija los siguientes errores: ${validationErrors.join(
          ", "
        )}.`
      );
      return; // Detiene la ejecución si hay errores.
    }

    setIsLoading(true);

    // Ensambla el objeto final para el backend.
    const finalEventData = { ...eventInfo, fechas, tiposEntrada };
    delete finalEventData.imagenPreview; // La preview no se envía.

    try {
      await createEvent(finalEventData);
      setIsSuccess(true);
    } catch (err) {
      setError(err.message || "Ocurrió un error desconocido.");
    } finally {
      setIsLoading(false);
    }
  };

  // --- SECCIÓN DE RETORNO DEL HOOK ---
  // Expone los estados y funciones que la UI necesitará para renderizarse y funcionar.
  return {
    eventInfo,
    fechas,
    tiposEntrada,
    locales,
    eventTypes,
    aforoRestante,
    isLoading,
    error,
    isSuccess,
    minDateTime,
    handleInfoChange,
    handleImageChange,
    addFecha,
    removeFecha,
    handleFechaChange,
    addTipoEntrada,
    removeTipoEntrada,
    handleTipoEntradaChange,
    handleSubmit,
  };
};
