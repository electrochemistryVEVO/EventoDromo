"use client";

import { FilaEntrada, CartItem } from "./filaEntrada"   ;
import { useState } from "react";
import "@/css/checkboxCarrito.css";

type Props = { items?: CartItem[] };

export const TablaEntradas: React.FC<Props> = ({ items = [] }) => {
    console.log("TablaEntradas: items =", items); 
    const [selected, setSelected] = useState<Set<string>>(new Set());

    const allSelected = items.length > 0 && selected.size === items.length;

    const toggleAll = () => {
        const next = new Set<string>();
        if (!allSelected) items.forEach((i) => next.add(i.id));
        setSelected(next);
    };

    const toggleOne = (id: string) => {
        const next = new Set(selected);
        next.has(id) ? next.delete(id) : next.add(id);
        setSelected(next);
    };

    return (
    <div className="tabla-entradas-carrito rounded-xl border border-gray-200 bg-white">
            {/* Encabezado */}
            <div className="grid grid-cols-[40px_2fr_90px_180px] items-center px-6 py-4 text-gray-600 bg-gray-50 rounded-t-xl" style={{ fontSize: '1.25rem' }}>
                <div >
                    <input
                        type="checkbox"
                        checked={allSelected}
                        onChange={toggleAll}
                        className="size-6 accent-black"
                    />
                </div>
                <div>Evento</div>
                <div className="text-center">Cantidad</div>
                <div className="text-right pr-2">Total</div>
            </div>

            {/* Filas */}
            <ul className="divide-y divide-gray-200" style={{marginLeft: '-20px'}} >
                {items.map((item) => (
                    <FilaEntrada
                        key={item.id}
                        item={item}
                        selected={selected.has(item.id)}
                        onToggle={toggleOne}
                    />
                ))}
            </ul>
        </div>
    );
};