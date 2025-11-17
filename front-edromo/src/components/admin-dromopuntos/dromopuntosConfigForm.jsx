/**
 * @file dromopuntosConfigForm.jsx
 * @description Componente de UI para el formulario de configuración de DromoPuntos.
 */
import React from "react";

// Componente genérico para campos de formulario
const FormField = ({ label, children, description }) => (
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-1">
      {label}
    </label>
    {children}
    {description && (
      <p className="text-xs text-gray-500 mt-1">{description}</p>
    )}
  </div>
);

export const DromoPuntosConfigForm = ({
  config,
  handleConfigChange,
  handleSubmit,
  isLoading,
  error,
}) => {
  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
    >
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        Parámetros de Conversión
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          label="Valor de 1 DromoPunto (en Soles)"
          description="Define cuántos soles (S/) equivale un único DromoPunto al momento de canjear."
        >
          <input
            type="number"
            name="valorEnSoles"
            placeholder="Ej: 0.50"
            value={config.valorEnSoles}
            onChange={handleConfigChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            step="0.01" // Permite decimales
          />
        </FormField>
      </div>

      <div className="flex justify-end items-center gap-4 pt-6 mt-4 border-t">
        {error && <p className="text-red-500 text-sm mr-auto">{error}</p>}
        <button
          type="submit"
          disabled={isLoading}
          className="bg-[#00C49A] text-white font-bold px-6 py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isLoading ? "Guardando..." : "Guardar Cambios"}
        </button>
      </div>
    </form>
  );
};