"use client";

import React from 'react';
import Image, { StaticImageData } from "next/image";

export type Entrada = {
    id: string;
    imageUrl: string | StaticImageData;
    title: string;
    subtitle: string;
    quantity: number;
    price: number;
};

type Props = {
    entradas: Entrada[];
};

const CostoDetalleEntradas: React.FC<Props> = ({ entradas }) => {
    const entradasArray = Array.isArray(entradas) ? entradas : [];
    const total = entradasArray.reduce(
        (acc, entrada) => acc + entrada.quantity * entrada.price,
        0
    );
    const dromoPuntosGanar = total/100;

    return (
        <div className="mt-6 w-full bg-white pl-15 pr-15 pt-15 pb-5 shadow-2">
            <table className="w-full border-collapse ">
                <thead>
                    <tr>
                        <th className="pb-3 text-left text-2xl font-semibold text-gray-600">Entrada</th>
                        <th className="pb-3 text-center text-2xl font-semibold text-gray-600">Costo Unitario</th>
                        <th className="pb-3 text-center text-2xl font-semibold text-gray-600">Subtotal</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-300">
                    {entradasArray.map((entrada, idx) => (
                        <tr key={idx} className="text-xl">
                            <td className="py-4"> x {entrada.quantity} {entrada.subtitle}</td>
                            <td className="py-4 text-center">S/. {entrada.price.toFixed(2)}</td>
                            <td className="py-4 text-center">S/. {(entrada.quantity * entrada.price).toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="mt-6 border-t-2 border-gray-300 pt-4 text-right text-3xl font-bold text-gray-800">
                Total: S/. {total.toFixed(2)}
            </div>
            <div className="mt-8 w-fit rounded-lg bg-[#00C49A] px-8 py-3 text-center text-xl font-semibold text-white shadow-md mx-auto">
                ¡En esta compra ganarás {dromoPuntosGanar.toFixed(0)} DromoPuntos!
            </div>
        </div>
    );
};

export default CostoDetalleEntradas;