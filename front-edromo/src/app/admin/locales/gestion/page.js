'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { listarCiudades, listarLocales } from "@/services/gestionLocal.service";
import { submitInput, modifyLocal, deleteLocal, restoreLocal } from "@/app/admin/locales/gestion/controller";
import { getAuthToken } from '@/services/admin-service'
import { getApiUrl } from '@/lib/utils'
import LocalDeleteWarningModal from '@/components/modals/LocalDeleteWarningModal'
import LocalDeleteConfirmModal from '@/components/modals/LocalDeleteConfirmModal'
import LocalRestoreModal from '@/components/modals/LocalRestoreModal'
import LocalUploadCSVModal from '@/components/modals/LocalUploadCSVModal'
import CSVUploadSuccessModal from '@/components/modals/CSVUploadSuccessModal'
import CSVUploadErrorModal from '@/components/modals/CSVUploadErrorModal'
import '@/css/adminLocales/gestionLocales.css';
import {
    FiSearch,
    FiFilter,
    FiPlus,
    FiEdit,
    FiSlash,
    FiRotateCcw,
    FiChevronLeft,
    FiChevronRight,
    FiUpload,
} from 'react-icons/fi';

// --- Sub-componentes ---

/**
 * Componente para la insignia de estado (Activo/Inactivo)
 */
const StatusBadge = ({ status }) => {
    const statusClass = status.toLowerCase(); // 'activo' or 'inactivo'
    return (
        <span className={`status-badge ${statusClass}`}>
            {status}
        </span>
    );
};

/**
 * Componente para los iconos de acción
 */
const ActionIcons = ({ status, id, setModalData, setCreatePopup, setEdit, router, localData, setDeleteModalData, setShowDeleteModal, setShowConfirmModal, setRestoreModalData, setShowRestoreModal }) => {
    if (status === 'Inactivo') {
        return (
            <div className="action-icons">
                <button 
                    onClick={() => {
                        setRestoreModalData(localData);
                        setShowRestoreModal(true);
                    }} 
                    aria-label="Restaurar local"
                >
                    <FiRotateCcw className="icon-restore" />
                </button>
            </div>
        );
    }
    
    const handleDeleteClick = () => {
        setDeleteModalData(localData);
        if (localData.eventos > 0) {
            setShowDeleteModal(true);
        } else {
            setShowConfirmModal(true);
        }
    };
    
    return (
        <div className="action-icons">
            <button onClick={() => router.push(`/admin/locales/editar/${id}`)} aria-label="Editar local">
                <FiEdit />
            </button>
            <button onClick={handleDeleteClick} aria-label="Eliminar local">
                <FiSlash />
            </button>
        </div>
    );
};

/**
 * Componente para la paginación
 */
const Pagination = ({ currentPage, totalPages, onPageChange, itemsPerPage, totalItems, onItemsPerPageChange }) => {
    // Generar números de página a mostrar
    const getPageNumbers = () => {
        const pages = [];
        const maxPagesToShow = 5;
        
        if (totalPages <= maxPagesToShow) {
            // Si hay pocas páginas, mostrarlas todas
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Lógica para mostrar páginas con elipsis
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) pages.push(i);
                pages.push('...');
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1);
                pages.push('...');
                for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
            } else {
                pages.push(1);
                pages.push('...');
                pages.push(currentPage - 1);
                pages.push(currentPage);
                pages.push(currentPage + 1);
                pages.push('...');
                pages.push(totalPages);
            }
        }
        
        return pages;
    };
    
    const pageNumbers = getPageNumbers();
    
    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
            {/* Selector de items por página */}
            <div className="flex items-center gap-2">
                <label htmlFor="items-per-page" className="text-sm text-gray-600">
                    Locales por página:
                </label>
                <select
                    id="items-per-page"
                    value={itemsPerPage}
                    onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
                    className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                </select>
                <span className="text-sm text-gray-600">
                    Mostrando {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)} - {Math.min(currentPage * itemsPerPage, totalItems)} de {totalItems}
                </span>
            </div>
            
            {/* Controles de paginación */}
            <nav className="pagination-container">
                <button 
                    className="pagination-arrow" 
                    aria-label="Página anterior"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    style={{ opacity: currentPage === 1 ? 0.5 : 1, cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
                >
                    <FiChevronLeft />
                </button>
                
                {pageNumbers.map((page, index) => {
                    if (page === '...') {
                        return (
                            <span key={`ellipsis-${index}`} className="pagination-ellipsis">
                                ...
                            </span>
                        );
                    }
                    
                    return (
                        <button
                            key={page}
                            className={`pagination-number ${page === currentPage ? 'active' : ''}`}
                            aria-current={page === currentPage ? 'page' : undefined}
                            onClick={() => onPageChange(page)}
                        >
                            {page}
                        </button>
                    );
                })}
                
                <button 
                    className="pagination-arrow" 
                    aria-label="Siguiente página"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    style={{ opacity: currentPage === totalPages ? 0.5 : 1, cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
                >
                    <FiChevronRight />
                </button>
            </nav>
        </div>
    );
};

// --- Componente Principal ---

function GestionLocales() {
    const router = useRouter()
    const [isEdit, setEdit] = useState(false)
    const [ciudades, setCiudades] = useState([])
    const [locales, setLocales] = useState([])
    const [modalData, setModalData] = useState({})
    const [filter, setFilter] = useState('')
    const [estadoFilter, setEstadoFilter] = useState('Todos')
    const [ciudadFilter, setCiudadFilter] = useState('Todas')
    const [capacidadMin, setCapacidadMin] = useState('')
    const [capacidadMax, setCapacidadMax] = useState('')
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const [createPopup, setCreatePopup] = useState(false)
    const [deleteModalData, setDeleteModalData] = useState(null)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [showConfirmModal, setShowConfirmModal] = useState(false)
    const [showRestoreModal, setShowRestoreModal] = useState(false)
    const [restoreModalData, setRestoreModalData] = useState(null)
    const [showUploadModal, setShowUploadModal] = useState(false)
    const [uploadStep, setUploadStep] = useState(1)
    const [selectedFile, setSelectedFile] = useState(null)
    const [uploadErrors, setUploadErrors] = useState([])
    const [isProcessing, setIsProcessing] = useState(false)
    const [showSuccessModal, setShowSuccessModal] = useState(false)
    const [showErrorModal, setShowErrorModal] = useState(false)
    const [uploadResult, setUploadResult] = useState({ success: 0, failed: 0, errors: [] })
    
    // Estados para paginación
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(20)
    
    useEffect(() => {
        listarLocales().then((res) => { 
            setLocales(res?.data) 
        })
        listarCiudades().then((res) => { 
            if (res && res.success && res.data) {
                setCiudades(res.data)
            } else if (res && res.data) {
                setCiudades(res.data)
            } else if (res && Array.isArray(res)) {
                setCiudades(res)
            }
        })
    }, []);
    
    // Cerrar dropdown al hacer clic fuera
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isDropdownOpen && !event.target.closest('.filter-dropdown-container')) {
                setIsDropdownOpen(false)
            }
        }
        
        document.addEventListener('click', handleClickOutside)
        return () => document.removeEventListener('click', handleClickOutside)
    }, [isDropdownOpen])
    
    // Filtrar locales
    const filteredLocales = locales?.filter((e) => {
        const matchesSearch = e.nombreCiudad?.toLowerCase().includes(filter)
            || e.nombre?.toLowerCase().includes(filter)
            || e.direccion?.toLowerCase().includes(filter)
        
        let matchesEstado = true
        if (estadoFilter === 'Activos') {
            matchesEstado = !e.isDeleted
        } else if (estadoFilter === 'Inactivos') {
            matchesEstado = e.isDeleted
        }
        
        // Filtro de ciudad
        const matchesCiudad = ciudadFilter === 'Todas' || e.nombreCiudad === ciudadFilter
        
        // Filtro de capacidad
        let matchesCapacidad = true
        if (capacidadMin !== '' && e.capacidad < parseInt(capacidadMin)) {
            matchesCapacidad = false
        }
        if (capacidadMax !== '' && e.capacidad > parseInt(capacidadMax)) {
            matchesCapacidad = false
        }
        
        return matchesSearch && matchesEstado && matchesCiudad && matchesCapacidad
    }) || []
    
    // Calcular paginación
    const totalItems = filteredLocales.length
    const totalPages = Math.ceil(totalItems / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const currentLocales = filteredLocales.slice(startIndex, endIndex)
    
    // Funciones de paginación
    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page)
        }
    }
    
    const handleItemsPerPageChange = (newItemsPerPage) => {
        setItemsPerPage(newItemsPerPage)
        setCurrentPage(1) // Resetear a la primera página
    }
    
    // Resetear a página 1 cuando cambian los filtros
    useEffect(() => {
        setCurrentPage(1)
    }, [filter, estadoFilter, ciudadFilter, capacidadMin, capacidadMax])
    
    // Parsear línea de CSV manejando comillas
    const parseCSVLine = (line) => {
        const values = [];
        let current = '';
        let inQuotes = false;
        
        for (let char of line) {
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                values.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }
        values.push(current.trim());
        return values;
    };
    
    // Validar y cargar CSV
    const handleUploadCSV = async () => {
        if (!selectedFile) {
            alert('Por favor selecciona un archivo CSV');
            return;
        }
        
        setIsProcessing(true);
        setUploadErrors([]);
        
        try {
            const text = await selectedFile.text();
            const lines = text.split('\n').filter(line => line.trim());
            
            if (lines.length < 2) {
                throw new Error('El archivo está vacío o solo tiene encabezados');
            }
            
            // Validar headers
            const headers = parseCSVLine(lines[0]).map(h => h.toLowerCase().trim());
            const required = ['nombre_local', 'ciudad', 'direccion', 'capacidad', 'imagen_url'];
            const missing = required.filter(h => !headers.includes(h));
            
            if (missing.length > 0) {
                throw new Error(`Faltan columnas: ${missing.join(', ')}`);
            }
            
            // Procesar filas
            const locales = [];
            const errors = [];
            
            for (let i = 1; i < lines.length; i++) {
                const values = parseCSVLine(lines[i]);
                const row = {};
                headers.forEach((h, idx) => row[h] = values[idx] || '');
                
                const rowNum = i + 1;
                const rowErrors = [];
                
                // Validar campos
                if (!row.nombre_local) rowErrors.push(`Fila ${rowNum}: Falta nombre`);
                if (!row.direccion) rowErrors.push(`Fila ${rowNum}: Falta dirección`);
                
                const ciudad = ciudades.find(c => c.nombre.toLowerCase() === row.ciudad.toLowerCase());
                if (!ciudad) rowErrors.push(`Fila ${rowNum}: Ciudad "${row.ciudad}" no existe`);
                
                const capacidad = parseInt(row.capacidad);
                if (isNaN(capacidad) || capacidad <= 0) rowErrors.push(`Fila ${rowNum}: Capacidad inválida`);
                
                if (row.imagen_url && !/^https?:\/\//i.test(row.imagen_url)) {
                    rowErrors.push(`Fila ${rowNum}: URL inválida`);
                }
                
                if (rowErrors.length > 0) {
                    errors.push(...rowErrors);
                } else {
                    locales.push({
                        nombre: row.nombre_local,
                        idCiudad: ciudad.id,
                        direccion: row.direccion,
                        capacidad: capacidad,
                        imagen: row.imagen_url || ''
                    });
                }
            }
            
            // Si hay errores de validación, mostrarlos en el modal de carga
            if (errors.length > 0) {
                setUploadErrors(errors);
                setIsProcessing(false);
                return;
            }
            
            // Cargar al backend
            const token = getAuthToken();
            const url = await getApiUrl();
            
            const response = await fetch(`${url}/Local/LocalCrearMasivo`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ locales })
            });
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                
                // Cerrar modal de carga y mostrar modal de error
                setShowUploadModal(false);
                setUploadResult({ 
                    success: 0, 
                    failed: locales.length, 
                    errors: [errorData.message || 'Error al cargar locales al servidor'] 
                });
                setShowErrorModal(true);
                setIsProcessing(false);
                return;
            }
            
            const result = await response.json();
            const insertados = result.data?.insertados || result.insertados || locales.length;
            
            // Recargar lista
            const actualizados = await listarLocales();
            setLocales(actualizados?.data || actualizados);
            
            // Cerrar modal de carga y mostrar modal de éxito
            setShowUploadModal(false);
            setSelectedFile(null);
            setUploadStep(1);
            setUploadErrors([]);
            setUploadResult({ success: insertados, failed: 0, errors: [] });
            setShowSuccessModal(true);
            
        } catch (error) {
            // Error general (archivo, formato, etc)
            setShowUploadModal(false);
            setUploadResult({ 
                success: 0, 
                failed: 0, 
                errors: [error.message] 
            });
            setShowErrorModal(true);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
            <div className="page-container">
                {/* --- Cabecera --- */}
                <header className="page-header">
                    <h1>Gestión de Locales</h1>
                    <div className="flex items-center gap-3">
                        <button className="btn btn-secondary" onClick={() => setShowUploadModal(true)}>
                            <FiUpload /> Cargar CSV
                        </button>
                        <button className="btn btn-create" onClick={() => router.push('/admin/locales/crear')}>
                            <FiPlus /> Crear local
                        </button>
                    </div>
                </header>

                {/* --- Contenedor Principal (Filtros + Tabla) --- */}
                <div className="content-wrapper">

                    {/* --- Barra de Filtros --- */}
                    <div className="filters-bar">
                        <div className="search-bar">
                            <FiSearch className="search-icon" />
                            <input
                                type="text"
                                placeholder="Busca Local"
                                onChange={(event) => {
                                    setFilter(event.target.value.toLowerCase())
                                }}
                            />
                        </div>
                        
                        {/* Dropdown de Estado */}
                        <div className="filter-dropdown-container">
                            <button 
                                className="btn btn-filter" 
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            >
                                <FiFilter /> Estado
                            </button>
                            
                            {isDropdownOpen && (
                                <div className="filter-dropdown">
                                    <button 
                                        className={`filter-option ${estadoFilter === 'Todos' ? 'active' : ''}`}
                                        onClick={() => {
                                            setEstadoFilter('Todos')
                                            setIsDropdownOpen(false)
                                        }}
                                    >
                                        Todos
                                    </button>
                                    <button 
                                        className={`filter-option ${estadoFilter === 'Activos' ? 'active' : ''}`}
                                        onClick={() => {
                                            setEstadoFilter('Activos')
                                            setIsDropdownOpen(false)
                                        }}
                                    >
                                        Activos
                                    </button>
                                    <button 
                                        className={`filter-option ${estadoFilter === 'Inactivos' ? 'active' : ''}`}
                                        onClick={() => {
                                            setEstadoFilter('Inactivos')
                                            setIsDropdownOpen(false)
                                        }}
                                    >
                                        Inactivos
                                    </button>
                                </div>
                            )}
                        </div>
                        
                        {/* Filtro por Ciudad */}
                        <div className="filter-select">
                            <label htmlFor="ciudad-filter">Ciudad</label>
                            <select
                                id="ciudad-filter"
                                value={ciudadFilter}
                                onChange={(e) => setCiudadFilter(e.target.value)}
                            >
                                <option value="Todas">Todas</option>
                                {ciudades.map((ciudad) => (
                                    <option key={ciudad.id} value={ciudad.nombre}>
                                        {ciudad.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>
                        
                        {/* Filtro por Capacidad */}
                        <div className="filter-select">
                            <label>Capacidad</label>
                            <div className="filter-date-range">
                                <input
                                    type="number"
                                    placeholder="Mín"
                                    value={capacidadMin}
                                    onChange={(e) => setCapacidadMin(e.target.value)}
                                    style={{ width: '100px' }}
                                />
                                <span>-</span>
                                <input
                                    type="number"
                                    placeholder="Máx"
                                    value={capacidadMax}
                                    onChange={(e) => setCapacidadMax(e.target.value)}
                                    style={{ width: '100px' }}
                                />
                            </div>
                        </div>
                        
                        {/* Botón para limpiar filtros */}
                        <button
                            onClick={() => {
                                setCiudadFilter('Todas')
                                setCapacidadMin('')
                                setCapacidadMax('')
                                setEstadoFilter('Todos')
                                setFilter('')
                                // Limpiar también el campo de búsqueda
                                const searchInput = document.querySelector('.search-bar input')
                                if (searchInput) searchInput.value = ''
                            }}
                            className="text-sm text-red-600 hover:text-red-800 font-medium self-end pb-2"
                        >
                            Limpiar filtros
                        </button>
                    </div>

                    {/* --- Contenedor de la Tabla (para scroll horizontal) --- */}
                    <div className="table-container">
                        <table className="locales-table">
                            <thead>
                                <tr>
                                    <th>Local</th>
                                    <th>Ciudad</th>
                                    <th>Dirección</th>
                                    <th>Capacidad</th>
                                    <th>Eventos</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentLocales.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="text-center py-8 text-gray-500">
                                            No se encontraron locales
                                        </td>
                                    </tr>
                                ) : (
                                    currentLocales.map((local) => (
                                        <tr key={local.id}>
                                            <td>{local.nombre}</td>
                                            <td>{local.nombreCiudad}</td>
                                            <td>
                                                <div style={{ maxWidth: '250px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={local.direccion}>
                                                    {local.direccion}
                                                </div>
                                            </td>
                                            <td>{local.capacidad.toLocaleString('es-ES')}</td>
                                            <td>
                                                {local.eventos} {local.eventos === 1 ? 'Evento' : 'Eventos'}
                                            </td>
                                            <td>

                                                <StatusBadge status={!local.isDeleted ? 'Activo' : 'Inactivo'} />
                                            </td>
                                            <td>
                                                <ActionIcons status={!local.isDeleted ? 'Activo' : 'Inactivo'}
                                                    id={local.id} 
                                                    setModalData={setModalData} 
                                                    setCreatePopup={setCreatePopup} 
                                                    setEdit={setEdit} 
                                                    router={router}
                                                    localData={local}
                                                    setDeleteModalData={setDeleteModalData}
                                                    setShowDeleteModal={setShowDeleteModal}
                                                    setShowConfirmModal={setShowConfirmModal}
                                                    setRestoreModalData={setRestoreModalData}
                                                    setShowRestoreModal={setShowRestoreModal} />
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* --- Paginación --- */}
                    {totalItems > 0 && (
                        <Pagination 
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                            itemsPerPage={itemsPerPage}
                            totalItems={totalItems}
                            onItemsPerPageChange={handleItemsPerPageChange}
                        />
                    )}
                </div>
            </div>

            {/* --- Modal --- */}
            {createPopup && (
                <div className="fixed z-[999] inset-0 bg-black/50 grid h-screen w-screen place-items-center shadow-md">
                    <div className="z-[999] relative w-100 vh-100 mx-auto bg-[var(--color-primary-light)] rounded-xl shadow p-6">
                        {/* Encabezado */}
                        <h2 className="text-xl font-semibold text-[var(--color-text-dark)] flex items-center gap-2 mb-4">
                            <span className="text-2xl">🏛️</span>
                            {isEdit ? "Editar Local" : "Insertar Local"}
                        </h2>

                        {/* Formulario */}
                        <form id="local-modal" onSubmit={(event) => {
                            if (isEdit) modifyLocal(event, modalData); else submitInput(event)
                        }} className="space-y-4">
                            {/* Nombre del Local */}
                            <div>
                                <label className="block text-sm font-medium text-[var(--color-text-dark)] mb-1">
                                    Nombre del Local <span className="text-[var(--color-red)]">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="nombre"
                                    placeholder="Ej: Teatro Municipal"
                                    defaultValue={modalData.nombre}
                                    className="w-full border border-[var(--color-border)] rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-light)]"
                                    required
                                />
                            </div>

                            {/* Ciudad */}
                            <div>
                                <label className="block text-sm font-medium text-[var(--color-text-dark)] mb-1">
                                    Ciudad <span className="text-[var(--color-red)]">*</span>
                                </label>
                                <select
                                    name="idCiudad"
                                    defaultValue={modalData.idCiudad}
                                    required
                                    className="w-full border border-[var(--color-border)] rounded-md p-2 bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-light)]"
                                >
                                    <option value="">Selecciona una ciudad</option>
                                    {ciudades.map((ciudad) => (
                                        <option key={ciudad.id} value={ciudad.id}>
                                            {ciudad.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Dirección */}
                            <div>
                                <label className="block text-sm font-medium text-[var(--color-text-dark)] mb-1">
                                    Dirección <span className="text-[var(--color-red)]">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="direccion"
                                    defaultValue={modalData.direccion}
                                    placeholder="Ej: Av. Principal 123"
                                    required
                                    className="w-full border border-[var(--color-border)] rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-light)]"
                                />
                                <p className="text-xs text-[var(--color-text-light)] mt-1">
                                    La dirección debe ser única y no puede repetirse en el sistema
                                </p>
                            </div>

                            {/* Capacidad */}
                            <div>
                                <label className="block text-sm font-medium text-[var(--color-text-dark)] mb-1">
                                    Capacidad <span className="text-[var(--color-red)]">*</span>
                                </label>
                                <input
                                    type="number"
                                    name="capacidad"
                                    defaultValue={modalData.capacidad}
                                    placeholder="Ej: 5,000"
                                    required
                                    className="w-full border border-[var(--color-border)] rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-light)]"
                                />
                            </div>

                            {/* Botón */}
                            <button
                                type="submit"
                                className="w-full flex justify-center items-center gap-2 bg-[var(--color-primary)] text-white font-semibold py-2.5 rounded-md hover:bg-[#15a890] transition-all"
                            >
                                Crear Local
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* --- Modal: No se puede inactivar (con eventos activos) --- */}
            <LocalDeleteWarningModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                localData={deleteModalData}
            />

            {/* --- Modal: Confirmación de inactivación (sin eventos activos) --- */}
            <LocalDeleteConfirmModal
                isOpen={showConfirmModal}
                onClose={() => setShowConfirmModal(false)}
                onConfirm={async () => {
                    await deleteLocal(deleteModalData.id);
                    setShowConfirmModal(false);
                    const res = await listarLocales();
                    setLocales(res?.data);
                }}
                localData={deleteModalData}
            />

            {/* --- Modal: Confirmación de restauración --- */}
            <LocalRestoreModal
                isOpen={showRestoreModal}
                onClose={() => setShowRestoreModal(false)}
                onConfirm={async () => {
                    try {
                        const result = await restoreLocal(restoreModalData.id);
                        const isSuccess = result && (
                            result.success === true || 
                            result.success === undefined ||
                            result.status === 'success' ||
                            (result.message && !result.message.toLowerCase().includes('error'))
                        );
                        
                        if (isSuccess) {
                            alert('Local restaurado exitosamente');
                            setShowRestoreModal(false);
                            const res = await listarLocales();
                            setLocales(res?.data);
                        } else {
                            alert(result?.message || 'Error al restaurar el local');
                        }
                    } catch (error) {
                        alert('Error al restaurar el local: ' + error.message);
                    }
                }}
                localData={restoreModalData}
            />

            {/* --- Modal: Cargar CSV --- */}
            <LocalUploadCSVModal
                isOpen={showUploadModal}
                onClose={() => setShowUploadModal(false)}
                uploadStep={uploadStep}
                setUploadStep={setUploadStep}
                selectedFile={selectedFile}
                setSelectedFile={setSelectedFile}
                uploadErrors={uploadErrors}
                setUploadErrors={setUploadErrors}
                onUpload={handleUploadCSV}
                isProcessing={isProcessing}
            />

            {/* --- Modal: Éxito CSV --- */}
            <CSVUploadSuccessModal
                isOpen={showSuccessModal}
                onClose={() => {
                    setShowSuccessModal(false);
                    setUploadResult({ success: 0, failed: 0, errors: [] });
                }}
                count={uploadResult.success}
            />

            {/* --- Modal: Error CSV --- */}
            <CSVUploadErrorModal
                isOpen={showErrorModal}
                onClose={() => {
                    setShowErrorModal(false);
                    setUploadResult({ success: 0, failed: 0, errors: [] });
                    setShowUploadModal(true);
                }}
                errors={uploadResult.errors}
                failedCount={uploadResult.failed}
            />
        </div>
    );
}

export default GestionLocales;