/**
 * @file ModificarEvento.services.js
 * @description Servicios para obtener y actualizar los datos de un evento existente.
 */

const BASE_API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const getAuthToken = () => {
  try {
    const userJSON = localStorage.getItem("user");
    if (!userJSON) {
      return null;
    }
    const userData = JSON.parse(userJSON);
    return userData?.token || null;
  } catch (error) {
    console.error("Error al leer token de localStorage:", error);
    return null;
  }
};

/**
 * Actualiza un evento existente enviando todos sus datos.
 * El backend identifica si una entrada es nueva si su 'idEntrada' es 0.
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

  try {
    // Construir el payload tal cual lo envía el controller
    const payload = {
      idEvento: eventData.idEvento,
      nombre: eventData.nombre,
      descripcion: eventData.descripcion,
      imagenURL: eventData.imagenURL,
      localId: parseInt(eventData.localId, 10),
      tipoEventoId: parseInt(eventData.tipoEventoId, 10),
      capacidad: parseInt(eventData.capacidad, 10),
      fechaPublicacion: eventData.fechaPublicacion,
      fechaCompra: eventData.fechaCompra,
      horarios: eventData.horarios.map((h) => ({
        id: h.id,
        fecha: h.fecha,
        hora: h.hora,
      })),
      entradas: eventData.entradas.map((e) => ({
        idEntrada: e.idEntrada,
        nombre: e.nombre,
        precio: e.precio,
        cantidadEntradas: e.cantidadEntradas,
        limiteCompra: e.limiteCompra,
        puntos: e.puntos,
        horario: {
          id: e.horario.id,
          fecha: e.horario.fecha || "",
          hora: e.horario.hora || "",
        },
      })),
      descuentos: eventData.descuentos.map((d) => ({
        id: d.id,
        nombre: d.nombre,
        codigo: d.codigo,
        tipo: d.tipo,
        valor: d.valor,
        fechaInicio: d.fechaInicio,
        fechaFin: d.fechaFin,
        usosMaximos: d.usosMaximos,
        tipoEntradaId: d.tipoEntradaId,
      })),
    };

    console.log(
      "Payload actualización evento:",
      JSON.stringify(payload, null, 2)
    );

    // --- 2. Petición a la API ---
    const response = await fetch(`${BASE_API_URL}/Evento/ActualizarEvento`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    // --- 3. Manejo de la Respuesta ---
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        message: `Error del servidor: ${response.status} ${response.statusText}`,
      }));
      console.error("Error response from backend:", errorData);
      throw new Error(
        errorData.message || "Ocurrió un error al actualizar el evento."
      );
    }

    const responseData = await response.json();
    console.log("Evento actualizado exitosamente:", responseData);
    return responseData;
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
    console.log("Datos del evento cargados:", apiResponse.data);
    return apiResponse.data || {};
  } else {
    throw new Error(
      apiResponse.message || "La respuesta del API no fue exitosa."
    );
  }
};
