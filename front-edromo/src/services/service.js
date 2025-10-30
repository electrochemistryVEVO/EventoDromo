//import { readFile } from 'fs';
//NOTA: Deshabilito funcion para leer de filesystem porque useffect requiere de un client component
import path from 'path';

// --- CONFIGURACIÓN ---
// Cambia a 'true' para usar el backend real.
// Cambia a 'false' para usar el archivo local 'eventos.json'.
const USE_BACKEND = true;
const BACKEND_URL = "http://localhost:8080/api/";

/**
 * Función genérica para obtener los datos, ya sea del backend o del archivo local.
 */
async function fetchData(idTipoEvento=null,controller='Evento/ListarEventosPorTipo') {
  let json;

  if (USE_BACKEND) {
    // --- Lógica para conectar al backend ---
    const res = idTipoEvento? await fetch(BACKEND_URL+controller,{
      method: "POST",
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({idTipoEvento})
    }) : await fetch(BACKEND_URL+controller); // Aquí iría la URL real del backend
    if (!res.ok) {
      throw new Error("Error cargando eventos (status " + res.status + ")");
    }
    json = await res.json();
  } else {

    // --- Lógica para leer el archivo local ---
    /*
    const jsonPath = path.join(process.cwd(), 'public', 'data', 'eventos.json');
    const fileContent = await readFile(jsonPath, 'utf8');
    json = JSON.parse(fileContent);*/
    json = []
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