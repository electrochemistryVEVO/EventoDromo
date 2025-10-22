"use client"; // Necesario porque usamos el hook 'useState'

import { useState } from "react";

// Exportamos un hook personalizado que encapsula la lógica del modal
export function useModalController() {
  // Estado para controlar si el modal está abierto o cerrado
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Función para abrir el modal (pone el estado en true)
  const openCart = () => setIsCartOpen(true);

  // Función para cerrar el modal (pone el estado en false)
  const closeCart = () => setIsCartOpen(false);

  // Devolvemos el estado y las funciones para que la página los pueda usar
  return {
    isCartOpen,
    openCart,
    closeCart,
  };
}