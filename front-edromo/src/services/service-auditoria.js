/**
 * @file service-auditoria.js
 * @description Servicio para la comunicación con el backend para la auditoría de clientes.
 */

// --- Interruptor para cambiar entre Backend y Mock Data ---
// Cambia a 'true' para usar el backend real.
// Cambia a 'false' para usar datos mock desde auditorias.json.
const USE_BACKEND = false;

const BASE_API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

/**
 * Obtiene el token de autenticación almacenado.
 * @returns {string|null} - El token JWT o null si no existe.
 */
const getAuthToken = () => {
  if (typeof window === "undefined") {
    console.warn("getAuthToken llamado en el servidor, retornando null");
    return null;
  }

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
 * Obtiene la lista de clientes para auditoría con filtros y paginación.
 * @param {number} page - Número de página (1-indexed).
 * @param {string} searchTerm - Término de búsqueda para filtrar clientes.
 * @returns {Promise<{success: boolean, message: string, data: {clientes: Array, totalPages: number, currentPage: number, totalClientes: number}, error: string}>}
 */
export const obtenerClientesAuditoria = async (page = 1, searchTerm = "") => {
  const token = getAuthToken();

  if (!token && USE_BACKEND) {
    console.error("No se encontró el token de autenticación.");
    return {
      success: false,
      message: "No se encontró el token de autenticación",
      data: null,
      error: "TOKEN_NOT_FOUND",
    };
  }

  if (USE_BACKEND) {
    // --- Lógica para conectar con el Backend Real ---
    try {
      console.log(
        `SERVICE: Obteniendo clientes de auditoría desde el BACKEND (página: ${page}, búsqueda: ${searchTerm})...`
      );

      const queryParams = new URLSearchParams({
        page: page.toString(),
        ...(searchTerm && { search: searchTerm }),
      });

      const response = await fetch(
        `${BASE_API_URL}/Auditoria/ObtenerClientes?${queryParams}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return {
          success: false,
          message:
            errorData.message || `Error HTTP: ${response.status} ${response.statusText}`,
          data: null,
          error: errorData.error || "HTTP_ERROR",
        };
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error en el servicio obtenerClientesAuditoria (backend):", error);
      return {
        success: false,
        message: "Error de conexión con el servidor",
        data: null,
        error: error.message,
      };
    }
  } else {
    // --- Lógica para usar Mock Data desde JSON ---
    console.log(
      `SERVICE: Obteniendo clientes de auditoría desde MOCK JSON (página: ${page}, búsqueda: ${searchTerm})...`
    );

    try {
      // Leer datos del archivo JSON
      const response = await fetch("/data/auditorias.json");
      
      if (!response.ok) {
        throw new Error("No se pudo cargar el archivo auditorias.json");
      }

      const mockData = await response.json();
      
      // Simulamos un pequeño retraso para imitar una llamada de red
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Obtener todos los clientes del mock
      const todosLosClientes = mockData.data.clientes;

      // Filtrar clientes según el término de búsqueda
      let clientesFiltrados = todosLosClientes;
      if (searchTerm && searchTerm.trim() !== "") {
        const termino = searchTerm.toLowerCase();
        clientesFiltrados = todosLosClientes.filter(
          (cliente) =>
            cliente.nombre.toLowerCase().includes(termino) ||
            cliente.email.toLowerCase().includes(termino) ||
            cliente.telefono.includes(termino)
        );
      }

      // Paginación
      const itemsPerPage = 6;
      const totalClientes = clientesFiltrados.length;
      const totalPages = Math.ceil(totalClientes / itemsPerPage);
      const startIndex = (page - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const clientesPaginados = clientesFiltrados.slice(startIndex, endIndex);

      return {
        success: true,
        message: "Clientes obtenidos exitosamente",
        data: {
          clientes: clientesPaginados,
          totalPages: totalPages > 0 ? totalPages : 1,
          currentPage: page,
          totalClientes,
        },
        error: null,
      };
    } catch (error) {
      console.error("Error al cargar datos mock:", error);
      return {
        success: false,
        message: "Error al cargar los datos mock",
        data: null,
        error: error.message,
      };
    }
  }
};

/**
 * Obtiene los detalles de un cliente específico para auditoría.
 * @param {number|string} clienteId - ID del cliente.
 * @returns {Promise<{success: boolean, message: string, data: object, error: string}>}
 */
export const obtenerDetalleCliente = async (clienteId) => {
  const token = getAuthToken();

  if (!token && USE_BACKEND) {
    console.error("No se encontró el token de autenticación.");
    return {
      success: false,
      message: "No se encontró el token de autenticación",
      data: null,
      error: "TOKEN_NOT_FOUND",
    };
  }

  if (USE_BACKEND) {
    // --- Lógica para conectar con el Backend Real ---
    try {
      console.log(
        `SERVICE: Obteniendo detalle del cliente ${clienteId} desde el BACKEND...`
      );

      const response = await fetch(
        `${BASE_API_URL}/Auditoria/ObtenerDetalleCliente/${clienteId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return {
          success: false,
          message:
            errorData.message || `Error HTTP: ${response.status} ${response.statusText}`,
          data: null,
          error: errorData.error || "HTTP_ERROR",
        };
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error en el servicio obtenerDetalleCliente (backend):", error);
      return {
        success: false,
        message: "Error de conexión con el servidor",
        data: null,
        error: error.message,
      };
    }
  } else {
    // --- Lógica para usar Mock Data desde JSON ---
    console.log(`SERVICE: Obteniendo detalle del cliente ${clienteId} desde MOCK JSON...`);

    try {
      // Leer datos del archivo JSON de detalle
      const response = await fetch("/data/auditoria-detalle.json");
      
      if (!response.ok) {
        throw new Error("No se pudo cargar el archivo auditoria-detalle.json");
      }

      const mockData = await response.json();
      
      // Simulamos un pequeño retraso para imitar una llamada de red
      await new Promise((resolve) => setTimeout(resolve, 300));

      // En el mock, siempre devolvemos el mismo cliente pero con el ID solicitado
      const clienteDetalle = {
        ...mockData.data,
        id: parseInt(clienteId)
      };

      return {
        success: true,
        message: "Detalle del cliente obtenido exitosamente",
        data: clienteDetalle,
        error: null,
      };
    } catch (error) {
      console.error("Error al cargar datos mock:", error);
      return {
        success: false,
        message: "Error al cargar los datos mock",
        data: null,
        error: error.message,
      };
    }
  }
};
