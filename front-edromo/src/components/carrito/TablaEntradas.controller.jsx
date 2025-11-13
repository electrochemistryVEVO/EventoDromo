// src/components/carrito/TablaEntradas.controller.js
"use client";

import React, { useMemo, useState, useEffect } from "react";
import { useCart } from "@/context/CartContext"; 
import { groupCartEntriesByTier } from "./groupCartEntries";
import { TablaEntradas } from "./tablaEntradas";

export const TablaEntradasController = () => {
  const {
    cartItems,
    isLoading,
    removeEntryFromCart,
    incrementEntryInCart,
    removeTierFromCart,
  } = useCart();

  const rows = useMemo(
    () => groupCartEntriesByTier(cartItems),
    [cartItems],
  );

  const rowMap = useMemo(
    () => new Map(rows.map((row) => [row.rowId, row])),
    [rows],
  );
  
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

  const executeRowRemoval = async (row) => {
  if (!row) return;

  // ✅ USAR LA NUEVA FUNCIÓN de eliminación optimista
  const success = await removeTierFromCart(row.cartItemId, row.tipoEntradaId);

  if (success) {
    // Eliminar de la selección si estaba seleccionado
    setSelectedIds(prev => {
      if (!prev.has(row.rowId)) return prev;
      const next = new Set(prev);
      next.delete(row.rowId);
      return next;
    });
  } else {
    alert("No se pudo eliminar el grupo de entradas");
  }
};

  const handleRemoveItem = async (row) => {
    if (!row) {
      return;
    }
    await executeRowRemoval(row);
  };

  const handleRemoveSelected = async () => {
    const rowsToRemove = Array.from(selectedIds)
      .map((id) => rowMap.get(id))
      .filter(Boolean);

    for (const row of rowsToRemove) {
      await executeRowRemoval(row);
    }
  };

  const handleDecreaseQuantity = async (row) => {
    if (!row || row.entryRecords.length === 0) {
      return;
    }

    // ✅ CORRECCIÓN: Tomar el ÚLTIMO record para eliminar
    const lastRecord = row.entryRecords[row.entryRecords.length - 1];

    await removeEntryFromCart(
      {
        cartItemId: row.cartItemId,
        entradaId: lastRecord.entradaId,
        tipoEntradaId: lastRecord.tipoEntradaId,
      },
      { manageLoading: true },
    );
  };

  const handleIncreaseQuantity = async (row) => {
    if (!row) {
      return;
    }

    await incrementEntryInCart(
      {
        cartItemId: row.cartItemId,
        tipoEntradaId: row.tipoEntradaId,
      },
      { manageLoading: true },
    );
  };

  const isAllSelected = rows.length > 0 && selectedIds.size === rows.length;
  const isIndeterminate =
    selectedIds.size > 0 && selectedIds.size < rows.length;

  // ✅ DEBUG: Verificar que no hay duplicados
  useEffect(() => {
    const rowIds = rows.map(row => row.rowId);
    const uniqueIds = new Set(rowIds);
    
    if (rowIds.length !== uniqueIds.size) {
      console.warn('⚠️ Se encontraron rowIds duplicados:', {
        total: rowIds.length,
        unique: uniqueIds.size,
        duplicates: rowIds.filter((id, index) => rowIds.indexOf(id) !== index)
      });
    }
  }, [rows]);

  return (
    <TablaEntradas
      items={rows} 
      selectedIds={selectedIds}
      isAllSelected={isAllSelected}
      isIndeterminate={isIndeterminate}
      onToggle={handleToggle}
      onToggleAll={handleToggleAll}
      onRemoveItem={handleRemoveItem}
      onDecreaseQuantity={handleDecreaseQuantity}
      onIncreaseQuantity={handleIncreaseQuantity}
      onRemoveSelected={handleRemoveSelected}
      isLoading={isLoading} 
      error={null}
    />
  );
};