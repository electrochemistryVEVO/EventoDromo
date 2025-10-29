import { getEventos, getEventosPorTipo, getLocales } from '@/services/service.js';
import { useEffect } from 'react';

//NOTA: En lo posible, usar componentes de react-bootstrap en vez de usar las clases manualmente
//Usar las clases manualmente no implementa el javascript necesario para el funcionamiento de algunos elementos

/**
 * Controller que obtiene todos los datos necesarios para la página de lista de eventos.
 */
export async function obtenerDatosParaPagina() {
  // Hacemos todas las llamadas al servicio en paralelo para mayor eficiencia
  let destacados = [];
  let conciertos = [];
  let deportes = [];
  let culturales = [];
  let locales = [];
  [destacados, conciertos, deportes, culturales, locales] = [
    await getEventos(), // criterio de destacados pendiente
    await getEventosPorTipo(1),
    await getEventosPorTipo(2),
    await getEventosPorTipo(3),
    []//await getLocales(),
  ]
  let data = { destacados, conciertos, deportes, culturales, locales };
  console.log(data);
  return data;
}
