import { promises as fs } from 'fs';
import path from 'path';

// --- CONFIGURACIÓN ---
// Cambia a 'true' para usar el backend real.
// Cambia a 'false' para usar el archivo local 'eventos.json'.
const USE_BACKEND = false; 
const BACKEND_URL = "https://localhost:44372/api/Evento/ListarTodos";

/**
 * Función genérica para obtener los datos, ya sea del backend o del archivo local.
 */
async function fetchData() {
  let json;

  if (USE_BACKEND) {
    // --- Lógica para conectar al backend ---
    const res = await fetch(BACKEND_URL); // Aquí iría la URL real del backend
    if (!res.ok) {
      throw new Error("Error cargando eventos (status " + res.status + ")");
    }
    json = await res.json();
  } else {
    // --- Lógica para leer el archivo local ---
    const jsonPath = path.join(process.cwd(), 'public', 'data', 'eventos.json');
    const fileContent = await fs.readFile(jsonPath, 'utf8');
    json = JSON.parse(fileContent);
  }

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
  const data = await fetchData();
  return data.eventos ?? [];
};

export const getLocales = async () => {
  const data = await fetchData();
  return data.locales ?? [];
};

export const getEventosPorTipo = async (tipo) => {
  // Reutilizamos la lógica principal para obtener y validar los datos
  const todosLosEventos = await getEventos();
  // Mapeamos los idTipoEvento a las nuevas categorías en string
  const categoriaMap = { 1: "Concierto", 2: "Deportivo", 3: "Cultural" };
  const categoriaStr = categoriaMap[tipo];
  return todosLosEventos.filter(evento => evento.categoria === categoriaStr);
};