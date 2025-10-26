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

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useUser();
  const [cartItems, setCartItems] = useState([]);
  const [expirationTime, setExpirationTime] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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
        const response = await mergeGuestCartWithDb(guestItems);

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
  }, [isAuthenticated]);
  
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
      const response = await addItemToDbCart(entrada, newExpiration);
      if (response.success) {
        setCartItems(response.data.items);
        setExpirationTime(response.data.expirationTime);
      } else {
        console.error("Error al agregar item a la BD");
      }
      setIsLoading(false);
    } else {
      setCartItems((prev) => [...prev, entrada]);
      setExpirationTime(newExpiration);
    }
  };

  const removeFromCart = async (cartItemId) => { // Recibe cartItemId
    if (isAuthenticated) {
      setIsLoading(true);
      const response = await removeItemFromDbCart(cartItemId);
      if (response.success) {
        setCartItems(response.data.items);
        setExpirationTime(response.data.expirationTime);
      } else {
        console.error("Error al eliminar item de la BD");
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
      const response = await clearDbCart();
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