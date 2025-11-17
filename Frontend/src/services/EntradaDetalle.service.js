/**
 * Servicio para obtener detalle de entrada.
 * - fetchDetalleByIdPost: Llama al Backend real (C#).
 * - fetchDetalleById: Llama al JSON local de simulación (fallback).
 */

const API_BASE = "http://localhost:5189"; 

/**
 * POST: solicita detalle a la API de Backend (C#).
 * (Coincide con la implementación de tu Controller y Swagger)
 * @param {string|number} idEntrada El ID de la entrada a consultar
 * @returns {Promise<object>} detalle
 */
export async function fetchDetalleByIdPost(idEntrada) {
  if (!API_BASE) {
    throw new Error("No hay API_BASE configurada.");
  }

  // --- CAMBIO 1: La URL NO lleva el ID ---
  // (Tal como lo muestra tu Swagger)
  const endpoint = `${API_BASE.replace(/\/$/, "")}/api/VerDetalleEntrada/ObtenerDetalleEntrada`;

  // --- CAMBIO 2: El método vuelve a ser POST ---
  const res = await fetch(endpoint, {
    method: "POST", 
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
    // --- CAMBIO 3: El ID (idEntrada) va en el body ---
    // Tu backend espera un [FromBody] int, así que enviamos el número 'raw'
    body: JSON.stringify(idEntrada), 
  });

  if (!res.ok) {
    // Si el backend da 404, 500, etc., lanza un error.
    throw new Error(`Error POST ${endpoint}: ${res.status} ${res.statusText}`);
  }

  const json = await res.json();
  if (!json) throw new Error("Respuesta vacía del servicio de detalle");
  
  if (json.success === false) {
    throw new Error(json.error || json.mensaje || "Error en respuesta del servicio");
  }
  
  return json.data ?? json;
}


/**
 * GET fallback: carga /data/detalleEntrada.json (simulación)
 * ESTA FUNCIÓN ES NECESARIA PARA EL FALLBACK
 */
export async function fetchDetalleById(idOrTransaccion, url = "/data/entrada-detalle.json") {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`Error obteniendo ${url}: ${res.status} ${res.statusText}`);
  
  const json = await res.json(); 
  if (!json) return null;

  return json.data ?? null;
}

export default {
  fetchDetalleByIdPost,
  fetchDetalleById,
};
