// src/services/TablaEntradas.service.ts
import type { CartItem } from "@/components/carrito/filaEntrada";

/**
 * Define la estructura de una entrada individual como viene del API.
 */
interface ApiEntrada {
  id: string;
  Evento: string;
  ubicacion: string;
  TipoEntrada: string; // Ahora es un string, ej: "General", "VIP"
  precio: number;
  imagen: string;
}

/**
 * Procesa la lista de entradas individuales del API y las agrupa.
 * Entradas con el mismo Evento y TipoEntrada se combinan en un solo CartItem.
 */
function groupEntradas(entradas: ApiEntrada[]): CartItem[] {
  if (!entradas || entradas.length === 0) {
    return [];
  }

  const grouped = new Map<string, CartItem>();

  entradas.forEach((entrada) => {
    // Clave única para agrupar por evento Y tipo de entrada.
    const groupKey = `${entrada.Evento}-${entrada.TipoEntrada}-${entrada.ubicacion}`;

    if (grouped.has(groupKey)) {
      // Si ya existe, actualizamos cantidad y precio
      const existing = grouped.get(groupKey)!;
      existing.quantity += 1;
      existing.price += entrada.precio;
    } else {
      // Si es nuevo, creamos el objeto CartItem
      grouped.set(groupKey, {
        id: entrada.id, // Usamos el id de la primera entrada del grupo
        title: entrada.Evento,
        subtitle: `${entrada.ubicacion} - ${entrada.TipoEntrada}`, // Mostramos el nombre del tipo de entrada
        imageUrl: entrada.imagen,
        quantity: 1,
        price: entrada.precio,
      });
    }
  });

  return Array.from(grouped.values());
}

/**
 * Obtiene y procesa las entradas para la tabla de detalle.
 */
export async function fetchTablaEntradas() {
  const res = await fetch("/data/carritoComprar.json");
  const json = await res.json();
  return groupEntradas(json.data[0]?.entradas || []);
}