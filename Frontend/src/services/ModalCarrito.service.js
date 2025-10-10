// src/services/ModalCarrito.service.js

/**
 * Obtiene los datos del carrito desde el backend (simulado con un JSON).
 * Esta función ahora es la única fuente de verdad para los datos del carrito.
 *
 * @returns {Promise<{success: boolean, data: object|null, error?: string}>}
 *          Retorna un objeto con el estado de la petición y los datos del carrito.
 *          - En caso de éxito con carrito: { success: true, data: { id, ..., entradas: [...] } }
 *          - En caso de éxito sin carrito: { success: true, data: null }
 *          - En caso de error: { success: false, error: "Mensaje de error" }
 */
export async function fetchCart() {
  try {
    // Simulamos que a veces el carrito está vacío y a veces no.
    // En una app real, la URL sería siempre la misma.
    const url = Math.random() > 0.5 ? "/data/carrito.json" : "/data/carritoVacio.json";
    console.log(`Fetching cart from: ${url}`); // Para depuración
    
    const res = await fetch(url);
    if (!res.ok) throw new Error("Error cargando el carrito");

    const json = await res.json();
    if (!json.success) {
      throw new Error(json.error || json.mensaje || "Error desconocido del API");
    }

    // La respuesta del backend ya es el estado que necesitamos.
    return { success: true, data: json.data };

  } catch (error) {
    console.error("No se pudo obtener el carrito:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Simula la eliminación de un item. En una app real, esto haría una petición
 * al backend (por ejemplo, un DELETE a /api/carrito/entradas/{id}).
 * @param {string} itemId - El ID de la entrada a eliminar.
 */
export async function removeCartItem(itemId) {
  console.log(`Simulando eliminación del item ${itemId}...`);
  // Aquí iría la lógica de fetch (DELETE, POST, etc.)
  // Por ahora, solo retornamos éxito para que la UI pueda re-validar.
  return { success: true };
}
