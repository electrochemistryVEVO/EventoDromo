// Ruta: src/services/CartApiService.js
// Ruta: src/services/CartApiService.js

// --- CONFIGURACIÓN DEL BACKEND ---
const RAW_API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.API_BASE_URL ||
  "http://localhost:5189/api";

const API_BASE_URL = RAW_API_BASE_URL.replace(/\/$/, "");

const CART_FETCH_ENDPOINT = (
  process.env.NEXT_PUBLIC_CART_FETCH_ENDPOINT ||
  "Carrito/ObtenerCarrito"
).replace(/^\/+/, "");

const CART_ADD_ENDPOINT = (
  process.env.NEXT_PUBLIC_CART_ADD_ENDPOINT ||
  "Carrito/AgregarItemAlCarrito"
).replace(/^\/+/, "");

const DEFAULT_EXPIRATION_MS = 10 * 60 * 1000;

const buildUrl = (endpoint) =>
  `${API_BASE_URL}/${endpoint.replace(/^\/+/, "")}`;

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
      tipoEntradaId: null,
      nombre: "Entrada",
      cantidad: 0,
      precioUnitario: 0,
    };
  }

  const cantidad = Number(
    entrada.cantidad ??
      entrada.quantity ??
      entrada.cantidadTotal ??
      entrada.numeroEntradas ??
      0,
  );

  const precioUnitarioRaw =
    entrada.precioUnitario ??
    entrada.precio ??
    entrada.precioPorUnidad ??
    (typeof entrada.precioTotal === "number" && cantidad
      ? entrada.precioTotal / cantidad
      : 0);

  return {
    ...entrada,
    tipoEntradaId:
      entrada.tipoEntradaId ??
      entrada.idTipoEntrada ??
      entrada.tipoEntrada?.id ??
      entrada.id ??
      null,
    nombre:
      entrada.nombre ??
      entrada.tipoEntradaNombre ??
      entrada.nombreTipoEntrada ??
      entrada.TipoEntrada ??
      entrada.tipoEntrada?.nombre ??
      "Entrada",
    cantidad,
    precioUnitario: Number(precioUnitarioRaw ?? 0),
  };
};

const computeTotalFromEntradas = (entradas) => {
  if (!Array.isArray(entradas)) return 0;
  return entradas.reduce((acc, entrada) => {
    const qty = Number(entrada.cantidad ?? 1);
    const price = Number(entrada.precioUnitario ?? entrada.precio ?? 0);
    if (!Number.isFinite(qty) || !Number.isFinite(price)) return acc;
    return acc + qty * price;
  }, 0);
};

const ensureCartItemStructure = (item, containerId) => {
  if (!item || typeof item !== "object") {
    return {
      cartItemId: generateFallbackId(),
      eventoInfo: { nombre: "Evento", imagenUrl: "" },
      localInfo: { nombre: "", ciudad: "" },
      funcionInfo: { id: null, fecha: null, hora: null },
      entradas: [],
      totalItem: 0,
    };
  }

  const entradasRaw = Array.isArray(item.entradas)
    ? item.entradas
    : Array.isArray(item.detalles)
      ? item.detalles
      : Array.isArray(item.detalleEntradas)
        ? item.detalleEntradas
        : [];

  const entradas = entradasRaw.map((entrada) => normalizeEntrada(entrada));

  const totalItem = Number.isFinite(item.totalItem)
    ? Number(item.totalItem)
    : Number.isFinite(item.precioTotal)
      ? Number(item.precioTotal)
      : computeTotalFromEntradas(entradas);

  const cartItemId = ensureCartItemId(item, containerId);

  const eventoRaw =
    item.eventoInfo ?? item.evento ?? item.eventoDetalle ?? item.detalleEvento ?? {};
  const localRaw = item.localInfo ?? item.local ?? item.localDetalle ?? {};
  const funcionRaw = item.funcionInfo ?? item.funcion ?? item.funcionDetalle ?? {};

  const eventoInfo = {
    id:
      eventoRaw.id ??
      eventoRaw.idEvento ??
      item.idEvento ??
      null,
    nombre:
      eventoRaw.nombre ??
      eventoRaw.nombreEvento ??
      item.nombreEvento ??
      "",
    imagenUrl:
      eventoRaw.imagenUrl ??
      eventoRaw.imagenURL ??
      eventoRaw.imagen ??
      item.imagenUrl ??
      item.imagenURL ??
      "",
  };

  const localInfo = {
    nombre:
      localRaw.nombre ??
      localRaw.localNombre ??
      item.nombreLocal ??
      "",
    ciudad:
      localRaw.ciudad ??
      localRaw.localCiudad ??
      item.ciudadLocal ??
      "",
  };

  let fecha = funcionRaw.fecha ?? item.fecha ?? null;
  let hora = funcionRaw.hora ?? item.hora ?? null;
  const fechaHoraRaw = funcionRaw.fechaHora ?? item.fechaHora ?? null;
  if (fechaHoraRaw) {
    if (typeof fechaHoraRaw === "string") {
      const trimmed = fechaHoraRaw.trim();
      if (!fecha && trimmed.length >= 10) {
        fecha = trimmed.slice(0, 10);
      }
      if (!hora && trimmed.length >= 16) {
        hora = trimmed.slice(11, 16);
      }
    } else {
      const parsed = new Date(fechaHoraRaw);
      if (!Number.isNaN(parsed.getTime())) {
        if (!fecha) {
          fecha = parsed.toISOString().slice(0, 10);
        }
        if (!hora) {
          hora = parsed.toISOString().slice(11, 16);
        }
      }
    }
  }

  const funcionInfo = {
    id:
      funcionRaw.id ??
      funcionRaw.idFuncion ??
      item.idFuncion ??
      null,
    fecha,
    hora,
    fechaHora:
      typeof fechaHoraRaw === "string"
        ? fechaHoraRaw
        : fechaHoraRaw instanceof Date
          ? fechaHoraRaw.toISOString()
          : fecha && hora
            ? `${fecha}T${hora}`
            : null,
  };

  return {
    ...item,
    cartItemId,
    eventoInfo,
    localInfo,
    funcionInfo,
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
  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? null : parsed;
};

const normalizeCartPayload = (raw) => {
  if (!raw) {
    return { items: [], expirationTime: null };
  }

  if (Array.isArray(raw)) {
    const aggregated = raw.map((entry) => normalizeCartPayload(entry));
    const items = aggregated.flatMap((entry) => entry.items);
    const expirationTime = aggregated.reduce((max, entry) => {
      if (!entry.expirationTime) return max;
      return Math.max(max, entry.expirationTime);
    }, 0);
    return {
      items,
      expirationTime: expirationTime || null,
    };
  }

  const expirationTime = parseExpiration(
    raw.expirationTime ?? raw.fechaExpiracion ?? raw.cartExpiration,
  );

  const itemsSource = Array.isArray(raw.items)
    ? raw.items
    : Array.isArray(raw.detalles)
      ? raw.detalles
      : Array.isArray(raw.detalleEntradas)
        ? raw.detalleEntradas
        : Array.isArray(raw.detalleCarrito)
          ? raw.detalleCarrito
          : null;

  let normalizedItems = [];

  if (itemsSource) {
    normalizedItems = itemsSource.map((item) =>
      ensureCartItemStructure(item, raw.id ?? raw.cartId ?? raw.idCarrito),
    );
  } else if (
    raw.eventoInfo ||
    raw.localInfo ||
    raw.funcionInfo ||
    (Array.isArray(raw.entradas) && raw.entradas.length > 0)
  ) {
    const fallbackItem = {
      cartItemId:
        raw.idDetalle ??
        raw.idCarritoDetalle ??
        raw.idCarrito ??
        raw.id ??
        undefined,
      eventoInfo: raw.eventoInfo,
      localInfo: raw.localInfo,
      funcionInfo: raw.funcionInfo,
      entradas: raw.entradas ?? [],
      totalItem: raw.totalItem ?? raw.totalCarrito ?? raw.precioTotal ?? null,
    };

    normalizedItems = [
      ensureCartItemStructure(fallbackItem, raw.idCarrito ?? raw.id),
    ];
  }

  return {
    items: normalizedItems,
    expirationTime,
    cartId: raw.idCarrito ?? raw.id ?? null,
  };
};

const getAuthToken = () => {
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

const apiFetch = async (endpoint, options = {}) => {
  const {
    token: explicitToken,
    headers: customHeaders,
    body,
    method = "GET",
    ...rest
  } = options;

  const rawToken = explicitToken ?? getAuthToken();
  const url = buildUrl(endpoint);

  const headers = new Headers(customHeaders || {});
  headers.set("Accept", "application/json");

  let requestBody = body;
  const isFormData =
    typeof FormData !== "undefined" && body instanceof FormData;
  const isBlob = typeof Blob !== "undefined" && body instanceof Blob;

  const isJsonBody =
    body &&
    typeof body === "object" &&
    !isFormData &&
    !isBlob;

  if (isJsonBody) {
    headers.set("Content-Type", "application/json");
    requestBody = JSON.stringify(body);
  }

  if (rawToken) {
    const normalizedToken = typeof rawToken === "string" ? rawToken.trim() : rawToken;
    if (typeof normalizedToken === "string" && normalizedToken.length > 0) {
      const hasBearerPrefix = /^bearer\s/i.test(normalizedToken);
      headers.set(
        "Authorization",
        hasBearerPrefix ? normalizedToken : `Bearer ${normalizedToken}`,
      );
    }
  }

  const response = await fetch(url, {
    method,
    body: requestBody,
    headers,
    cache: rest.cache ?? "no-store",
    ...rest,
  });

  const contentType = response.headers.get("Content-Type") || "";
  let payload = null;

  if (contentType.includes("application/json")) {
    payload = await response.json();
  } else {
    const text = await response.text();
    payload = text ? { mensaje: text } : null;
  }

  if (!response.ok) {
    const message =
      payload?.error ||
      payload?.mensaje ||
      `Error HTTP ${response.status}`;
    throw new Error(message);
  }

  return payload;
};

export const fetchCartWithToken = async (token) => {
  const response = await apiFetch(CART_FETCH_ENDPOINT, {
    method: "GET",
    token,
  });

  if (response?.success === false) {
    throw new Error(
      response.error || response.mensaje || "Error en el servicio de carrito",
    );
  }

  const normalized = normalizeCartPayload(response?.data ?? response ?? null);

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
  try {
    const { data } = await fetchCartWithToken(token);

    const mergedItems = mergeServerAndGuestItems(
      data.items,
      guestItems,
    );

    const expirationTime =
      data.expirationTime ??
      (mergedItems.length > 0
        ? Date.now() + DEFAULT_EXPIRATION_MS
        : null);

    return {
      success: true,
      data: {
        items: mergedItems,
        expirationTime,
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
    return {
      success: false,
      error: "No hay entradas válidas para agregar",
    };
  }

  console.log("[Cart.service] Payload agregar item:", {
    endpoint: CART_ADD_ENDPOINT,
    body: payload,
  });

  try {
    const response = await apiFetch(CART_ADD_ENDPOINT, {
      method: "POST",
      body: payload,
      token,
    });

    if (response?.success === false) {
      return {
        success: false,
        error:
          response.error ||
          response.mensaje ||
          "Error en el servicio de carrito",
      };
    }

    const normalized = normalizeCartPayload(
      response?.data ?? response ?? null,
    );

    return {
      success: true,
      data: normalized,
    };
  } catch (error) {
    console.error("[Cart.service] Error al agregar item:", error);
    return {
      success: false,
      error: error.message || "Error al agregar item al carrito",
    };
  }
};

export const removeItemFromDbCart = async (_cartItemId, _token) => ({
  success: false,
  error: "Servicio para eliminar items no implementado",
});

export const clearDbCart = async (_token) => ({
  success: false,
  error: "Servicio para limpiar el carrito no implementado",
});