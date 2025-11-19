"use client";

import React, { use } from "react";
import { useRouter } from "next/navigation";
import { useDetalleClienteController } from "./controller";
import { 
  FiArrowLeft, 
  FiShoppingCart, 
  FiSend, 
  FiUser, 
  FiAward,
  FiLogIn
} from "react-icons/fi";

const DetalleClientePage = ({ params }) => {
  const router = useRouter();
  const { clienteId } = use(params); // Unwrap params usando React.use()
  const { cliente, isLoading, error } = useDetalleClienteController(clienteId);

  // Mapeo de iconos según el tipo de actividad
  const getIconoActividad = (tipo) => {
    const iconos = {
      compra: <FiShoppingCart className="w-5 h-5 text-white" />,
      transferencia_enviada: <FiSend className="w-5 h-5 text-white" />,
      actualizacion_perfil: <FiUser className="w-5 h-5 text-white" />,
      uso_puntos: <FiAward className="w-5 h-5 text-white" />,
      inicio_sesion: <FiLogIn className="w-5 h-5 text-white" />,
    };
    return iconos[tipo] || <FiUser className="w-5 h-5 text-white" />;
  };

  // Mapeo de colores según el tipo de actividad
  const getColorActividad = (tipo) => {
    const colores = {
      compra: "bg-green-500",
      transferencia_enviada: "bg-blue-500",
      actualizacion_perfil: "bg-purple-500",
      uso_puntos: "bg-purple-500",
      inicio_sesion: "bg-gray-500",
    };
    return colores[tipo] || "bg-gray-500";
  };

  // Formatear fecha y hora
  const formatearFechaHora = (fecha, hora) => {
    const fechaFormateada = fecha.split('-').reverse().join('-');
    return `${fechaFormateada} ${hora.slice(0, 5)}`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl text-gray-600">Cargando datos del cliente...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-red-50 p-4">
        <div className="text-center">
          <p className="text-xl text-red-700 mb-4">Error: {error}</p>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  if (!cliente) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl text-gray-600">No se encontró el cliente</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header con botón de volver */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            title="Volver"
          >
            <FiArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              {cliente.nombre} {cliente.apellido}
            </h1>
          </div>
        </div>

        {/* Grid de dos columnas */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna izquierda - Información del cliente */}
          <div className="lg:col-span-1 space-y-6">
            {/* Resumen del Cliente */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <FiUser className="w-5 h-5 text-gray-700" />
                <h2 className="text-lg font-semibold text-gray-800">
                  Resumen del Cliente
                </h2>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-3xl font-bold text-gray-900">
                    {cliente.resumen.comprasTotales}
                  </p>
                  <p className="text-sm text-gray-600">Compras Totales</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-green-600">
                    {cliente.resumen.gastoTotal}
                  </p>
                  <p className="text-sm text-gray-600">Gasto Total</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-blue-600">
                    {cliente.resumen.transferencias}
                  </p>
                  <p className="text-sm text-gray-600">Transferencias</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-purple-600">
                    {cliente.resumen.puntosUsados}
                  </p>
                  <p className="text-sm text-gray-600">Puntos Usados</p>
                </div>
              </div>
            </div>

            {/* Datos del Cliente */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <FiUser className="w-5 h-5 text-gray-700" />
                <h2 className="text-lg font-semibold text-gray-800">
                  Datos del Cliente
                </h2>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-600">Nombre</label>
                    <input
                      type="text"
                      value={cliente.nombre}
                      disabled
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Apellido</label>
                    <input
                      type="text"
                      value={cliente.apellido}
                      disabled
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Email</label>
                  <input
                    type="email"
                    value={cliente.email}
                    disabled
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-600">Tipo Documento</label>
                    <input
                      type="text"
                      value={cliente.tipoDocumento}
                      disabled
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">
                      Número de documento
                    </label>
                    <input
                      type="text"
                      value={cliente.numeroDocumento}
                      disabled
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-600">Teléfono</label>
                    <input
                      type="text"
                      value={cliente.telefono}
                      disabled
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Puntos</label>
                    <input
                      type="text"
                      value={cliente.puntos}
                      disabled
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Columna derecha - Historial de Actividades */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-gray-600">⟲</span>
                </div>
                <h2 className="text-lg font-semibold text-gray-800">
                  Historial de Actividades
                </h2>
              </div>

              {/* Lista de actividades */}
              <div className="space-y-4">
                {cliente.historialActividades.map((actividad) => (
                  <div
                    key={actividad.id}
                    className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        {/* Icono */}
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${getColorActividad(
                            actividad.tipo
                          )}`}
                        >
                          {getIconoActividad(actividad.tipo)}
                        </div>

                        {/* Contenido */}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="inline-block px-3 py-1 bg-yellow-400 text-gray-900 text-xs font-medium rounded">
                              {actividad.etiqueta}
                            </span>
                            {actividad.monto && (
                              <span className="text-sm font-semibold text-gray-900">
                                {actividad.monto}
                              </span>
                            )}
                            {actividad.puntosUsados && (
                              <span className="text-sm font-semibold text-purple-600">
                                {actividad.puntosUsados}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-700">
                            {actividad.descripcion}
                          </p>
                        </div>
                      </div>

                      {/* Fecha y hora */}
                      <div className="text-right text-sm text-gray-500 ml-4">
                        {formatearFechaHora(actividad.fecha, actividad.hora)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Paginación (placeholder por ahora) */}
              <div className="flex items-center justify-center gap-2 mt-6 pt-6 border-t border-gray-200">
                <button className="px-3 py-1 rounded border border-gray-300 hover:bg-gray-50">
                  ←
                </button>
                <button className="px-3 py-1 rounded border bg-teal-500 text-white border-teal-500">
                  1
                </button>
                <button className="px-3 py-1 rounded border border-gray-300 hover:bg-gray-50">
                  2
                </button>
                <span className="px-2">...</span>
                <button className="px-3 py-1 rounded border border-gray-300 hover:bg-gray-50">
                  9
                </button>
                <button className="px-3 py-1 rounded border border-gray-300 hover:bg-gray-50">
                  10
                </button>
                <button className="px-3 py-1 rounded border border-gray-300 hover:bg-gray-50">
                  →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetalleClientePage;
