// src/services/CostoDetalle.service.ts

/**
 * Define la estructura de una entrada individual como viene del API.
 */
interface ApiEntrada {
  id: string;
  Evento: string;
  ubicacion: string;
  TipoEntrada: string; // Ahora es un string
  precio: number;
}

/**
 * Define la estructura de una fila de detalle para la vista.
 */
export interface DetalleEntrada {
  id: string; // Clave única para el tipo de entrada dentro del evento
  descripcion: string; // "General - Tipo 1"
  cantidad: number;
  costoUnitario: number;
  subtotal: number;
}

/**
 * Define la estructura de un grupo de evento para la vista.
 */
export interface EventoDetalle {
  eventoNombre: string;
  entradas: DetalleEntrada[];
}

/**
 * Procesa la lista de entradas individuales del API y las agrupa por Evento y TipoEntrada.
 */
function agruparEntradasPorEvento(entradas: ApiEntrada[]): EventoDetalle[] {
  if (!entradas || entradas.length === 0) {
    return [];
  }

  const eventosMap = new Map<string, Map<string, DetalleEntrada>>();

  // Agrupa primero por Evento, y luego por TipoEntrada
  for (const entrada of entradas) {
    if (!eventosMap.has(entrada.Evento)) {
      eventosMap.set(entrada.Evento, new Map<string, DetalleEntrada>());
    }
    const tipoEntradaMap = eventosMap.get(entrada.Evento)!;

    if (tipoEntradaMap.has(entrada.TipoEntrada)) {
      const existente = tipoEntradaMap.get(entrada.TipoEntrada)!;
      existente.cantidad += 1;
      existente.subtotal += entrada.precio;
    } else {
      tipoEntradaMap.set(entrada.TipoEntrada, {
        id: `${entrada.Evento}-${entrada.TipoEntrada}`,
        descripcion: entrada.TipoEntrada, // Usamos directamente el nombre del tipo
        cantidad: 1,
        costoUnitario: entrada.precio,
        subtotal: entrada.precio,
      });
    }
  }

  // Convierte el mapa anidado a la estructura final que espera la vista
  return Array.from(eventosMap.entries()).map(([eventoNombre, tipoEntradaMap]) => ({
    eventoNombre,
    entradas: Array.from(tipoEntradaMap.values()),
  }));
}

export async function fetchCostoDetalle(): Promise<EventoDetalle[]> {
  const res = await fetch("/data/carritoComprar.json");
  const json = await res.json();
  const entradasApi = json.data[0]?.entradas || [];
  return agruparEntradasPorEvento(entradasApi);
}