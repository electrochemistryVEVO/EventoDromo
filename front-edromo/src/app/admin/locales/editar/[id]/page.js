'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { obtenerLocalPorId, editarLocal, listarCiudades } from '@/services/gestionLocal.service'
import { fetchUserData, getAuthToken } from '@/services/admin-service'
import LocalValidationModal from '@/components/modals/LocalValidationModal'
import LocalSuccessModal from '@/components/modals/LocalSuccessModal'

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

        const localActualizado = {
            idLocal: parseInt(localId),
            Nombre: nombre,
            CiudadId: idCiudad,
            Direccion: direccion,
            Capacidad: capacidad,
        }

        try {
            const result = await editarLocal(localActualizado)
            
            if (result?.success) {
                setShowSuccessModal(true)
                // Redirigir después de 2 segundos
                setTimeout(() => {
                    router.push('/admin/locales/gestion')
                }, 2000)
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
            <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
                <div className="max-w-4xl mx-auto">
                    <header className="flex items-center gap-4 mb-6">
                        <button
                            onClick={() => router.back()}
                            className="text-gray-600 hover:text-black"
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M15 19l-7-7 7-7"
                                ></path>
                            </svg>
                        </button>
                        <h1 className="text-2xl font-bold text-gray-800">
                            Editar Local
                        </h1>
                    </header>
                    <div className="bg-white rounded-lg shadow-md p-6 text-center">
                        <p className="text-gray-600">Cargando datos del local...</p>
                    </div>
                </div>
            </div>
        )
    }

    if (!localData) {
        return (
            <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
                <div className="max-w-4xl mx-auto">
                    <header className="flex items-center gap-4 mb-6">
                        <button
                            onClick={() => router.back()}
                            className="text-gray-600 hover:text-black"
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M15 19l-7-7 7-7"
                                ></path>
                            </svg>
                        </button>
                        <h1 className="text-2xl font-bold text-gray-800">
                            Editar Local
                        </h1>
                    </header>
                    <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
                        <p>No se pudo cargar los datos del local</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
            <div className="max-w-4xl mx-auto">
                {/* --- Encabezado de la Página --- */}
                <header className="flex items-center gap-4 mb-6">
                    <button
                        onClick={() => router.back()}
                        className="text-gray-600 hover:text-black"
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M15 19l-7-7 7-7"
                            ></path>
                        </svg>
                    </button>
                    <h1 className="text-2xl font-bold text-gray-800">
                        Editar Local
                    </h1>
                </header>

                <div className="space-y-6">
                    {/* --- Formulario del Local --- */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
                            <span className="text-3xl">🏛️</span>
                            <h2 className="text-xl font-semibold text-gray-800">Datos del Local</h2>
                        </div>

                        <form id="editar-local-form" onSubmit={handleSubmit} className="space-y-6">
                            {/* Mensaje de error */}
                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                                    {error}
                                </div>
                            )}

                            {/* Nombre del Local */}
                            <div className="space-y-2">
                                <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">
                                    Nombre del Local <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="nombre"
                                    type="text"
                                    name="nombre"
                                    placeholder="Ej: Teatro Municipal"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00C49A] focus:border-transparent outline-none transition-all"
                                    defaultValue={localData?.nombre || ''}
                                    required
                                />
                            </div>

                            {/* Ciudad */}
                            <div className="space-y-2">
                                <label htmlFor="idCiudad" className="block text-sm font-medium text-gray-700">
                                    Ciudad <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="idCiudad"
                                    name="idCiudad"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00C49A] focus:border-transparent outline-none transition-all appearance-none bg-white"
                                    style={{
                                        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                                        backgroundPosition: 'right 0.5rem center',
                                        backgroundRepeat: 'no-repeat',
                                        backgroundSize: '1.5em 1.5em',
                                        paddingRight: '2.5rem'
                                    }}
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
                            <div className="space-y-2">
                                <label htmlFor="direccion" className="block text-sm font-medium text-gray-700">
                                    Dirección <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="direccion"
                                    type="text"
                                    name="direccion"
                                    placeholder="Ej: Av. Principal 123"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00C49A] focus:border-transparent outline-none transition-all"
                                    defaultValue={localData?.direccion || ''}
                                    required
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    La dirección debe ser única y no puede repetirse en el sistema
                                </p>
                            </div>

                            {/* Capacidad */}
                            <div className="space-y-2">
                                <label htmlFor="capacidad" className="block text-sm font-medium text-gray-700">
                                    Capacidad <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="capacidad"
                                    type="number"
                                    name="capacidad"
                                    placeholder="Ej: 5,000"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00C49A] focus:border-transparent outline-none transition-all"
                                    defaultValue={localData?.capacidad || ''}
                                    min="1"
                                    required
                                />
                            </div>

                            {/* Botón Submit */}
                            <div className="flex justify-end items-center gap-4 pt-4">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="bg-[#00C49A] text-white font-bold px-6 py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all"
                                >
                                    {isLoading ? 'Actualizando Local...' : 'Actualizar Local'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* Modales */}
            <LocalEditValidationModal
                isOpen={showValidationModal}
                onClose={() => setShowValidationModal(false)}
                errors={validationErrors}
                localName={localName}
            />
            
            <LocalEditSuccessModal
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

export default EditarLocal
