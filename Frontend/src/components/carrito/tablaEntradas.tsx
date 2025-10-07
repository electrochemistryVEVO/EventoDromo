"use client";

import { FilaEntrada, CartItem } from "./filaEntrada"   ;
import { useState } from "react";

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
        <div className="w-full rounded-xl border border-gray-200 bg-white">
            {/* Encabezado */}
            <div className="grid grid-cols-[48px_1fr_120px_140px] items-center px-4 py-3 text-sm font-medium text-gray-600 bg-gray-50 rounded-t-xl">
                <div>
                    <input
                        type="checkbox"
                        checked={allSelected}
                        onChange={toggleAll}
                        className="size-4 accent-black"
                    />
                </div>
                <div>Evento</div>
                <div className="text-center">Cantidad</div>
                <div className="text-right pr-2">Total</div>
            </div>

            {/* Filas */}
            <ul className="divide-y divide-gray-200">
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