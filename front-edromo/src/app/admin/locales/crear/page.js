'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { FiArrowLeft } from 'react-icons/fi'
import { insertarLocal, listarCiudades } from '@/services/gestionLocal.service'
import { fetchUserData, getAuthToken } from '@/services/admin-service'
import '@/css/adminLocales/crearLocal.css'

function CrearLocal() {
    const router = useRouter()
    const [ciudades, setCiudades] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const [adminData, setAdminData] = useState(null)

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

        cargarAdminData()
        cargarCiudades()
    }, [])

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

        const local = {
            id: 0,
            nombre: formData.get('nombre'),
            idCiudad: idCiudad,
            imagenURL: "",
            ciudad: {
                id: ciudadSeleccionada.id,
                nombre: ciudadSeleccionada.nombre,
                idPais: ciudadSeleccionada.idPais || 0,
                pais: ciudadSeleccionada.pais || {
                    id: ciudadSeleccionada.idPais || 0,
                    nombre: ciudadSeleccionada.nombrePais || "Perú"
                }
            },
            direccion: formData.get('direccion'),
            capacidad: parseInt(formData.get('capacidad')),
            isDeleted: false,
            idAdministrador: adminData?.id || 0,
            administrador: {
                id: adminData?.id || 0,
                nombres: adminData?.nombres || "",
                apellidos: adminData?.apellidos || "",
                email: adminData?.email || "",
                passwordHash: "",
                fechaCreacion: adminData?.fechaCreacion || new Date().toISOString()
            },
            nombreCiudad: ciudadSeleccionada.nombre,
            eventos: 0
        }

        try {
            const result = await insertarLocal(local)
            
            if (result?.success) {
                alert('Local creado exitosamente')
                router.push('/admin/locales/gestion')
            } else {
                const errorMsg = result?.message || result?.error || 'Error al crear local'
                setError(errorMsg)
                alert('Error al crear local: ' + errorMsg)
            }
        } catch (error) {
            const errorMsg = error.message || 'Error de conexión al crear local'
            setError(errorMsg)
            alert('Error al crear local: ' + errorMsg)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="crear-local-container">
            {/* Header */}
            <header className="crear-local-header">
                <button 
                    className="btn-back"
                    onClick={() => router.push('/admin/locales/gestion')}
                    aria-label="Volver a gestión de locales"
                >
                    <FiArrowLeft size={24} />
                </button>
                <h1>Crear Local</h1>
            </header>

            {/* Formulario */}
            <div className="form-wrapper">
                <div className="form-card">
                    <div className="form-header">
                        <span className="form-icon">🏛️</span>
                        <h2>Datos del Local</h2>
                    </div>

                    <form id="crear-local-form" onSubmit={handleSubmit} className="form-content">
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
                            {isLoading ? 'Creando...' : '+ Crear Local'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default CrearLocal
