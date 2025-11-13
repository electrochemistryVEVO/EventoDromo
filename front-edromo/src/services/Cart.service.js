// Ruta: src/services/Cart.service.js
import { api } from "../lib/api";

const DEFAULT_EXPIRATION_MS = 10 * 60 * 1000;

const normalizeEndpoint = (value, fallback) => {
  const base = value || fallback;
  if (!base) return "";
  return base.startsWith("/") ? base : `/${base}`;
};

const CART_ENDPOINTS = {
  fetch: normalizeEndpoint(
    process.env.NEXT_PUBLIC_CART_FETCH_ENDPOINT,
    "Carrito/ObtenerCarrito",
  ),
  add: normalizeEndpoint(
    process.env.NEXT_PUBLIC_CART_ADD_ENDPOINT,
    "Carrito/AgregarItemAlCarrito",
  ),
  remove: normalizeEndpoint(
    process.env.NEXT_PUBLIC_CART_REMOVE_ENDPOINT,
    "Carrito/EliminarItemDelCarrito",
  ),
  sync: normalizeEndpoint(
    process.env.NEXT_PUBLIC_CART_SYNC_ENDPOINT,
    "Carrito/SincronizarCarrito", // O el nombre que le des en el backend
  ),
  // ¡NUEVO ENDPOINT!
  clear: normalizeEndpoint(
    process.env.NEXT_PUBLIC_CART_CLEAR_ENDPOINT,
    "Carrito/LimpiarCarrito", // O el nombre que le des en el backend
  ),

  removeTier: normalizeEndpoint(
    process.env.NEXT_PUBLIC_CART_REMOVE_TIER_ENDPOINT,
    "Carrito/EliminarTipoEntradaDelCarrito",
  ),
};

const generateFallbackId = () => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `cart-${Math.random().toString(36).slice(2)}`;
};

const ensureCartItemId = (item, fallbackPrefix) => {
  const candidate =
    item?.cartItemId ??
    item?.id ??
    item?.carritoDetalleId ??
    item?.idCarritoDetalle ??
    (fallbackPrefix ? `${fallbackPrefix}` : null);

  if (candidate) return candidate.toString();
  return generateFallbackId();
};

const normalizeEntrada = (entrada) => {
  if (!entrada || typeof entrada !== "object") {
    return {
      entradaId: null,
      tipoEntradaId: null,
      nombre: "Entrada",
      cantidad: 1,
      precioUnitario: 0,
    };
  }

  const precio = Number(entrada.precio ?? entrada.precioUnitario ?? 0);
  const cantidad = Number.isFinite(entrada.cantidad) && entrada.cantidad > 0
    ? Number(entrada.cantidad)
    : 1;

  return {
    entradaId: entrada.idEntrada ?? null,
    tipoEntradaId: entrada.idTipoEntrada ?? null,
    nombre: entrada.nombreTipoEntrada ?? "Entrada",
    cantidad,
    precioUnitario: Number.isFinite(precio) ? precio : 0,
    limiteCompra: Number(entrada.limiteCompra ?? 0),
  };
};

const computeTotalFromEntradas = (entradas = []) =>
  entradas.reduce((acc, entrada) => {
    const qty = Number(entrada.cantidad ?? 1);
    const price = Number(entrada.precioUnitario ?? 0);
    if (!Number.isFinite(qty) || !Number.isFinite(price)) {
      return acc;
    }
    return acc + qty * price;
  }, 0);

const ensureCartItemStructure = (evento, containerId, index = 0) => {
  if (!evento || typeof evento !== "object") {
    return {
      cartItemId: generateFallbackId(),
      eventoInfo: { id: null, nombre: "Evento", imagenUrl: "" },
      localInfo: { nombre: "", ciudad: "" },
      funcionInfo: { id: null, fecha: null, hora: null, fechaHora: null },
      entradas: [],
      totalItem: 0,
    };
  }

  const fallbackId = `${containerId}-${evento.idEvento ?? `evt-${index + 1}`}-${evento.funcionInfo?.id ?? `func-${index + 1}`
    }`;

  const cartItemId = ensureCartItemId(
    { cartItemId: evento.cartItemId },
    fallbackId,
  );

  const entradas = Array.isArray(evento.entradas)
    ? evento.entradas.map((entrada) => normalizeEntrada(entrada))
    : [];

  const totalItemFromDto = Number(evento.totalEvento);
  const totalItem = Number.isFinite(totalItemFromDto)
    ? totalItemFromDto
    : computeTotalFromEntradas(entradas);

  const fechaHora = evento.funcionInfo?.fechaHora ?? null;
  let fecha = null;
  let hora = null;

  if (fechaHora) {
    const parsed = new Date(fechaHora);
    if (!Number.isNaN(parsed.getTime())) {
      fecha = parsed.toISOString().slice(0, 10);
      hora = parsed.toISOString().slice(11, 16);
    }
  }

  return {
    cartItemId,
    eventoInfo: {
      id: evento.idEvento ?? null,
      nombre: evento.nombreEvento ?? "",
      imagenUrl: evento.imagenURL ?? "",
    },
    localInfo: {
      nombre: evento.localInfo?.nombre ?? "",
      ciudad: evento.localInfo?.ciudad ?? "",
    },
    funcionInfo: {
      id: evento.funcionInfo?.id ?? null,
      fecha,
      hora,
      fechaHora,
    },
    entradas,
    totalItem,
  };
};

const toIsoString = (value) => {
  if (!value) return null;
  if (typeof value === "string") return value;
  if (value instanceof Date) return value.toISOString();
  if (typeof value === "number") {
    const date = new Date(value);
    if (!Number.isNaN(date.getTime())) return date.toISOString();
  }
  return null;
};

const buildAddItemPayload = (cartItem, expirationTime) => {
  const fechaExpiracion = toIsoString(expirationTime);

  const aggregated = new Map();

  (cartItem?.entradas || []).forEach((entrada) => {
    const tipoEntradaIdRaw =
      entrada.tipoEntradaId ??
      entrada.idTipoEntrada ??
      entrada.tipoEntrada?.id ??
      null;
    const tipoEntradaId = Number(tipoEntradaIdRaw);
    if (!Number.isFinite(tipoEntradaId) || tipoEntradaId <= 0) {
      return;
    }
    const cantidad = Number(
      entrada.cantidad ??
      entrada.quantity ??
      entrada.cantidadTotal ??
      entrada.numeroEntradas ??
      0,
    );

    if (!Number.isFinite(cantidad) || cantidad <= 0) {
      return;
    }

    aggregated.set(
      tipoEntradaId,
      (aggregated.get(tipoEntradaId) ?? 0) + cantidad,
    );
  });

  const entradasCamel = Array.from(aggregated.entries()).map(
    ([tipoEntradaId, cantidad]) => ({
      idTipoEntrada: Number(tipoEntradaId),
      cantidad,
    }),
  );

  const payload = {
    entradas: entradasCamel,
    fechaExpiracion: fechaExpiracion || null,
  };

  return payload;
};

const parseExpiration = (value) => {
  if (!value) return null;
  if (typeof value === "number") return value;
  if (typeof value !== "string") return null;

  const dateObject = new Date(value);

  // Verificamos si la fecha creada es válida.
  // Si el string era inválido, `getTime()` devuelve NaN.
  if (Number.isNaN(dateObject.getTime())) {
    return null;
  }

  return dateObject.getTime();
};

const normalizeCartPayload = (raw) => {
  if (!raw) {
    return {
      items: [],
      expirationTime: null,
      cartId: null,
      totalCart: 0,
    };
  }

  const cartId = raw.idCarrito ?? null;
  const containerId = cartId ?? generateFallbackId();
  const eventos = Array.isArray(raw.eventos) ? raw.eventos : [];
  const items = eventos.map((evento, index) =>
    ensureCartItemStructure(evento, containerId, index),
  );

  const expirationTime = parseExpiration(raw.fechaExpiracion);
  const totalCartRaw = Number(raw.totalCarrito);
  const totalCart = Number.isFinite(totalCartRaw)
    ? totalCartRaw
    : items.reduce((acc, item) => acc + item.totalItem, 0);

  return {
    items,
    expirationTime,
    cartId,
    totalCart,
  };
};

const resolveAuthToken = () => {
  if (typeof window === "undefined") return null;

  try {
    const sessionRaw = window.sessionStorage?.getItem("session");
    if (sessionRaw) {
      const sessionData = JSON.parse(sessionRaw);
      if (sessionData?.token) return sessionData.token;
    }
  } catch (error) {
    console.warn("[Cart.service] No se pudo leer sessionStorage:", error);
  }

  try {
    const userRaw = window.localStorage?.getItem("user");
    if (userRaw) {
      const userData = JSON.parse(userRaw);
      if (userData?.token) return userData.token;
      if (userData?.authToken) return userData.authToken;
    }
  } catch (error) {
    console.warn("[Cart.service] No se pudo leer localStorage:", error);
  }

  return null;
};

const buildAuthHeaders = (token) => {
  const effectiveToken = token ?? resolveAuthToken();
  if (!effectiveToken || typeof effectiveToken !== "string") {
    return undefined;
  }
  const trimmed = effectiveToken.trim();
  if (!trimmed) {
    return undefined;
  }
  const hasBearerPrefix = /^bearer\s/i.test(trimmed);
  return {
    Authorization: hasBearerPrefix ? trimmed : `Bearer ${trimmed}`,
  };
};

export const fetchCartWithToken = async (token) => {
  const headers = buildAuthHeaders(token);
  const rawData = await api.get(
    CART_ENDPOINTS.fetch,
    headers ? { headers } : {},
  );

  const normalized = normalizeCartPayload(rawData);

  return {
    success: true,
    data: normalized,
  };
};

const mergeServerAndGuestItems = (serverItems = [], guestItems = []) => {
  const merged = new Map();

  serverItems.forEach((item) => {
    if (!item?.cartItemId) return;
    merged.set(item.cartItemId, item);
  });

  (guestItems || []).forEach((item) => {
    if (!item?.cartItemId) return;
    if (!merged.has(item.cartItemId)) {
      merged.set(item.cartItemId, item);
    }
  });

  return Array.from(merged.values());
};

export const mergeGuestCartWithDb = async (guestItems = [], token) => {
  // Esta función ahora será la encargada de la "materialización".
  // Su trabajo es enviar el carrito de invitado al backend para su validación.

  // 1. Construimos un payload similar al de 'addItemToDbCart' pero para múltiples items.
  const entradas = guestItems.flatMap(item =>
    buildAddItemPayload(item, null).entradas
  );

  if (entradas.length === 0) {
    // Si no había nada en el carrito de invitado, solo pedimos el carrito de la BD.
    return fetchCartWithToken(token);
  }

  const payload = {
    // El backend espera una lista de entradas a agregar.
    entradas,
  };

  try {
    const headers = buildAuthHeaders(token);
    // 2. Llamamos al nuevo endpoint de sincronización
    const response = await api.post(
      CART_ENDPOINTS.sync,
      payload,
      headers ? { headers } : {},
    );

    // 3. La respuesta del backend ya es el carrito final y validado.
    // La normalizamos y la devolvemos. El backend también podría devolver una lista de 'rechazados'.
    // Asumiremos que el backend devuelve un objeto con { carrito: {...}, rechazados: [...] }

    const normalized = normalizeCartPayload(response?.carrito ?? response);

    return {
      success: true,
      data: {
        ...normalized,
        // Adjuntamos los items rechazados para que el Context pueda notificar al usuario.
        rejectedItems: response?.rechazados ?? [],
      },
    };
  } catch (error) {
    console.error("[Cart.service] No se pudo sincronizar el carrito:", error);
    return {
      success: false,
      error: error.message || "No se pudo sincronizar el carrito",
    };
  }
};

export const addItemToDbCart = async (item, expirationTime, token) => {
  const payload = buildAddItemPayload(item, expirationTime);

  if (!payload.entradas.length) {
    return { success: false, error: "No hay entradas válidas para agregar" };
  }

  try {
    const headers = buildAuthHeaders(token);
    const response = await api.post(
      CART_ENDPOINTS.add,
      payload,
      headers ? { headers } : {},
    );

    // --- ¡AÑADE ESTA LÍNEA DE CORRECCIÓN! ---
    // Normalizamos la respuesta para asegurar que expirationTime es un número.
    const normalized = normalizeCartPayload(response ?? null);

    return {
      success: true,
      // Devolvemos los datos normalizados, no la respuesta cruda.
      data: normalized,
    };
  } catch (error) {
    console.error("[Cart.service] Error al agregar item:", error);
    return { success: false, error: error.message || "Error al agregar item al carrito" };
  }
};

export const removeItemFromDbCart = async (entradaId, token) => {
  const normalizedId = Number(entradaId);
  if (!Number.isFinite(normalizedId) || normalizedId <= 0) {
    return { success: false, error: "Id de entrada inválido" };
  }

  try {
    const headers = buildAuthHeaders(token);
    const response = await api.delete(
      `${CART_ENDPOINTS.remove}/${normalizedId}`,
      headers ? { headers } : {},
    );

    // --- ¡AÑADE ESTA LÍNEA DE CORRECCIÓN! ---
    // Normalizamos también aquí para mantener la consistencia.
    const normalized = normalizeCartPayload(response ?? null);

    return {
      success: true,
      // Devolvemos los datos normalizados.
      data: normalized,
    };
  } catch (error) {
    console.error("[Cart.service] Error al eliminar la entrada del carrito:", error);
    return { success: false, error: error.message || "No se pudo eliminar la entrada" };
  }
};

export const clearDbCart = async (token) => {
  try {
    const headers = buildAuthHeaders(token);
    // Usamos DELETE en un endpoint específico para limpiar el carrito.
    await api.delete(CART_ENDPOINTS.clear, headers ? { headers } : {});
    return { success: true };
  } catch (error) {
    console.error("[Cart.service] Error al limpiar el carrito de la BD:", error);
    return {
      success: false,
      error: error.message || "No se pudo limpiar el carrito",
    };
  }
};

export const removeEntireTierFromCart = async (cartItemId, tipoEntradaId, token) => {
  try {
    const normalizedTipoEntradaId = Number(tipoEntradaId);
    if (!Number.isFinite(normalizedTipoEntradaId) || normalizedTipoEntradaId <= 0) {
      return {
        success: false,
        error: "Id de tipo de entrada inválido"
      };
    }

    // Validar cartItemId
    if (!cartItemId || typeof cartItemId !== 'string') {
      return {
        success: false,
        error: "Id de carrito inválido"
      };
    }

    const headers = buildAuthHeaders(token);

    // Construir el payload para eliminar el grupo completo
    const payload = {
      cartItemId: cartItemId,
      tipoEntradaId: normalizedTipoEntradaId
    };

    console.log('🔍 Enviando payload para eliminar tier:', payload);

    // Realizar la llamada DELETE con payload en el body
    const response = await api.delete(
      CART_ENDPOINTS.removeTier,
      {
        body: payload, // Para axios, los DELETE pueden llevar data
        ...(headers ? { headers } : {})
      }
    );

    // Normalizar la respuesta
    const normalized = normalizeCartPayload(response ?? null);

    return {
      success: true,
      data: normalized,
    };

  } catch (error) {
    console.error("[Cart.service] Error al eliminar grupo del carrito:", error);

    // Manejar diferentes tipos de errores
    let errorMessage = "No se pudo eliminar el grupo de entradas";

    if (error.response) {
      // Error del servidor
      errorMessage = error.response.data?.message || errorMessage;
    } else if (error.request) {
      // Error de red
      errorMessage = "Error de conexión. Verifique su internet.";
    }

    return {
      success: false,
      error: errorMessage
    };
  }
};