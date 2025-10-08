"use client"; // Marcamos como Client Component porque interactúa con el usuario

import React from "react";
// 1. Importamos el hook con la lógica desde el archivo controller
import { useModalController } from "./controller";
// 2. Importamos el componente del modal desde su nueva ubicación
import ModalCarrito from "@/components/carrito/ModalCarrito";

export default function AuxPruebaModalPage() {
  // 3. Usamos nuestro hook para obtener el estado y las funciones
  const { isCartOpen, openCart, closeCart } = useModalController();

  return (
    <main style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Página de Prueba del Modal</h1>
      <p>
        Esta página implementa el modal del carrito con la nueva estructura de
        archivos.
      </p>

      {/* El botón ahora usa la función 'openCart' del controlador */}
      <button
        onClick={openCart}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          cursor: "pointer",
          backgroundColor: "#0070f3",
          color: "white",
          border: "none",
          borderRadius: "5px",
        }}
      >
        Abrir Carrito
      </button>

      {/* El componente ModalCarrito recibe las props desde el controlador */}
      <ModalCarrito
        isOpen={isCartOpen}
        onClose={closeCart}
        title="🛒 Mi Carrito"
      >
        <div>
          <h3>Este es el contenido del modal</h3>
          <p>Puedes colocar cualquier componente o elemento aquí.</p>
        </div>
      </ModalCarrito>
    </main>
  );
}