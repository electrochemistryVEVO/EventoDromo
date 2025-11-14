// --- Interruptor para cambiar entre Backend y Mock Data ---
// Cambia a 'true' para usar el backend real.
// Cambia a 'false' para usar el archivo dromopuntos.json local.
const USE_BACKEND = true;

// URL base de tu API. En un proyecto real, esto estaría en un archivo .env
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL+"/";

/**
 * Obtiene el resumen completo de DromoPuntos (total, por vencer y movimientos)
 * desde el backend en una sola llamada.
 * @param {string} token - El token JWT del usuario autenticado.
 * @returns {Promise<object>} Una promesa que resuelve con el objeto ResumenDromopuntosDTO.
 */
export async function getResumenDromopuntos(token) {
  let res;

  if (USE_BACKEND) {
    // --- Lógica para conectar con el Backend ---
    if (!token) {
      throw new Error("No se proporcionó un token de autenticación.");
    }
    const url = `${API_BASE_URL}Dromopuntos/ObtenerResumen`;
    res = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`, // Envía el token en el encabezado
        'Content-Type': 'application/json',
      },
    });
  } else {
    // --- Lógica para usar Mock Data (JSON local) ---
    res = await fetch(`/data/dromopuntos.json`);
  }

  if (!res.ok) {
    throw new Error(`Error en la comunicación con el servidor (status ${res.status})`);
  }

  const json = await res.json();

  if (!json) throw new Error("Respuesta vacía del servicio.");
  if (json.success === false) {
    throw new Error(json.error || json.message || "Error en la respuesta del servicio");
  }

  // Devuelve el objeto completo dentro de "data"
  return json.data ?? { total: 0, porVencer: [], movimientos: [] };
}