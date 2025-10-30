// src/components/carrito/TablaEntradas.controller.js
"use client";

import React, { useMemo, useState, useEffect } from "react";
import { useCart } from "@/context/CartContext"; 
// 1. MODIFICADO: Importa la nueva vista desde 'tablaEntradas.jsx'
import { TablaEntradas } from "./TablaEntradas";

export const TablaEntradasController = () => {
  // Obtenemos todo del contexto (sin cambios)
  const { cartItems, isLoading, removeFromCart } = useCart();

  const rows = useMemo(() => {
    return cartItems.flatMap((item) => {
      const baseData = {
        cartItemId: item.cartItemId,
        eventName: item?.eventoInfo?.nombre || "Evento no disponible",
        imageUrl: item?.eventoInfo?.imagenUrl || "/images/placeholder.png",
        fecha: item?.funcionInfo?.fecha || "Fecha no disponible",
        hora: item?.funcionInfo?.hora || "",
      };

      if (!Array.isArray(item?.entradas) || item.entradas.length === 0) {
        return [
          {
            ...baseData,
            rowId: `${item.cartItemId}-sin-entradas`,
            tierName: "Sin entradas",
            quantity: 0,
            totalPrice: 0,
          },
        ];
      }

      return item.entradas
        .filter((entrada) => Number(entrada?.cantidad || 0) > 0)
        .map((entrada) => {
          const quantity = Number(entrada?.cantidad || 0);
          const unitPrice = Number(entrada?.precioUnitario || 0);
          const rowId = `${item.cartItemId}-${entrada?.tipoEntradaId ?? entrada?.nombre ?? "entrada"}`;

          return {
            ...baseData,
            rowId,
            tierName: entrada?.nombre || "Entrada",
            quantity,
            totalPrice: unitPrice * quantity,
          };
        });
    });
  }, [cartItems]);

  const rowMap = useMemo(() => {
    return new Map(rows.map((row) => [row.rowId, row]));
  }, [rows]);
  
  // Lógica de selección (sin cambios)
  const [selectedIds, setSelectedIds] = useState(new Set());

  useEffect(() => {
    setSelectedIds((prev) => {
      if (prev.size === 0) {
        return prev;
      }
      const filtered = new Set();
      let changed = false;
      prev.forEach((id) => {
        if (rowMap.has(id)) {
          filtered.add(id);
        } else {
          changed = true;
        }
      });
      if (!changed && filtered.size === prev.size) {
        return prev;
      }
      return filtered;
    });
  }, [rowMap]);

  const handleToggle = (id) => {
    if (!rowMap.has(id)) {
      return;
    }
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
    if (rows.length === 0) {
      setSelectedIds(new Set());
      return;
    }
    if (selectedIds.size === rows.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(rows.map((row) => row.rowId)));
    }
  };

  const handleRemoveItem = (id) => {
    const row = rowMap.get(id);
    if (!row) {
      return;
    }
    removeFromCart(row.cartItemId);
  };

  const handleRemoveSelected = () => {
    const uniqueCartItemIds = new Set();
    selectedIds.forEach((id) => {
      const row = rowMap.get(id);
      if (row) {
        uniqueCartItemIds.add(row.cartItemId);
      }
    });
    uniqueCartItemIds.forEach((cartItemId) => removeFromCart(cartItemId));
    setSelectedIds(new Set());
  };

  const isAllSelected = rows.length > 0 && selectedIds.size === rows.length;
  const isIndeterminate =
    selectedIds.size > 0 && selectedIds.size < rows.length;

  // 2. MODIFICADO: Renderiza el componente 'TablaEntradas'
  return (
    <TablaEntradas
      items={rows} 
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