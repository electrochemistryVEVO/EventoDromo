"use client";

import { FilaResumenCompra } from "./FilaResumenCompra";
import "@/css/checkboxCarrito.css";
import { EntradaDTO } from "@/lib/dto";

type Props = { items?: EntradaDTO[] };

export const ResumenCompra: React.FC<Props> = ({ items = [] }) => {
    return (
        <div className="tabla-entradas-carrito rounded-xl border border-gray-200 bg-white">
            <div className="grid grid-cols-[2fr_90px_180px] items-center px-6 py-4 text-gray-600 bg-gray-50 rounded-t-xl" style={{ fontSize: '1.25rem' }}>
                <div>Evento</div>
                <div className="text-center">Cantidad</div>
                <div className="text-right pr-2">Total</div>
            </div>
            <ul className="divide-y divide-gray-200" style={{ marginLeft: '-20px' }} >
                {items.map((item) => (
                    <FilaResumenCompra
                        key={item.id}
                        item={item}
                    />
                ))}
            </ul>
        </div>
    );
};