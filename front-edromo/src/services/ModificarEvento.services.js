/**
 * @file eventEditionService.js
 * @description Servicios para obtener y actualizar los datos de un evento existente.
 */

const BASE_API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const getAuthToken = () => {
  try {
    // 1. Lee la clave "user" de localStorage (donde UserContext la guarda)
    const userJSON = localStorage.getItem("user");

    if (!userJSON) {
      return null;
    }

    // 2. Parsea el objeto y devuelve la propiedad "token"
    const userData = JSON.parse(userJSON);
    return userData?.token || null;
  } catch (error) {
    console.error("Error al leer token de localStorage:", error);
    return null;
  }
};

/**
 * Actualiza un evento existente enviando todos sus datos, incluyendo horarios, entradas y descuentos.
 * El backend identifica si un sub-elemento es nuevo si su 'id' es 0.
 *
 * @param {object} eventData - El objeto completo con los datos del evento a actualizar.
 * @returns {Promise<object>} La respuesta del servidor tras la actualización.
 * @throws {Error} Si los datos son inválidos, falta el token o la API devuelve un error.
 */
export const updateEvent = async (eventData) => {
  // --- 1. Validación de Entradas ---
  if (!eventData) {
    throw new Error("Se requieren los datos del evento para la actualización.");
  }
  if (
    !eventData.idEvento ||
    typeof eventData.idEvento !== "number" ||
    eventData.idEvento <= 0
  ) {
    throw new Error(
      "El objeto eventData debe contener un 'idEvento' numérico y válido."
    );
  }

  const token = getAuthToken();
  if (!token) {
    throw new Error("Token de autenticación no encontrado.");
  }

  // --- 2. Transformación de Datos (Frontend -> Backend) ---
  try {
    const resolveId = (id) => {
      if (!id) return 0;
      return id > 2000000000 ? 0 : id;
    };

    // Mapa de horarios para vincularlos a las entradas (preservando tu lógica anterior)
    const horariosMap = new Map();
    (eventData.fechas || []).forEach((h) => horariosMap.set(h.id, h));

    const payload = {
      // --- Campos Principales ---
      idEvento: eventData.idEvento,
      nombre: eventData.nombre,
      descripcion: eventData.descripcion,
      imagenURL: eventData.imagenURL,
      localId: parseInt(eventData.localId, 10),
      tipoEventoId: parseInt(eventData.tipoEventoId, 10),
      capacidad: parseInt(eventData.capacidad, 10),
      fechaPublicacion: eventData.fechaPublicacion,
      fechaCompra: eventData.fechaCompra,

      // --- Mapeo de Horarios ---
      horarios: (eventData.fechas || []).map((h) => ({
        id: resolveId(h.id),
        fecha: h.fecha,
        hora: h.hora,
      })),

      // --- Mapeo de Entradas ---
      entradas: (eventData.tiposEntrada || []).map((t) => {
        // Lógica existente: vincular con objeto horario completo
        const horarioAsociado = horariosMap.get(t.horarioId);

        return {
          idEntrada: resolveId(t.id),
          nombre: t.nombre,
          precio: parseFloat(t.precio),
          cantidadEntradas: parseInt(t.cantidad, 10),
          limiteCompra: parseInt(t.limiteCompra, 10),
          puntos: parseInt(t.puntos, 10),
          horario: horarioAsociado
            ? {
                id: resolveId(horarioAsociado.id),
                fecha: horarioAsociado.fecha,
                hora: horarioAsociado.hora,
              }
            : null,
        };
      }),

      // --- Mapeo de Descuentos (NUEVO) ---
      descuentos: (eventData.descuentos || []).map((d) => ({
        id: resolveId(d.id), // 0 si es nuevo, ID real si existe
        nombre: d.nombre,
        codigo: d.codigo,
        tipo: d.tipo, // "Porcentaje" o "Fijo"
        valor: parseFloat(d.valor),
        fechaInicio: d.fechaInicio,
        fechaFin: d.fechaFin,
        usosMaximos: parseInt(d.usosMaximos, 10),
        tipoEntradaId: parseInt(d.tipoEntradaId, 10),
      })),
    };

    console.log("Payload updateEvent:", JSON.stringify(payload, null, 2));

    // --- 3. Petición a la API ---
    const response = await fetch(`${BASE_API_URL}/Evento/ActualizarEvento`, {
      method: "POST", // O 'PUT' dependiendo de tu backend, pero veo que usabas POST
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    // --- 4. Manejo de la Respuesta ---
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        message: `Error del servidor: ${response.status} ${response.statusText}`,
      }));
      throw new Error(
        errorData.message || "Ocurrió un error al actualizar el evento."
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error crítico en el servicio updateEvent:", error);
    throw error;
  }
};

/**
 * Realiza una llamada a la API para obtener los detalles completos de un evento por su ID.
 * @param {string|number} eventId - El ID del evento.
 * @returns {Promise<object>} Los datos completos del evento, incluyendo descuentos.
 */

export const getEventById = async (eventId) => {
  const token = getAuthToken();
  if (!token) throw new Error("Token de autenticación no encontrado.");

  const response = await fetch(
    `${BASE_API_URL}/Evento/EventoObtenerDatos?id=${eventId}`,
    {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({ message: `Error del servidor: ${response.status}` }));
    throw new Error(
      errorData.message || "Error al obtener los detalles del evento."
    );
  }

  const apiResponse = await response.json();
  if (apiResponse && apiResponse.success && apiResponse.data) {
    if (!apiResponse.data.descuentos) {
      apiResponse.data.descuentos = [];
    }
    return apiResponse.data || {};
  } else {
    throw new Error(
      apiResponse.message || "La respuesta del API no fue exitosa."
    );
  }
};
