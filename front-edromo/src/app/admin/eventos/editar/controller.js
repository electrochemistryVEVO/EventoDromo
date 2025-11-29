/**
 * @file controller.js
 * @description Custom hook (controlador) para la lógica de la página de EDICIÓN de eventos.
 *              Maneja la carga inicial de datos, el estado del formulario y la actualización del evento.
 */

import { useState, useEffect, useMemo } from "react";
import { showError } from "@/components/Notifications/toast";
import {
  getLocales,
  getEventTypes,
  uploadImageAndGetUrl,
} from "@/services/gestionEvento.services.js";
import {
  getEventById,
  updateEvent,
} from "@/services/ModificarEvento.services.js";

const initialEventInfo = {
  nombre: "",
  descripcion: "",
  imagenFile: null,
  imagenPreview: "",
  localId: "",
  capacidad: "",
  tipoEventoId: "",
  fechaPublicacion: "",
  fechaCompra: "",
};

export const useEventEditor = (eventId) => {
  const [eventInfo, setEventInfo] = useState(initialEventInfo);
  const [fechas, setFechas] = useState([]);
  const [tiposEntrada, setTiposEntrada] = useState([]);
  const [descuentos, setDescuentos] = useState([]);
  const [entradasOriginales, setEntradasOriginales] = useState([]);
  const [locales, setLocales] = useState([]);
  const [eventTypes, setEventTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [minDateTime, setMinDateTime] = useState(null);

  // Efecto para la fecha mínima
  useEffect(() => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    setMinDateTime(now.toISOString().slice(0, 16));
  }, []);

  // Efecto principal para cargar datos iniciales
  useEffect(() => {
    if (!eventId) {
      setError("No se ha proporcionado un ID de evento.");
      setIsLoading(false);
      return;
    }

    const fetchInitialData = async () => {
      try {
        const [eventData, localesData, eventTypesData] = await Promise.all([
          getEventById(eventId),
          getLocales(),
          getEventTypes(),
        ]);

        setEventInfo({
          nombre: eventData.nombre,
          descripcion: eventData.descripcion,
          imagenFile: null,
          imagenPreview: eventData.imagenURL,
          localId: eventData.localId,
          capacidad: eventData.capacidad,
          tipoEventoId: eventData.tipoEventoId,
          fechaPublicacion: eventData.fechaPublicacion,
          fechaCompra: eventData.fechaCompra,
        });

        // Guardamos los horarios tal cual vienen del backend
        setFechas(eventData.horarios);

        // Guardamos las entradas originales con sus IDs reales
        setEntradasOriginales(eventData.entradas);

        // Extraemos los tipos de entrada únicos (sin duplicar por horario)
        const tiposMap = new Map();
        eventData.entradas.forEach((entrada) => {
          if (!tiposMap.has(entrada.id)) {
            tiposMap.set(entrada.id, {
              id: entrada.id, // ID REAL de la entrada (clave principal)
              nombre: entrada.nombre,
              precio: entrada.precio,
              cantidad: entrada.cantidad,
              limiteCompra: entrada.limiteCompra,
              puntos: entrada.puntos,
              horarioId: entrada.horarioId, // Guardamos el horarioId original
            });
          }
        });

        setTiposEntrada(Array.from(tiposMap.values()));
        setDescuentos(eventData.descuentos || []);
        setLocales(localesData);
        setEventTypes(eventTypesData);
      } catch (err) {
        console.error("Error fetching initial data for editor:", err);
        setError("No se pudieron cargar los datos del evento para editar.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, [eventId]);

  const handleInfoChange = (e) => {
    const { name, value } = e.target;

    if (name === "localId") {
      const selectedLocal = locales.find(
        (local) => local.id === parseInt(value, 10)
      );
      setEventInfo((prev) => ({
        ...prev,
        localId: value,
        capacidad: selectedLocal?.capacidad ?? "",
      }));
      return;
    }

    setEventInfo((prev) => {
      const newState = { ...prev, [name]: value };
      if (
        name === "fechaPublicacion" &&
        newState.fechaCompra &&
        value > newState.fechaCompra
      ) {
        newState.fechaCompra = "";
      }
      if (
        name === "fechaCompra" &&
        newState.fechaPublicacion &&
        value < newState.fechaPublicacion
      ) {
        newState.fechaPublicacion = "";
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEventInfo((prev) => {
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
        horarioId: null,
      },
    ]);

  const handleTipoEntradaChange = (id, field, value) =>
    setTiposEntrada((prev) =>
      prev.map((t) => (t.id === id ? { ...t, [field]: value } : t))
    );

  const removeTipoEntrada = (id) => {
    // VALIDACIÓN: Verificar si este tipo de entrada está siendo usado por un descuento
    const descuentoAsociado = descuentos.find(
      (d) => parseInt(d.tipoEntradaId, 10) === id
    );

    if (descuentoAsociado) {
      showError(
        `No puede eliminar este tipo de entrada porque está asociado al descuento "${descuentoAsociado.nombre}". Por favor, elimine o modifique el descuento primero.`,
        { duration: 7000 }
      );
      return;
    }

    setTiposEntrada((prev) => prev.filter((t) => t.id !== id));
  };

  const addDescuento = () =>
    setDescuentos((prev) => [
      ...prev,
      {
        id: Date.now(),
        nombre: "",
        codigo: "",
        tipo: "PORCENTAJE",
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

  const aforoRestante = useMemo(() => {
    const capacidadTotal = parseInt(eventInfo.capacidad, 10) || 0;
    const aforoAsignado = tiposEntrada.reduce(
      (sum, tipo) => sum + (parseInt(tipo.cantidad, 10) || 0),
      0
    );
    return capacidadTotal - aforoAsignado;
  }, [eventInfo.capacidad, tiposEntrada]);

  const handleSubmit = async () => {
    setError(null);
    setIsSuccess(false);

    // --- VALIDACIÓN ---
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
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      let imageUrl = eventInfo.imagenPreview;
      if (eventInfo.imagenFile) {
        imageUrl = await uploadImageAndGetUrl(eventInfo.imagenFile);
      }

      // Mapear entradas: si tienen ID real (de BD), mantenerlas; si son nuevas (Date.now()), enviar ID 0
      const entradasFinales = tiposEntrada.map((tipo) => {
        const isNew = typeof tipo.id === "number" && tipo.id > 1_000_000_000;
        return {
          idEntrada: isNew ? 0 : tipo.id,
          nombre: tipo.nombre,
          precio: parseFloat(tipo.precio),
          cantidadEntradas: parseInt(tipo.cantidad, 10),
          limiteCompra: parseInt(tipo.limiteCompra, 10),
          puntos: parseInt(tipo.puntos, 10),
          horario: {
            id: tipo.horarioId > 1_000_000 ? 0 : tipo.horarioId,
            fecha: "",
            hora: "",
          },
        };
      });

      const finalEventData = {
        idEvento: parseInt(eventId, 10),
        nombre: eventInfo.nombre,
        descripcion: eventInfo.descripcion,
        imagenURL: imageUrl,
        localId: parseInt(eventInfo.localId, 10),
        tipoEventoId: parseInt(eventInfo.tipoEventoId, 10),
        capacidad: parseInt(eventInfo.capacidad, 10),
        fechaPublicacion: eventInfo.fechaPublicacion,
        fechaCompra: eventInfo.fechaCompra,
        horarios: fechas.map((f) => ({
          id: typeof f.id === "string" || f.id > 1_000_000 ? 0 : f.id,
          fecha: f.fecha,
          hora: f.hora,
        })),
        entradas: entradasFinales,
        descuentos: descuentos.map((d) => ({
          id: typeof d.id === "string" || d.id > 1_000_000 ? 0 : d.id,
          nombre: d.nombre,
          codigo: d.codigo,
          tipo: d.tipo,
          valor: parseFloat(d.valor),
          fechaInicio: d.fechaInicio,
          fechaFin: d.fechaFin,
          usosMaximos: parseInt(d.usosMaximos, 10),
          tipoEntradaId: d.tipoEntradaId ? parseInt(d.tipoEntradaId, 10) : null,
        })),
      };

      console.log(
        "Payload final para actualización:",
        JSON.stringify(finalEventData, null, 2)
      );

      await updateEvent(finalEventData);
      setIsSuccess(true);
    } catch (err) {
      setError(err.message || "Ocurrió un error al actualizar el evento.");
    } finally {
      setIsLoading(false);
    }
  };

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
