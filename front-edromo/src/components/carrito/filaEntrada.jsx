"use client";

import React from "react";

// El formateador de moneda (sin cambios)
const pen = new Intl.NumberFormat("es-PE", {
  style: "currency",
  currency: "PEN",
  minimumFractionDigits: 2,
});

export const FilaEntrada = ({ item, selected, onToggle, onRemove }) => {
  
  // Calculamos la cantidad total de entradas para este item del carrito
  const totalQuantity = item.entradas.reduce((acc, entrada) => acc + entrada.cantidad, 0);

  return (
    <li className="grid grid-cols-[auto_1fr_128px_160px_auto] items-center gap-x-4 px-4 py-4 transition-colors hover:bg-slate-50">
      {/* Checkbox (Usa 'cartItemId') */}
      <div>
        <input
          type="checkbox"
          checked={selected}
          onChange={() => onToggle(item.cartItemId)} // CORREGIDO
          className="w-6 h-6 text-black border-gray-300 rounded focus:ring-black"
          aria-label={`Seleccionar ${item.eventoInfo.nombre}`}
        />
      </div>

      {/* Imagen y Texto (Usa 'eventoInfo' y 'funcionInfo') */}
      <div className="flex items-center gap-6">
        <img
          src={item.eventoInfo.imagenUrl || "/images/placeholder.png"} // CORREGIDO
          alt={item.eventoInfo.nombre} // CORREGIDO
          className="object-cover w-20 h-20 rounded-lg shrink-0"
          loading="lazy"
        />
        <div className="leading-tight">
          <div className="text-xl font-bold text-gray-800">{item.eventoInfo.nombre}</div> {/* CORREGIDO */}
          <div className="text-base text-gray-500">{item.funcionInfo.fecha} - {item.funcionInfo.hora}</div> {/* CORREGIDO */}
        </div>
      </div>

      {/* Cantidad */}
      <div className="text-lg font-medium text-center text-gray-800 tabular-nums">
        {totalQuantity} {/* CORREGIDO */}
      </div>

      {/* Precio (Usa 'totalItem') */}
      <div className="text-lg font-normal text-right text-gray-900 tabular-nums">
        {pen.format(item.totalItem)} {/* CORREGIDO */}
      </div>

      {/* Botón Eliminar (Usa 'cartItemId') */}
      <div className="flex justify-center w-16">
        <button
          onClick={() => onRemove(item.cartItemId)} // CORREGIDO
          className="text-gray-400 transition-colors hover:text-red-500"
          aria-label={`Eliminar ${item.eventoInfo.nombre}`}
        >
          <svg /* ... (ícono de basura svg) ... */ >
            {/* ... */}
          </svg>
        </button>
      </div>
    </li>
  );
};