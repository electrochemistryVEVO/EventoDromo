// src/components/carrito/ModalCarrito.controller.jsx
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { fetchCart, removeCartItem } from "../../services/ModalCarrito.service";
import ModalCarritoView from "./ModalCarrito";

/**
 * Controller: maneja la lógica del modal (animación, visibilidad)
 * y la obtención de datos del carrito desde el servicio.
 */
export default function ModalCarritoController({ isOpen, onClose }) {
  // 1. Estados para manejar los datos, la carga y los errores
  const [cartData, setCartData] = useState(null); // Almacenará el objeto carrito completo
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tiempoRestante, setTiempoRestante] = useState(null);

  // 2. Estado para la animación
  const [isAnimating, setIsAnimating] = useState(false);
  const modalRef = useRef(null);
  const router = useRouter();

  // 3. Lógica para cargar los datos del carrito cuando se abre el modal
  const loadCart = async () => {
    setIsLoading(true);
    setError(null);
    const response = await fetchCart();
    if (response.success) {
      setCartData(response.data);
    } else {
      setError(response.error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (isOpen) {
      // Carga los datos cada vez que se abre el modal
      loadCart();

      // Inicia la animación
      const timer = setTimeout(() => setIsAnimating(true), 10);
      return () => clearTimeout(timer);
    } else {
      setIsAnimating(false);
    }
  }, [isOpen]);

  // Efecto para manejar el temporizador de expiración del carrito
  useEffect(() => {
    const carrito = Array.isArray(cartData) ? cartData[0] : null;
    if (carrito && carrito.fechaExpiracion) {
      const fechaExpiracion = new Date(carrito.fechaExpiracion).getTime();

      const intervalo = setInterval(() => {
        const ahora = new Date().getTime();
        const distancia = fechaExpiracion - ahora;

        if (distancia < 0) {
          clearInterval(intervalo);
          setTiempoRestante("Expirado");
          // Opcional: podrías llamar a una función para vaciar el carrito aquí
        } else {
          // --- NUEVO CÁLCULO ---
          // Calculamos el total de horas, y los minutos y segundos restantes.
          const totalHoras = Math.floor(distancia / (1000 * 60 * 60));
          const minutos = Math.floor((distancia % (1000 * 60 * 60)) / (1000 * 60));
          const segundos = Math.floor((distancia % (1000 * 60)) / 1000);

          // Formateamos para que siempre tengan dos dígitos, ej: 09, 08, etc.
          const displayHoras = String(totalHoras).padStart(2, '0');
          const displayMinutos = String(minutos).padStart(2, '0');
          const displaySegundos = String(segundos).padStart(2, '0');

          // Construimos el string de tiempo a mostrar en formato HH:MM:SS
          setTiempoRestante(`${displayHoras}:${displayMinutos}:${displaySegundos}`);
        }
      }, 1000);

      // Función de limpieza que se ejecuta cuando el componente se desmonta o cartData cambia
      return () => clearInterval(intervalo);
    }
  }, [cartData]); // Se ejecuta cada vez que cartData cambia

  // 4. Lógica para cerrar el modal
  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      onClose(); // Llama a la función del padre para actualizar el estado
    }, 300); // Debe coincidir con la duración de la animación en CSS
  };

  // Nueva función para manejar la finalización del pedido
  const handleCheckout = () => {
    handleClose(); // Cierra el modal
    router.push('/user/carrito/entradaDetalle'); // Navega a la página de detalle
  };

  // 5. Lógica para eliminar un item
  const handleRemoveItem = async (itemId) => {
    const response = await removeCartItem(itemId);
    if (response.success) {
      // Si la eliminación fue exitosa, volvemos a cargar el carrito
      // para reflejar los cambios.
      loadCart();
    } else {
      // Manejar el error de eliminación si es necesario
      console.error("Error al eliminar el item:", response.error);
    }
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

  // 7. Extraemos los items y calculamos el total
  // El carrito puede ser null (vacío) o un objeto con `entradas`
  // El JSON devuelve un array, así que tomamos el primer elemento.
  const carrito = Array.isArray(cartData) ? cartData[0] : null;
  const items = carrito?.entradas || [];
  const total = items.reduce((acc, item) => acc + item.precioTotal, 0);


  // 8. Renderiza la Vista, pasándole todos los datos y funciones como props.
  return (
    <div className={`modal-carrito-backdrop ${isAnimating ? "active" : ""}`}>
      <div ref={modalRef} className="modal-carrito">
        <div className="modal-carrito__header">
          <div className="modal-carrito__header-content">
            {/* Renderizamos el temporizador aquí si existe */}
            {tiempoRestante && items.length > 0 && (
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
          items={items}
          isLoading={isLoading}
          tiempoRestante={tiempoRestante}
          error={error}
          total={total}
          onClose={handleClose}
          onRemoveItem={handleRemoveItem}
          onCheckout={handleCheckout}
        />
      </div>
    </div>
  );
}