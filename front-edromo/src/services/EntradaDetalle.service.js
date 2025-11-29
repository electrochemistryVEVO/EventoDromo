//const API_URL = "http://localhost:8080/api"
const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL

// --- Interruptor para cambiar entre Backend y Mock Data ---
// Cambia a 'true' para usar el backend real cuando esté listo.
const USE_BACKEND = true;

export async function obtenerDetallePorId(idEvento){
    let url = API_URL+"/Evento/ObtenerEventoPorId"
    return await fetch(url,{
        method: "POST",
        headers:{
        'Content-Type':'application/json'
        },body:JSON.stringify({idEvento})})
        .then((res)=>res.json())
        .catch((err)=>{console.log(err);return err;})
}

export async function listarEventosPorBusqueda(busqueda){
    let url = API_URL + "/Evento/ListarEventosPorBusqueda";
    return await fetch(url,{
        method: "POST",
        headers:{
            'Content-Type':'application/json'
        },body:JSON.stringify({busqueda})})
        .then((res)=>res.json())
        .catch((err)=>{console.log(err);return err;})
}

/**
 * Obtiene la cantidad de entradas vendidas y el total para un tipo de entrada específico.
 * @param {number} idTipoEntrada - El ID del tipo de entrada a consultar.
 * @returns {Promise<{vendidas: number, total: number}>} Una promesa que resuelve con la disponibilidad.
 */
export async function obtenerDisponibilidadEntrada(idTipoEntrada) {
  if (USE_BACKEND) {
    // --- Lógica para conectar con el Backend Real ---
    console.log(`SERVICE: Obteniendo disponibilidad para tipo de entrada ${idTipoEntrada} desde BACKEND...`);
    const url = `${API_URL}/TipoEntrada/ObtenerDisponibilidadPorTipoEntrada`;
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idTipoEntrada })
      });
      if (!response.ok) throw new Error("Error del servidor al obtener disponibilidad.");
      const result = await response.json();
      if (!result.success) throw new Error(result.message || "La respuesta no fue exitosa.");
      return result.data;
    } catch (error) {
      console.error("Error en servicio obtenerDisponibilidadEntrada (backend):", error);
      // Devolvemos un valor por defecto en caso de error para no romper la UI
      return { vendidas: 0, total: 0 };
    }
  } else {
    // --- Lógica para usar Mock Data (JSON local) ---
    console.log(`SERVICE: Obteniendo disponibilidad para tipo de entrada ${idTipoEntrada} desde MOCK...`);
    await new Promise(resolve => setTimeout(resolve, 50)); // Simular latencia de red
    const response = await fetch(`/data/evento-disponibilidad-entradas.json`);
    const mockData = await response.json();
    // Devuelve los datos para el ID específico, o los datos por defecto si no se encuentra.
    return mockData.data[idTipoEntrada] || mockData.data.default;
  }
}