// CartContext.jsx
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
  const { user, isAuthenticated } = useUser();
  const [cartItems, setCartItems] = useState([]);
  const [expirationTime, setExpirationTime] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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
          guestItems = JSON.parse(guestCartJson);
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
        } else {
          console.error("Error al sincronizar carrito:", response.error);
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
  }, [isAuthenticated, user?.token]);
  
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
    // ¡CORRECCIÓN! Compara con 'cartItemId'
    const exists = cartItems.find((item) => item.cartItemId === entrada.cartItemId);
    if (exists) return;

    let newExpiration = expirationTime;
    if (cartItems.length === 0) {
      newExpiration = Date.now() + CART_EXPIRATION_MINUTES * 60 * 1000;
    }

    if (isAuthenticated) {
      setIsLoading(true);
      const token = resolveAuthToken();
      if (!token) {
        console.warn("[CartContext] No se pudo obtener token para agregar al carrito.");
        setIsLoading(false);
        return;
      }
      const response = await addItemToDbCart(entrada, newExpiration, token);
      if (response.success) {
        setCartItems(response.data.items);
        setExpirationTime(response.data.expirationTime);
      } else {
        console.error("Error al agregar item a la BD", response.error);
      }
      setIsLoading(false);
    } else {
      setCartItems((prev) => [...prev, entrada]);
      setExpirationTime(newExpiration);
    }
  };

  const removeEntryFromCart = async (
    { cartItemId, entradaId, tipoEntradaId } = {},
    { manageLoading = true } = {},
  ) => {
    if (!cartItemId && !entradaId) {
      return false;
    }

    if (isAuthenticated) {
      if (manageLoading) {
        setIsLoading(true);
      }
      const token = resolveAuthToken();
      if (!token) {
        console.warn("[CartContext] No se pudo obtener token para eliminar entrada.");
        if (manageLoading) {
          setIsLoading(false);
        }
        return false;
      }

      if (!entradaId) {
        console.warn("[CartContext] No se proporcionó idEntrada para eliminar.");
        if (manageLoading) {
          setIsLoading(false);
        }
        return false;
      }

      const response = await removeItemFromDbCart(entradaId, token);
      if (response.success) {
        setCartItems(response.data.items);
        setExpirationTime(response.data.expirationTime);
      } else {
        console.error("Error al eliminar entrada de la BD", response.error);
        if (manageLoading) {
          setIsLoading(false);
        }
        return false;
      }

      if (manageLoading) {
        setIsLoading(false);
      }
      return true;
    }

    let nextCartSnapshot = [];

    setCartItems((prev) => {
      const updated = prev
        .map((item) => {
          if (item.cartItemId !== cartItemId) {
            return item;
          }

          const entradasActualizadas = (item.entradas || [])
            .map((entrada) => {
              const tipoEntradaActual =
                entrada.tipoEntradaId ??
                entrada.idTipoEntrada ??
                entrada.tipoEntrada?.id ??
                null;

              if (
                tipoEntradaId == null ||
                tipoEntradaActual == null ||
                String(tipoEntradaActual) !== String(tipoEntradaId)
              ) {
                return entrada;
              }

              const cantidadActual = Number(
                entrada.cantidad ?? entrada.quantity ?? 0,
              );
              const nuevaCantidad = Math.max(0, cantidadActual - 1);

              return {
                ...entrada,
                cantidad: nuevaCantidad,
                quantity: nuevaCantidad,
              };
            })
            .filter((entrada) =>
              Number(entrada.cantidad ?? entrada.quantity ?? 0) > 0,
            );

          const totalItem = computeEntradasTotal(entradasActualizadas);

          return {
            ...item,
            entradas: entradasActualizadas,
            totalItem,
          };
        })
        .filter((item) => (item.entradas || []).length > 0);

      nextCartSnapshot = updated;
      return updated;
    });

    if (nextCartSnapshot.length === 0) {
      setExpirationTime(null);
    }

    return true;
  };

  const incrementEntryInCart = async (
    { cartItemId, tipoEntradaId } = {},
    { manageLoading = true } = {},
  ) => {
    if (!cartItemId || tipoEntradaId == null) {
      return false;
    }

    if (isAuthenticated) {
      if (manageLoading) {
        setIsLoading(true);
      }

      const token = resolveAuthToken();
      if (!token) {
        console.warn(
          "[CartContext] No se pudo obtener token para incrementar entrada.",
        );
        if (manageLoading) {
          setIsLoading(false);
        }
        return false;
      }

      const targetItem = cartItems.find(
        (item) => item.cartItemId === cartItemId,
      );
      if (!targetItem) {
        if (manageLoading) {
          setIsLoading(false);
        }
        return false;
      }

      const matchingEntrada = (targetItem.entradas || []).find((entrada) => {
        const currentTipo =
          entrada?.tipoEntradaId ??
          entrada?.idTipoEntrada ??
          entrada?.tipoEntrada?.id ??
          null;
        return currentTipo != null && String(currentTipo) === String(tipoEntradaId);
      });

      const tipoEntradaNumeric = Number(
        matchingEntrada?.tipoEntradaId ??
          matchingEntrada?.idTipoEntrada ??
          matchingEntrada?.tipoEntrada?.id ??
          tipoEntradaId,
      );

      if (!Number.isFinite(tipoEntradaNumeric) || tipoEntradaNumeric <= 0) {
        console.warn(
          "[CartContext] Tipo de entrada inválido al incrementar en BD.",
        );
        if (manageLoading) {
          setIsLoading(false);
        }
        return false;
      }

      const expirationTarget =
        expirationTime ?? Date.now() + CART_EXPIRATION_MINUTES * 60 * 1000;

      const payloadItem = {
        entradas: [
          {
            tipoEntradaId: tipoEntradaNumeric,
            cantidad: 1,
          },
        ],
      };

      const response = await addItemToDbCart(
        payloadItem,
        expirationTarget,
        token,
      );

      if (response.success) {
        setCartItems(response.data.items);
        setExpirationTime(response.data.expirationTime ?? expirationTarget);
        if (manageLoading) {
          setIsLoading(false);
        }
        return true;
      }

      console.error("Error al incrementar entrada en la BD", response.error);
      if (manageLoading) {
        setIsLoading(false);
      }
      return false;
    }

    let snapshot = null;

    setCartItems((prev) => {
      let cartMutated = false;

      const updated = prev.map((item) => {
        if (item.cartItemId !== cartItemId) {
          return item;
        }

        const entradasActuales = Array.isArray(item.entradas)
          ? item.entradas
          : [];

        let tierUpdated = false;

        const entradasIncrementadas = entradasActuales.map((entrada) => {
          const tipoEntradaActual =
            entrada?.tipoEntradaId ??
            entrada?.idTipoEntrada ??
            entrada?.tipoEntrada?.id ??
            null;

          if (
            tipoEntradaActual == null ||
            String(tipoEntradaActual) !== String(tipoEntradaId)
          ) {
            return entrada;
          }

          tierUpdated = true;
          cartMutated = true;

          const cantidadActual = Number(
            entrada.cantidad ?? entrada.quantity ?? 0,
          );
          const nuevaCantidad = Number.isFinite(cantidadActual)
            ? cantidadActual + 1
            : 1;

          return {
            ...entrada,
            cantidad: nuevaCantidad,
            quantity: nuevaCantidad,
          };
        });

        if (!tierUpdated) {
          return item;
        }

        const totalItem = computeEntradasTotal(entradasIncrementadas);

        return {
          ...item,
          entradas: entradasIncrementadas,
          totalItem,
        };
      });

      if (!cartMutated) {
        return prev;
      }

      snapshot = updated;
      return updated;
    });

    if (!snapshot) {
      return false;
    }

    if (!expirationTime) {
      setExpirationTime(Date.now() + CART_EXPIRATION_MINUTES * 60 * 1000);
    }

    return true;
  };

  const removeFromCart = async (cartItemId) => { // Recibe cartItemId
    if (isAuthenticated) {
      setIsLoading(true);
      const targetItem = cartItems.find((item) => item.cartItemId === cartItemId);
      if (!targetItem) {
        setIsLoading(false);
        return;
      }

      const entradas = Array.isArray(targetItem.entradas)
        ? targetItem.entradas
        : [];

      for (const entrada of entradas) {
        const tipoEntradaId =
          entrada?.tipoEntradaId ?? entrada?.idTipoEntrada ?? null;
        const entradaId =
          entrada?.entradaId ??
          entrada?.idEntrada ??
          entrada?.id ??
          null;

        const repeat = Math.max(
          1,
          Number(entrada?.cantidad ?? entrada?.quantity ?? 0) || 1,
        );

        for (let i = 0; i < repeat; i += 1) {
          const success = await removeEntryFromCart(
            { cartItemId, entradaId, tipoEntradaId },
            { manageLoading: false },
          );

          if (!success) {
            setIsLoading(false);
            return;
          }
        }
      }
      setIsLoading(false);
    } else {
      // --- ¡CORRECCIÓN AQUÍ! ---
      // Filtra por 'cartItemId' en lugar de 'id'
      const newCart = cartItems.filter((item) => item.cartItemId !== cartItemId);
      setCartItems(newCart);
      if (newCart.length === 0) {
        setExpirationTime(null);
      }
    }
  };

  const clearCart = async () => {
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
        console.error("Error al limpiar el carrito de la BD");
      }
      setIsLoading(false);
    } else {
      setCartItems([]);
      setExpirationTime(null);
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
    addToCart,
    removeFromCart,
    removeEntryFromCart,
    incrementEntryInCart,
    clearCart,
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