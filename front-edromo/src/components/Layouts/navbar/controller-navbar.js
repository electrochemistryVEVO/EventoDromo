"use client"; // Necesario porque usa hooks de cliente (useState, useEffect, useRouter, useSearchParams)

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation'; // Hooks de Next.js App Router

// --- Hook Personalizado para la Lógica del Navbar ---
export function useNavbarController() {
    const router = useRouter();
    const searchParams = useSearchParams(); // Hook para leer parámetros de la URL actual

    // --- ESTADO PARA FILTROS ACTIVOS ---
    // Se inicializa leyendo los parámetros de la URL actual
    const [activeFilters, setActiveFilters] = useState(() => {
        const currentFilters = {};
        if (searchParams.get('categoria')) currentFilters.categoria = searchParams.get('categoria');
        if (searchParams.get('ciudad')) currentFilters.ciudad = searchParams.get('ciudad');
        if (searchParams.get('precioMin')) currentFilters.precioMin = searchParams.get('precioMin');
        if (searchParams.get('precioMax')) currentFilters.precioMax = searchParams.get('precioMax');
        if (searchParams.get('fechaInicio')) currentFilters.fechaInicio = searchParams.get('fechaInicio');
        if (searchParams.get('fechaFin')) currentFilters.fechaFin = searchParams.get('fechaFin');
        // Ya no lee 'fecha'
        if (searchParams.get('busqueda')) currentFilters.busqueda = searchParams.get('busqueda');
        return currentFilters;
    });

    // --- ESTADO PARA EL INPUT DE BÚSQUEDA ---
    const [searchTerm, setSearchTerm] = useState(searchParams.get('busqueda') || '');

    // --- EFECTO PARA ACTUALIZAR ESTADOS SI LA URL CAMBIA ---
    useEffect(() => {
        const currentFilters = {};
        if (searchParams.get('categoria')) currentFilters.categoria = searchParams.get('categoria');
        if (searchParams.get('ciudad')) currentFilters.ciudad = searchParams.get('ciudad');
        if (searchParams.get('precioMin')) currentFilters.precioMin = searchParams.get('precioMin');
        if (searchParams.get('precioMax')) currentFilters.precioMax = searchParams.get('precioMax');
        if (searchParams.get('fechaInicio')) currentFilters.fechaInicio = searchParams.get('fechaInicio');
        if (searchParams.get('fechaFin')) currentFilters.fechaFin = searchParams.get('fechaFin');
        // Ya no lee 'fecha'
        if (searchParams.get('busqueda')) currentFilters.busqueda = searchParams.get('busqueda');
        setActiveFilters(currentFilters);
        setSearchTerm(searchParams.get('busqueda') || '');
    }, [searchParams]);

    // --- FUNCIÓN PARA APLICAR/ACTUALIZAR UN FILTRO ---
    const applyFilter = (filterData) => {
        console.log("Aplicando filtro:", filterData);
        const newFilters = { ...activeFilters };

        switch (filterData.tipo) {
            case 'precio':
                newFilters.precioMin = filterData.min || null;
                newFilters.precioMax = filterData.max || null;
                break;
            case 'categoria':
                newFilters.categoria = filterData.valor; // Recibe string (con comas si hay multi) o null
                break;
            case 'ciudad':
                newFilters.ciudad = filterData.valor; // Recibe string (con comas si hay multi) o null
                break;
            case 'fecha':
                 // Recibe inicio y fin (YYYY-MM-DD) o null
                 newFilters.fechaInicio = filterData.inicio || null;
                 newFilters.fechaFin = filterData.fin || null;
                 delete newFilters.fecha; // Asegura que no quede el parámetro antiguo
                break;
             case 'busqueda':
                 newFilters.busqueda = filterData.valor;
                 break;
            default:
                console.warn("Tipo de filtro desconocido:", filterData.tipo);
                return;
        }

        // Limpia valores nulos, undefined o vacíos
        Object.keys(newFilters).forEach(key => {
            if (newFilters[key] === null || newFilters[key] === undefined || newFilters[key] === '') {
                 delete newFilters[key];
            }
        });

        // Construye queryString y navega
        const queryString = new URLSearchParams(newFilters).toString();
        router.push(`/user/eventos/lista?${queryString}`);
    };

    // --- FUNCIÓN PARA LIMPIAR/ELIMINAR UN FILTRO ---
    const clearFilter = (filterType) => {
       console.log("Limpiando filtro:", filterType);
        const newFilters = { ...activeFilters };

        switch (filterType) {
            case 'precio':
                delete newFilters.precioMin; delete newFilters.precioMax; break;
            case 'categoria':
                delete newFilters.categoria; break;
            case 'ciudad':
                delete newFilters.ciudad; break;
            case 'fecha':
                 delete newFilters.fechaInicio; delete newFilters.fechaFin;
                 delete newFilters.fecha; // Limpia también por si acaso
                break;
             case 'busqueda':
                 delete newFilters.busqueda; setSearchTerm(''); break;
            default:
                console.warn("Tipo de filtro desconocido para limpiar:", filterType); return;
        }

        // Construye queryString y navega
        const queryString = new URLSearchParams(newFilters).toString();
        router.push(`/user/eventos/lista?${queryString}`);
    };

    // --- HANDLERS PARA EL INPUT DE BÚSQUEDA ---
    const handleSearchChange = (event) => { setSearchTerm(event.target.value); };
    const handleSearchSubmit = (event) => {
        event.preventDefault();
        applyFilter({ tipo: 'busqueda', valor: searchTerm });
    };

    // --- VALORES DEVUELTOS POR EL HOOK ---
    return {
        applyFilter,
        clearFilter,
        handleSearchChange,
        handleSearchSubmit,
        activeFilters, // Para pasar a los modales
        searchTerm,    // Para el input
    };
}

