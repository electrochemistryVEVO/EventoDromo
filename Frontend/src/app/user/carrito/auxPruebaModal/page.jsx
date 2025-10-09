// src/app/user/carrito/auxPruebaModal/page.jsx
"use client";

import React, { useState } from "react";
import ModalCarritoController from "../../../../components/carrito/ModalCarrito.controller";

export default function AuxPruebaModalPage() {
  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <main style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Página de Prueba del Carrito</h1>
      <p>
        Esta página ahora abre el modal, que cargará los datos desde un JSON
        simulado.
      </p>

      <button
        onClick={() => setModalOpen(true)}
        style={{ padding: "10px 20px", cursor: "pointer", marginRight: "1rem" }}
      >
        Abrir Carrito (Cargará datos del backend)
      </button>

      {/* Renderizamos el Controller, que se encargará del resto */}
      <ModalCarritoController
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
      />
    </main>
  );
}