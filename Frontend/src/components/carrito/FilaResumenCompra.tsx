"use client";

import Image, { StaticImageData } from "next/image";
import React from "react";
import { EntradaDTO } from "@/lib/dto";

type CartRowProps = {
    item: EntradaDTO;
};

const pen = new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
    minimumFractionDigits: 2,
});

export const FilaResumenCompra: React.FC<CartRowProps> = ({ item }) => {
    return (
        <li
            className="grid grid-cols-[2fr_240px_100px] items-center px-4 py-3 hover:bg-gray-50 transition"
        >
            <div className="flex items-center gap-3">
                <Image
                    src={item.imagenURL}
                    alt={`${item.nombreEvento} ${item.nombreLocal}`}
                    className="h-28 w-28 rounded-md object-cover"
                    loading="lazy"
                />
                <div className="leading-tight">
                    <div className="font-semibold text-gray-900 text-xl">{item.nombreEvento}</div>
                    <div className="text-lg text-gray-500">{item.nombreLocal}</div>
                </div>
            </div>
            <div className="text-center tabular-nums text-2xl">{item.cantidadEntradas}</div>
            <div className="text-right pr-2 text-2xl tabular-nums">
                {pen.format(item.precioEntrada)}
            </div>
        </li>
    );
};