// src/app/admin/auditoria/page.js
"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAuditoriaController } from "./controller";
import { FiSearch, FiEye } from "react-icons/fi";

const AuditoriaPage = () => {
  const router = useRouter();
  const {
    clientes,
    isLoading,
    isSearching,
    error,
    searchTerm,
    handleSearchChange,
    currentPage,
    totalPages,
    handlePageChange,
  } = useAuditoriaController();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl text-gray-600">Cargando datos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-red-50 p-4">
        <p className="text-xl text-red-700">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Auditoría de Clientes
          </h1>
        </header>

        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Busca Cliente"
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden relative">
          {/* Overlay de búsqueda */}
          {isSearching && (
            <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
                <p className="text-gray-600">Buscando...</p>
              </div>
            </div>
          )}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Cuenta
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Última Sesión
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Actividad
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Transferencias
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {clientes && clientes.length > 0 ? (
                  clientes.map((cliente) => (
                    <tr
                      key={cliente.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      {/* Cliente */}
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-semibold text-gray-900">
                            {cliente.nombre}
                          </span>
                          <span className="text-sm text-gray-500">
                            {cliente.email}
                          </span>
                          <span className="text-sm text-gray-500">
                            {cliente.telefono}
                          </span>
                        </div>
                      </td>

                      {/* Cuenta */}
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <div className="text-sm text-gray-700">
                            <span className="font-medium">Creación:</span>{" "}
                            {cliente.fechaCreacion}
                          </div>
                          <div className="text-sm text-gray-700">
                            <span className="font-medium">Última edición:</span>{" "}
                            {cliente.ultimaEdicion}
                          </div>
                        </div>
                      </td>

                      {/* Última Sesión */}
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm text-gray-900">
                            {cliente.ultimaSesion.fecha}
                          </span>
                          <span className="text-sm text-gray-500">
                            {cliente.ultimaSesion.hora}
                          </span>
                        </div>
                      </td>

                      {/* Actividad */}
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm text-gray-900">
                            {cliente.actividad.compras} Compras
                          </span>
                          <span className="text-sm text-gray-900">
                            {cliente.actividad.total}
                          </span>
                          <span className="text-sm text-green-600 font-medium">
                            {cliente.actividad.puntosUsados}
                          </span>
                        </div>
                      </td>

                      {/* Transferencias */}
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2 text-sm">
                            <span className="text-teal-600">↗</span>
                            <span className="text-gray-700">
                              {cliente.transferencias.enviadas} enviadas
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <span className="text-green-600">✓</span>
                            <span className="text-gray-700">
                              {cliente.transferencias.recibidas} recibidas
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Acciones */}
                      <td className="px-6 py-4">
                        <button
                          onClick={() => router.push(`/admin/auditoria/detalle/${cliente.id}`)}
                          className="text-gray-600 hover:text-teal-600 transition-colors"
                          title="Ver detalles"
                        >
                          <FiEye className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center">
                      <p className="text-gray-500">
                        No se encontraron clientes
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="border-t border-gray-200 px-6 py-4">
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ←
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => {
                    // Mostrar solo algunas páginas
                    if (
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`px-3 py-1 rounded border ${
                            currentPage === page
                              ? "bg-teal-500 text-white border-teal-500"
                              : "border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          {page}
                        </button>
                      );
                    } else if (
                      page === currentPage - 2 ||
                      page === currentPage + 2
                    ) {
                      return (
                        <span key={page} className="px-2">
                          ...
                        </span>
                      );
                    }
                    return null;
                  }
                )}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuditoriaPage;
