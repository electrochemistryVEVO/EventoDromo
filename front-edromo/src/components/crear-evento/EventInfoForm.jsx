/**
 * @file EventInfoForm.jsx
 * @description Componente del formulario para la información general del evento.
 */
import React from "react";

// Un componente genérico para los campos del formulario para no repetir código
const FormField = ({ label, children }) => (
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-1">
      {label}
    </label>
    {children}
  </div>
);

export const EventInfoForm = ({
  eventInfo,
  handleInfoChange,
  locales,
  eventTypes,
  handleImageChange,
  minDateTime,
  isReadOnly = false,
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        Información del evento:
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Columna Izquierda */}
        <div className="space-y-4">
          <FormField label="Nombre del Evento">
            <input
              type="text"
              name="nombre"
              placeholder="Ej: Evento General"
              value={eventInfo.nombre}
              onChange={handleInfoChange}
              readOnly={isReadOnly}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </FormField>
          <FormField label="Descripción">
            <textarea
              name="descripcion"
              rows="5"
              placeholder="Lorem ipsum dolor sit amet..."
              value={eventInfo.descripcion}
              onChange={handleInfoChange}
              readOnly={isReadOnly}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </FormField>
        </div>

        {/* Columna Derecha - Imagen */}
        <div className="space-y-4">
          <FormField label="Ingresar Imagen">
            {/* 1. Cambiamos el div por una etiqueta <label> y añadimos htmlFor */}
            <label
              htmlFor="image-upload"
              className="w-full h-48 bg-gray-100 rounded-md flex items-center justify-center border-2 border-dashed relative cursor-pointer hover:bg-gray-200 transition-colors"
            >
              {eventInfo.imagenPreview ? (
                // La imagen de previsualización ahora está dentro de la etiqueta
                <img
                  src={eventInfo.imagenPreview}
                  alt="Previsualización del evento"
                  className="w-full h-full object-cover rounded-md"
                />
              ) : (
                // El ícono y texto también están dentro
                <span className="text-gray-400 text-center pointer-events-none">
                  {" "}
                  {/* pointer-events-none es una precaución extra */}
                  <svg
                    className="w-10 h-10 mx-auto"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                    ></path>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                    ></path>
                  </svg>
                  <p className="text-sm mt-1">Haz clic para subir</p>
                </span>
              )}
            </label>

            {/* 2. El input ahora está fuera de la etiqueta visual, pero conectado por el id. Lo ocultamos con la clase 'hidden' */}
            <input
              id="image-upload" // Este ID debe coincidir con el htmlFor de la etiqueta
              type="file"
              name="imagen"
              accept="image/*"
              onChange={handleImageChange}
              readOnly={isReadOnly}
              className="hidden" // 'hidden' lo oculta completamente pero lo mantiene funcional
            />
          </FormField>
        </div>
      </div>

      {/* Fila Inferior de Campos */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-6">
        <FormField label="Local">
          <select
            name="localId"
            value={eventInfo.localId}
            onChange={handleInfoChange}
            disabled={isReadOnly}
            className="w-full p-2 border border-gray-300 rounded-md bg-white"
          >
            <option value="" disabled>
              Seleccione un local
            </option>
            {locales.map((local) => (
              <option key={local.id} value={local.id}>
                {local.nombre}
              </option>
            ))}
          </select>
        </FormField>
        <FormField label="Capacidad de Evento">
          <input
            type="number"
            name="capacidad"
            placeholder="Se autocompleta"
            value={eventInfo.capacidad}
            onChange={handleInfoChange}
            readOnly
            className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
          />
        </FormField>
        <FormField label="Tipo evento">
          <select
            name="tipoEventoId"
            value={eventInfo.tipoEventoId}
            onChange={handleInfoChange}
            disabled={isReadOnly}
            className="w-full p-2 border border-gray-300 rounded-md bg-white"
          >
            <option value="" disabled>
              Seleccione un tipo
            </option>
            {eventTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.nombre}
              </option>
            ))}
          </select>
        </FormField>
      </div>

      {/* Fechas de Publicación y Compra */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
        <FormField label="Fecha de Publicación">
          <input
            type="datetime-local"
            name="fechaPublicacion"
            value={eventInfo.fechaPublicacion}
            onChange={handleInfoChange}
            readOnly={isReadOnly}
            max={eventInfo.fechaCompra || ""} // No se puede seleccionar después de la fecha de compra
            min={minDateTime} // No se puede seleccionar antes de ahora
            className="w-full max-w-xs p-2 border border-gray-300 rounded-md" // Ancho reducido
          />
        </FormField>
        <FormField label="Fecha de Compra">
          <input
            type="datetime-local"
            name="fechaCompra"
            value={eventInfo.fechaCompra}
            onChange={handleInfoChange}
            readOnly={isReadOnly}
            min={eventInfo.fechaPublicacion || minDateTime} // No se puede seleccionar antes de la publicación O de ahora
            className="w-full max-w-xs p-2 border border-gray-300 rounded-md" // Ancho reducido
          />
        </FormField>
      </div>
    </div>
  );
};
