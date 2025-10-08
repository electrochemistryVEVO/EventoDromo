// src/components/carrito/ModalCarrito.tsx (CÓDIGO CORREGIDO)
"use client";

import React, { useEffect, useRef, useState } from "react";
import "@/css/ModalCarrito.css"; 

interface ModalCarritoProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
}

export default function ModalCarrito({ isOpen, onClose, children, title }: ModalCarritoProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  
  // 1. AÑADIMOS UN ESTADO INTERNO PARA CONTROLAR LA ANIMACIÓN
  // Esto nos permite separar el montaje del componente de la activación de la animación.
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Si el modal debe abrirse, esperamos un instante muy breve antes de 
      // añadir la clase 'active'. Esto le da tiempo al navegador de renderizar
      // el estado inicial (oculto) y luego animar al estado final (visible).
      const timer = setTimeout(() => {
        setIsAnimating(true);
      }, 10); // Un pequeño retardo es suficiente

      return () => clearTimeout(timer);
    } else {
      // Si el modal debe cerrarse, simplemente quitamos la clase.
      // La función handleClose se encargará de esperar a que termine la animación.
      setIsAnimating(false);
    }
  }, [isOpen]);

  // 2. CREAMOS UNA FUNCIÓN PARA MANEJAR EL CIERRE
  // Esta función se asegura de que la animación de salida se complete
  // ANTES de que el componente se desmonte.
  const handleClose = () => {
    setIsAnimating(false); // Inicia la animación de salida
    setTimeout(() => {
      onClose(); // Llama a la función del padre para desmontar el componente
    }, 300); // IMPORTANTE: Este tiempo debe ser igual a la duración de la transición en tu CSS
  };

  // Efecto para manejar clics fuera y la tecla Escape
  useEffect(() => {
    // Ahora usamos nuestra nueva función handleClose
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        handleClose();
      }
    };
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleClose();
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscKey);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscKey);
    };
    // Desactivamos la advertencia de lint porque handleClose está definido dentro del componente
    // y no cambiará de una manera que requiera un nuevo efecto.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // 3. MODIFICAMOS LA LÓGICA DE RENDERIZADO
  // El componente ya no se anula a sí mismo, sino que espera a que el padre (a través de `isOpen`) lo haga.
  if (!isOpen) {
    return null;
  }

  return (
    // La clase 'active' ahora depende de nuestro estado de animación 'isAnimating'
    <div className={`modal-carrito-backdrop ${isAnimating ? "active" : ""}`}>
      <div ref={modalRef} className="modal-carrito">
        <div className="modal-carrito__header">
          <h2 className="modal-carrito__title">{title}</h2>
          {/* El botón de cierre ahora llama a handleClose */}
          <button onClick={handleClose} className="modal-carrito__close-button">
            &times;
          </button>
        </div>
        <div className="modal-carrito__body">{children}</div>
      </div>
    </div>
  );
}