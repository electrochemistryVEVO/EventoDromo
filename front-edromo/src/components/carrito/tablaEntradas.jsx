// src/components/carrito/tablaEntradas.jsx
"use client";

import React, { useRef, useEffect } from "react";
import { FilaEntrada } from "@/components/carrito/FilaEntrada";

// Renombramos la funciÃ³n de "TablaEntradasView" a "TablaEntradas"
export const TablaEntradas = ({
  items,
  selectedIds,
  isAllSelected,
  isIndeterminate,
  onToggle,
  onToggleAll,
  onRemoveItem,
  onDecreaseQuantity,
  onIncreaseQuantity,
  onRemoveSelected,
  isLoading,
  error,
}) => {
  // La View ahora maneja su propia ref interna.
  const selectAllCheckboxRef = useRef(null);

  // Sincroniza el estado 'indeterminate' del checkbox principal
  useEffect(() => {
    if (selectAllCheckboxRef.current) {
      selectAllCheckboxRef.current.indeterminate = isIndeterminate;
    }
  }, [isIndeterminate]);

  const renderContent = () => {
    if (isLoading)
      return <div className="p-4 text-center">Cargando entradas...</div>;
    if (error)
      return <div className="p-4 text-center text-red-500">{error}</div>;
    if ((items?.length ?? 0) === 0)
      return (
        <div className="p-4 text-center">No hay entradas en tu carrito.</div>
      );

    return (
      <ul className="p-0 divide-y divide-gray-200">
        {items.map((item) => (
          <FilaEntrada
            key={item.rowId}
            item={item}
            selected={selectedIds.has(item.rowId)}
            onToggle={onToggle}
            onRemove={() => onRemoveItem(item)}
            onDecrease={() => onDecreaseQuantity(item)}
            onIncrease={() => onIncreaseQuantity(item)}
            isLoading={isLoading}
          />
        ))}
      </ul>
    );
  };

  return (
    <div className="flex flex-col overflow-hidden bg-white border rounded-lg border-slate-200">
      <header className="flex-shrink-0 grid grid-cols-[auto_1fr_160px_160px_auto] items-center gap-x-4 bg-[#EEECEC] px-4 py-3 text-sm font-bold uppercase text-slate-600">
        <div>
          <input
            type="checkbox"
            ref={selectAllCheckboxRef}
            checked={isAllSelected}
            onChange={onToggleAll}
            className="w-6 h-6 text-black border-gray-300 rounded focus:ring-black"
            aria-label="Seleccionar todo"
          />
        </div>
        <div className="text-sm">Evento</div>
        <div className="text-sm tracking-wider text-center">Cantidad</div>
        <div className="text-sm tracking-wider text-right">Precio</div>
        <div className="w-16" />
      </header>
      <div className="flex-1 overflow-y-auto">
        {renderContent()}
      </div>
      <footer className="flex-shrink-0 flex items-center justify-center gap-x-4 rounded-b-lg bg-[#EEECEC] px-4 py-3">
        <button
          onClick={onRemoveSelected}
          disabled={(selectedIds?.size ?? 0) === 0}
          className="px-8 py-3 text-lg font-bold text-white transition-colors bg-red-600 rounded-md shadow-sm hover:bg-red-500 disabled:cursor-not-allowed disabled:bg-gray-400 disabled:opacity-70"
        >
          Borrar seleccionados
        </button>
      </footer>
    </div>
  );
};
