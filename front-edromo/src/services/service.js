// --- CONFIGURACIÓN ---
const BACKEND_URL = (() => {
  const DEFAULT_URL = "http://localhost:5189/api/";
  const candidates = [
    process.env.NEXT_PUBLIC_EVENTOS_API_URL,
    process.env.NEXT_PUBLIC_API_URL,
    process.env.API_BASE_URL,
    DEFAULT_URL,
  ];

  const resolved = candidates.find((value) => typeof value === "string" && value.trim().length > 0) ?? DEFAULT_URL;

  if (resolved.includes("api.ejemplo.com")) {
    console.warn(
      "[service] Detectada URL de ejemplo (api.ejemplo.com). Usando el backend local por defecto.",
    );
    return DEFAULT_URL;
  }

  return resolved;
})();

/**
 * Función genérica para obtener los datos, ya sea del backend o del archivo local.
 */
async function fetchData(idTipoEvento = null, controller = "Evento/ListarEventosPorTipo") {
  if (!controller) {
    throw new Error("El nombre del controlador es obligatorio");
  }

  const endpoint = new URL(controller.replace(/^\/+/, ""), BACKEND_URL);
  const requestUrl = endpoint.toString();

  const options = idTipoEvento
    ? {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idTipoEvento }),
      }
    : { method: "GET" };

  let res;
  try {
    res = await fetch(requestUrl, { ...options, cache: "no-store" });
  } catch (error) {
    throw new Error(`No se pudo conectar con ${requestUrl}: ${error.message}`);
  }

  if (!res.ok) {
    throw new Error("Error cargando eventos (status " + res.status + ")");
  }

  const json = await res.json();

  // --- Lógica común para procesar la GenericResponse ---
  if (!json) {
    throw new Error("Respuesta vacía del servicio de eventos");
  }
  if (json.success === false) {
    // prioriza error, luego mensaje
    throw new Error(json.error || json.mensaje || "Error en respuesta del servicio");
  }

  return json.data ?? { eventos: [], locales: [] };
}

export const getEventos = async () => {
  const data = await getEventosPorTipo(1);
  return data ?? [];
};

export const getLocales = async () => {
  const data = await fetchData(null,"Local/ListarLocales");
  return data ?? [];
};

export const getEventosPorTipo = async (tipo) => {
  // Reutilizamos la lógica principal para obtener y validar los datos
  return await fetchData(tipo);
};