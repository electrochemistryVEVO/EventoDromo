// --- 1. Importa la función principal del servicio ---
import { getPaginaEventosData } from '@/services/service.js'; // O serviceEventos.js si lo renombraste

/**
 * Controller que obtiene datos para la página, acepta filtros y agrupa dinámicamente por categoría.
 * @param {object} searchParams - Objeto con los parámetros de la URL (filtros).
 */
export async function obtenerDatosParaPagina(searchParams) {

  // Extraer los filtros relevantes de searchParams (sin cambios)
  const filters = {
      categoria: searchParams?.categoria,
      ciudad: searchParams?.ciudad,
      precioMin: searchParams?.precioMin,
      precioMax: searchParams?.precioMax,
      fechaInicio: searchParams?.fechaInicio,
      fechaFin: searchParams?.fechaFin,
      busqueda: searchParams?.busqueda,
  };

  try {
    // --- 2. Llama a la nueva función del servicio ---
    // Obtiene tanto eventos (ya filtrados por el servicio si aplica) como locales
    const { eventos: eventosFiltrados, locales } = await getPaginaEventosData(filters);

    // 3. Agrupar los eventos filtrados dinámicamente por categoría (sin cambios)
    const eventosPorCategoria = eventosFiltrados.reduce((acc, evento) => {
      const categoria = evento.categoria || 'Sin Categoría';
      if (!acc[categoria]) {
        acc[categoria] = [];
      }
      acc[categoria].push(evento);
      return acc;
    }, {});

    // 4. Definir los eventos destacados (sin cambios)
    const destacados = eventosFiltrados.slice(0, 4);

    // 5. Devolver un objeto con los datos procesados (sin cambios)
    return {
        destacados,
        eventosPorCategoria,
        locales,
    };

  } catch (error) {
     // Manejo de error si la llamada al servicio falla
     console.error("Error en obtenerDatosParaPagina:", error);
     // Devuelve datos vacíos para que la página no se rompa completamente
     return {
         destacados: [],
         eventosPorCategoria: {},
         locales: [],
     };
  }
}

