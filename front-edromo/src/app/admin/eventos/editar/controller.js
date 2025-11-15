/**
 * @file controller.js
 * @description Custom hook (controlador) para la lógica de la página de EDICIÓN de eventos.
 *              Maneja la carga inicial de datos, el estado del formulario y la actualización del evento.
 */

import { useState, useEffect, useMemo } from "react";
// Importamos los servicios de gestión, creación Y EDICIÓN
import {
  getLocales,
  getEventTypes,
  uploadImageAndGetUrl,
} from "@/services/gestionEvento.services.js";
import {
  getEventById,
  updateEvent,
} from "@/services/ModificarEvento.services.js";

// La estructura inicial es la misma que en la creación
const initialEventInfo = {
  nombre: "",
  descripcion: "",
  imagenFile: null,
  imagenPreview: "", // Usaremos esto para la previsualización de la imagen nueva o existente
  localId: "",
  capacidad: "",
  tipoEventoId: "",
  fechaPublicacion: "",
  fechaCompra: "",
};

/**
 * @hook useEventEditor
 * @param {string|number} eventId - El ID del evento que se va a editar.
 */
export const useEventEditor = (eventId) => {
  // --- ESTADOS DEL FORMULARIO (Iguales a useEventCreator) ---
  const [eventInfo, setEventInfo] = useState(initialEventInfo);
  const [fechas, setFechas] = useState([]);
  const [tiposEntrada, setTiposEntrada] = useState([]);
  const [descuentos, setDescuentos] = useState([]);

  // --- NUEVOS ESTADOS para rastrear eliminaciones ---
  /*
  const [deletedFechasIds, setDeletedFechasIds] = useState([]);
  const [deletedTiposEntradaIds, setDeletedTiposEntradaIds] = useState([]);
  const [deletedDescuentosIds, setDeletedDescuentosIds] = useState([]);
*/
  // Estado INTERNO para guardar la lista original de entradas del backend.
  // Es crucial para poder conservar los IDs correctos al actualizar.
  const [entradasOriginales, setEntradasOriginales] = useState([]);

  // --- ESTADOS PARA DATOS EXTERNOS Y UI (Iguales) ---
  const [locales, setLocales] = useState([]);
  const [eventTypes, setEventTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Inicia en true para la carga inicial
  const [error, setError] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [minDateTime, setMinDateTime] = useState(null);

  // --- EFECTOS (useEffect) ---

  // Efecto para la fecha mínima (igual que en la creación)
  useEffect(() => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    setMinDateTime(now.toISOString().slice(0, 16));
  }, []);

  // Efecto principal para CARGAR TODOS LOS DATOS INICIALES
  useEffect(() => {
    if (!eventId) {
      setError("No se ha proporcionado un ID de evento.");
      setIsLoading(false);
      return;
    }

    const fetchInitialData = async () => {
      try {
        // Obtenemos todo en paralelo: datos del evento, locales y tipos.
        const [eventData, localesData, eventTypesData] = await Promise.all([
          getEventById(eventId),
          getLocales(),
          getEventTypes(),
        ]);

        // --- POBLAR EL ESTADO CON LOS DATOS CARGADOS ---
        setEventInfo({
          nombre: eventData.nombre,
          descripcion: eventData.descripcion,
          imagenFile: null, // No hay un archivo nuevo al inicio
          imagenPreview: eventData.imagenURL, // Mostramos la imagen existente
          localId: eventData.localId,
          capacidad: eventData.capacidad,
          tipoEventoId: eventData.tipoEventoId,
          fechaPublicacion: eventData.fechaPublicacion,
          fechaCompra: eventData.fechaCompra,
        });
        console.log("DATOS CRUDOS DEL BACKEND (entradas):", eventData.entrada);
        console.log("DATOS CRUDOS DEL BACKEND:", eventData);
        console.log("DATOS CRUDOS DEL BACKEND (horarios):", eventData.horarios);
        // Poblamos las listas dinámicas. Asignamos el ID que viene del backend.
        setFechas(eventData.horarios);

        // 2. Guardar la lista COMPLETA de entradas originales para referencia futura
        setEntradasOriginales(eventData.entradas);

        // 3. DEDUCIR las "plantillas de entrada" a partir de los datos recibidos
        const plantillasMap = new Map();
        eventData.entradas.forEach((entrada) => {
          const nombrePlantilla = entrada.nombre.split(" - ")[0]; // Extrae "General" de "General - 28 Nov"
          if (!plantillasMap.has(nombrePlantilla)) {
            plantillasMap.set(nombrePlantilla, {
              id: `plantilla-${nombrePlantilla.replace(/\s+/g, "-")}`, // Usamos un ID real para la clave de React
              nombre: nombrePlantilla,
              precio: entrada.precio ?? "",
              cantidad: entrada.cantidad ?? "", // Mapeamos el nombre para que coincida con el formulario
              limiteCompra: entrada.limiteCompra ?? "",
              puntos: entrada.puntos ?? "",
            });
          }
        });
        const plantillasGeneradas = Array.from(plantillasMap.values());
        console.log(
          "PLANTILLAS GENERADAS PARA EL FORMULARIO:",
          plantillasGeneradas
        );
        setTiposEntrada(Array.from(plantillasMap.values()));

        setDescuentos(eventData.descuentos || []);
        setLocales(localesData);
        setEventTypes(eventTypesData);
      } catch (err) {
        console.error("Error fetching initial data for editor:", err);
        setError("No se pudieron cargar los datos del evento para editar.");
      } finally {
        setIsLoading(false); // Terminamos la carga inicial
      }
    };

    fetchInitialData();
  }, [eventId]); // Se ejecuta si el ID del evento cambia.

  // --- MANEJADORES DE EVENTOS (Casi idénticos a useEventCreator) ---

  // La lógica de handleInfoChange, handleImageChange, addFecha, etc., no necesita cambios.
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

  // Funciones que responden a las interacciones del usuario en la UI.
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEventInfo((prev) => {
        // Si ya existía una URL de preview creada con createObjectURL, la liberamos.
        if (prev.imagenPreview && prev.imagenPreview.startsWith("blob:")) {
          URL.revokeObjectURL(prev.imagenPreview);
        }
        return {
          ...prev,
          imagenFile: file,
          imagenPreview: URL.createObjectURL(file),
        };
      });
    }
  };

  const addFecha = () =>
    setFechas((prev) => [...prev, { id: Date.now(), fecha: "", hora: "" }]);
  const removeFecha = (id) =>
    setFechas((prev) => prev.filter((f) => f.id !== id));
  const handleFechaChange = (id, field, value) =>
    setFechas((prev) =>
      prev.map((f) => (f.id === id ? { ...f, [field]: value } : f))
    );
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
  const handleTipoEntradaChange = (id, field, value) =>
    setTiposEntrada((prev) =>
      prev.map((t) => (t.id === id ? { ...t, [field]: value } : t))
    );

  const removeTipoEntrada = (id) => {
    // VALIDACIÓN: No permitir borrar si el tipo de entrada está en uso por un descuento
    const estaEnUso = descuentos.some(
      (d) => parseInt(d.tipoEntradaId, 10) === id
    );
    if (estaEnUso) {
      alert(
        "No puede eliminar este tipo de entrada porque está siendo utilizado por al menos un descuento. Por favor, elimine o modifique el descuento primero."
      );
      return;
    }
    setTiposEntrada((prev) => prev.filter((t) => t.id !== id));
  };

  // --- NUEVOS MANEJADORES PARA DESCUENTOS ---
  const addDescuento = () =>
    setDescuentos((prev) => [
      ...prev,
      {
        id: Date.now(),
        nombre: "",
        codigo: "",
        tipo: "Porcentaje",
        valor: "",
        fechaInicio: "",
        fechaFin: "",
        usosMaximos: "",
        tipoEntradaId: "",
      },
    ]);

  const removeDescuento = (id) => {
    setDescuentos((prev) => prev.filter((d) => d.id !== id));
  };

  const handleDescuentoChange = (id, field, value) =>
    setDescuentos((prev) =>
      prev.map((d) => (d.id === id ? { ...d, [field]: value } : d))
    );

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
    if (!eventInfo.imagenPreview && !eventInfo.imagenFile) {
      validationErrors.push("una Imagen para el evento");
    }
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

    if (descuentos.length > 0) {
      if (
        descuentos.some(
          (d) =>
            !d.nombre.trim() ||
            !d.codigo.trim() ||
            !d.valor ||
            !d.fechaInicio ||
            !d.fechaFin ||
            !d.usosMaximos ||
            !d.tipoEntradaId
        )
      ) {
        validationErrors.push("completar todos los campos de los Descuentos");
      }
      if (descuentos.some((d) => d.fechaFin < d.fechaInicio)) {
        validationErrors.push(
          "la fecha de fin de un descuento no puede ser anterior a la de inicio"
        );
      }
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
    setError(null);

    try {
      // Lógica de imagen: si hay un archivo nuevo, lo subimos. Si no, usamos la URL existente.
      let imageUrl = eventInfo.imagenPreview; // Empezamos con la URL existente o la nueva preview
      if (eventInfo.imagenFile) {
        imageUrl = await uploadImageAndGetUrl(eventInfo.imagenFile);
      }
      // Generamos la lista final de entradas combinando horarios y plantillas.
      const entradasFinales = [];
      fechas.forEach((horario) => {
        tiposEntrada.forEach((plantilla) => {
          // --- ¡LÓGICA CORREGIDA PARA ENCONTRAR LA ENTRADA ORIGINAL! ---
          // Creamos una cadena de texto de la fecha del horario para buscarla en el nombre.
          const fechaBusqueda = new Date(horario.fecha)
            .toLocaleDateString("es-ES", {
              day: "numeric",

              month: "short",
            })
            .replace(".", ""); // Ej: "15 nov"

          // Buscamos la entrada original comparando el nombre de la plantilla Y la fecha en el nombre.
          const entradaOriginal = entradasOriginales.find(
            (e) =>
              e.nombre.startsWith(plantilla.nombre) &&
              e.nombre.toLowerCase().includes(fechaBusqueda.toLowerCase())
          );

          // El resto de la lógica para construir la entrada final es la misma.
          entradasFinales.push({
            idEntrada: entradaOriginal ? entradaOriginal.id : 0, // Usamos el 'id' de la entrada original
            nombre: `${plantilla.nombre} - ${fechaBusqueda}`,
            precio: parseFloat(plantilla.precio),
            cantidadEntradas: parseInt(plantilla.cantidad, 10),
            limiteCompra: parseInt(plantilla.limiteCompra, 10),
            puntos: parseInt(plantilla.puntos, 10),
            horario: {
              id:
                typeof horario.id === "string" || horario.id > 1_000_000
                  ? 0
                  : horario.id,
              fecha: horario.fecha,
              hora: horario.hora,
            },
          });
        });
      });
      // Ensamblamos el payload final
      const finalEventData = {
        idEvento: parseInt(eventId, 10),
        ...eventInfo,
        imagenURL: imageUrl,
        horarios: fechas.map((f) => ({
          id: typeof f.id === "string" || f.id > 1_000_000 ? 0 : f.id, // Nuevos horarios tienen ID 0
          fecha: f.fecha,
          hora: f.hora,
        })),
        entradas: entradasFinales,
        descuentos,
      };

      // Llamamos al servicio de ACTUALIZACIÓN
      await updateEvent(finalEventData);

      setIsSuccess(true);
    } catch (err) {
      setError(err.message || "Ocurrió un error al actualizar el evento.");
    } finally {
      setIsLoading(false);
    }
  };

  // --- RETORNO DEL HOOK ---
  return {
    eventInfo,
    fechas,
    tiposEntrada,
    locales,
    eventTypes,
    aforoRestante,
    isLoading, // Es importante para mostrar un spinner mientras se cargan los datos iniciales
    error,
    isSuccess,
    minDateTime,
    descuentos,
    addDescuento,
    removeDescuento,
    handleDescuentoChange,
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