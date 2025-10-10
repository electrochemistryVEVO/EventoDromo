// src/components/carrito/TablaEntradas.controller.tsx
"use client";

import React, { useState, useEffect } from "react";
import { fetchTablaEntradas } from "@/services/TablaEntradas.service";
import { TablaEntradasView } from "./TablaEntradas.view";
import type { CartItem } from "./filaEntrada";

/**
 * Controller para TablaEntradas.
 * Maneja la obtención de datos, el estado de selección y la lógica de eliminación.
 */
export const TablaEntradasController: React.FC = () => {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    useEffect(() => {
        const loadData = async () => {
            try {
                setIsLoading(true);
                const data = await fetchTablaEntradas();
                setItems(data);
            } catch (err) {
                setError("Error al cargar las entradas. Inténtalo de nuevo más tarde.");
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, []);

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

    // Simula la eliminación de un item. En una app real, llamaría a un servicio.
    const handleRemoveItem = (id: string) => {
        setItems(prev => prev.filter(item => item.id !== id));
    };

    const handleRemoveSelected = () => {
        setItems(prev => prev.filter(item => !selectedIds.has(item.id)));
        setSelectedIds(new Set());
    };

    const isAllSelected = items.length > 0 && selectedIds.size === items.length;
    const isIndeterminate = selectedIds.size > 0 && selectedIds.size < items.length;

    return <TablaEntradasView
        items={items}
        selectedIds={selectedIds}
        isAllSelected={isAllSelected}
        isIndeterminate={isIndeterminate}
        onToggle={handleToggle}
        onToggleAll={handleToggleAll}
        onRemoveItem={handleRemoveItem}
        onRemoveSelected={handleRemoveSelected}
        isLoading={isLoading}
        error={error}
    />;
};