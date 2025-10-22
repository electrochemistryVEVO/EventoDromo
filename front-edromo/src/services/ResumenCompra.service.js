// src/services/ResumenCompra.service.js

/**
 * Procesa la lista de entradas individuales del API y las agrupa para el resumen.
 * Entradas con el mismo Evento y TipoEntrada se combinan en un solo CartItem.
 * @param {Array} entradas - La lista de entradas individuales del API.
 * @returns {{items: Array, total: number}} - Un objeto con la lista de items agrupados y el total general.
 */
function groupEntradas(entradas) {
  if (!entradas || entradas.length === 0) {
    return { items: [], total: 0 };
  }

  const grouped = new Map();
  let totalGeneral = 0;

  entradas.forEach((entrada) => {
    totalGeneral += entrada.precio; // Suma el precio de cada entrada para el total general
    const groupKey = `${entrada.Evento}-${entrada.TipoEntrada}-${entrada.ubicacion}`;

    if (grouped.has(groupKey)) {
      const existing = grouped.get(groupKey);
      existing.quantity += 1;
      existing.price += entrada.precio; // 'price' ahora actúa como el subtotal
    } else {
      grouped.set(groupKey, {
        id: entrada.id, // Usamos el id de la primera entrada del grupo
        title: entrada.Evento,
        subtitle: `${entrada.ubicacion} - ${entrada.TipoEntrada}`,
        imageUrl: entrada.imagen,
        quantity: 1,
        price: entrada.precio,
      });
    }
  });

  return { items: Array.from(grouped.values()), total: totalGeneral };
}

/**
 * Obtiene y procesa las entradas para el componente ResumenCompra.
 */
export async function fetchResumenCompraItems() {
  const res = await fetch("/data/carritoComprar.json");
  if (!res.ok) {
    throw new Error("Failed to fetch cart summary");
  }
  const json = await res.json();
  const entradasApi = json.data[0]?.entradas || [];
  return groupEntradas(entradasApi);
}
