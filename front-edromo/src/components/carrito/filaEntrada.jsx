"use client";

import React from "react";

const pen = new Intl.NumberFormat("es-PE", {
  style: "currency",
  currency: "PEN",
  minimumFractionDigits: 2,
});

export const FilaEntrada = ({ item, selected, onToggle, onRemove }) => {
  return (
    <li className="grid grid-cols-[auto_1fr_128px_160px_auto] items-center gap-x-4 px-4 py-4 transition-colors hover:bg-slate-50">
      {/* Checkbox */}
      <div>
        <input
          type="checkbox"
          checked={selected}
          onChange={() => onToggle(item.id)}
          className="h-6 w-6 rounded border-gray-300 text-black focus:ring-black"
          aria-label={`Seleccionar ${item.title} ${item.subtitle}`}
        />
      </div>

      {/* Imagen y Texto */}
      <div className="flex items-center gap-6">
        <img
          src={item.imageUrl || "/images/placeholder.png"}
          alt={`${item.title} ${item.subtitle}`}
          className="h-20 w-20 flex-shrink-0 rounded-lg object-cover"
          loading="lazy"
        />
        <div className="leading-tight">
          <div className="text-xl font-bold text-gray-800">{item.title}</div>
          <div className="text-base text-gray-500">{item.subtitle}</div>
        </div>
      </div>

      {/* Cantidad */}
      <div className="text-center text-lg font-medium text-gray-800 tabular-nums">
        {item.quantity}
      </div>

      {/* Precio */}
      <div className="text-right text-lg font-normal text-gray-900 tabular-nums">
        {pen.format(item.price)}
      </div>

      {/* Botón Eliminar */}
      <div className="flex w-16 justify-center">
        <button
          onClick={() => onRemove(item.id)}
          className="text-gray-400 hover:text-red-500 transition-colors"
          aria-label={`Eliminar ${item.title}`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>
    </li>
  );
};
