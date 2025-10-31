const BASE_API_URL = "http://localhost:5189/api";
/**
 * Obtiene el token de autenticación almacenado.
 * @returns {string|null} - El token JWT o null si no existe.
 */

const getAuthToken = () => {
  const sessionJSON = sessionStorage.getItem("session");
  // Variable para guardar el token final
  let userToken = null;
  // 2. MUY IMPORTANTE: Verificar que el dato exista antes de continuar
  if (sessionJSON) {
    // 3. Convertir (parsear) la cadena JSON a un objeto de JavaScript real
    const sessionData = JSON.parse(sessionJSON);
    // 4. Ahora sí, acceder a la propiedad "token" del objeto
    userToken = sessionData.token;
  }
  return userToken;
};

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
 * Simula una llamada a la API para obtener una lista de locales.
 * En una aplicación real, esta función haría una petición fetch a un endpoint del backend.
 * @returns {Promise<Array<string>>} Una promesa que resuelve a un array de nombres de locales.
 */
/*
export const getLocales = async () => {
  console.log("Fetching locales...");
  // Simulación de una llamada a la API
  return new Promise((resolve) => {
    setTimeout(() => {
      const locales = [
        { id: 1, nombre: "Estadio San Marcos", capacidad: 50000 },
        { id: 2, nombre: "Teatro Municipal", capacidad: 800 },
        { id: 3, nombre: "Estadio Monumental", capacidad: 80000 },
        { id: 4, nombre: "Jockey Club del Perú", capacidad: 15000 },
        {
          id: 5,
          nombre: "Anfiteatro del Parque de la Exposición",
          capacidad: 4000,
        },
      ];
      console.log("Locales fetched:", locales);
      resolve(locales);
    }, 500); // Simular un retardo de red
  });
};
*/
/**
 * Simula una llamada a la API para obtener los eventos filtrados.
 * En una aplicación real, los filtros se enviarían como parámetros en la petición fetch.
 * @param {object} filters - Los filtros a aplicar en la búsqueda.
 * @returns {Promise<object>} Una promesa que resuelve a un objeto con los eventos y la información de paginación.
 */
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

/**
 * Simula el envío de los datos de un nuevo evento al backend.
 * @param {object} eventData El objeto de estado del formulario del frontend.
 * @returns {Promise<object>} Una promesa que resuelve a un objeto de respuesta exitosa.
 */
export const createEvent = async (eventData) => {
  console.log("1. DATOS RECIBIDOS DEL FORMULARIO:", eventData);

  // --- BUENA PRÁCTICA 1: Transformar los datos del frontend al formato que el backend espera ---
  // Esto desacopla la estructura de tu estado del contrato de la API.
  const payload = {
    nombre: eventData.nombre,
    descripcion: eventData.descripcion,
    localId: parseInt(eventData.localId, 10),
    tipoEventoId: parseInt(eventInfo.tipoEventoId, 10),
    capacidad: parseInt(eventData.capacidad, 10),
    fechaPublicacion: eventData.fechaPublicacion,
    fechaCompra: eventData.fechaCompra,
    // Transformamos el array de fechas a un formato que el backend podría preferir (ej: 'horarios')
    horarios: eventData.fechas.map((f) => `${f.fecha}T${f.hora}`),
    // Transformamos los tipos de entrada, asegurando que los números sean números.
    entradas: eventData.tiposEntrada.map((t) => ({
      nombre: t.nombre,
      precio: parseFloat(t.precio),
      cantidad: parseInt(t.cantidad, 10),
      limiteCompra: parseInt(t.limiteCompra, 10),
      puntos: parseInt(t.puntos, 10),
    })),
  };

  // El archivo de imagen se manejaría por separado (en FormData en la versión real).
  const imagenFile = eventData.imagenFile;

  console.log(
    "2. PAYLOAD TRANSFORMADO (simulando lo que se enviaría):",
    payload
  );
  console.log(
    "3. ARCHIVO DE IMAGEN (simulando lo que se enviaría):",
    imagenFile
  );

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // --- BUENA PRÁCTICA 2: Simular una validación realista del backend ---
      const aforoTotalAsignado = payload.entradas.reduce(
        (sum, e) => sum + e.cantidad,
        0
      );
      if (aforoTotalAsignado > payload.capacidad) {
        const errorResponse = {
          message: "Error de validación del servidor.",
          errors: {
            aforo: `La suma de las cantidades de entrada (${aforoTotalAsignado}) no puede exceder la capacidad del local (${payload.capacidad}).`,
          },
        };
        console.error("4. SIMULACIÓN FALLIDA:", errorResponse);
        // Rechazamos la promesa con un error estructurado, como lo haría una API real.
        return reject(new Error(errorResponse.errors.aforo));
      }

      const successResponse = {
        message: "Evento creado exitosamente (simulado).",
        data: { id: Date.now(), ...payload },
      };

      console.log("4. SIMULACIÓN EXITOSA:", successResponse);
      resolve(successResponse);
    }, 1500);
  });
};

/**
 * Realiza una llamada a la API para obtener los eventos filtrados y paginados.
 * @param {object} filters - Los filtros a aplicar en la búsqueda.
 * @returns {Promise<object>} Una promesa que resuelve a un objeto con los eventos y la información de paginación.
 */
/*
export const getEvents = async (filters = {}) => {
  const token = getAuthToken();
  if (!token) {
    throw new Error('No se encontró el token de autenticación.');
  }

  // 1. Preparamos los parámetros para la URL, omitiendo los que no se deben enviar.
  const queryParams = { ...filters };
  if (queryParams.local === 0) {
    delete queryParams.local; // El backend no espera localId=0
  }
  if (queryParams.status === 'Todos') {
    delete queryParams.status;
  }
  // Renombramos 'local' a 'localId' para que coincida con la especificación del backend.
  if (queryParams.local) {
      queryParams.localId = queryParams.local;
      delete queryParams.local;
  }


  // 2. Construimos la cadena de búsqueda (query string)
  const queryString = new URLSearchParams(queryParams).toString();
  const url = `${BASE_API_URL}/admin/events?${queryString}`;

  console.log('Realizando petición a:', url);

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': token,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || 'Error al obtener los eventos');
  }

  return response.json();
};
*/

/**
 * Envía los datos del nuevo evento al backend para su creación.
 * @param {object} eventData El objeto de estado del formulario del frontend.
 * @returns {Promise<object>} La respuesta del backend.
 */
/*
export const createEvent = async (eventData) => {
  const token = getAuthToken();
  if (!token) throw new Error('Token de autenticación no encontrado.');

  // --- BUENA PRÁCTICA 1: Usar FormData para enviar archivos y datos juntos ---
  // FormData es el método estándar para peticiones multipart/form-data.
  const formData = new FormData();

  // 1. Añadimos el archivo de imagen. El 'imagen' es el nombre del campo que el backend espera.
  formData.append('imagen', eventData.imagenFile);

  // 2. Transformamos el resto de los datos a la estructura que el backend necesita.
  const payload = {
    nombre: eventData.nombre,
    descripcion: eventData.descripcion,
    localId: parseInt(eventData.localId, 10),
    tipoEventoId: parseInt(eventData.tipoEventoId, 10),
    capacidad: parseInt(eventData.capacidad, 10),
    fechaPublicacion: eventData.fechaPublicacion,
    fechaCompra: eventData.fechaCompra,
    horarios: eventData.fechas.map(f => `${f.fecha}T${f.hora}`),
    entradas: eventData.tiposEntrada.map(t => ({
      nombre: t.nombre,
      precio: parseFloat(t.precio),
      cantidad: parseInt(t.cantidad, 10),
      limiteCompra: parseInt(t.limiteCompra, 10),
      puntos: parseInt(t.puntos, 10),
    })),
  };

  // 3. Añadimos el objeto de datos como un string JSON. El backend deberá parsear este campo.
  //    Este es un patrón común para enviar datos estructurados junto con archivos.
  formData.append('data', JSON.stringify(payload));

  console.log("Enviando FormData al backend...");

  const response = await fetch(`${BASE_API_URL}/admin/events`, {
    method: 'POST',
    headers: {
      'Authorization': token,
      // --- BUENA PRÁCTICA 2: NO establecer el 'Content-Type' manualmente ---
      // Cuando usas FormData, el navegador lo establece automáticamente a 'multipart/form-data'
      // con el 'boundary' correcto. Ponerlo manualmente aquí romperá la petición.
    },
    body: formData, // El cuerpo de la petición es el objeto FormData.
  });

  // --- BUENA PRÁCTICA 3: Manejo de errores detallado ---
  if (!response.ok) {
    // Intentamos parsear el cuerpo del error para obtener un mensaje más específico del backend.
    const errorData = await response.json().catch(() => ({ 
      message: `Error del servidor: ${response.status} ${response.statusText}` 
    }));
    throw new Error(errorData.message || 'Ocurrió un error al crear el evento.');
  }

  return response.json();
};
*/
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
