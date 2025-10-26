// Ruta: src/services/CartApiService.js

// --- NO TOCAR (los usaremos en el futuro) ---
const API_BASE_URL = "/api/cart";
const getAuthToken = () => { /* ... */ };
const apiFetch = async (endpoint, options = {}) => { /* ... */ };
// ------------------------------------------


// --- SIMULACIÓN DE BACKEND ---

// 1. Nuestra "base de datos falsa" en memoria.
let mockDatabase = {
  items: [],
  expirationTime: null,
};

// 2. Función para simular el tiempo de espera de la red (ej. 300ms)
const simulateNetworkDelay = (ms = 300) => 
  new Promise(resolve => setTimeout(resolve, ms));

// --- Servicios Exportados (Versión Simulada) ---

/**
 * 1. Fusiona el carrito de invitado con el de la "BD".
 */
export const mergeGuestCartWithDb = async (guestItems) => {
  await simulateNetworkDelay();
  
  // Lógica de fusión simple: (sobrescribe el de la BD con el de invitado)
  // En un backend real, esta lógica sería más compleja.
  const mergedItems = new Map();
  mockDatabase.items.forEach(item => mergedItems.set(item.cartItemId, item));
  (guestItems || []).forEach(item => mergedItems.set(item.cartItemId, item));
  
  mockDatabase.items = Array.from(mergedItems.values());

  // Si hay items, establece una nueva expiración
  if (mockDatabase.items.length > 0) {
    mockDatabase.expirationTime = Date.now() + 10 * 60 * 1000;
  }
  
  console.log("[MOCK API] mergeGuestCartWithDb:", mockDatabase);
  
  return { 
    success: true, 
    data: { ...mockDatabase } // Devuelve una copia
  };
};

/**
 * 2. Agrega un nuevo item al carrito en la "BD".
 */
export const addItemToDbCart = async (item, expirationTime) => {
  await simulateNetworkDelay();
  
  // Simula un error de stock si el nombre lo incluye
  if (item.eventoInfo.nombre.toLowerCase().includes("agotado")) {
    console.warn("[MOCK API] addItemToDbCart: ¡Stock Agotado! (Simulado)");
    return { success: false, error: "Stock no disponible (Simulación)" };
  }

  // Agrega el item
  mockDatabase.items.push(item);
  // Actualiza la expiración
  mockDatabase.expirationTime = expirationTime;
  
  console.log("[MOCK API] addItemToDbCart:", mockDatabase);
  
  return { 
    success: true, 
    data: { ...mockDatabase } // Devuelve el carrito actualizado
  };
};

/**
 * 3. Elimina un item del carrito en la "BD".
 */
export const removeItemFromDbCart = async (cartItemId) => {
  await simulateNetworkDelay();
  
  mockDatabase.items = mockDatabase.items.filter(
    (item) => item.cartItemId !== cartItemId
  );
  
  // Si el carrito queda vacío, limpia la expiración
  if (mockDatabase.items.length === 0) {
    mockDatabase.expirationTime = null;
  }
  
  console.log("[MOCK API] removeItemFromDbCart:", mockDatabase);
  
  return { 
    success: true, 
    data: { ...mockDatabase } // Devuelve el carrito actualizado
  };
};

/**
 * 4. Vacía el carrito completo en la "BD".
 */
export const clearDbCart = async () => {
  await simulateNetworkDelay();
  
  mockDatabase = { items: [], expirationTime: null };
  
  console.log("[MOCK API] clearDbCart:", mockDatabase);
  
  // Tu CartContext espera 'success: true' y limpia el estado localmente
  return { success: true, data: null };
};