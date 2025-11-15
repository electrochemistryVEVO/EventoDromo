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
const Pagination = () => {
    return (
        <nav className="pagination-container">
            <button className="pagination-arrow" aria-label="Página anterior">
                <FiChevronLeft />
            </button>
            <button className="pagination-number active" aria-current="page">1</button>
            <button className="pagination-number">2</button>
            <span className="pagination-ellipsis">...</span>
            <span className="pagination-number-static">9</span>
            <span className="pagination-number-static">10</span>
            <button className="pagination-arrow" aria-label="Siguiente página">
                <FiChevronRight />
            </button>
        </nav>
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

    return (
        <>
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
                                {locales
                                    ?.filter((e) => {
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
                                    })
                                    ?.map((local) => (
                                        <tr key={local.id}>
                                            <td>{local.nombre}</td>
                                            <td>{local.nombreCiudad}</td>
                                            <td>{local.direccion}</td>
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
                                    ))}
                            </tbody>
                        </table>
                    </div>

                    {/* --- Paginación --- */}
                    <Pagination />
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
        </>
    );
}

export default GestionLocales;