/**
 * @file EventFilters.jsx
 * @description Componente con todos los filtros para la gestión de eventos.
 */

import React from "react";

const EventFilters = ({
  filters,
  locales,
  statuses,
  onFilterChange,
  onApplyFilters,
}) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="grid grid-cols-1 md:grid-cols-5 lg:grid-cols-12 gap-4 ">
        {/* Buscador */}
        <div className="lg:col-span-3">
          <label className="block text-sm font-semibold mb-1 invisible">
            Buscar
          </label>
          <div className="relative">
            <img
              src="/images/icon/search-icon.png"
              alt="Buscar"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
            />
            <input
              type="text"
              placeholder="Busca Evento"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filters.search}
              onChange={(e) => onFilterChange("search", e.target.value)}
            />
          </div>
        </div>

        {/* Filtro Local */}
        <div className="lg:col-span-2">
          <label
            htmlFor="local-filter"
            className="block text-sm font-semibold text-gray-700 mb-1"
          >
            Local
          </label>
          <select
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filters.local}
            onChange={(e) => onFilterChange("local", e.target.value)}
          >
            {locales.map((local) => (
              <option key={local.id} value={local.id}>
                {local.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro Estados */}
        <div className="lg:col-span-2">
          <label
            htmlFor="status-filter"
            className="block text-sm font-semibold text-gray-700 mb-1"
          >
            Estados
          </label>
          <select
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filters.status}
            onChange={(e) => onFilterChange("status", e.target.value)}
          >
            <option value="Todos">Todos</option>
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro Fechas */}
        <div className="lg:col-span-4">
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Fecha
          </label>
          <div className="flex items-center gap-2">
            <input
              type="date"
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filters.startDate}
              onChange={(e) => onFilterChange("startDate", e.target.value)}
            />
            <span className="text-gray-500">-</span>
            <input
              type="date"
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filters.endDate}
              onChange={(e) => onFilterChange("endDate", e.target.value)}
            />
          </div>
        </div>

        {/* Botón Aplicar Filtros */}
        <div className="lg:col-span-1">
          <label className="block text-sm font-semibold mb-1 invisible">
            Acción
          </label>
          <button
            onClick={onApplyFilters}
            className="w-full h-10 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded-lg"
            aria-label="Aplicar filtros"
          >
            <img
              src="/images/icon/apply-filter-icon.png"
              alt="Aplicar"
              className="w-6 h-6"
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventFilters;
