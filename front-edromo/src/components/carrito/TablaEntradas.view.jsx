// src/components/carrito/TablaEntradas.view.jsx
"use client";

import React, { useRef, useEffect } from "react";
import { FilaEntrada } from "./filaEntrada";

export const TablaEntradasView = ({
  items,
  selectedIds,
  isAllSelected,
  isIndeterminate,
  onToggle,
  onToggleAll,
  onRemoveItem,
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
    if (items.length === 0)
      return (
        <div className="p-4 text-center">No hay entradas en tu carrito.</div>
      );

    return (
      <ul className="divide-y divide-gray-200 p-0">
        {items.map((item) => (
          <FilaEntrada
            key={item.id}
            item={item}
            selected={selectedIds.has(item.id)}
            onToggle={onToggle}
            onRemove={onRemoveItem}
          />
        ))}
      </ul>
    );
  };

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <header className="grid grid-cols-[auto_1fr_128px_160px_auto] items-center gap-x-4 bg-[#EEECEC] px-4 py-5 text-sm font-bold uppercase text-slate-600">
        <div>
          <input
            type="checkbox"
            ref={selectAllCheckboxRef}
            checked={isAllSelected}
            onChange={onToggleAll}
            className="h-6 w-6 rounded border-gray-300 text-black focus:ring-black"
            aria-label="Seleccionar todo"
          />
        </div>
        <div className="text-base">Evento</div>
        <div className="text-center text-base tracking-wider">Cantidad</div>
        <div className="text-right text-base tracking-wider">Precio</div>
        <div className="w-16" />
      </header>
      {renderContent()}
      <footer className="flex items-center justify-center gap-x-4 rounded-b-lg bg-[#EEECEC] px-4 py-4">
        <button
          onClick={onRemoveSelected}
          disabled={selectedIds.size === 0}
          className="rounded-md bg-red-600 px-8 py-3 text-lg font-bold text-white shadow-sm transition-colors hover:bg-red-500 disabled:cursor-not-allowed disabled:bg-gray-400 disabled:opacity-70"
        >
          Borrar seleccionados
        </button>
      </footer>
    </div>
  );
};
