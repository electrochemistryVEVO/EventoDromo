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
 * --- VERSIÓN SIMULADA (MOCK) ---
 * Obtiene los detalles completos de un evento por su ID.
 */
export const getEventById = async (eventId) => {
  console.log(`Fetching simulated event data for ID: ${eventId}...`);

  if (!eventId) {
    throw new Error("Se requiere un ID de evento para obtener los detalles.");
  }

  await new Promise((resolve) => setTimeout(resolve, 800));

  const mockEventData = {
    nombre: "Overpass Lima",
    descripcion: "El mejor concierto del año...",
    imagenURL: "https://via.placeholder.com/800x600.png?text=Overpass+Lima",
    localId: 1,
    tipoEventoId: 1,
    capacidad: 3000,
    fechaPublicacion: "2025-10-15T10:00",
    fechaCompra: "2025-10-30T11:00",
    horarios: [
      { id: 201, fecha: "2025-11-11", hora: "20:00" },
      { id: 202, fecha: "2025-11-12", hora: "21:00" },
    ],
    entradas: [
      {
        id: 101,
        nombre: "General",
        precio: 200,
        cantidad: 300,
        limiteCompra: 10,
        puntos: 2,
      },
      {
        id: 102,
        nombre: "VIP",
        precio: 350,
        cantidad: 100,
        limiteCompra: 10,
        puntos: 3,
      },
    ],
    descuentos: [
      {
        id: 51,
        nombre: "Preventa Fans",
        codigo: "FANCLUB20",
        tipo: "Porcentaje",
        valor: 20,
        fechaInicio: "2025-10-30T12:00",
        fechaFin: "2025-11-05T23:59",
        usosMaximos: 50,
        tipoEntradaId: 102, // Vinculado a VIP
      },
    ],
  };

  console.log("Simulated event data fetched:", mockEventData);
  return mockEventData;
};

/**
 * --- VERSIÓN SIMULADA (MOCK) ---
 * Simula el envío de los datos actualizados de un evento al backend.
 *
 * @param {string|number} eventId - El ID del evento a actualizar.
 * @param {object} eventData - El objeto con todos los datos actualizados del formulario.
 * @returns {Promise<object>} Una promesa que resuelve con la respuesta de éxito simulada.
 */
export const updateEvent = async (eventId, eventData) => {
  console.log(`1. INICIANDO ACTUALIZACIÓN SIMULADA para Evento ID: ${eventId}`);
  console.log("2. DATOS RECIBIDOS DEL FORMULARIO:", eventData);

  // --- VALIDACIONES BÁSICAS ---
  if (!eventId || !eventData) {
    throw new Error(
      "Se requiere el ID del evento y los datos para actualizar."
    );
  }

  // --- TRANSFORMACIÓN DEL PAYLOAD (Igual que en la versión real) ---
  const payload = {
    nombre: eventData.nombre,
    descripcion: eventData.descripcion,
    localId: parseInt(eventData.localId, 10),
    tipoEventoId: parseInt(eventData.tipoEventoId, 10),
    capacidad: parseInt(eventData.capacidad, 10),
    fechaPublicacion: eventData.fechaPublicacion,
    fechaCompra: eventData.fechaCompra,
    imagenURL: eventData.imagenURL,
    horarios: eventData.fechas.map((f) => ({
      id: f.id,
      fecha: f.fecha,
      hora: f.hora,
    })),
    entradas: eventData.tiposEntrada.map((t) => ({
      id: t.id,
      nombre: t.nombre,
      precio: parseFloat(t.precio),
      cantidad: parseInt(t.cantidad, 10),
      limiteCompra: parseInt(t.limiteCompra, 10),
      puntos: parseInt(t.puntos, 10),
    })),
    descuentos: eventData.descuentos.map((d) => ({
      id: d.id,
      nombre: d.nombre,
      codigo: d.codigo,
      tipo: d.tipo,
      valor: parseFloat(d.valor),
      fechaInicio: d.fechaInicio,
      fechaFin: d.fechaFin,
      usosMaximos: parseInt(d.usosMaximos, 10),
      tipoEntradaId: parseInt(d.tipoEntradaId, 10),
    })),
    // --- NUEVOS ARRAYS DE IDs ELIMINADOS ---
    deletedFechasIds: eventData.deletedFechasIds,
    deletedTiposEntradaIds: eventData.deletedTiposEntradaIds,
    deletedDescuentosIds: eventData.deletedDescuentosIds,
  };

  console.log(
    "3. PAYLOAD TRANSFORMADO (simulando lo que se enviaría):",
    payload
  );

  return new Promise((resolve, reject) => {
    // Simula un retraso de red
    setTimeout(() => {
      // --- SIMULACIÓN DE VALIDACIÓN DEL BACKEND ---
      const aforoTotalAsignado = payload.entradas.reduce(
        (sum, e) => sum + e.cantidad,
        0
      );
      if (aforoTotalAsignado > payload.capacidad) {
        const errorResponse = {
          message: `La suma de las cantidades de entrada (${aforoTotalAsignado}) excede la capacidad del local (${payload.capacidad}).`,
        };
        console.error("4. SIMULACIÓN DE ACTUALIZACIÓN FALLIDA:", errorResponse);
        return reject(new Error(errorResponse.message));
      }

      // Si la validación pasa, devolvemos una respuesta de éxito.
      const successResponse = {
        message: `Evento con ID ${eventId} actualizado exitosamente (simulado).`,
        data: {
          id: eventId, // Devolvemos el mismo ID que recibimos
          ...payload, // Devolvemos los datos actualizados
        },
      };

      console.log("4. SIMULACIÓN DE ACTUALIZACIÓN EXITOSA:", successResponse);
      resolve(successResponse);
    }, 1500); // Retardo de 1.5 segundos para simular la operación
  });
};
/**
 * Envía los datos actualizados de un evento al backend.
 */
/*
export const updateEvent = async (eventId, eventData) => {
  if (!eventId || !eventData) {
    throw new Error(
      "Se requiere el ID del evento y los datos para actualizar."
    );
  }
  const token = getAuthToken();
  if (!token) {
    throw new Error("Token de autenticación no encontrado.");
  }

  const payload = {
    nombre: eventData.nombre,
    descripcion: eventData.descripcion,
    localId: parseInt(eventData.localId, 10),
    tipoEventoId: parseInt(eventData.tipoEventoId, 10),
    capacidad: parseInt(eventData.capacidad, 10),
    fechaPublicacion: eventData.fechaPublicacion,
    fechaCompra: eventData.fechaCompra,
    imagenURL: eventData.imagenURL,
    horarios: eventData.fechas.map((f) => ({
      id: f.id,
      fecha: f.fecha,
      hora: f.hora,
    })),
    entradas: eventData.tiposEntrada.map((t) => ({
      id: t.id,
      nombre: t.nombre,
      precio: parseFloat(t.precio),
      cantidad: parseInt(t.cantidad, 10),
      limiteCompra: parseInt(t.limiteCompra, 10),
      puntos: parseInt(t.puntos, 10),
    })),
  };

  try {
    const response = await fetch(
      `${BASE_API_URL}/Evento/ActualizarEvento/${eventId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ message: `Error del servidor: ${response.status}` }));
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
*/

/**
 * Realiza una llamada a la API para obtener los detalles completos de un evento por su ID.
 * @param {string|number} eventId - El ID del evento.
 * @returns {Promise<object>} Los datos completos del evento, incluyendo descuentos.
 */
/*
export const getEventById = async (eventId) => {
  const token = getAuthToken();
  if (!token) throw new Error("Token de autenticación no encontrado.");

  const response = await fetch(`${BASE_API_URL}/Evento/GetEvento/${eventId}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({ message: `Error del servidor: ${response.status}` }));
    throw new Error(
      errorData.message || "Error al obtener los detalles del evento."
    );
  }

  const apiResponse = await response.json();
  if (apiResponse && apiResponse.success) {
    // Asumimos que la respuesta ahora incluye un array 'descuentos'
    return apiResponse.data || {};
  } else {
    throw new Error(
      apiResponse.message || "La respuesta del API no fue exitosa."
    );
  }
};
*/

/**
 * Envía los datos actualizados de un evento al backend, incluyendo la gestión de descuentos.
 * @param {string|number} eventId - El ID del evento a actualizar.
 * @param {object} eventData - Los datos completos del formulario.
 * @returns {Promise<object>} La respuesta del backend.
 */
/*
export const updateEvent = async (eventId, eventData) => {
  const token = getAuthToken();
  if (!token) throw new Error("Token de autenticación no encontrado.");

  // --- El payload ahora incluye los descuentos y los IDs a eliminar ---
  const payload = {
    nombre: eventData.nombre,
    descripcion: eventData.descripcion,
    localId: parseInt(eventData.localId, 10),
    tipoEventoId: parseInt(eventData.tipoEventoId, 10),
    capacidad: parseInt(eventData.capacidad, 10),
    fechaPublicacion: eventData.fechaPublicacion,
    fechaCompra: eventData.fechaCompra,
    imagenURL: eventData.imagenURL,
    horarios: eventData.fechas.map((f) => ({
      id: f.id,
      fecha: f.fecha,
      hora: f.hora,
    })),
    entradas: eventData.tiposEntrada.map((t) => ({
      id: t.id,
      nombre: t.nombre,
      precio: parseFloat(t.precio),
      cantidad: parseInt(t.cantidad, 10),
      limiteCompra: parseInt(t.limiteCompra, 10),
      puntos: parseInt(t.puntos, 10),
    })),
    descuentos: eventData.descuentos.map((d) => ({
      id: d.id,
      nombre: d.nombre,
      codigo: d.codigo,
      tipo: d.tipo,
      valor: parseFloat(d.valor),
      fechaInicio: d.fechaInicio,
      fechaFin: d.fechaFin,
      usosMaximos: parseInt(d.usosMaximos, 10),
      tipoEntradaId: parseInt(d.tipoEntradaId, 10),
    })),
    deletedFechasIds: eventData.deletedFechasIds,
    deletedTiposEntradaIds: eventData.deletedTiposEntradaIds,
    deletedDescuentosIds: eventData.deletedDescuentosIds,
  };

  const response = await fetch(
    `${BASE_API_URL}/Evento/ActualizarEvento/${eventId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    }
  );

  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({ message: `Error del servidor: ${response.status}` }));
    throw new Error(
      errorData.message || "Ocurrió un error al actualizar el evento."
    );
  }

  return await response.json();
};
*/
