// src/context/CartContext.jsx
"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { useUser } from "./UserContext";
import {
  mergeGuestCartWithDb,
  addItemToDbCart,
  removeItemFromDbCart,
  clearDbCart,
} from "@/services/Cart.service";

const CART_EXPIRATION_MINUTES = 10;
const CartContext = createContext();

const computeEntradasTotal = (entradas = []) =>
  entradas.reduce((acc, entrada) => {
    const qty = Number(entrada?.cantidad ?? entrada?.quantity ?? 0) || 0;
    const price = Number(
      entrada?.precioUnitario ??
      entrada?.precio ??
      entrada?.precioPorUnidad ??
      0,
    );
    return acc + qty * price;
  }, 0);

export const CartProvider = ({ children }) => {
  const { user, isAuthenticated, logout } = useUser();
  const [cartItems, setCartItems] = useState([]);
  const [expirationTime, setExpirationTime] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [syncingItemIds, setSyncingItemIds] = useState(new Set());

  const normalizeToken = (rawToken) => {
    if (typeof rawToken !== "string") return null;
    const trimmed = rawToken.trim();
    if (!trimmed || trimmed.toLowerCase() === "null") return null;
    return trimmed;
  };

  const resolveAuthToken = () => {
    const userToken = normalizeToken(user?.token);
    if (userToken) return userToken;

    if (typeof window === "undefined") {
      return null;
    }

    try {
      const sessionRaw = window.sessionStorage?.getItem("session");
      if (sessionRaw) {
        const sessionData = JSON.parse(sessionRaw);
        const sessionToken = normalizeToken(sessionData?.token);
        if (sessionToken) {
          return sessionToken;
        }
      }
    } catch (error) {
      console.warn("[CartContext] No se pudo leer sessionStorage", error);
    }

    try {
      const userRaw = window.localStorage?.getItem("user");
      if (userRaw) {
        const userData = JSON.parse(userRaw);
        const storedToken = normalizeToken(userData?.token);
        if (storedToken) {
          return storedToken;
        }
        const legacyToken = normalizeToken(userData?.authToken);
        if (legacyToken) {
          return legacyToken;
        }
      }
    } catch (error) {
      console.warn("[CartContext] No se pudo leer localStorage", error);
    }

    return null;
  };

  // ... (tu useEffect de "EL CEREBRO" [isAuthenticated] está bien) ...
  useEffect(() => {
    const loadCart = async () => {
      setIsLoading(true);
      if (isAuthenticated) {
        // --- USUARIO LOGUEADO ---
        console.log("Usuario logueado, sincronizando carrito...");
        const guestCartJson = localStorage.getItem("cart");
        let guestItems = [];
        if (guestCartJson) {
          try {
            guestItems = JSON.parse(guestCartJson);
          } catch {
            console.warn("No se pudo parsear el carrito de invitado.");
          }
        }

        const token = resolveAuthToken();
        if (!token) {
          console.warn("[CartContext] Usuario autenticado sin token disponible. Omitiendo sincronización con backend.");
          setCartItems([]);
          setExpirationTime(null);
          setIsLoading(false);
          return;
        }

        const response = await mergeGuestCartWithDb(guestItems, token);

        if (response.success) {
          setCartItems(response.data.items);
          setExpirationTime(response.data.expirationTime);
          localStorage.removeItem("cart");
          localStorage.removeItem("cartExpiration");
          console.log("Carrito sincronizado con la BD.");

          if (response.data.rejectedItems && response.data.rejectedItems.length > 0) {
            const nombresRechazados = response.data.rejectedItems.map(item => item.nombre).join(', ');
            const mensaje = `Algunas entradas no se pudieron agregar por falta de stock: ${nombresRechazados}.`;
            console.warn(mensaje);
            // Idealmente, mostrar una notificación "toast"
            // toast.error(mensaje, { duration: 6000 });
            alert(mensaje); // Usamos alert como fallback simple.
          }

        } else {
          console.error("Error al sincronizar carrito:", response.error);
          const unauthorized = /401|unauthorized|no autorizado/i.test(
            response.error || "",
          );
          if (unauthorized && typeof logout === "function") {
            console.warn(
              "[CartContext] Sesión inválida al sincronizar carrito. Cerrando sesión y usando modo invitado.",
            );
            logout();
            setIsLoading(false);
            return;
          }
          setCartItems([]);
          setExpirationTime(null);
        }
      } else {
        // --- USUARIO INVITADO ---
        console.log("Usuario invitado, cargando desde localStorage...");
        const savedCart = localStorage.getItem("cart");
        const savedExpiration = localStorage.getItem("cartExpiration");

        if (savedExpiration) {
          const expiryTimestamp = Number(savedExpiration);
          if (Date.now() > expiryTimestamp) {
            localStorage.removeItem("cart");
            localStorage.removeItem("cartExpiration");
            setCartItems([]);
            setExpirationTime(null);
          } else {
            setExpirationTime(expiryTimestamp);
            setCartItems(savedCart ? JSON.parse(savedCart) : []);
          }
        } else {
          setCartItems([]);
          setExpirationTime(null);
        }
      }
      setIsLoading(false);
    };

    loadCart();
  }, [isAuthenticated, user?.token, logout]);

  // Este es el núcleo de la solución. Centraliza toda la lógica del timer.
  useEffect(() => {
    // Solo nos importa este efecto para usuarios invitados.
    if (!isAuthenticated) {
      if (cartItems.length > 0 && !expirationTime) {
        // CASO 1: Hay items en el carrito, pero no hay timer. ¡Inícialo!
        setExpirationTime(Date.now() + CART_EXPIRATION_MINUTES * 60 * 1000);
      } else if (cartItems.length === 0 && expirationTime) {
        // CASO 2: No hay items, pero el timer sigue activo. ¡Bórralo!
        setExpirationTime(null);
      }
    }
    // Este efecto se ejecuta cada vez que el carrito cambia.
  }, [cartItems, isAuthenticated, expirationTime]);

  // ... (tus useEffect de persistencia y vigilante están bien) ...
  // --- EFECTOS DE PERSISTENCIA (SOLO PARA INVITADOS) ---
  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem("cart", JSON.stringify(cartItems));
    }
  }, [cartItems, isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) {
      if (expirationTime) {
        localStorage.setItem("cartExpiration", expirationTime.toString());
      } else {
        localStorage.removeItem("cartExpiration");
      }
    }
  }, [expirationTime, isAuthenticated]);

  // Efecto "vigilante"
  useEffect(() => {
    if (expirationTime) {
      const interval = setInterval(() => {
        if (Date.now() > expirationTime) {
          console.log("El carrito ha expirado. Limpiando...");
          clearCart();
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [expirationTime]);

  // --- FUNCIONES DE MUTACIÓN "INTELIGENTES" ---

  const addToCart = async (entrada) => {
    const exists = cartItems.find((item) => item.cartItemId === entrada.cartItemId);
    if (exists) return;

    if (isAuthenticated) {
      // La lógica para el usuario logueado no cambia.
      setIsLoading(true);
      const token = resolveAuthToken();
      if (!token) {
        console.warn("[CartContext] No se pudo obtener token para agregar al carrito.");
        setIsLoading(false);
        return;
      }
      // Se calcula la expiración aquí porque el backend la necesita.
      const newExpiration = expirationTime || Date.now() + CART_EXPIRATION_MINUTES * 60 * 1000;
      const response = await addItemToDbCart(entrada, newExpiration, token);
      if (response.success) {
        setCartItems(response.data.items);
        setExpirationTime(response.data.expirationTime);
      } else {
        console.error("Error al agregar item a la BD", response.error);
      }
      setIsLoading(false);
    } else {
      // --- LÓGICA DE INVITADO SIMPLIFICADA ---
      // Se eliminó toda la lógica de 'newExpiration' y 'setExpirationTime'.
      // Ahora, solo nos preocupamos de añadir el item. El nuevo useEffect se encargará del timer.
      setCartItems((prev) => [...prev, entrada]);
    }
  };

  const removeEntryFromCart = async (
    { cartItemId, entradaId, tipoEntradaId } = {},
    { manageLoading = true } = {},
  ) => {
    if (syncingItemIds.has(cartItemId)) {
      return false;
    }

    if (isAuthenticated) {
      // ✅ ELIMINADO: La lógica optimista completa
      setSyncingItemIds((prev) => new Set(prev).add(cartItemId));

      try {
        const token = resolveAuthToken();
        if (!token) {
          throw new Error("No se pudo obtener el token para eliminar la entrada.");
        }

        let resolvedEntradaId = entradaId;
        if (!resolvedEntradaId) {
          const targetItem = cartItems.find((item) => item.cartItemId === cartItemId);
          const matchingEntrada = targetItem?.entradas?.find((entrada) => {
            const currentTipo = entrada?.tipoEntradaId ?? entrada?.idTipoEntrada ?? entrada?.tipoEntrada?.id ?? entrada?.id ?? null;
            return (currentTipo != null && (tipoEntradaId == null || String(currentTipo) === String(tipoEntradaId)));
          }) ?? targetItem?.entradas?.[0];
          resolvedEntradaId = matchingEntrada?.entradaId ?? matchingEntrada?.idEntrada ?? matchingEntrada?.id ?? null;
        }

        if (!resolvedEntradaId) {
          throw new Error("No se pudo resolver el idEntrada para eliminar.");
        }

        const response = await removeItemFromDbCart(resolvedEntradaId, token);

        // ✅ SOLO actualizamos con la respuesta del backend
        setCartItems(response.data.items);
        setExpirationTime(response.data.expirationTime);

        return true;

      } catch (error) {
        console.error("Error al eliminar entrada:", error);
        if (manageLoading) {
          alert("No se pudo disminuir la cantidad. Inténtalo de nuevo.");
        }
        // ❌ NO hay reversión porque nunca actualizamos optimistamente
        return false;
      } finally {
        setSyncingItemIds((prev) => {
          const newSet = new Set(prev);
          newSet.delete(cartItemId);
          return newSet;
        });
      }

    } else {
      // La lógica de invitado no cambia.
      setCartItems((prev) =>
        prev
          .map((item) => {
            if (item.cartItemId !== cartItemId) {
              return item;
            }
            const entradasActualizadas = (item.entradas || [])
              .map((entrada) => {
                const tipoEntradaActual = entrada.tipoEntradaId ?? entrada.idTipoEntrada ?? entrada.tipoEntrada?.id ?? null;
                if (tipoEntradaId == null || tipoEntradaActual == null || String(tipoEntradaActual) !== String(tipoEntradaId)) {
                  return entrada;
                }
                const cantidadActual = Number(entrada.cantidad ?? entrada.quantity ?? 0);
                const nuevaCantidad = Math.max(0, cantidadActual - 1);
                return { ...entrada, cantidad: nuevaCantidad, quantity: nuevaCantidad };
              })
              .filter((entrada) => Number(entrada.cantidad ?? entrada.quantity ?? 0) > 0);
            const totalItem = computeEntradasTotal(entradasActualizadas);
            return { ...item, entradas: entradasActualizadas, totalItem };
          })
          .filter((item) => (item.entradas || []).length > 0)
      );
      return true;
    }
  };

  const incrementEntryInCart = async (
    { cartItemId, tipoEntradaId } = {},
    { manageLoading = true } = {},
  ) => {
    if (!cartItemId || tipoEntradaId == null) {
      return false;
    }

    if (syncingItemIds.has(cartItemId)) {
      return false;
    }

    if (isAuthenticated) {
      // ✅ ELIMINADO: La lógica optimista completa
      setSyncingItemIds((prev) => new Set(prev).add(cartItemId));

      try {
        const token = resolveAuthToken();
        if (!token) throw new Error("No se pudo obtener el token.");

        const tipoEntradaNumeric = Number(tipoEntradaId);
        if (!Number.isFinite(tipoEntradaNumeric) || tipoEntradaNumeric <= 0) throw new Error("Tipo de entrada inválido.");

        const expirationTarget = expirationTime || Date.now() + CART_EXPIRATION_MINUTES * 60 * 1000;
        const payloadItem = { entradas: [{ tipoEntradaId: tipoEntradaNumeric, cantidad: 1 }] };
        const response = await addItemToDbCart(payloadItem, expirationTarget, token);

        // ✅ SOLO actualizamos con la respuesta del backend
        setCartItems(response.data.items);
        setExpirationTime(response.data.expirationTime ?? expirationTarget);

        return true;

      } catch (error) {
        console.error("Error al incrementar entrada:", error);
        if (manageLoading) {
          alert("No se pudo aumentar la cantidad. Es posible que no haya más stock.");
        }
        // ❌ NO hay reversión porque nunca actualizamos optimistamente
        return false;
      } finally {
        setSyncingItemIds((prev) => {
          const newSet = new Set(prev);
          newSet.delete(cartItemId);
          return newSet;
        });
      }

    } else {
      // La lógica de invitado no cambia.
      setCartItems((prev) => prev.map((item) => {
        if (item.cartItemId !== cartItemId) return item;
        const entradasIncrementadas = (item.entradas || []).map((entrada) => {
          const tipoEntradaActual = entrada.tipoEntradaId ?? entrada.idTipoEntrada ?? entrada.tipoEntrada?.id ?? null;
          if (tipoEntradaActual == null || String(tipoEntradaActual) !== String(tipoEntradaId)) return entrada;
          const cantidadActual = Number(entrada.cantidad ?? entrada.quantity ?? 0);
          return { ...entrada, cantidad: cantidadActual + 1, quantity: cantidadActual + 1 };
        });
        return { ...item, entradas: entradasIncrementadas, totalItem: computeEntradasTotal(entradasIncrementadas) };
      }));
      return true;
    }
  };

  const removeFromCart = async (cartItemId) => {
    // Si el item ya se está sincronizando, ignoramos la acción.
    if (syncingItemIds.has(cartItemId)) {
      return;
    }

    if (isAuthenticated) {
      // Marcamos el item como "sincronizando".
      setSyncingItemIds((prev) => new Set(prev).add(cartItemId));

      try {
        const targetItem = cartItems.find((item) => item.cartItemId === cartItemId);
        if (!targetItem) {
          console.warn("El artículo a eliminar no se encontró en el carrito.");
          return;
        }

        // Eliminar todas las entradas del item llamando a removeEntryFromCart
        const entradas = Array.isArray(targetItem.entradas) ? targetItem.entradas : [];

        // Usamos Promise.all para esperar a que todas las eliminaciones terminen
        const deletePromises = [];

        for (const entrada of entradas) {
          const tipoEntradaId = entrada?.tipoEntradaId ?? entrada?.idTipoEntrada ?? null;
          const entradaId = entrada?.entradaId ?? entrada?.idEntrada ?? entrada?.id ?? null;
          const repeat = Math.max(1, Number(entrada?.cantidad ?? entrada?.quantity ?? 0) || 1);

          for (let i = 0; i < repeat; i += 1) {
            deletePromises.push(
              removeEntryFromCart({ cartItemId, entradaId, tipoEntradaId }, { manageLoading: false })
            );
          }
        }

        // Esperar a que todas las eliminaciones se completen
        const results = await Promise.allSettled(deletePromises);

        // Verificar si alguna eliminación falló
        const hasFailures = results.some(result => result.status === 'rejected');
        if (hasFailures) {
          throw new Error("Algunas entradas no se pudieron eliminar del carrito.");
        }

        // ✅ El estado ya se actualizó automáticamente mediante las llamadas a removeEntryFromCart
        // No necesitamos hacer setCartItems aquí

      } catch (error) {
        console.error("Error al eliminar item del carrito:", error);
        alert("No se pudo eliminar el artículo del carrito.");
        // ❌ NO revertimos porque nunca actualizamos optimistamente
      } finally {
        // Desbloqueamos el item sin importar el resultado.
        setSyncingItemIds((prev) => {
          const newSet = new Set(prev);
          newSet.delete(cartItemId);
          return newSet;
        });
      }

    } else {
      // La lógica de invitado no cambia.
      setCartItems((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
    }
  };

  const clearCart = async () => {
    // La lógica para el usuario logueado no cambia.
    if (isAuthenticated) {
      setIsLoading(true);
      const token = resolveAuthToken();
      if (!token) {
        console.warn("[CartContext] No se pudo obtener token para vaciar el carrito.");
        setIsLoading(false);
        return;
      }
      const response = await clearDbCart(token);
      if (response.success) {
        setCartItems([]);
        setExpirationTime(null);
      } else {
        console.error("Error al limpiar el carrito de la BD", response.error);
      }
      setIsLoading(false);
    } else {
      // --- LÓGICA DE INVITADO SIMPLIFICADA ---
      // Se eliminó la línea 'setExpirationTime(null)'.
      // Ahora solo actualizamos los items. El useEffect se encargará del timer.
      setCartItems([]);
    }
  };

  const addTicketsToCart = async (ticketsInfo) => {
    // Evitar duplicados durante la sincronización
    if (syncingItemIds.has(ticketsInfo.cartItemId)) {
      return;
    }

    if (isAuthenticated) {
      setSyncingItemIds((prev) => new Set(prev).add(ticketsInfo.cartItemId));

      try {
        const token = resolveAuthToken();
        if (!token) throw new Error("No se pudo obtener el token.");

        const expirationTarget = expirationTime || Date.now() + CART_EXPIRATION_MINUTES * 60 * 1000;

        // ✅ SOLUCIÓN: Esperar DIRECTAMENTE al backend SIN actualización optimista
        const response = await addItemToDbCart(ticketsInfo, expirationTarget, token);

        // ✅ Actualizar SOLO con la respuesta del backend
        setCartItems(response.data.items);
        setExpirationTime(response.data.expirationTime ?? expirationTarget);

      } catch (error) {
        console.error("Error al agregar entradas:", error);
        alert("No se pudieron agregar las entradas al carrito.");
      } finally {
        setSyncingItemIds((prev) => {
          const newSet = new Set(prev);
          newSet.delete(ticketsInfo.cartItemId);
          return newSet;
        });
      }

    } else {
      // Lógica de invitado (sin cambios)
      setCartItems((prevCartItems) => {
        const existingItem = prevCartItems.find(item =>
          item.eventoInfo.id === ticketsInfo.eventoInfo.id &&
          item.funcionInfo.id === ticketsInfo.funcionInfo.id
        );

        if (existingItem) {
          return prevCartItems.map(item => {
            if (item.cartItemId !== existingItem.cartItemId) return item;
            const existingEntradasMap = new Map(item.entradas.map(e => [e.tipoEntradaId, e]));
            ticketsInfo.entradas.forEach(newEntrada => {
              if (existingEntradasMap.has(newEntrada.tipoEntradaId)) {
                existingEntradasMap.get(newEntrada.tipoEntradaId).cantidad += newEntrada.cantidad;
              } else {
                existingEntradasMap.set(newEntrada.tipoEntradaId, newEntrada);
              }
            });
            const mergedEntradas = Array.from(existingEntradasMap.values());
            return { ...item, entradas: mergedEntradas, totalItem: computeEntradasTotal(mergedEntradas) };
          });
        } else {
          return [...prevCartItems, ticketsInfo];
        }
      });
    }
  };

  // --- VALORES CALCULADOS ---

  // --- ¡CORRECCIÓN AQUÍ! ---
  // Usa 'totalItem' de tu nueva estructura, no 'precio'
  const totalPrice = cartItems.reduce((acc, item) => acc + item.totalItem, 0);
  const itemCount = cartItems.length;

  const value = {
    cartItems,
    expirationTime,
    totalPrice,
    itemCount,
    isLoading,
    syncingItemIds,
    addToCart,
    removeFromCart,
    removeEntryFromCart,
    incrementEntryInCart,
    clearCart,
    addTicketsToCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart debe usarse dentro de un CartProvider");
  }
  return context;
};