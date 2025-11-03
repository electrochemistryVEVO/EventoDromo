'use client'

import React, { useEffect, useState } from 'react'
//import { Modal } from "bootstrap";
import { listarCiudades, listarLocales, obtenerLocalPorId } from "@/services/gestionLocal.service";
import { submitInput, loadLocal, modifyLocal, deleteLocal } from "@/app/admin/locales/controller";
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
import Form from "next/form";

// --- Mock Data ---
const mockData = [
    { id: 1, local: 'Estadio Nacional', ciudad: 'Lima', direccion: 'C. José Díaz S/N', capacidad: 40000, eventos: 0, estado: 'Activo' },
    { id: 2, local: 'Estadio San Marcos', ciudad: 'Lima', direccion: 'Jr. Francisco Moreyra y...', capacidad: 30000, eventos: 3, estado: 'Activo' },
    { id: 3, local: 'Teatro Ricardo Blume', ciudad: 'Lima', direccion: 'Jr. Huiracocha 2193-2115', capacidad: 5000, eventos: 5, estado: 'Activo' },
    { id: 4, local: 'Estadio Inca Garcilaso d...', ciudad: 'Cusco', direccion: 'Pje. América 222', capacidad: 20000, eventos: 0, estado: 'Inactivo' },
    { id: 5, local: 'Casona Boticario', ciudad: 'Arequipa', direccion: 'C. San José 191-101', capacidad: 40000, eventos: 2, estado: 'Activo' },
];

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
const ActionIcons = ({ status, id, setModalData, setCreatePopup, setEdit }) => {
    if (status === 'Inactivo') {
        return (
            <div className="action-icons">
                <FiRotateCcw className="icon-restore" />
            </div>
        );
    }
    return (
        <div className="action-icons">
            <button onClick={() => { console.log("hola"); loadLocal(id, setModalData, setCreatePopup, setEdit) }}>
                <FiEdit />
            </button>
            <button onClick={() => { deleteLocal(id) }}>
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
    let [isEdit, setEdit] = useState(false)
    let [ciudades, setCiudades] = useState([])
    let [locales, setLocales] = useState([]);
    let [modalData, setModalData] = useState({});

    let [filter, setFilter] = useState('')
    let [createPopup, setCreatePopup] = useState(false)
    useEffect(() => {
        listarLocales().then((res) => { setLocales(res?.data) })
        listarCiudades().then((res) => { setCiudades(res?.data) })
    }, []);
    return (
        <>
            <div className="page-container">
                {/* --- Cabecera --- */}
                <header className="page-header">
                    <h1>Gestión de Locales</h1>
                    <button className="btn btn-create" onClick={() => { setCreatePopup(true) }}>
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
                                    console.log(event.target.value);
                                    setFilter(event.target.value.toLowerCase())
                                }}
                            />
                        </div>
                        <button className="btn btn-filter">
                            <FiFilter /> Estado
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
                                {locales
                                    ?.filter((e) => {
                                        return e.nombreCiudad.toLowerCase().includes(filter)
                                            || e.local.toLowerCase().includes(filter)
                                            || e.direccion.toLowerCase().includes(filter)
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
                                                    id={local.id} setModalData={setModalData} setCreatePopup={setCreatePopup} setEdit={setEdit} />
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
                                    {ciudades.map((e) => (<option value={e.id}>{e.nombre}</option>))}
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
        </>
    );
}

export default GestionLocales;