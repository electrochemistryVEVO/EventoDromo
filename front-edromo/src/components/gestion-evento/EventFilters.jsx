/**
 * @file EventFilters.jsx
 * @description Componente con todos los filtros para la gestión de eventos.
 */

import React from "react";
import { FiSearch } from 'react-icons/fi';

const EventFilters = ({
  filters,
  locales,
  statuses,
  onFilterChange,
  onApplyFilters,
}) => {
  return (
    <div className="filters-bar">
      {/* Buscador */}
      <div className="search-bar">
        <FiSearch className="search-icon" />
        <input
          type="text"
          placeholder="Busca Evento"
          value={filters.search}
          onChange={(e) => onFilterChange("search", e.target.value)}
        />
      </div>

      {/* Grupo de Filtros */}
      <div className="filter-select-group">
        {/* Filtro Local */}
        <div className="filter-select">
          <label htmlFor="local-filter">Local</label>
          <select
            id="local-filter"
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
        <div className="filter-select">
          <label htmlFor="status-filter">Estados</label>
          <select
            id="status-filter"
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
        <div className="filter-select">
          <label>Fecha</label>
          <div className="filter-date-range">
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => onFilterChange("startDate", e.target.value)}
            />
            <span>-</span>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => onFilterChange("endDate", e.target.value)}
            />
          </div>
        </div>

        {/* Botón Aplicar Filtros */}
        <button
          onClick={onApplyFilters}
          className="btn-apply-filter"
          aria-label="Aplicar filtros"
          title="Aplicar filtros"
        >
          <img
            src="/images/icon/apply-filter-icon.png"
            alt="Aplicar"
          />
        </button>
      </div>
    </div>
  );
};

export default EventFilters;
