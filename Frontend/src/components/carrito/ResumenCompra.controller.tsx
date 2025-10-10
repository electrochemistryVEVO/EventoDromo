// src/components/carrito/ResumenCompra.controller.tsx
"use client";

import React, { useState, useEffect } from "react";
import { fetchResumenCompraItems } from "@/services/ResumenCompra.service";
import { ResumenCompraView } from "./ResumenCompra.view";
import type { CartItem } from "./filaEntrada";

/**
 * Controller para ResumenCompra.
 * Maneja la obtención de datos y los estados de carga/error.
 */
export const ResumenCompraController: React.FC = () => {
    const [items, setItems] = useState<CartItem[]>([]);
    const [total, setTotal] = useState<number>(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                setIsLoading(true);
                const { items: data, total: totalAmount } = await fetchResumenCompraItems();
                setItems(data);
                setTotal(totalAmount);
            } catch (err) {
                const message = err instanceof Error ? err.message : "Error desconocido";
                setError(`No se pudo cargar el resumen: ${message}`);
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, []);

    return (
        <ResumenCompraView items={items} total={total} isLoading={isLoading} error={error} />
    );
};