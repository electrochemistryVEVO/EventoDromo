// src/services/mis-entradas.service.js
// --- 1. IMPORTA el hook para obtener el token ---
// (Asumiendo que lo tienes en tu UserContext, si no, lo ajustamos)
// No, mejor lo pasamos desde el controller.

/**
 * Obtiene las entradas del usuario, filtradas y paginadas desde el backend.
 * @param {string} token - El token JWT del usuario.
 * @param {object} filters - Objeto con los filtros y paginación.
 * @param {string} filters.startDate - Fecha de inicio (YYYY-MM-DD)
 * @param {string} filters.endDate - Fecha de fin (YYYY-MM-DD)
 * @param {object} filters.statusFilter - Objeto con los estados (ej. { vigente: true })
 * @param {number} filters.currentPage - Número de página
 * @param {number} filters.pageSize - Tamaño de la página
 */
export async function getEntradas(token, { startDate, endDate, statusFilter, currentPage, pageSize }) {
  
  // --- 2. CONSTRUIMOS LA URL CON PARÁMETROS ---
  const params = new URLSearchParams();
  if (startDate) params.append('fechaInicio', startDate);
  if (endDate) params.append('fechaFin', endDate);

  // Manda los estados activos
  if (statusFilter.vigente) params.append('estados', 'vigente');
  if (statusFilter.vencido) params.append('estados', 'vencido');
  
  // Manda la paginación
  params.append('pagina', currentPage);
  params.append('tamanoPagina', pageSize);

  const queryString = params.toString();
  
  // --- 3. NUEVO ENDPOINT (que crearemos en el backend) ---
  const url = `http://localhost:5189/api/EntradaEventoAuxiliar/ListarMisEntradas?${queryString}`;

  const res = await fetch(url, {
    method: 'GET',
    headers: {
      // --- 4. ENVIAMOS EL TOKEN ---
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!res.ok)
    throw new Error("Error cargando entradas (status " + res.status + ")");
  
  const json = await res.json();

  if (!json) throw new Error("Respuesta vacía del servicio de entradas");
  if (json.success === false) {
    throw new Error(
      json.error || json.mensaje || "Error en respuesta del servicio"
    );
  }

  // --- 5. DEVOLVEMOS EL OBJETO DE PAGINACIÓN COMPLETO ---
  // (Esperamos que el backend devuelva { items: [], totalItems: 0, totalPages: 0 })
  return json.data ?? { items: [], totalItems: 0, totalPages: 0 };
}
/*
export async function getEntradas() {
  // link test
  // const res = await fetch("/data/entradas.json");
  //link q funciona en individual: http://localhost:5189/api/EntradaEventoAuxiliar/ListarTodasLasEntradas"
  //link q funciona en docker: http://localhost:8081/api/EntradaEventoAuxiliar/ListarTodasLasEntradas"
  const res = await fetch("http://localhost:5189/api/EntradaEventoAuxiliar/ListarTodasLasEntradas"); // para cambiar al back
  console.log(res);
  if (!res.ok)
    throw new Error("Error cargando entradas (status " + res.status + ")");
  const json = await res.json();

  // GenericResponse { success: bool, mensaje: string, data: T, error: string }
  if (!json) throw new Error("Respuesta vacía del servicio de entradas");
  if (json.success === false) {
    // prioriza error, luego mensaje
    throw new Error(
      json.error || json.mensaje || "Error en respuesta del servicio"
    );
  }

  return json.data ?? [];
}
*/