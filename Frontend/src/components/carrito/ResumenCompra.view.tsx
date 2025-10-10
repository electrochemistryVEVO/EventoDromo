// src/components/carrito/ResumenCompra.view.tsx
"use client";

import { FilaResumenCompra } from "./FilaResumenCompra";
import { CartItem } from "./filaEntrada";

type Props = {
    items: CartItem[];
    total: number;
    isLoading: boolean;
    error: string | null;
};

const pen = new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
    minimumFractionDigits: 2,
});

export const ResumenCompraView: React.FC<Props> = ({ items, total, isLoading, error }) => {
    const renderContent = () => {
        if (isLoading) {
            return <li className="p-4 text-center">Cargando resumen...</li>;
        }
        if (error) {
            return <li className="p-4 text-center text-red-500">{error}</li>;
        }
        if (items.length === 0) {
            return <li className="p-4 text-center">No hay entradas en el carrito.</li>;
        }
        return items.map((item) => (
            <FilaResumenCompra key={item.id} item={item} />
        ));
    };

    return (
        // Contenedor principal que envuelve tanto la lista como el total
        <div className="flex flex-col h-full">
            <div className="rounded-xl border border-gray-200 bg-white">
                <div className="grid grid-cols-[3fr_1fr_1fr] items-center px-3 py-4 text-gray-600 bg-gray-50 rounded-t-xl text-xl">
                    <div className="text-center">Evento</div>
                    <div className="text-center">Cantidad</div>
                    <div className="text-center">Total</div>
                </div>
                <ul className="divide-y divide-gray-200 pl-0 mb-0 px-3 py-2">
                    {renderContent()}
                </ul>
            </div>
            {/* Div para el total, hermano de la lista de items */}
            <div className="mt-auto pt-4 border-t border-gray-300 flex flex-col items-center gap-4">
                <div className="text-xl font-bold text-gray-800">
                    Importe total: {pen.format(total)}
                </div>
            </div>
        </div>
    );
};