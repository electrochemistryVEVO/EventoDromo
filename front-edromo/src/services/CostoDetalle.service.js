// src/services/CostoDetalle.service.js

/**
 * Procesa la lista de entradas individuales del API y las agrupa por Evento y TipoEntrada.
 * @param {Array} entradas - La lista de entradas individuales del API.
 * @returns {Array} - Una lista de eventos agrupados con sus detalles de entradas.
 */
function agruparEntradasPorEvento(entradas) {
  if (!entradas || entradas.length === 0) {
    return [];
  }

  const eventosMap = new Map();

  // Agrupa primero por Evento, y luego por TipoEntrada
  for (const entrada of entradas) {
    if (!eventosMap.has(entrada.Evento)) {
      eventosMap.set(entrada.Evento, new Map());
    }
    const tipoEntradaMap = eventosMap.get(entrada.Evento);

    if (tipoEntradaMap.has(entrada.TipoEntrada)) {
      const existente = tipoEntradaMap.get(entrada.TipoEntrada);
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
  return Array.from(eventosMap.entries()).map(
    ([eventoNombre, tipoEntradaMap]) => ({
      eventoNombre,
      entradas: Array.from(tipoEntradaMap.values()),
    })
  );
}

export async function fetchCostoDetalle() {
  const res = await fetch("/data/carritoComprar.json");
  const json = await res.json();
  const entradasApi = json.data[0]?.entradas || [];
  return agruparEntradasPorEvento(entradasApi);
}
