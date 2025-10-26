// src/components/carrito/TablaEntradas.controller.js
"use client";

import React, { useState } from "react";
import { useCart } from "@/context/CartContext"; 
// 1. MODIFICADO: Importa la nueva vista desde 'tablaEntradas.jsx'
import { TablaEntradas } from "./TablaEntradas";

export const TablaEntradasController = () => {
  // Obtenemos todo del contexto (sin cambios)
  const { cartItems, isLoading, removeFromCart } = useCart();
  
  // Lógica de selección (sin cambios)
  const [selectedIds, setSelectedIds] = useState(new Set());

  const handleToggle = (id) => {
    setSelectedIds((prev) => {
      const newSelected = new Set(prev);
      if (newSelected.has(id)) {
        newSelected.delete(id);
      } else {
        newSelected.add(id);
      }
      return newSelected;
    });
  };

  const handleToggleAll = () => {
    if (selectedIds.size === cartItems.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(cartItems.map((item) => item.cartItemId)));
    }
  };

  const handleRemoveItem = (id) => {
    removeFromCart(id);
  };

  const handleRemoveSelected = () => {
    selectedIds.forEach(id => {
      removeFromCart(id);
    });
    setSelectedIds(new Set());
  };

  const isAllSelected = cartItems.length > 0 && selectedIds.size === cartItems.length;
  const isIndeterminate =
    selectedIds.size > 0 && selectedIds.size < cartItems.length;

  // 2. MODIFICADO: Renderiza el componente 'TablaEntradas'
  return (
    <TablaEntradas
      items={cartItems} 
      selectedIds={selectedIds}
      isAllSelected={isAllSelected}
      isIndeterminate={isIndeterminate}
      onToggle={handleToggle}
      onToggleAll={handleToggleAll}
      onRemoveItem={handleRemoveItem}
      onRemoveSelected={handleRemoveSelected}
      isLoading={isLoading} 
      error={null}
    />
  );
};