import { useState, useEffect, useMemo } from "react";
import {
  getLocales,
  getEventTypes,
  createEvent,
  uploadImageAndGetUrl,
} from "@/services/gestionEvento.services.js";

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

export const useEventCreator = () => {
  const [eventInfo, setEventInfo] = useState(initialEventInfo);
  const [fechas, setFechas] = useState([]);
  const [tiposEntrada, setTiposEntrada] = useState([]);
  const [descuentos, setDescuentos] = useState([]);
  const [locales, setLocales] = useState([]);
  const [eventTypes, setEventTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [minDateTime, setMinDateTime] = useState(null);

  useEffect(() => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    setMinDateTime(now.toISOString().slice(0, 16));
  }, []);

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
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
  }, []);

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

  const removeTipoEntrada = (id) => {
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
    setDescuentos((prev) =>
      prev.filter((d) => parseInt(d.tipoEntradaId, 10) !== id)
    );
  };

  const handleTipoEntradaChange = (id, field, value) =>
    setTiposEntrada((prev) =>
      prev.map((t) => (t.id === id ? { ...t, [field]: value } : t))
    );

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
  const removeDescuento = (id) =>
    setDescuentos((prev) => prev.filter((d) => d.id !== id));
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

    // --- LÓGICA DE VALIDACIÓN ---
    const validationErrors = [];
    if (!eventInfo.nombre.trim()) validationErrors.push("Nombre del Evento");
    if (!eventInfo.descripcion.trim()) validationErrors.push("Descripción");
    if (!eventInfo.imagenFile) {
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
    // --- NUEVA VALIDACIÓN AÑADIDA para Descuentos ---
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

    try {
      // --- PASO A: "Subir" la imagen para obtener la URL ---
      // Llamamos a nuestra función simulada pasándole el archivo del estado.
      console.log("Paso 1: Convirtiendo imagen a URL...");
      const imageUrl = await uploadImageAndGetUrl(eventInfo.imagenFile);

      // --- PASO B: Ensamblar el payload final con la URL obtenida ---
      console.log("Paso 2: Creando el payload del evento...");
      const finalEventData = {
        ...eventInfo,
        fechas,
        tiposEntrada,
        descuentos, // <-- Incluimos los descuentos en el payload final
        imagenURL: imageUrl, // <-- ¡Aquí usamos la URL que nos devolvió la función!
      };

      // Limpiamos los campos que el backend no necesita
      delete finalEventData.imagenFile;
      delete finalEventData.imagenPreview;

      // --- PASO C: Llamar al servicio de creación de evento ---
      console.log("Paso 3: Enviando datos del evento al backend...");
      await createEvent(finalEventData);

      setIsSuccess(true);
    } catch (err) {
      // Captura errores tanto de la "subida" como de la creación
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
    addFecha,
    removeFecha,
    handleFechaChange,
    handleImageChange,
    addTipoEntrada,
    removeTipoEntrada,
    handleTipoEntradaChange,
    handleSubmit,
    descuentos,
    addDescuento,
    removeDescuento,
    handleDescuentoChange,
  };
};
