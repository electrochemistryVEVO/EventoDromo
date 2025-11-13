"use client";

import React from "react";

const pen = new Intl.NumberFormat("es-PE", {
  style: "currency",
  currency: "PEN",
  minimumFractionDigits: 2,
});

export const FilaEntrada = ({
  item,
  selected,
  onToggle,
  onRemove,
  onDecrease,
  onIncrease,
  isLoading,
}) => {
  const {
    rowId,
    eventName,
    fecha,
    hora,
    tierName,
    quantity,
    totalPrice,
    imageUrl,
  } = item;

  return (
    <li className="grid grid-cols-[auto_1fr_160px_160px_auto] items-center gap-x-4 px-4 py-4 transition-colors hover:bg-slate-50">
      <div>
        <input
          type="checkbox"
          checked={selected}
          onChange={() => onToggle(rowId)}
          className="w-6 h-6 text-black border-gray-300 rounded focus:ring-black"
          aria-label={`Seleccionar ${eventName} ${tierName}`}
        />
      </div>

      <div className="flex items-center gap-6">
        <img
          src={imageUrl}
          alt={eventName}
          className="object-cover w-20 h-20 rounded-lg shrink-0"
          loading="lazy"
        />
        <div className="leading-tight">
          <div className="text-xl font-bold text-gray-800">{eventName}</div>
          <div className="text-base text-gray-500">
            {fecha}
            {hora ? ` - ${hora}` : ""}
          </div>
          <div className="text-sm font-medium text-gray-600">{tierName}</div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-3 text-gray-800">
        <button
          type="button"
          onClick={onDecrease}
          disabled={isLoading || quantity <= 0}
          className="flex items-center justify-center w-9 h-9 rounded-full border border-slate-300 text-lg font-semibold transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
          aria-label={`Disminuir cantidad de ${eventName} ${tierName}`}
        >
          −
        </button>
        <span className="text-lg font-semibold tabular-nums">{quantity}</span>
        <button
          type="button"
          onClick={onIncrease}
          disabled={isLoading || (item.limiteCompra > 0 && item.quantity >= item.limiteCompra)}
          className="flex items-center justify-center w-9 h-9 rounded-full border border-slate-300 text-lg font-semibold transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
          aria-label={`Incrementar cantidad de ${eventName} ${tierName}`}
        >
          +
        </button>
      </div>

      <div className="text-lg font-normal text-right text-gray-900 tabular-nums">
        {pen.format(totalPrice)}
      </div>

      <div className="flex justify-center w-16">
        <button
          type="button"
          onClick={onRemove}
          disabled={isLoading}
          className="text-gray-400 transition-colors hover:text-red-500"
          aria-label={`Eliminar ${eventName} ${tierName}`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6"
          >
            <path d="M9 3a1 1 0 0 0-.894.553L7.382 5H4a1 1 0 1 0 0 2h.278l.846 12.206A2 2 0 0 0 7.117 21h9.766a2 2 0 0 0 1.993-1.794L19.722 7H20a1 1 0 1 0 0-2h-3.382l-.724-1.447A1 1 0 0 0 15 3ZM9.618 5h4.764l.5 1H9.118ZM9 9a1 1 0 0 0-1 1v7a1 1 0 1 0 2 0v-7a1 1 0 0 0-1-1Zm6 0a1 1 0 0 0-1 1v7a1 1 0 1 0 2 0v-7a1 1 0 0 0-1-1Z" />
          </svg>
        </button>
      </div>
    </li>
  );
};