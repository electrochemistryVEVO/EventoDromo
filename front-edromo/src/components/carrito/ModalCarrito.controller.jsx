// src/components/carrito/ModalCarrito.controller.jsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import ModalCarritoView from "./ModalCarrito";
import "@/css/ModalCarrito.css";

/**
 * Controller: maneja la lógica del modal (animación, visibilidad)
 * y la obtención de datos del carrito desde el servicio.
 */
export default function ModalCarritoController({ isOpen, onClose }) {
  const {
    cartItems,
    totalPrice,
    isLoading,
    removeFromCart,
    clearCart,
    expirationTime,
  } = useCart();

  const [tiempoRestante, setTiempoRestante] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const modalRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => setIsAnimating(true), 10);
      return () => clearTimeout(timer);
    }
    setIsAnimating(false);
    return undefined;
  }, [isOpen]);

  useEffect(() => {
    if (!expirationTime) {
      setTiempoRestante(null);
      return undefined;
    }

    const updateTimer = () => {
      const now = Date.now();
      const remaining = expirationTime - now;

      if (remaining <= 0) {
        setTiempoRestante("Expirado");
        clearCart();
        return;
      }

      const totalHoras = Math.floor(remaining / (1000 * 60 * 60));
      const minutos = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
      const segundos = Math.floor((remaining % (1000 * 60)) / 1000);

      const displayHoras = String(totalHoras).padStart(2, "0");
      const displayMinutos = String(minutos).padStart(2, "0");
      const displaySegundos = String(segundos).padStart(2, "0");

      setTiempoRestante(`${displayHoras}:${displayMinutos}:${displaySegundos}`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [expirationTime, clearCart]);

  // 4. Lógica para cerrar el modal
  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      onClose(); // Llama a la función del padre para actualizar el estado
    }, 300); // Debe coincidir con la duración de la animación en CSS
  };

  const handleCheckout = () => {
    handleClose(); // Cierra el modal
    router.push('/user/carrito/entradaDetalle'); // Navega a la página de detalle
  };

  // 6. Maneja el cierre con clic afuera o tecla Escape
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
  }, [isAnimating]);

  if (!isOpen) {
    return null;
  }

  // 8. Renderiza la Vista, pasándole todos los datos y funciones como props.
  return (
    <div className={`modal-carrito-backdrop ${isAnimating ? "active" : ""}`}>
      <div ref={modalRef} className="modal-carrito">
        <div className="modal-carrito__header">
          <div className="modal-carrito__header-content">
            {/* Renderizamos el temporizador aquí si existe */}
            {tiempoRestante && cartItems.length > 0 && (
              <div className="modal-carrito__timer">
                <strong>{tiempoRestante}</strong>
              </div>
            )}
            <h2 className="modal-carrito__title">🛒 Mi Carrito</h2>
          </div>
          <button onClick={handleClose} className="modal-carrito__close-button">
            &times;
          </button>
        </div>
        <ModalCarritoView
          items={cartItems}
          isLoading={isLoading}
          tiempoRestante={tiempoRestante}
          error={null}
          total={totalPrice}
          onClose={handleClose}
          onRemoveItem={removeFromCart}
          onCheckout={handleCheckout}
        />
      </div>
    </div>
  );
}