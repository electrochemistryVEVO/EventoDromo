const BASE_API_URL = "http://localhost:5189/api";
/**
 * Obtiene el token de autenticación almacenado del UserContext.
 * @returns {string|null} - El token JWT o null si no existe.
 */
export const getAuthToken = () => {
  try {
    // 1. Lee la clave "user" de localStorage (donde UserContext la guarda)
    const userJSON = localStorage.getItem("user");

    if (!userJSON) {
      return null;
    } // 2. Parsea el objeto y devuelve la propiedad "token"
    const userData = JSON.parse(userJSON);
    return userData?.token || null;
  } catch (error) {
    console.error("Error al leer token de localStorage:", error);
    return null;
  }
};

/* Antes...
export const getAuthToken = () => {
  const sessionJSON = sessionStorage.getItem("session");
  let userToken = null;
  if (sessionJSON) {
    const sessionData = JSON.parse(sessionJSON);
    userToken = sessionData.token;
  }
  return userToken;
};
*/

/**
 * Realiza una llamada a la API para obtener la lista completa de locales.
 * @returns {Promise<Array<{id: number, nombre: string}>>} Una promesa que resuelve a un array de objetos de locales.
 */
export const getLocales = async () => {
  const token = getAuthToken();
  if (!token) {
    throw new Error("No se encontró el token de autenticación.");
  }

  const response = await fetch(`${BASE_API_URL}/Local/GetLocales`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    // Si la respuesta del servidor es un error (ej: 401, 404, 500), lanzamos un error.
    const errorData = await response
      .json()
      .catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || "Error al obtener los locales");
  }

  // 1. Convierte la respuesta a JSON
  const apiResponse = await response.json();

  // 2. Verifica si la respuesta del API fue exitosa y devuelve solo la data.
  //    Si la propiedad 'data' no existe, devuelve un array vacío para evitar errores.
  if (apiResponse && apiResponse.success) {
    return apiResponse.data || [];
  } else {
    // Si el backend devuelve 200 OK pero success es false, lanza un error con su mensaje.
    throw new Error(
      apiResponse.message || "La respuesta del API no fue exitosa."
    );
  }
};

/**
 * Simula una llamada a la API para obtener los eventos filtrados.
 * En una aplicación real, los filtros se enviarían como parámetros en la petición fetch.
 * @param {object} filters - Los filtros a aplicar en la búsqueda.
 * @returns {Promise<object>} Una promesa que resuelve a un objeto con los eventos y la información de paginación.
 */
/*
export const getEvents = async (filters = {}) => {
  console.log("Fetching events with filters:", filters);
  const token = getAuthToken();
  // Simulación de una llamada al backend con el token de autorización
  const headers = {
    Authorization: token,
    "Content-Type": "application/json",
  };

  // Aquí iría la lógica de la llamada fetch al backend:
  // const response = await fetch(`https://api.example.com/events?page=${filters.page || 1}`, { headers });
  // const data = await response.json();
  // return data;

  // Por ahora, devolvemos datos hardcodeados para el frontend.
  return new Promise((resolve) => {
    setTimeout(() => {
      const events = [
        {
          id: 1,
          nombre: "Overpass Lima",
          local: "Estadio San Marcos",
          tipo: "Concierto",
          fechaPublicacion: "2025-10-15T10:00:00",
          fechaCompra: "2025-10-30T11:00:00",
          horario: "2025-11-11T20:00:00",
          ocupacion: {
            actual: 0,
            total: 30000,
          },
          ingresosBrutos: 0.0,
          estado: "Creado",
        },
        {
          id: 2,
          nombre: "Imagine Dragons",
          local: "Estadio San Marcos",
          tipo: "Concierto",
          fechaPublicacion: "2025-05-13T10:00:00",
          fechaCompra: "2025-05-30T11:00:00",
          horario: "2025-10-09T21:00:00",
          ocupacion: {
            actual: 0,
            total: 30000,
          },
          ingresosBrutos: 0.0,
          estado: "Publicado",
        },
        {
          id: 3,
          nombre: "Linkin Park",
          local: "Estadio San Marcos",
          tipo: "Concierto",
          fechaPublicacion: "2025-05-10T10:00:00",
          fechaCompra: "2025-05-29T12:00:00",
          horario: "2025-11-07T19:00:00",
          ocupacion: {
            actual: 11000,
            total: 30000,
          },
          ingresosBrutos: 13200.0,
          estado: "En venta",
        },
        {
          id: 4,
          nombre: "Circo Alegría",
          local: "Teatro Municipal",
          tipo: "Cultural",
          fechaPublicacion: "2025-05-08T10:00:00",
          fechaCompra: "2025-05-08T11:00:00",
          horario: "Múltiples Fechas",
          ocupacion: {
            actual: 11000,
            total: 30000,
          },
          ingresosBrutos: 13200.0,
          estado: "Concluido",
        },
        {
          id: 5,
          nombre: "Universitario vs Alianza",
          local: "Estadio Monumental",
          tipo: "Deportivo",
          fechaPublicacion: "2025-04-05T10:00:00",
          fechaCompra: "2025-04-20T09:00:00",
          horario: "2025-06-15T15:00:00",
          ocupacion: {
            actual: 0,
            total: 30000,
          },
          ingresosBrutos: 0.0,
          estado: "Cancelado",
        },
      ];

      const response = {
        data: events,
        pagination: {
          currentPage: filters.page || 1,
          totalPages: 10, // Simulación de paginación
          totalEvents: 98,
        },
      };
      console.log("Events fetched:", response);
      resolve(response);
    }, 1000); // Simular un retardo de red
  });
};
*/
/**
 * Realiza una llamada a la API para obtener los eventos filtrados y paginados.
 * @param {object} filters - Los filtros a aplicar en la búsqueda.
 * @returns {Promise<object>} Una promesa que resuelve a un objeto con los eventos y la información de paginación.
 */

export const getEvents = async (filters = {}) => {
  const token = getAuthToken();
  if (!token) {
    throw new Error("No se encontró el token de autenticación.");
  }

  // 1. Preparamos los parámetros para la URL, omitiendo los que no se deben enviar.
  const queryParams = { ...filters };
  if (queryParams.local === 0) {
    delete queryParams.local; // El backend no espera localId=0
  }
  if (queryParams.status === "Todos") {
    delete queryParams.status;
  }
  // Renombramos 'local' a 'localId' para que coincida con la especificación del backend.
  if (queryParams.local) {
    queryParams.localId = queryParams.local;
    delete queryParams.local;
  }

  // 2. Construimos la cadena de búsqueda (query string)
  const queryString = new URLSearchParams(queryParams).toString();
  const url = `${BASE_API_URL}/Evento/EventoGetEvents?${queryString}`;

  console.log("Realizando petición a:", url);

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: token,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || "Error al obtener los eventos");
  }

  return response.json();
};

/**
 * Envía los datos de un nuevo evento al backend para su creación.
 * A diferencia de la versión anterior, esta función envía una URL de imagen
 * en lugar de un archivo binario.
 *
 * @param {object} eventData - El objeto que contiene todos los datos del formulario del evento.
 *                             Se espera que contenga una propiedad `imagenURL` (string).
 * @returns {Promise<object>} Una promesa que resuelve con la respuesta exitosa del backend.
 * @throws {Error} Lanza un error si el token no se encuentra, si los datos son inválidos,
 *                 o si la petición a la API falla por cualquier motivo.
 */
export const createEvent = async (eventData) => {
  // Previene llamadas innecesarias a la API si los datos son claramente incorrectos.
  if (!eventData || !eventData.nombre || !eventData.imagenURL) {
    throw new Error(
      "Datos incompletos. Se requiere al menos un nombre y una URL de imagen para crear el evento."
    );
  }

  console.log("Iniciando creación de evento con datos:", eventData);

  const token = getAuthToken();
  if (!token) {
    throw new Error(
      "Token de autenticación no encontrado. No se puede continuar."
    );
  }

  // Mapeamos los datos del estado del frontend al contrato exacto que espera la API.
  // Esto hace el código más mantenible si el estado del frontend cambia.
  const payload = {
    nombre: eventData.nombre,
    descripcion: eventData.descripcion,
    localId: parseInt(eventData.localId, 10),
    tipoEventoId: parseInt(eventData.tipoEventoId, 10), // Corregido de eventInfo a eventData
    capacidad: parseInt(eventData.capacidad, 10),
    fechaPublicacion: eventData.fechaPublicacion,
    fechaCompra: eventData.fechaCompra,
    imagenURL: eventData.imagenURL, // <-- El cambio principal: ahora es una URL.
    horarios: eventData.fechas.map((f) => `${f.fecha}T${f.hora}`),
    entradas: eventData.tiposEntrada.map((t) => ({
      nombre: t.nombre,
      precio: parseFloat(t.precio),
      cantidad: parseInt(t.cantidad, 10),
      limiteCompra: parseInt(t.limiteCompra, 10),
      puntos: parseInt(t.puntos, 10),
    })),
  };

  console.log("Payload a enviar a la API:", JSON.stringify(payload, null, 2));

  try {
    const response = await fetch(`${BASE_API_URL}/Evento/CrearEvento`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      // El cuerpo es el objeto payload convertido a una cadena JSON.
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      // Intentamos leer el cuerpo del error para obtener un mensaje específico del backend.
      const errorData = await response.json().catch(() => ({
        // Fallback si el cuerpo del error no es JSON o está vacío.
        message: `Error del servidor: ${response.status} ${response.statusText}`,
      }));
      throw new Error(
        errorData.message || "Ocurrió un error al crear el evento."
      );
    }

    // Si la respuesta es exitosa (ej: 201 Created), devolvemos los datos.
    return await response.json();
  } catch (error) {
    // Este bloque se activa si hay un problema de red (servidor caído, sin conexión)
    // o si lanzamos un error manualmente en el bloque `if (!response.ok)`.
    console.error("Error crítico en el servicio createEvent:", error);

    // Relanzamos el error para que la capa que llamó (el controlador/componente)
    // pueda manejarlo y mostrar una notificación al usuario.
    throw error;
  }
};

/**
 * Obtiene la lista de tipos de evento disponibles desde el backend.
 *
 * @returns {Promise<Array<{id: number, nombre: string}>>} Una promesa que resuelve a un array de objetos de tipo de evento.
 * @throws {Error} Lanza un error detallado si la petición a la API falla por cualquier motivo.
 */

export const getEventTypes = async () => {
  console.log("Fetching event types from backend...");
  const token = getAuthToken();
  if (!token) {
    throw new Error(
      "Token de autenticación no encontrado. No se puede realizar la petición."
    );
  }
  try {
    const response = await fetch(`${BASE_API_URL}/TipoEvento/GetTiposEvento`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        // Si el cuerpo del error no es JSON o está vacío, creamos un error genérico.
        message: `Error del servidor: ${response.status} ${response.statusText}`,
      }));
      // Lanzamos un error con el mensaje más específico que tengamos.
      throw new Error(
        errorData.message || "Ocurrió un error al obtener los tipos de evento."
      );
    }
    // 1. Convierte la respuesta a JSON
    const apiResponse = await response.json();
    // 2. Verifica si la respuesta del API fue exitosa y devuelve solo la data.
    if (apiResponse && apiResponse.success) {
      console.log("Tipos de evento fetched:", apiResponse.data);
      return apiResponse.data || [];
    } else {
      // Si el backend devuelve 200 OK pero success es false, lanza un error con su mensaje.
      throw new Error(
        apiResponse.message || "La respuesta del API no fue exitosa."
      );
    }
  } catch (error) {
    console.error("Error en getEventTypes:", error);
    throw error;
  }
};

/**
 * Sube un archivo de imagen y devuelve su URL pública.
 *
 * --- ¡VERSIÓN SIMULADA (MOCK)! ---
 * Por ahora, esta función NO sube el archivo. Simplemente simula un
 * retraso de red y devuelve una URL de imagen hardcodeada para desarrollo.
 *
 * @param {File} imageFile - El archivo de imagen seleccionado por el usuario (actualmente no se utiliza).
 * @returns {Promise<string>} Una promesa que resuelve a la URL de la imagen.
 */
export const uploadImageAndGetUrl = async (imageFile) => {
  console.log("ADVERTENCIA: Usando el servicio de subida de imagen SIMULADO.");

  // Validamos que se recibió un archivo para mantener la consistencia con la futura función real.
  if (!imageFile) {
    throw new Error("No se proporcionó ningún archivo de imagen.");
  }

  // Simula un pequeño retraso de red (ej: 500 milisegundos)
  await new Promise((resolve) => setTimeout(resolve, 500));

  const HARDCODED_IMAGE_URL =
    "https://via.placeholder.com/1024x768.png?text=Mi+Evento";

  console.log("Subida simulada exitosa. URL devuelta:", HARDCODED_IMAGE_URL);

  // En el futuro, aquí iría la llamada fetch real y devolveríamos la URL de la respuesta.
  // Por ahora, simplemente devolvemos la URL fija.
  return HARDCODED_IMAGE_URL;
};
