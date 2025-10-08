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
            className="grid grid-cols-[1fr_1fr_1fr] items-center hover:bg-gray-50 transition"
        >
            <div className="flex items-center gap-2">
                <Image
                    src={item.imagenURL}
                    alt={`${item.nombreEvento} ${item.nombreLocal}`}
                    className="h-28 w-28 rounded-md object-cover"
                    loading="lazy"
                />
                <div className="flex flex-col gap-1 text-center">
                    <div className="font-semibold text-gray-900 text-xl">{item.nombreEvento}</div>
                    <div className="text-lg text-gray-500">{item.nombreLocal}</div>
                </div>
            </div>
            <div className="text-center text-2xl">{item.cantidadEntradas}</div>
            <div className="text-right pr-2 text-2xl">
                {pen.format(item.precioEntrada)}
            </div>
        </li>
    );
};