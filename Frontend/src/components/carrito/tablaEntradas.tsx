"use client";

import React, { useState, useEffect, useRef } from "react";
import { FilaEntrada, type CartItem } from "./filaEntrada";

type TablaEntradasProps = {
    items: CartItem[];
    onRemoveItem: (id: string) => void;
};

export const TablaEntradas: React.FC<TablaEntradasProps> = ({ items, onRemoveItem }) => {
    const selectAllCheckboxRef = useRef<HTMLInputElement>(null);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    const handleToggle = (id: string) => {
        setSelectedIds(prev => {
            const newSelected = new Set(prev);
            if (newSelected.has(id)) {
                newSelected.delete(id);
            } else {
                newSelected.add(id);
            }
            return newSelected;
        });
    };

    const handleToggleAll = () => {
        if (selectedIds.size === items.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(items.map(item => item.id)));
        }
    };

    const handleRemoveSelected = () => {
        selectedIds.forEach(id => {
            onRemoveItem(id);
        });
        setSelectedIds(new Set());
    };

    const isAllSelected = items.length > 0 && selectedIds.size === items.length;
    const isIndeterminate = selectedIds.size > 0 && selectedIds.size < items.length;

    useEffect(() => {
        if (selectAllCheckboxRef.current) {
            selectAllCheckboxRef.current.indeterminate = isIndeterminate;
        }
    }, [isIndeterminate]);

    return (
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
            {/* Encabezado de la Tabla */}
            <header className="grid grid-cols-[auto_1fr_128px_160px_auto] items-center gap-x-4 bg-[#EEECEC] px-4 py-5 text-lg font-bold uppercase text-slate-600">
                {/* Checkbox "Seleccionar Todo" */}
                <div>
                    <input
                        type="checkbox"
                        ref={selectAllCheckboxRef}
                        checked={isAllSelected}
                        onChange={handleToggleAll}
                        className="h-6 w-6 rounded border-gray-300 text-black focus:ring-black"
                        aria-label="Seleccionar todo"
                    />
                </div>
                {/* Título de Producto */}
                <div className="text-2xl" >Evento</div>
                {/* Título de Cantidad */}
                <div className="text-center text-2xl tracking-wider">Cantidad</div>
                {/* Título de Precio */}
                <div className="text-right text-2xl tracking-wider">Precio</div>
                {/* Columna vacía para alinear el botón de eliminar (debe coincidir con el ancho del botón) */}
                <div className="w-16" />
            </header>
            <ul className="divide-y divide-gray-200 p-0">
                {items.map((item) => (
                    <FilaEntrada
                        key={item.id}
                        item={item}
                        selected={selectedIds.has(item.id)}
                        onToggle={handleToggle}
                        onRemove={onRemoveItem}
                    />
                ))}
            </ul>
            {/* Footer de la Tabla */}
            <footer className="flex items-center justify-center gap-x-4 rounded-b-lg bg-[#EEECEC] px-4 py-4">
                <button
                    onClick={handleRemoveSelected}
                    disabled={selectedIds.size === 0}
                    className="rounded-md bg-red-600 px-8 py-3 text-2xl font-bold text-white shadow-sm transition-colors hover:bg-red-500 disabled:cursor-not-allowed disabled:bg-gray-400 disabled:opacity-70"
                >
                    Borrar seleccionados
                </button>
            </footer>
        </div>
    );
};