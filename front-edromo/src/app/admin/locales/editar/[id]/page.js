'use client'

import React, { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { FiArrowLeft } from 'react-icons/fi'
import { editarLocal, listarCiudades, obtenerLocalPorId } from '@/services/gestionLocal.service'
import { fetchUserData, getAuthToken } from '@/services/admin-service'
import '@/css/adminLocales/editarLocal.css'

function EditarLocal() {
    const router = useRouter()
    const params = useParams()
    const localId = params.id
    
    const [ciudades, setCiudades] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [isLoadingData, setIsLoadingData] = useState(true)
    const [error, setError] = useState(null)
    const [adminData, setAdminData] = useState(null)
    const [localData, setLocalData] = useState(null)

    useEffect(() => {
        const cargarAdminData = async () => {
            try {
                const token = getAuthToken()
                if (!token) {
                    setError('No se encontró token de autenticación')
                    return
                }

                const userJSON = localStorage.getItem('user')
                if (userJSON) {
                    setAdminData(JSON.parse(userJSON))
                }
            } catch (error) {
                console.error('Error al cargar datos del administrador:', error)
            }
        }

        const cargarCiudades = async () => {
            try {
                const response = await listarCiudades()
                
                // Manejar diferentes formatos de respuesta
                if (response?.success && Array.isArray(response.data)) {
                    setCiudades(response.data)
                } else if (Array.isArray(response?.data)) {
                    setCiudades(response.data)
                } else if (Array.isArray(response)) {
                    setCiudades(response)
                } else if (response?.success === false) {
                    throw new Error(response.error || response.message || 'Error al cargar ciudades')
                }
            } catch (error) {
                console.error('Error al cargar ciudades:', error)
                // Fallback a JSON local
                try {
                    const localResponse = await fetch('/data/ciudades.json')
                    const data = await localResponse.json()
                    setCiudades(data)
                } catch (err) {
                    console.error('Error al cargar ciudades desde JSON:', err)
                }
            }
        }

        const cargarLocalData = async () => {
            try {
                setIsLoadingData(true)
                const response = await obtenerLocalPorId(localId)
                setLocalData(response?.data || response)
            } catch (error) {
                console.error('Error al cargar datos del local:', error)
                setError('Error al cargar los datos del local')
                alert('Error al cargar los datos del local')
            } finally {
                setIsLoadingData(false)
            }
        }

        cargarAdminData()
        cargarCiudades()
        if (localId) {
            cargarLocalData()
        }
    }, [localId])

    const handleSubmit = async (event) => {
        event.preventDefault()
        setIsLoading(true)
        setError(null)
        
        const formData = new FormData(event.target)
        const idCiudad = parseInt(formData.get('idCiudad'))
        const ciudadSeleccionada = ciudades.find(c => c.id === idCiudad)
        
        if (!ciudadSeleccionada) {
            setError('Por favor selecciona una ciudad válida')
            setIsLoading(false)
            return
        }

        const localActualizado = {
            idLocal: parseInt(localId),
            Nombre: formData.get('nombre'),
            CiudadId: idCiudad,
            Direccion: formData.get('direccion'),
            Capacidad: parseInt(formData.get('capacidad')),
        }

        try {
            const result = await editarLocal(localActualizado)
            
            if (result?.success) {
                alert('Local actualizado exitosamente')
                router.push('/admin/locales/gestion')
            } else {
                const errorMsg = result?.message || result?.error || 'Error al actualizar local'
                setError(errorMsg)
                alert('Error al actualizar local: ' + errorMsg)
            }
        } catch (error) {
            const errorMsg = error.message || 'Error de conexión al actualizar local'
            setError(errorMsg)
            alert('Error al actualizar local: ' + errorMsg)
        } finally {
            setIsLoading(false)
        }
    }

    if (isLoadingData) {
        return (
            <div className="editar-local-container">
                <header className="editar-local-header">
                    <button 
                        className="btn-back"
                        onClick={() => router.push('/admin/locales')}
                        aria-label="Volver a gestión de locales"
                    >
                        <FiArrowLeft size={24} />
                    </button>
                    <h1>Editar Local</h1>
                </header>
                <div className="loading-container">
                    <p>Cargando datos del local...</p>
                </div>
            </div>
        )
    }

    if (!localData) {
        return (
            <div className="editar-local-container">
                <header className="editar-local-header">
                    <button 
                        className="btn-back"
                        onClick={() => router.push('/admin/locales')}
                        aria-label="Volver a gestión de locales"
                    >
                        <FiArrowLeft size={24} />
                    </button>
                    <h1>Editar Local</h1>
                </header>
                <div className="error-container">
                    <p>No se pudo cargar los datos del local</p>
                </div>
            </div>
        )
    }

    return (
        <div className="editar-local-container">
            {/* Header */}
            <header className="editar-local-header">
                <button 
                    className="btn-back"
                    onClick={() => router.push('/admin/locales')}
                    aria-label="Volver a gestión de locales"
                >
                    <FiArrowLeft size={24} />
                </button>
                <h1>Editar Local</h1>
            </header>

            {/* Formulario */}
            <div className="form-wrapper">
                <div className="form-card">
                    <div className="form-header">
                        <span className="form-icon">🏛️</span>
                        <h2>Datos del Local</h2>
                    </div>

                    <form id="editar-local-form" onSubmit={handleSubmit} className="form-content">
                        {/* Mensaje de error */}
                        {error && (
                            <div className="error-message" style={{
                                padding: '12px',
                                backgroundColor: '#fee',
                                border: '1px solid #fcc',
                                borderRadius: '4px',
                                color: '#c33',
                                marginBottom: '16px'
                            }}>
                                {error}
                            </div>
                        )}

                        {/* Nombre del Local */}
                        <div className="form-group">
                            <label htmlFor="nombre">
                                Nombre del Local <span className="required">*</span>
                            </label>
                            <input
                                id="nombre"
                                type="text"
                                name="nombre"
                                placeholder="Ej: Teatro Municipal"
                                className="form-input"
                                defaultValue={localData?.nombre || ''}
                                required
                            />
                        </div>

                        {/* Ciudad */}
                        <div className="form-group">
                            <label htmlFor="idCiudad">
                                Ciudad <span className="required">*</span>
                            </label>
                            <select
                                id="idCiudad"
                                name="idCiudad"
                                className="form-select"
                                defaultValue={localData?.idCiudad || ''}
                                required
                            >
                                <option value="">Selecciona una ciudad</option>
                                {ciudades?.map((ciudad) => (
                                    <option key={ciudad.id} value={ciudad.id}>
                                        {ciudad.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Dirección */}
                        <div className="form-group">
                            <label htmlFor="direccion">
                                Dirección <span className="required">*</span>
                            </label>
                            <input
                                id="direccion"
                                type="text"
                                name="direccion"
                                placeholder="Ej: Av. Principal 123"
                                className="form-input"
                                defaultValue={localData?.direccion || ''}
                                required
                            />
                            <p className="form-help-text">
                                La dirección debe ser única y no puede repetirse en el sistema
                            </p>
                        </div>

                        {/* Capacidad */}
                        <div className="form-group">
                            <label htmlFor="capacidad">
                                Capacidad <span className="required">*</span>
                            </label>
                            <input
                                id="capacidad"
                                type="number"
                                name="capacidad"
                                placeholder="Ej: 5,000"
                                className="form-input"
                                defaultValue={localData?.capacidad || ''}
                                min="1"
                                required
                            />
                        </div>

                        {/* Botón Submit */}
                        <button
                            type="submit"
                            className="btn-submit"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Actualizando...' : 'Editar Local'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default EditarLocal
