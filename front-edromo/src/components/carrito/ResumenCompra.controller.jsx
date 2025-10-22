// src/components/carrito/ResumenCompra.controller.js
"use client";

import React, { useState, useEffect } from "react";
// Asumimos que ResumenCompra.service.ts se convertirá en ResumenCompra.service.js
import { fetchResumenCompraItems } from "@/services/ResumenCompra.service";
import { ResumenCompraView } from "./ResumenCompra.view";

/**
 * Controller para ResumenCompra.
 * Maneja la obtención de datos y los estados de carga/error.
 */
export const ResumenCompraController = () => {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const { items: data, total: totalAmount } =
          await fetchResumenCompraItems();
        setItems(data);
        setTotal(totalAmount);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Error desconocido";
        setError(`No se pudo cargar el resumen: ${message}`);
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  return (
    <ResumenCompraView
      items={items}
      total={total}
      isLoading={isLoading}
      error={error}
    />
  );
};
