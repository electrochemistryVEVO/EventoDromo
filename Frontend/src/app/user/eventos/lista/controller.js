import { getEventos, getEventosPorTipo, getLocales } from '@/services/service.js';

//NOTA: En lo posible, usar componentes de react-bootstrap en vez de usar las clases manualmente
//Usar las clases manualmente no implementa el javascript necesario para el funcionamiento de algunos elementos

/**
 * Controller que obtiene todos los datos necesarios para la página de lista de eventos.
 */
export async function obtenerDatosParaPagina() {
  // Hacemos todas las llamadas al servicio en paralelo para mayor eficiencia
  const [destacados, conciertos, deportes, culturales, locales] = await Promise.all([
    getEventos(), // criterio de destacados pendiente
    getEventosPorTipo(1),
    getEventosPorTipo(2),
    getEventosPorTipo(3),
    getLocales(),
  ]);
  return { destacados, conciertos, deportes, culturales, locales };
}
