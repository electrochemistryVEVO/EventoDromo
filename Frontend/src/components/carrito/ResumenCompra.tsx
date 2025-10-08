"use client";

import { FilaResumenCompra, CartItem } from "./FilaResumenCompra";
// import { useState } from "react"; // ELIMINADO: Ya no es necesario
import "@/css/checkboxCarrito.css";
// import { useState } from "react"; // ELIMINADO: Ya no es necesario

type Props = { items?: CartItem[] };

export const ResumenCompra: React.FC<Props> = ({ items = [] }) => {
    console.log("TablaEntradas: items =", items); 
    // const [selected, setSelected] = useState<Set<string>>(new Set()); // ELIMINADO: Ya no se usa

    // const allSelected = items.length > 0 && selected.size === items.length; // ELIMINADO: Ya no se usa

    // const toggleAll = () => { // ELIMINADO: Ya no se usa
    //     const next = new Set<string>();
    //     if (!allSelected) items.forEach((i) => next.add(i.id));
    //     setSelected(next);
    // };

    // const toggleOne = (id: string) => { // ELIMINADO: Ya no se usa
    //     const next = new Set(selected);
    //     next.has(id) ? next.delete(id) : next.add(id);
    //     setSelected(next);
    // };

    return (
    <div className="tabla-entradas-carrito rounded-xl border border-gray-200 bg-white">
            {/* Encabezado: Se ajustan las columnas y se elimina el checkbox */}
            {/* Antes: grid-cols-[40px_2fr_90px_180px] */}
            {/* Ahora: grid-cols-[2fr_90px_180px] (Se elimina la primera columna de 40px) */}
            <div className="grid grid-cols-[2fr_90px_180px] items-center px-6 py-4 text-gray-600 bg-gray-50 rounded-t-xl" style={{ fontSize: '1.25rem' }}>
                {/* ELIMINADO: La columna del checkbox */}
                <div>Evento</div>
                <div className="text-center">Cantidad</div>
                <div className="text-right pr-2">Total</div>
            </div>

            {/* Filas */}
            <ul className="divide-y divide-gray-200" style={{marginLeft: '-20px'}} >
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