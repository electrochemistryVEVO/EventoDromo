"use client";

import { FilaResumenCompra } from "./FilaResumenCompra";
import "@/css/checkboxCarrito.css";
import { EntradaDTO } from "@/lib/dto";

type Props = { items?: EntradaDTO[] };

export const ResumenCompra: React.FC<Props> = ({ items = [] }) => {
    return (
        <div className="rounded-xl border border-gray-200 bg-white">
            <div className="grid grid-cols-[3fr_1fr_1fr] items-center px-3 py-4 text-gray-600 bg-gray-50 rounded-t-xl text-xl">
                <div className="text-center">Evento</div>
                <div className="text-center">Cantidad</div>
                <div className="text-center">Total</div>
            </div>
            <ul className="divide-y divide-gray-200 pl-0 mb-0 px-3 py-2">
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