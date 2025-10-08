"use client";

import Image, { StaticImageData } from "next/image";
import React from "react";

export type CartItem = {
    id: string;
    imageUrl: string | StaticImageData;
    title: string;
    subtitle: string;
    quantity: number;
    price: number;
};

type CartRowProps = {
    item: CartItem;
    // ELIMINADO: selected: boolean;
    // ELIMINADO: onToggle: (id: string) => void;
};

const pen = new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
    minimumFractionDigits: 2,
});

export const FilaResumenCompra: React.FC<CartRowProps> = ({ item }) => {
    // Validación de item para evitar errores si faltan datos
    if (!item || !item.id || !item.imageUrl || !item.title || !item.subtitle || item.quantity === undefined || item.price === undefined) {
        return (
            <li style={{ color: 'red', padding: '1rem' }}>
                Error: item inválido o incompleto
            </li>
        );
    }
    return (
        // Se ajustan las columnas para coincidir con el encabezado modificado
        // Antes: grid-cols-[40px_2fr_240px_100px]
        // Ahora: grid-cols-[2fr_240px_100px] (Se elimina la primera columna de 40px)
        <li
            className="grid grid-cols-[2fr_240px_100px] items-center px-4 py-3 hover:bg-gray-50 transition"
        >
            {/* ELIMINADO: La columna del checkbox */}
            {/* <div>
                <input
                    type="checkbox"
                    checked={selected}
                    onChange={() => onToggle(item.id)}
                    className="size-5 accent-black"
                    aria-label={`Seleccionar ${item.title} ${item.subtitle}`}
                />
            </div> */}

            <div className="flex items-center gap-3">
                <Image
                    src={item.imageUrl}
                    alt={`${item.title} ${item.subtitle}`}
                    className="h-28 w-28 rounded-md object-cover"
                    loading="lazy"
                />
                <div className="leading-tight">
                    <div className="font-semibold text-gray-900 text-xl">{item.title}</div>
                    <div className="text-lg text-gray-500">{item.subtitle}</div>
                </div>
            </div>

            <div className="text-center tabular-nums text-2xl">{item.quantity}</div>

            <div className="text-right pr-2 text-2xl tabular-nums">
                {pen.format(item.price)}
            </div>
        </li>
    );
};