"use client";

import React from 'react';
import Image, { StaticImageData } from "next/image";
import "@/css/costoDetalleEntradas.css";

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
        <div className="costo-detalle-frame">
            <table className="costo-detalle-table">
                <thead>
                    <tr>
                        <th>Entrada</th>
                        <th>Costo Unitario</th>
                        <th>Subtotal</th>
                    </tr>
                </thead>
                <tbody>
                    {entradasArray.map((entrada, idx) => (
                        <tr key={idx}>
                            <td>{entrada.quantity} x {entrada.subtitle}</td>
                            <td>S/. {entrada.price.toFixed(2)}</td>
                            <td>S/. {(entrada.quantity * entrada.price).toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="costo-detalle-total">
                Total: S/. {total.toFixed(2)}
            </div>
            <div className="costo-detalle-puntos">
                ¡En esta compra ganarás {dromoPuntosGanar.toFixed(0)} DromoPuntos!
            </div>
        </div>
    );
};

export default CostoDetalleEntradas;