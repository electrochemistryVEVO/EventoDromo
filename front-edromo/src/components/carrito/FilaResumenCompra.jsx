"use client";

import React from "react";

const pen = new Intl.NumberFormat("es-PE", {
  style: "currency",
  currency: "PEN",
  minimumFractionDigits: 2,
});

export const FilaResumenCompra = ({ item }) => {
  return (
    <li className="grid grid-cols-[3fr_1fr_1fr] items-center hover:bg-gray-50 transition py-2">
      <div className="flex items-center gap-2">
        {item.imageUrl && (
          <img
            src={item.imageUrl}
            alt={`${item.title} ${item.subtitle}`}
            className="h-16 w-16 rounded-md object-cover"
            loading="lazy"
          />
        )}
        <div className="flex flex-col gap-1 text-center">
          <div className="font-semibold text-gray-900 text-base">
            {item.title}
          </div>
          <div className="text-sm text-gray-500">{item.subtitle}</div>
        </div>
      </div>
      <div className="text-center text-lg">{item.quantity}</div>
      <div className="text-right pr-2 text-lg">{pen.format(item.price)}</div>
    </li>
  );
};
