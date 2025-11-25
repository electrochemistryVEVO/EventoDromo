'use client'

import React, { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { insertarLocal, listarCiudades } from '@/services/gestionLocal.service'
import { fetchUserData, getAuthToken } from '@/services/admin-service'
import LocalValidationModal from '@/components/modals/LocalValidationModal'
import LocalSuccessModal from '@/components/modals/LocalSuccessModal'

// Importar MapLocationPicker dinámicamente para evitar problemas con SSR
const MapLocationPicker = dynamic(
    () => import('@/components/admin-locales/MapLocationPicker'),
    { ssr: false, loading: () => <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">Cargando mapa...</div> }
)

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
    const [imagenURL, setImagenURL] = useState('')
    const [imageError, setImageError] = useState(false)
    const [locationData, setLocationData] = useState(null)
    const [selectedImage, setSelectedImage] = useState(null)
    const [imagePreview, setImagePreview] = useState(null)
    const [isUploadingImage, setIsUploadingImage] = useState(false)

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
        
        // Validar que se haya seleccionado ubicación en el mapa
        if (!locationData || !locationData.lat || !locationData.lng) {
            errors.push('Debe seleccionar la ubicacion del local en el mapa')
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

        try {
            // 1. Subir imagen a S3 si hay una seleccionada
            let imagenUrlSubida = null
            if (selectedImage) {
                setIsUploadingImage(true)
                const imageFormData = new FormData()
                imageFormData.append('imagen', selectedImage)
                
                const token = getAuthToken()
                const url = await getApiUrl()
                const uploadResponse = await fetch(`${url}/Local/SubirImagenLocal`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    body: imageFormData
                })
                
                if (uploadResponse.ok) {
                    const uploadResult = await uploadResponse.json()
                    if (uploadResult.success) {
                        imagenUrlSubida = uploadResult.data
                    }
                }
                setIsUploadingImage(false)
            }

            // 2. Crear el local
            const local = {
                Nombre: nombre,
                CiudadId: ciudadSeleccionada.id,
                Direccion: direccion,
                Capacidad: capacidad,
                imagenURL: imagenUrlSubida || null,
                Latitud: locationData?.lat || null,
                Longitud: locationData?.lng || null,
                GoogleMapsUrl: locationData?.googleMapsUrl || null
            }

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
            setIsUploadingImage(false)
        }
    }

    const handleImageChange = (e) => {
        const file = e.target.files?.[0]
        if (file) {
            // Validar tipo de archivo
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
            if (!allowedTypes.includes(file.type)) {
                alert('Solo se permiten imágenes (JPG, PNG, GIF, WEBP)')
                e.target.value = ''
                return
            }
            
            // Validar tamaño (máximo 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert('La imagen no debe exceder 5MB')
                e.target.value = ''
                return
            }
            
            setSelectedImage(file)
            
            // Crear preview
            const reader = new FileReader()
            reader.onloadend = () => {
                setImagePreview(reader.result)
                setImageError(false)
            }
            reader.readAsDataURL(file)
        }
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
                        Creación de Local
                    </h1>
                </header>

                <div className="space-y-6">
                    {/* --- Formulario del Local --- */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
                            <span className="text-3xl">🏛️</span>
                            <h2 className="text-xl font-semibold text-gray-800">Datos del Local</h2>
                        </div>

                        <form id="crear-local-form" onSubmit={handleSubmit} className="space-y-6">
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

                            {/* Selección de Ubicación en Mapa */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Ubicación del Local <span className="text-red-500">*</span>
                                </label>
                                <MapLocationPicker 
                                    onLocationSelect={(data) => {
                                        setLocationData(data)
                                        // Actualizar el campo direccion automáticamente
                                        const direccionInput = document.getElementById('direccion')
                                        if (direccionInput && data.address) {
                                            direccionInput.value = data.address
                                        }
                                    }}
                                />
                                {locationData && (
                                    <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg text-sm">
                                        <p className="font-medium text-green-800">Ubicación seleccionada:</p>
                                        <p className="text-green-700">📍 {locationData.address}</p>
                                        <p className="text-green-600 text-xs mt-1">
                                            Coordenadas: {locationData.lat.toFixed(6)}, {locationData.lng.toFixed(6)}
                                        </p>
                                    </div>
                                )}
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
                                    placeholder="Seleccione la ubicación en el mapa"
                                    value={locationData?.address || ''}
                                    readOnly
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 cursor-not-allowed"
                                    required
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    La dirección se completa automáticamente al seleccionar una ubicación en el mapa
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
                                    min="1"
                                    required
                                />
                            </div>

                            {/* Vista Previa de Imagen */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Imagen del Local
                                </label>
                                <div className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                                    {imagePreview && !imageError ? (
                                        <img 
                                            src={imagePreview} 
                                            alt="Vista previa del local" 
                                            className="max-h-full max-w-full object-contain"
                                            onError={() => setImageError(true)}
                                        />
                                    ) : (
                                        <div className="flex flex-col items-center justify-center text-gray-400">
                                            <svg 
                                                className="w-16 h-16 mb-2" 
                                                fill="none" 
                                                stroke="currentColor" 
                                                viewBox="0 0 24 24"
                                            >
                                                <path 
                                                    strokeLinecap="round" 
                                                    strokeLinejoin="round" 
                                                    strokeWidth="2" 
                                                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                                                />
                                                <path 
                                                    strokeLinecap="round" 
                                                    strokeLinejoin="round" 
                                                    strokeWidth="2" 
                                                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                                                />
                                            </svg>
                                            <span className="text-sm">{imageError ? 'Error al cargar imagen' : 'Sin imagen'}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Subir Imagen */}
                            <div className="space-y-2">
                                <label htmlFor="imagenFile" className="block text-sm font-medium text-gray-700">
                                    Subir Imagen
                                </label>
                                <input
                                    id="imagenFile"
                                    type="file"
                                    accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                                    onChange={handleImageChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00C49A] focus:border-transparent outline-none transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#00C49A] file:text-white hover:file:bg-green-700"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Formatos permitidos: JPG, PNG, GIF, WEBP. Tamaño máximo: 5MB
                                </p>
                            </div>

                            {/* Botón Submit */}
                            <div className="flex justify-end items-center gap-4 pt-4">
                                <button
                                    type="submit"
                                    disabled={isLoading || isUploadingImage}
                                    className="bg-[#00C49A] text-white font-bold px-6 py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all"
                                >
                                    {isUploadingImage ? 'Subiendo imagen...' : isLoading ? 'Creando Local...' : 'Crear Local'}
                                </button>
                            </div>
                        </form>
                    </div>
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
