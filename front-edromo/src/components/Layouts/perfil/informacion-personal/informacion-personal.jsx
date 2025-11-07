'use client';
import React, { useState, useEffect } from 'react';
import { controllerPerfil } from './controller-informacion-personal';
// --- 1. IMPORTA useUser AQUÍ (EN EL COMPONENTE) ---
import { useUser } from '@/context/UserContext.jsx';

export default function PerfilPage() {
  // --- 2. LLAMA AL HOOK EN EL NIVEL SUPERIOR DEL COMPONENTE ---
  const { user } = useUser();

  // (El resto de tus 'useState' están perfectos)
  const [formData, setFormData] = useState({
    nombres: '',
    apellidos: '',
    email: '',
    idciudad: '',
    idsexo: '',
    telefono: '',
    fechaNacimiento: '',
  });
  const [originalFormData, setOriginalFormData] = useState(null);
  const [selectOptions, setSelectOptions] = useState({
    paises: [],
    ciudades: [],
    sexos: [],
  });
  const [selectedPaisId, setSelectedPaisId] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [maxDate, setMaxDate] = useState('');

  // --- 3. fetchData AHORA USA EL 'user.token' ---
  const fetchData = async () => {
    setIsLoading(true);
    setMessage(null);
    try {
      // 3.1. Valida que tengamos el token antes de llamar
      if (!user || !user.token) {
         throw new Error("Usuario no autenticado o token no encontrado.");
      }
      
      // 3.2. Pasa el token al controlador
      const data = await controllerPerfil.onPageLoad(user.token);

      // (El resto de tu lógica de formateo de datos queda igual)
      if (data && data.datosCliente) {
        let fechaFormateada = data.datosCliente.fechaNacimiento;
        if (fechaFormateada && fechaFormateada.includes('/')) {
           const partes = fechaFormateada.split('/');
           if (partes.length === 3) {
             fechaFormateada = `${partes[2]}-${partes[1]}-${partes[0]}`;
           }
        }
        const datosClienteFormateados = { ...data.datosCliente, fechaNacimiento: fechaFormateada };
        setFormData(datosClienteFormateados);
        setOriginalFormData(datosClienteFormateados);
        setMaxDate(data.maxDate || '');
        setSelectOptions({
          paises: data.paises || [],
          ciudades: data.ciudades || [],
          sexos: data.sexos || [],
        });
        const ciudadActual = (data.ciudades || []).find(c => c.id === data.datosCliente.idciudad);
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

  // --- 4. useEffect AHORA DEPENDE DE 'user' ---
  // Cargar datos al montar el componente
  useEffect(() => {
    // Solo intenta cargar datos si 'user' (y el token) ya están disponibles
    if (user) { 
      fetchData();
    }
  }, [user]); // <-- Se ejecuta cuando 'user' se carga

  // ... (handleChange y handlePaisChange quedan igual) ...
  const handleChange = (e) => {
    const { name, value } = e.target;
    const newValue = (name === 'idciudad' || name === 'idsexo') ? (value ? parseInt(value, 10) : '') : value;
    setFormData(prevState => ({
      ...prevState,
      [name]: newValue,
    }));
  };
  const handlePaisChange = (e) => {
    const newPaisId = e.target.value ? parseInt(e.target.value, 10) : '';
    setSelectedPaisId(newPaisId);
    setFormData(prevState => ({
      ...prevState,
      idciudad: '',
    }));
  };

  // --- 5. handleSubmit AHORA PASA EL 'user.token' ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    // 5.1. Valida el token aquí también
    if (!user || !user.token) {
        setMessage({ type: 'error', text: 'Su sesión ha expirado. Por favor, recargue la página.' });
        setIsSaving(false);
        return;
    }

    // 5.2. Pasa el token y el formulario al controlador
    const response = await controllerPerfil.onSubmit(user.token, formData);

    setIsSaving(false);

    if (response.success) {
      setMessage({ type: 'success', text: response.message || 'Cambios guardados con éxito' });
      setOriginalFormData(formData);
    } else {
      setMessage({ type: 'error', text: response.message });
    }
  };

  // ... (El resto de tu código: handleCancel y todo el JSX del return, queda exactamente igual) ...
  const handleCancel = () => {
    if (originalFormData) {
      setFormData(originalFormData);
      const ciudadActual = selectOptions.ciudades.find(c => c.id === originalFormData.idciudad);
      if (ciudadActual) {
        setSelectedPaisId(ciudadActual.idPais);
      } else {
        setSelectedPaisId('');
      }
    }
    setMessage(null);
  };

  const CalendarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-calendar" viewBox="0 0 16 16">
      <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z" />
    </svg>
  );

  const filteredCiudades = selectOptions.ciudades.filter(c => c.idPais === selectedPaisId);

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
                className="w-full px-3 py-2 bg-zinc-100 border-b border-gray-300 rounded-md focus:outline-none focus:ring-0 focus:border-b-2 focus:border-[#00C49A]"
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
                className="w-full px-3 py-2 bg-zinc-100 border-b border-gray-300 rounded-md focus:outline-none focus:ring-0 focus:border-b-2 focus:border-[#00C49A]"
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
                className="w-full px-3 py-2 bg-transparent text-gray-700 border-b border-gray-300 rounded-md"
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
                className="w-full px-3 py-2 bg-zinc-100 border-b border-gray-300 rounded-md focus:outline-none focus:ring-0 focus:border-b-2 focus:border-[#00C49A]"
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
              <label htmlFor="idciudad" className="block text-sm font-medium text-gray-700 mb-1">
                Ciudad
              </label>
              <select
                id="idciudad"
                name="idciudad"
                value={formData.idciudad}
                onChange={handleChange}
                disabled={!selectedPaisId || filteredCiudades.length === 0} // Deshabilitado si no hay país o ciudades
                className="w-full px-3 py-2 bg-zinc-100 border-b border-gray-300 rounded-md focus:outline-none focus:ring-0 focus:border-b-2 focus:border-[#00C49A]"
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
              <label htmlFor="idsexo" className="block text-sm font-medium text-gray-700 mb-1">
                Sexo
              </label>
              <select
                id="idsexo"
                name="idsexo"
                value={formData.idsexo}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-zinc-100 border-b border-gray-300 rounded-md focus:outline-none focus:ring-0 focus:border-b-2 focus:border-[#00C49A]"
              >
                <option value="" disabled>Seleccione un sexo</option>
                {selectOptions.sexos.map(sexo => (
                  <option key={sexo.id} value={sexo.id}>
                    {sexo.nombre}
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
                className="w-full px-3 py-2 bg-zinc-100 border-b border-gray-300 rounded-md focus:outline-none focus:ring-0 focus:border-b-2 focus:border-[#00C49A]"
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
                  value={formData.fechanacimiento} // Asegúrate que el DTO usa 'fechanacimiento'
                  onChange={handleChange}
                  max={maxDate}
                  className="w-full px-3 py-2 bg-zinc-100 border-b border-gray-300 rounded-md focus:outline-none focus:ring-0 focus:border-b-2 focus:border-[#00C49A]"
                />
              </div>
            </div>
          </div>

          {/* Mensajes de estado (Guardado) */}
          {message && (message.type === 'success' || (message.type === 'error' && isSaving)) && (
            <div className={`mt-6 p-3 rounded-md text-sm ${message.type === 'success' ? 'bg-[#00C49A]/10 text-[#007A60]' : 'bg-red-100 text-red-800'
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
              style={{ borderRadius: '6px' }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-[#00C49A] hover:bg-[#00b08a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00C49A] transition-colors disabled:opacity-50"
              style={{ borderRadius: '6px' }}
            >
              {isSaving ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      )}
    </>
  );
}