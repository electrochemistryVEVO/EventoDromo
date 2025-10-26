"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

// 1. ELIMINAMOS los servicios de API
// import { fetchCart, removeCartItem } from "../../services/ModalCarrito.service"; 

// 2. IMPORTAMOS el CartContext
import { useCart } from "@/context/CartContext"; // Ajusta la ruta si es necesario
import ModalCarrito from "./ModalCarrito"; // Importamos la Vista

/**
 * Controller: maneja la lógica, estado, y el "cascarón" del modal.
 * AHORA LEE DESDE EL CONTEXTO.
 */
export default function ModalCarritoController({ isOpen, onClose }) {
  
  // 3. OBTENEMOS TODO DESDE useCart()
  // Ya no necesitamos los estados 'cartData', 'isLoading', 'error'
  const {
    cartItems,
    expirationTime,
    totalPrice,
    removeFromCart,
    // clearCart // (Puedes agregar 'clearCart' si lo necesitas)
  } = useCart();

  // 4. Mantenemos los estados de UI (animación y tiempo)
  const [tiempoRestante, setTiempoRestante] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const modalRef = useRef(null);
  const router = useRouter();

  // 5. ELIMINAMOS la función 'loadCart()'. Ya no es necesaria.
  /*
  const loadCart = async () => { ... };
  */

  // 6. Lógica para cerrar el modal (sin cambios)
  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      onClose(); 
    }, 300);
  };

  // 7. Lógica para navegar al checkout (sin cambios)
  const handleCheckout = () => {
    handleClose(); 
    router.push('/user/carrito/entradaDetalle');
  };

  // 8. Lógica para eliminar un item (MODIFICADA)
  const handleRemoveItem = (cartItemId) => {
    // Llama a la función del contexto directamente.
    // Ya no es async y no necesita 'await'.
    removeFromCart(cartItemId);
    // No es necesario 'loadCart()', el contexto actualiza el estado.
  };

  // 9. Efecto: Cargar datos y animar al abrir (MODIFICADO)
  useEffect(() => {
    if (isOpen) {
      // Ya no llamamos a loadCart()
      const timer = setTimeout(() => setIsAnimating(true), 10);
      return () => clearTimeout(timer);
    } else {
      setIsAnimating(false);
    }
  }, [isOpen]);

  // 10. Efecto: Temporizador de expiración (MODIFICADO)
  // Ahora depende de 'expirationTime' del contexto.
  useEffect(() => {
    if (expirationTime) { // Usamos el valor del contexto
      const intervalo = setInterval(() => {
        const ahora = new Date().getTime();
        const distancia = expirationTime - ahora; // 'expirationTime' es un timestamp

        if (distancia < 0) {
          clearInterval(intervalo);
          setTiempoRestante("Expirado");
          // El contexto se encargará de limpiar el carrito
        } else {
          const totalHoras = Math.floor(distancia / (1000 * 60 * 60));
          const minutos = Math.floor((distancia % (1000 * 60 * 60)) / (1000 * 60));
          const segundos = Math.floor((distancia % (1000 * 60)) / 1000);

          const displayHoras = String(totalHoras).padStart(2, '0');
          const displayMinutos = String(minutos).padStart(2, '0');
          const displaySegundos = String(segundos).padStart(2, '0');
          
          setTiempoRestante(`${displayHoras}:${displayMinutos}:${displaySegundos}`);
        }
      }, 1000);

      return () => clearInterval(intervalo);
    } else {
      setTiempoRestante(null); // Si no hay expiración, resetea el tiempo
    }
  }, [expirationTime]); // Se ejecuta cuando la expiración cambia

  // 11. Efecto: Cierre con clic afuera o tecla Escape (sin cambios)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        handleClose();
      }
    };
    const handleEscKey = (event) => {
      if (event.key === "Escape") handleClose();
    };
    if (isAnimating) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscKey);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [isAnimating, handleClose]);

  // 12. Extraemos los items y calculamos el total (MODIFICADO)
  // Los datos vienen directamente del contexto, ya no de 'cartData'
  const items = cartItems;
  const total = totalPrice;

  if (!isOpen) {
    return null;
  }

  // 13. Renderizado del cascarón (MODIFICADO)
  return (
    // Backdrop
    <div
      className={`fixed inset-0 z-50 flex justify-end bg-black/60 transition-opacity duration-300 ${
        isAnimating ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Contenedor del Modal */}
      <div
        ref={modalRef}
        className={`relative flex flex-col bg-white h-full w-[500px] max-w-[90%] shadow-xl transition-transform duration-300 ease-out ${
          isAnimating ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="relative flex items-center justify-between p-5 border-b border-gray-200">
          <div className="flex flex-col">
            {/* Temporizador */}
            {tiempoRestante && items.length > 0 && (
              <div className="absolute top-full left-0 w-full p-2.5 text-center text-sm bg-yellow-100 text-yellow-800 border-b border-gray-200">
                Tu reserva expira en: <strong>{tiempoRestante}</strong>
              </div>
            )}
            <h2 className="text-xl font-bold">🛒 Mi Carrito</h2>
          </div>
          <button 
            onClick={handleClose} 
            className="text-4xl leading-none text-gray-500 bg-transparent border-none cursor-pointer"
          >
            &times;
          </button>
        </div>
        
        {/* Renderizado de la Vista (contenido) */}
        {/* Pasamos los props directamente desde el contexto */}
        <ModalCarrito
          isLoading={false} // Ya no hay carga asíncrona
          error={null}     // Ya no hay error de API
          items={items}
          total={total}
          onClose={handleClose}
          onRemoveItem={handleRemoveItem}
          onCheckout={handleCheckout}
        />
      </div>
    </div>
  );
}