'use client';
import React, { useState, useEffect } from 'react';
// Esta es la línea clave que te falta:
import { controllerPerfil } from './controller-informacion-personal'; // O la ruta correcta a tu controlador

export default function PerfilPage() {
  // Estado para los datos del formulario (datosCliente)
  const [formData, setFormData] = useState({
    nombres: '',
    apellidos: '',
    email: '',
    idCiudad: '',
    idSexo: '',
    telefono: '',
    fechaNacimiento: '',
  });

  // Estado para guardar los datos originales y usarlos en "Cancelar"
  const [originalFormData, setOriginalFormData] = useState(null);

  // Estado para las listas de los dropdowns
  const [selectOptions, setSelectOptions] = useState({
    paises: [],
    ciudades: [],
    sexos: [],
  });

  // Estado para el ID del país seleccionado (para filtrar ciudades)
  const [selectedPaisId, setSelectedPaisId] = useState('');

  // Estados de UI
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState(null); // { type: 'success' | 'error', text: string }

  // Función para cargar los datos iniciales
  const fetchData = async () => {
    setIsLoading(true);
    setMessage(null);
    try {
      // Invoca al controlador para cargar datos
      const data = await controllerPerfil.onPageLoad();

      if (data && data.datosCliente) {
        setFormData(data.datosCliente);
        setOriginalFormData(data.datosCliente); // Guarda el original para "Cancelar"
        setSelectOptions({
          paises: data.paises || [],
          ciudades: data.ciudades || [],
          sexos: data.sexos || [],
        });

        // Encontrar el país inicial basado en la ciudad
        const ciudadActual = (data.ciudades || []).find(c => c.id === data.datosCliente.idCiudad);
        if (ciudadActual) {
          setSelectedPaisId(ciudadActual.idPais);
        }
      } else {
        throw new Error("El formato de datos recibido no es correcto.");
      }

    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  // Cargar datos al montar el componente
  useEffect(() => {
    fetchData();
  }, []);

  // Manejador para actualizar el estado cuando cambian los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Convertir a número si es un ID de las listas
    const newValue = (name === 'idCiudad' || name === 'idSexo') ? (value ? parseInt(value, 10) : '') : value;

    setFormData(prevState => ({
      ...prevState,
      [name]: newValue,
    }));
  };

  // Manejador específico para el cambio de País
  const handlePaisChange = (e) => {
    const newPaisId = e.target.value ? parseInt(e.target.value, 10) : '';
    setSelectedPaisId(newPaisId);

    // Al cambiar de país, reseteamos la ciudad en el formulario
    setFormData(prevState => ({
      ...prevState,
      idCiudad: '', // Resetea la ciudad seleccionada
    }));
  };

  // Función que se ejecuta cuando el usuario envía el formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    // Invoca a la función onSubmit() del controlador
    const response = await controllerPerfil.onSubmit(formData);

    setIsSaving(false);

    if (response.success) {
      setMessage({ type: 'success', text: response.message || 'Cambios guardados con éxito' });
      // Actualiza el "original" para que "Cancelar" refleje los nuevos datos guardados
      setOriginalFormData(formData);
    } else {
      setMessage({ type: 'error', text: response.message });
    }
  };

  // Manejador para el botón "Cancelar"
  const handleCancel = () => {
    // Revierte el formulario a los últimos datos guardados (o los iniciales)
    if (originalFormData) {
      setFormData(originalFormData);

      // Resetea también el país seleccionado
      const ciudadActual = selectOptions.ciudades.find(c => c.id === originalFormData.idCiudad);
      if (ciudadActual) {
        setSelectedPaisId(ciudadActual.idPais);
      } else {
        setSelectedPaisId('');
      }
    }
    setMessage(null);
  };

  // Icono de calendario simple (SVG)
  const CalendarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-calendar" viewBox="0 0 16 16">
      <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z" />
    </svg>
  );

  // Ciudades filtradas basadas en el país seleccionado
  const filteredCiudades = selectOptions.ciudades.filter(c => c.idPais === selectedPaisId);

  // Renderizado del componente (HTML y CSS con Tailwind)
  return (
    <>
      <h1 className="text-3xl font-light text-gray-800 mb-8">Información Personal</h1>

      {/* Mensaje de Carga */}
      {isLoading && (
        <div className="text-center p-4">Cargando información...</div>
      )}

      {/* Mensaje de Error de Carga (solo se muestra si falla la carga inicial) */}
      {!isLoading && message && message.type === 'error' && !originalFormData && (
        <div className="bg-red-100 text-red-800 p-3 rounded-md mb-6">
          <strong>Error al cargar:</strong> {message.text}
        </div>
      )}

      {/* Formulario (se muestra solo si no está cargando y no hubo error fatal de carga) */}
      {!isLoading && originalFormData && (
        <form onSubmit={handleSubmit}>
          {/* Contenedor del grid para el formulario (6 columnas) */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-x-6 gap-y-6">

            {/* Campo Nombre */}
            <div className="md:col-span-3">
              <label htmlFor="nombres" className="block text-sm font-medium text-gray-700 mb-1">
                Nombre
              </label>
              <input
                type="text"
                id="nombres"
                name="nombres"
                value={formData.nombres}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              />
            </div>

            {/* Campo Apellido */}
            <div className="md:col-span-3">
              <label htmlFor="apellidos" className="block text-sm font-medium text-gray-700 mb-1">
                Apellido
              </label>
              <input
                type="text"
                id="apellidos"
                name="apellidos"
                value={formData.apellidos}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              />
            </div>

            {/* Campo Email */}
            <div className="md:col-span-6">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                readOnly // El email parece no editable
                className="w-full px-3 py-2 border-none bg-gray-100 text-gray-500 rounded-md"
              />
            </div>

            {/* Campo País */}
            <div className="md:col-span-2">
              <label htmlFor="pais" className="block text-sm font-medium text-gray-700 mb-1">
                País
              </label>
              <select
                id="pais"
                name="pais"
                value={selectedPaisId}
                onChange={handlePaisChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              >
                <option value="" disabled>Seleccione un país</option>
                {selectOptions.paises.map(pais => (
                  <option key={pais.id} value={pais.id}>
                    {pais.nombre}
                  </option>
                ))}
              </select>
            </div>

            {/* Campo Ciudad */}
            <div className="md:col-span-2">
              <label htmlFor="idCiudad" className="block text-sm font-medium text-gray-700 mb-1">
                Ciudad
              </label>
              <select
                id="idCiudad"
                name="idCiudad"
                value={formData.idCiudad}
                onChange={handleChange}
                disabled={!selectedPaisId || filteredCiudades.length === 0} // Deshabilitado si no hay país o ciudades
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100"
              >
                <option value="" disabled>Seleccione una ciudad</option>
                {filteredCiudades.map(ciudad => (
                  <option key={ciudad.id} value={ciudad.id}>
                    {ciudad.nombre}
                  </option>
                ))}
              </select>
            </div>

            {/* Campo Sexo */}
            <div className="md:col-span-2">
              <label htmlFor="idSexo" className="block text-sm font-medium text-gray-700 mb-1">
                Sexo
              </label>
              <select
                id="idSexo"
                name="idSexo"
                value={formData.idSexo}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              >
                <option value="" disabled>Seleccione un sexo</option>
                {selectOptions.sexos.map(sexo => (
                  <option key={sexo.id} value={sexo.id}>
                    {sexo.descripcion}
                  </option>
                ))}
              </select>
            </div>

            {/* Campo Teléfono */}
            <div className="md:col-span-3">
              <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-1">
                Teléfono
              </label>
              <input
                type="tel"
                id="telefono"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              />
            </div>

            {/* Campo Fecha de nacimiento */}
            <div className="md:col-span-3">
              <label htmlFor="fechaNacimiento" className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de nacimiento
              </label>
              <div className="relative">
                <input
                  type="date"
                  id="fechaNacimiento"
                  name="fechaNacimiento"
                  value={formData.fechaNacimiento}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 pr-10"
                />
                <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500">
                  <CalendarIcon />
                </span>
              </div>
            </div>
          </div>

          {/* Mensajes de estado (Guardado) */}
          {message && (message.type === 'success' || (message.type === 'error' && isSaving)) && (
            <div className={`mt-6 p-3 rounded-md text-sm ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
              {message.text}
            </div>
          )}

          {/* Contenedor de botones */}
          <div className="flex justify-end items-center gap-4 mt-10">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors disabled:opacity-50"
            >
              {isSaving ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      )}

    </>
  );
}