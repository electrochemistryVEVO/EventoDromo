// src/context/CartContext.jsx
"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { useUser } from "./UserContext";
import { showError, showWarning } from "@/components/Notifications/toast";
import {
  mergeGuestCartWithDb,
  addItemToDbCart,
  removeItemFromDbCart,
  clearDbCart,
  removeEntireTierFromCart,
} from "@/services/Cart.service";
import { obtenerConfiguracion } from "@/services/config.service";

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
  const [cartExpirationMinutes, setCartExpirationMinutes] = useState(30); // Default 30 minutos

  // Cargar configuración del sistema al iniciar
  useEffect(() => {
    const loadConfig = async () => {
      try {
        const response = await obtenerConfiguracion();
        if (response.success && response.data) {
          setCartExpirationMinutes(response.data.minutosVigenciaCarrito || 30);
          console.log(`[CartContext] Configuración cargada: ${response.data.minutosVigenciaCarrito} minutos de vigencia del carrito`);
        }
      } catch (error) {
        console.warn("[CartContext] No se pudo cargar la configuración, usando valores por defecto:", error);
      }
    };
    loadConfig();
  }, []);

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
            showWarning(mensaje, { duration: 6000 });
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
        setExpirationTime(Date.now() + cartExpirationMinutes * 60 * 1000);
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
      const newExpiration = expirationTime || Date.now() + cartExpirationMinutes * 60 * 1000;
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
    // ✅ FIX RACE CONDITION: Usar clave más granular
    const syncKey = `${cartItemId}-${tipoEntradaId ?? entradaId ?? 'remove'}`;
    if (syncingItemIds.has(syncKey)) {
      console.log(`[CartContext] Request bloqueado: ${syncKey} ya en proceso`);
      return false;
    }

    if (isAuthenticated) {
      setSyncingItemIds((prev) => new Set(prev).add(syncKey));

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
          showError("No se pudo disminuir la cantidad. Inténtalo de nuevo.");
        }
        // ❌ NO hay reversión porque nunca actualizamos optimistamente
        return false;
      } finally {
        setSyncingItemIds((prev) => {
          const newSet = new Set(prev);
          newSet.delete(syncKey); // ✅ Usar syncKey en lugar de cartItemId
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

    // ✅ FIX RACE CONDITION: Usar clave más granular (cartItemId + tipoEntradaId)
    const syncKey = `${cartItemId}-${tipoEntradaId}`;
    if (syncingItemIds.has(syncKey)) {
      console.log(`[CartContext] Request bloqueado: ${syncKey} ya en proceso`);
      return false;
    }

    // ✅ VALIDAR LÍMITE DE COMPRA ANTES de llamar al backend
    // ✅ CONTAR CORRECTAMENTE: Buscar en TODO el carrito cuántas entradas de este tipo ya hay
    let cantidadTotalEnCarrito = 0;
    let limiteCompra = 0;
    let nombreEntrada = 'entradas';
    
    for (const item of cartItems) {
      for (const entrada of (item.entradas || [])) {
        const entradaTipoId = entrada.tipoEntradaId ?? entrada.idTipoEntrada;
        if (String(entradaTipoId) === String(tipoEntradaId)) {
          cantidadTotalEnCarrito += Number(entrada.cantidad ?? entrada.quantity ?? 0);
          limiteCompra = Number(entrada.limiteCompra ?? 0);
          nombreEntrada = entrada.nombre || 'entradas';
        }
      }
    }

    console.log(`🔍 [incrementEntryInCart] Validación para ${nombreEntrada}:`, {
      cantidadTotalEnCarrito,
      limiteCompra,
      alcanzaLimite: limiteCompra > 0 && cantidadTotalEnCarrito >= limiteCompra
    });
    
    if (limiteCompra > 0 && cantidadTotalEnCarrito >= limiteCompra) {
      if (manageLoading) {
        showWarning(`Has alcanzado el límite de compra de "${nombreEntrada}" (máximo ${limiteCompra} entradas)`);
      }
      return false;
    }

    if (isAuthenticated) {
      setSyncingItemIds((prev) => new Set(prev).add(syncKey));

      try {
        const token = resolveAuthToken();
        if (!token) throw new Error("No se pudo obtener el token.");

        const tipoEntradaNumeric = Number(tipoEntradaId);
        if (!Number.isFinite(tipoEntradaNumeric) || tipoEntradaNumeric <= 0) throw new Error("Tipo de entrada inválido.");

        const expirationTarget = expirationTime || Date.now() + cartExpirationMinutes * 60 * 1000;
        const payloadItem = { entradas: [{ tipoEntradaId: tipoEntradaNumeric, cantidad: 1 }] };
        const response = await addItemToDbCart(payloadItem, expirationTarget, token);

        // ✅ SOLO actualizamos con la respuesta del backend
        setCartItems(response.data.items);
        setExpirationTime(response.data.expirationTime ?? expirationTarget);

        return true;

      } catch (error) {
        console.error("Error al incrementar entrada:", error);
        if (manageLoading) {
          showError("No se pudo aumentar la cantidad. Es posible que no haya más stock.");
        }
        return false;
      } finally {
        setSyncingItemIds((prev) => {
          const newSet = new Set(prev);
          newSet.delete(syncKey);
          return newSet;
        });
      }

    } else {
      // La lógica de invitado - también validar límite
      // ✅ CONTAR TOTAL EN TODO EL CARRITO primero
      let cantidadTotalEnCarrito = 0;
      let limiteCompra = 0;
      
      for (const item of cartItems) {
        for (const entrada of (item.entradas || [])) {
          const entradaTipoId = entrada.tipoEntradaId ?? entrada.idTipoEntrada;
          if (String(entradaTipoId) === String(tipoEntradaId)) {
            cantidadTotalEnCarrito += Number(entrada.cantidad ?? entrada.quantity ?? 0);
            limiteCompra = Number(entrada.limiteCompra ?? 0);
          }
        }
      }
      
      if (limiteCompra > 0 && cantidadTotalEnCarrito >= limiteCompra) {
        if (manageLoading) {
          showWarning(`Has alcanzado el límite de compra (máximo ${limiteCompra} entradas)`);
        }
        return false;
      }
      
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
      console.log('[removeFromCart] Item ya sincronizando, ignorando');
      return;
    }

    if (isAuthenticated) {
      // Marcamos el item como "sincronizando".
      setSyncingItemIds((prev) => new Set(prev).add(cartItemId));

      // ✅ GUARDAR ESTADO ANTERIOR PARA ROLLBACK
      const previousCartItems = [...cartItems];

      try {
        const targetItem = cartItems.find((item) => item.cartItemId === cartItemId);
        if (!targetItem) {
          console.warn("El artículo a eliminar no se encontró en el carrito.");
          return;
        }

        console.log('[removeFromCart] Eliminando item completo:', targetItem);

        // ✅ Extraer idFechaEvento ANTES de eliminar el item del estado
        const idFechaEvento = targetItem.funcionInfo?.id || null;
        const entradas = Array.isArray(targetItem.entradas) ? targetItem.entradas : [];
        const tiposUnicos = [...new Set(entradas.map(e => e.tipoEntradaId))];
        
        console.log('[removeFromCart] idFechaEvento:', idFechaEvento, 'tipos:', tiposUnicos);

        // ✅ ACTUALIZACIÓN OPTIMISTA: Eliminar del estado inmediatamente
        setCartItems((prev) => prev.filter((item) => item.cartItemId !== cartItemId));

        // ✅ USAR EL NUEVO ENDPOINT QUE ELIMINA POR TIPO DE ENTRADA
        const token = resolveAuthToken();
        if (!token) throw new Error("No se pudo obtener el token.");

        // Eliminamos cada tipo de entrada usando el endpoint de batch
        const deletePromises = tiposUnicos.map(tipoEntradaId => {
          if (!tipoEntradaId) return Promise.resolve();
          return removeEntireTierFromCart(cartItemId, tipoEntradaId, idFechaEvento, token).then(response => {
            if (!response.success) {
              throw new Error(response.error || 'Error eliminando tipo de entrada');
            }
            return response;
          });
        });

        // Esperamos a que todos se completen
        const results = await Promise.all(deletePromises);
        
        // Tomamos el último resultado que contiene el carrito actualizado
        const lastResult = results[results.length - 1];
        if (lastResult?.data) {
          setCartItems(lastResult.data.items || []);
          setExpirationTime(lastResult.data.expirationTime);
        }

        console.log('[removeFromCart] ✅ Item completo eliminado correctamente');

      } catch (error) {
        console.error("[removeFromCart] Error al eliminar item:", error);
        // ✅ ROLLBACK: Restaurar estado anterior
        setCartItems(previousCartItems);
        showError("No se pudo eliminar el artículo del carrito.");
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

  // ✅ AÑADE ESTA NUEVA FUNCIÓN JUSTO AQUÍ
  const removeTierFromCart = async (cartItemId, tipoEntradaId) => {
    if (syncingItemIds.has(cartItemId)) return false;

    setSyncingItemIds(prev => new Set(prev).add(cartItemId));

    // ✅ GUARDAR ESTADO PREVIO PARA ROLLBACK
    const previousCartItems = [...cartItems];

    try {
      // ✅ EXTRAER idFechaEvento ANTES de la actualización optimista
      const targetItem = cartItems.find(item => item.cartItemId === cartItemId);
      if (!targetItem) {
        throw new Error("Item no encontrado en el carrito");
      }
      
      const idFechaEvento = targetItem.funcionInfo?.id || null;
      console.log('[removeTierFromCart] Datos:', { cartItemId, tipoEntradaId, idFechaEvento });

      // ✅ ACTUALIZACIÓN OPTIMISTA
      setCartItems(prev => prev.map(item => {
        if (item.cartItemId !== cartItemId) return item;

        const entradasFiltradas = item.entradas.filter(
          entrada => entrada.tipoEntradaId !== tipoEntradaId
        );

        if (entradasFiltradas.length === 0) {
          return null;
        }

        return {
          ...item,
          entradas: entradasFiltradas,
          totalItem: computeEntradasTotal(entradasFiltradas)
        };
      }).filter(Boolean));

      // ✅ LLAMADA AL BACKEND (nueva integración)
      if (isAuthenticated) {
        const token = resolveAuthToken();
        if (!token) throw new Error("No se pudo obtener el token");

        const response = await removeEntireTierFromCart(cartItemId, tipoEntradaId, idFechaEvento, token);

        if (!response.success) {
          throw new Error(response.error);
        }

        // ✅ ACTUALIZAR CON LA RESPUESTA DEL BACKEND
        setCartItems(response.data.items || []);
        setExpirationTime(response.data.expirationTime);
      }

      console.log('✅ Eliminación completada - Frontend y Backend sincronizados');
      return true;

    } catch (error) {
      console.error("[removeTierFromCart] Error al eliminar grupo:", error);
      // ✅ ROLLBACK en caso de error
      setCartItems(previousCartItems);
      showError(error.message || "No se pudo eliminar el grupo de entradas");
      return false;
    } finally {
      setSyncingItemIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(cartItemId);
        return newSet;
      });
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
    console.log('🎫 [addTicketsToCart] Tickets recibidos:', ticketsInfo);
    
    // Evitar duplicados durante la sincronización
    if (syncingItemIds.has(ticketsInfo.cartItemId)) {
      return;
    }

    // ✅ VALIDAR LÍMITE DE COMPRA antes de agregar
    const existingItem = cartItems.find(item =>
      item.eventoInfo?.id === ticketsInfo.eventoInfo?.id &&
      item.funcionInfo?.id === ticketsInfo.funcionInfo?.id
    );

    console.log('🔍 [addTicketsToCart] Item existente:', existingItem);
    console.log('🔍 [addTicketsToCart] Entradas a agregar:', ticketsInfo.entradas);

    // Validar límites para cada entrada
    for (const newEntrada of ticketsInfo.entradas) {
      const limiteCompra = Number(newEntrada.limiteCompra ?? 0);
      const cantidadNueva = Number(newEntrada.cantidad ?? 0);
      const tipoEntradaId = newEntrada.tipoEntradaId;

      console.log(`🔢 [addTicketsToCart] Validando entrada "${newEntrada.nombre}" (ID: ${tipoEntradaId}):`, {
        limiteCompra,
        cantidadNueva,
        excedeLimite: limiteCompra > 0 && cantidadNueva > limiteCompra
      });

      // Validar si la cantidad que quiere agregar excede el límite por sí sola
      if (limiteCompra > 0 && cantidadNueva > limiteCompra) {
        console.warn(`⚠️ [addTicketsToCart] BLOQUEADO: Cantidad ${cantidadNueva} excede límite ${limiteCompra}`);
        showWarning(
          `No puedes agregar ${cantidadNueva} entradas de "${newEntrada.nombre}". ` +
          `El límite de compra es ${limiteCompra} entrada${limiteCompra > 1 ? 's' : ''}.`
        );
        return; // Bloquear la operación completa
      }

      // ✅ CONTAR CORRECTAMENTE: Buscar en TODO el carrito cuántas entradas de este tipo ya hay
      let cantidadTotalEnCarrito = 0;
      
      for (const item of cartItems) {
        for (const entrada of (item.entradas || [])) {
          const entradaTipoId = entrada.tipoEntradaId ?? entrada.idTipoEntrada;
          if (String(entradaTipoId) === String(tipoEntradaId)) {
            cantidadTotalEnCarrito += Number(entrada.cantidad ?? entrada.quantity ?? 0);
          }
        }
      }

      const totalDespues = cantidadTotalEnCarrito + cantidadNueva;

      console.log(`🔍 [Validación acumulada] ${newEntrada.nombre}:`, {
        cantidadTotalEnCarrito,
        cantidadNueva,
        totalDespues,
        limiteCompra,
        excedeLimite: limiteCompra > 0 && totalDespues > limiteCompra
      });

      if (limiteCompra > 0 && totalDespues > limiteCompra) {
        const espacioDisponible = limiteCompra - cantidadTotalEnCarrito;
        showWarning(
          `No puedes agregar ${cantidadNueva} entrada${cantidadNueva > 1 ? 's' : ''} más de "${newEntrada.nombre}". ` +
          `Ya tienes ${cantidadTotalEnCarrito} en el carrito, el límite es ${limiteCompra}. ` +
          `Solo puedes agregar ${espacioDisponible > 0 ? espacioDisponible : 0} más.`
        );
        return; // Bloquear la operación completa
      }
    }

    if (isAuthenticated) {
      setSyncingItemIds((prev) => new Set(prev).add(ticketsInfo.cartItemId));

      try {
        const token = resolveAuthToken();
        if (!token) throw new Error("No se pudo obtener el token.");

        const expirationTarget = expirationTime || Date.now() + cartExpirationMinutes * 60 * 1000;

        // ✅ SOLUCIÓN: Esperar DIRECTAMENTE al backend SIN actualización optimista
        const response = await addItemToDbCart(ticketsInfo, expirationTarget, token);

        // ✅ Actualizar SOLO con la respuesta del backend
        setCartItems(response.data.items);
        setExpirationTime(response.data.expirationTime ?? expirationTarget);

      } catch (error) {
        console.error("Error al agregar entradas:", error);
        showError("No se pudieron agregar las entradas al carrito.");
      } finally {
        setSyncingItemIds((prev) => {
          const newSet = new Set(prev);
          newSet.delete(ticketsInfo.cartItemId);
          return newSet;
        });
      }

    } else {
      // Lógica de invitado - también validar límite
      
      // Primero validar ANTES de modificar el estado
      for (const newEntrada of ticketsInfo.entradas) {
        const limiteCompra = Number(newEntrada.limiteCompra ?? 0);
        const cantidadNueva = Number(newEntrada.cantidad ?? 0);

        // Validar si la cantidad que quiere agregar excede el límite por sí sola
        if (limiteCompra > 0 && cantidadNueva > limiteCompra) {
          showWarning(
            `No puedes agregar ${cantidadNueva} entradas de "${newEntrada.nombre}". ` +
            `El límite de compra es ${limiteCompra} entrada${limiteCompra > 1 ? 's' : ''}.`
          );
          return; // No agregar nada
        }
      }
      
      setCartItems((prevCartItems) => {
        const existingItem = prevCartItems.find(item =>
          item.eventoInfo.id === ticketsInfo.eventoInfo.id &&
          item.funcionInfo.id === ticketsInfo.funcionInfo.id
        );

        if (existingItem) {
          // Validar límites acumulados antes de actualizar
          let hasLimitExceeded = false;
          
          for (const newEntrada of ticketsInfo.entradas) {
            const existing = existingItem.entradas?.find(e => 
              e.tipoEntradaId === newEntrada.tipoEntradaId
            );
            
            if (existing) {
              const limiteCompra = Number(existing.limiteCompra ?? newEntrada.limiteCompra ?? 0);
              const cantidadActual = Number(existing.cantidad ?? 0);
              const cantidadNueva = Number(newEntrada.cantidad ?? 0);
              const totalDespues = cantidadActual + cantidadNueva;
              
              if (limiteCompra > 0 && totalDespues > limiteCompra) {
                showWarning(
                  `No puedes agregar ${cantidadNueva} entrada${cantidadNueva > 1 ? 's' : ''} más de "${newEntrada.nombre}". ` +
                  `Ya tienes ${cantidadActual} en el carrito y el límite es ${limiteCompra}.`
                );
                hasLimitExceeded = true;
                break;
              }
            }
          }
          
          if (hasLimitExceeded) {
            return prevCartItems; // No modificar el carrito
          }
          
          return prevCartItems.map(item => {
            if (item.cartItemId !== existingItem.cartItemId) return item;
            const existingEntradasMap = new Map(item.entradas.map(e => [e.tipoEntradaId, e]));
            
            ticketsInfo.entradas.forEach(newEntrada => {
              if (existingEntradasMap.has(newEntrada.tipoEntradaId)) {
                const existing = existingEntradasMap.get(newEntrada.tipoEntradaId);
                existing.cantidad += newEntrada.cantidad;
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
    removeTierFromCart,
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