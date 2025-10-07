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
    selected: boolean;
    onToggle: (id: string) => void;
};

const pen = new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
    minimumFractionDigits: 2,
});

export const FilaEntrada: React.FC<CartRowProps> = ({ item, selected, onToggle }) => {
    return (
        <li
            className="grid grid-cols-[48px_1fr_120px_140px] items-center px-4 py-3 hover:bg-gray-50 transition"
        >
            <div>
                <input
                    type="checkbox"
                    checked={selected}
                    onChange={() => onToggle(item.id)}
                    className="size-4 accent-black"
                    aria-label={`Seleccionar ${item.title} ${item.subtitle}`}
                />
            </div>

            <div className="flex items-center gap-3">
                <Image
                    src={item.imageUrl}
                    alt={`${item.title} ${item.subtitle}`}
                    className="h-12 w-12 rounded-md object-cover"
                    loading="lazy"
                />
                <div className="leading-tight">
                    <div className="font-semibold text-gray-900">{item.title}</div>
                    <div className="text-xs text-gray-500">{item.subtitle}</div>
                </div>
            </div>

            <div className="text-center tabular-nums">{item.quantity}</div>

            <div className="text-right pr-2 font-medium tabular-nums">
                {pen.format(item.price)}
            </div>
        </li>
    );
};