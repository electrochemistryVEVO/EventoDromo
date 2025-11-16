'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { insertarLocal, listarCiudades } from '@/services/gestionLocal.service'
import { fetchUserData, getAuthToken } from '@/services/admin-service'
import LocalValidationModal from '@/components/modals/LocalValidationModal'
import LocalSuccessModal from '@/components/modals/LocalSuccessModal'
import '@/css/adminLocales/crearLocal.css'

function CrearLocal() {
    const router = useRouter()
    const [ciudades, setCiudades] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const [adminData, setAdminData] = useState(null)
    const [showValidationModal, setShowValidationModal] = useState(false)
    const [showSuccessModal, setShowSuccessModal] = useState(false)
    const [validationErrors, setValidationErrors] = useState([])
    const [localName, setLocalName] = useState('')

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
        const nombre = formData.get('nombre')
        const idCiudad = parseInt(formData.get('idCiudad'))
        const direccion = formData.get('direccion')
        const capacidad = parseInt(formData.get('capacidad'))
        
        setLocalName(nombre)
        
        // Validación de datos
        const errors = []
        
        // Validar nombre del local (más de 3 caracteres)
        if (!nombre || nombre.trim().length <= 3) {
            errors.push('El nombre del local de tener mas de 3 caracteres')
        }
        
        // Validar ciudad seleccionada
        const ciudadSeleccionada = ciudades.find(c => c.id === idCiudad)
        if (!ciudadSeleccionada || !idCiudad) {
            errors.push('Debe seleccionar una ciudad que sea valida')
        }
        
        // Validar dirección (más de 6 caracteres)
        if (!direccion || direccion.trim().length <= 6) {
            errors.push('La direccion debe tener mas de 6 caracteres')
        }
        
        // Validar capacidad (número válido mayor a 0)
        if (!capacidad || isNaN(capacidad) || capacidad <= 0) {
            errors.push('La capacidad debe ser un numero valido')
        }
        
        // Si hay errores, mostrar modal de validación
        if (errors.length > 0) {
            setValidationErrors(errors)
            setShowValidationModal(true)
            setIsLoading(false)
            return
        }

        const local = {
            Nombre: nombre,
            CiudadId: ciudadSeleccionada.id,
            Direccion: direccion,
            Capacidad: capacidad
        }

        try {
            const result = await insertarLocal(local)
            
            if (result?.success) {
                setShowSuccessModal(true)
                // Redirigir después de 2 segundos
                setTimeout(() => {
                    router.push('/admin/locales/gestion')
                }, 2000)
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

            {/* Modales */}
            <LocalValidationModal
                isOpen={showValidationModal}
                onClose={() => setShowValidationModal(false)}
                errors={validationErrors}
                localName={localName}
            />
            
            <LocalSuccessModal
                isOpen={showSuccessModal}
                onClose={() => {
                    setShowSuccessModal(false)
                    router.push('/admin/locales/gestion')
                }}
                count={1}
            />
        </div>
    )
}

export default CrearLocal
