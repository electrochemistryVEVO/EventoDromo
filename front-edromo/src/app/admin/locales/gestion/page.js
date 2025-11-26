'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { listarCiudades, listarLocales } from "@/services/gestionLocal.service";
import { submitInput, modifyLocal, deleteLocal, restoreLocal } from "@/app/admin/locales/gestion/controller";
import '@/css/adminLocales/gestionLocales.css';
import {
    FiSearch,
    FiFilter,
    FiPlus,
    FiEdit,
    FiSlash,
    FiRotateCcw,
    FiChevronLeft,
    FiChevronRight
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
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const [createPopup, setCreatePopup] = useState(false)
    const [deleteModalData, setDeleteModalData] = useState(null)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [showConfirmModal, setShowConfirmModal] = useState(false)
    const [showRestoreModal, setShowRestoreModal] = useState(false)
    const [restoreModalData, setRestoreModalData] = useState(null)
    
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
        
        return matchesSearch && matchesEstado
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
    }, [filter, estadoFilter])

    return (
        <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
            <div className="page-container">
                {/* --- Cabecera --- */}
                <header className="page-header">
                    <h1>Gestión de Locales</h1>
                    <button className="btn btn-create" onClick={() => router.push('/admin/locales/crear')}>
                        <FiPlus /> Crear local
                    </button>
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
            {showDeleteModal && deleteModalData && (
                <div className="fixed z-[999] inset-0 bg-black/50 grid h-screen w-screen place-items-center">
                    <div className="relative max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8">
                        {/* Botón Cerrar */}
                        <button 
                            onClick={() => setShowDeleteModal(false)}
                            className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
                            aria-label="Cerrar modal"
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>

                        {/* Título */}
                        <h2 className="text-2xl font-bold text-red-600 mb-4">
                            No se puede inactivar este local
                        </h2>

                        {/* Mensaje */}
                        <p className="text-gray-700 text-lg mb-6">
                            El local <strong>{deleteModalData.nombre}</strong> no puede ser puesto en estado inactivo por que tiene <strong>{deleteModalData.eventos} eventos activos</strong>
                        </p>

                        {/* Caja de advertencia */}
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                            <div className="flex items-start gap-3">
                                <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="12" cy="12" r="10"></circle>
                                        <line x1="12" y1="8" x2="12" y2="12"></line>
                                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                                    </svg>
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-red-800 text-lg mb-1">
                                        Eventos activos: {deleteModalData.eventos}
                                    </h3>
                                    <p className="text-red-700 text-sm">
                                        Para bloquear este local, primero debe cancelar o finalizar todos los eventos activos
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Botón */}
                        <div className="flex justify-end">
                            <button 
                                onClick={() => setShowDeleteModal(false)}
                                className="px-8 py-2.5 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* --- Modal: Confirmación de inactivación (sin eventos activos) --- */}
            {showConfirmModal && deleteModalData && (
                <div className="fixed z-[999] inset-0 bg-black/50 grid h-screen w-screen place-items-center">
                    <div className="relative max-w-xl mx-auto bg-white rounded-2xl shadow-xl p-8">
                        {/* Título */}
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">
                            ¿Estas seguro de que quieres inactivar el local "{deleteModalData.nombre}"?
                        </h2>

                        {/* Mensaje */}
                        <p className="text-gray-600 mb-8">
                            Esta acción marcará el local como inactivo pero podrás restaurarlo más tarde.
                        </p>

                        {/* Botones */}
                        <div className="flex justify-end gap-3">
                            <button 
                                onClick={() => setShowConfirmModal(false)}
                                className="px-6 py-2.5 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                            >
                                Cancelar
                            </button>
                            <button 
                                onClick={() => {
                                    deleteLocal(deleteModalData.id);
                                    setShowConfirmModal(false);
                                    listarLocales().then((res) => { 
                                        setLocales(res?.data) 
                                    });
                                }}
                                className="px-6 py-2.5 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors font-medium"
                            >
                                Inactivar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* --- Modal: Confirmación de restauración --- */}
            {showRestoreModal && restoreModalData && (
                <div className="fixed z-[999] inset-0 bg-black/50 grid h-screen w-screen place-items-center">
                    <div className="relative max-w-xl mx-auto bg-white rounded-2xl shadow-xl p-8">
                        {/* Título */}
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">
                            Restaurar Local
                        </h2>

                        {/* Mensaje */}
                        <p className="text-gray-700 text-lg mb-8">
                            ¿Estas seguro de que quieres restaurar el local "{restoreModalData.nombre}"? El local volverá a estar activo y disponible para eventos.
                        </p>

                        {/* Botones */}
                        <div className="flex justify-end gap-3">
                            <button 
                                onClick={() => setShowRestoreModal(false)}
                                className="px-6 py-2.5 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                            >
                                Cancelar
                            </button>
                            <button 
                                onClick={async () => {
                                    try {
                                        console.log('[BUTTON] Iniciando restauración del local:', restoreModalData);
                                        const result = await restoreLocal(restoreModalData.id);
                                        console.log('[BUTTON] Resultado de restoreLocal:', result);
                                        
                                        // Verificar varios casos de éxito
                                        const isSuccess = result && (
                                            result.success === true || 
                                            result.success === undefined ||
                                            result.status === 'success' ||
                                            (result.message && !result.message.toLowerCase().includes('error'))
                                        );
                                        
                                        if (isSuccess) {
                                            console.log('[BUTTON] Restauración exitosa');
                                            alert('Local restaurado exitosamente');
                                            setShowRestoreModal(false);
                                            const res = await listarLocales();
                                            console.log('[BUTTON] Lista actualizada:', res);
                                            setLocales(res?.data);
                                        } else {
                                            console.error('[BUTTON] Error en restauración:', result);
                                            alert(result?.message || 'Error al restaurar el local');
                                        }
                                    } catch (error) {
                                        console.error('[BUTTON] Error capturado:', error);
                                        alert('Error al restaurar el local: ' + error.message);
                                    }
                                }}
                                className="px-6 py-2.5 text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors font-medium"
                            >
                                Restaurar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default GestionLocales;