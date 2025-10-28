import { getPaginaEventosData } from "@/services/service.js";

//NOTA: En lo posible, usar componentes de react-bootstrap en vez de usar las clases manualmente
//Usar las clases manualmente no implementa el javascript necesario para el funcionamiento de algunos elementos

/**
 * Controller que obtiene todos los datos necesarios para la página de lista de eventos.
 * Utiliza la nueva función unificada 'getPaginaEventosData'.
 */
export async function obtenerDatosParaPagina() {
  // Hacemos todas las llamadas al servicio en paralelo para mayor eficiencia.
  // Cada llamada pide los eventos con un filtro de categoría diferente.
  // NOTA: Asumimos que los nombres de las categorías son "Conciertos", "Deportes", etc.
  // ¡Debes verificar que estos nombres coincidan con los datos reales en tu JSON o base de datos!
  const [
    respuestaDestacados, // Contiene { eventos, locales }
    respuestaConciertos, // Contiene { eventos, locales }
    respuestaDeportes,
    respuestaCulturales,
  ] = await Promise.all([
    // Para "destacados", traemos eventos sin filtro de categoría. Podrías añadir un límite si lo necesitas.
    getPaginaEventosData({}),

    // Equivalente a getEventosPorTipo(1)
    getPaginaEventosData({ categoria: "Conciertos" }),

    // Equivalente a getEventosPorTipo(2)
    getPaginaEventosData({ categoria: "Deportes" }),

    // Equivalente a getEventosPorTipo(3)
    getPaginaEventosData({ categoria: "Culturales" }),
  ]);

  // Ahora, extraemos las listas de eventos de cada respuesta.
  const destacados = respuestaDestacados.eventos;
  const conciertos = respuestaConciertos.eventos;
  const deportes = respuestaDeportes.eventos;
  const culturales = respuestaCulturales.eventos;

  // La lista de locales viene en cada respuesta. Tomamos la de la primera llamada,
  // ya que debería ser la misma en todas.
  const locales = respuestaDestacados.locales;

  // Devolvemos el objeto final con la misma estructura que tu componente de página espera.
  return { destacados, conciertos, deportes, culturales, locales };
}
