"use client";
import React from "react";
import Image from "next/image";
import MovimientoItem from "./MovimientoItem";
import Paginador from "./Paginador";

// Función para formatear la fecha de vencimiento
const formatVencimiento = (dateString) => {
  if (!dateString) return { monthYear: "-", full: "-" };
  const date = new Date(dateString);
  const monthYear = date.toLocaleDateString("es-ES", { month: "long", year: "numeric" });
  const full = date.toLocaleDateString("es-ES", { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  return {
    monthYear: monthYear.charAt(0).toUpperCase() + monthYear.slice(1),
    full: `Vence: ${full.replace(",", " a las")}`
  };
};

export default function MisDromopuntosView({ data, movimientos, loading, error, currentPage, onPageChange, puntosPorSol }) {
  // Los hooks deben llamarse siempre en el nivel superior, antes de cualquier retorno condicional.

  if (loading) {
    return (
      <div className="flex items-center justify-center p-10">
        <div className="spinner-border text-primary" role="status" />
        <span className="ms-2">Cargando tus DromoPuntos...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        <strong>Error:</strong>{" "}
        {error.message || "No se pudieron cargar los datos."}
      </div>
    );
  }

  const hasPoints = data && data.total > 0;
  // Cálculo seguro: solo se ejecuta si 'data' y 'data.total' existen.
  const valorEquivalente = puntosPorSol > 0 ? puntosPorSol : 10;
  const puntosEquivalencia = hasPoints ? (data.total * valorEquivalente).toFixed(2) : "0.00";

  // Lógica de paginación para el historial
  const ITEMS_PER_PAGE = 7;
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentMovimientos = movimientos.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="p-4 md:p-6">
      {/* Contenedor para el título y el ícono de información */}
      <div className="mb-6 flex items-center gap-2">
        <h1 className="text-3xl font-bold text-gray-800">
          Mis DromoPuntos
        </h1>
        <div className="relative group flex items-center">
          <img
            src="/images/icon/info_verde.svg"
            alt="info"
            width={24}
            height={24}
            className="cursor-pointer transition-transform hover:scale-110"
          />

          {/* Tooltip una sola estructura */}
          <div className="absolute left-8 top-1/2 -translate-y-1/2 z-20 hidden group-hover:flex">
            <div
              className="relative bg-linear-to-b from-[#00C49A] to-[#00A67D] text-white text-sm font-medium px-4 py-3 w-60 shadow-lg rounded-lg"
              style={{
                clipPath:
                  "polygon(10px 0%, 100% 0%, 100% 100%, 10px 100%, 10px 60%, 0% 50%, 10px 40%)",
              }}
            >
              <p className="text-center leading-snug">
                <span className="font-bold">¡Usa tus DromoPuntos!</span><br />
                Son la moneda de Eventodromo.<br />
                Cada DromoPunto equivale a<br />
                <span className="font-semibold">S/10</span> para que pagues tus entradas.
              </p>
            </div>
          </div>
        </div>

      </div>

      {data.porVencer && data.porVencer.length > 0 && (
        <p className="text-orange-600 font-semibold mb-6 -mt-4">
          ¡Tus DromoPuntos están por vencer!
        </p>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Columna Izquierda: Puntos Disponibles y por Vencer */}
        <div className="flex flex-col gap-6">
          {/* Card Puntos Disponibles */}
          <div className="bg-gray-100 p-6 rounded-lg">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Mis Puntos Disponibles</h2>
            <div className="flex items-center gap-4">
              <Image src="/images/icon/monedas_verde.svg" alt="Puntos" width={60} height={60} />
              <div>
                <p className="text-4xl font-bold text-gray-800">{hasPoints ? data.total.toLocaleString("es-ES") : "0"} pt.</p>
                <p className="text-gray-600">Equivale a S/ {puntosEquivalencia}</p>
              </div>
            </div>
          </div>

          {/* Card Puntos por Vencer */}
          <div className="bg-gray-100 p-6 rounded-lg">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Image src="/images/icon/dromopuntos_vencer.png" alt="Puntos por vencer" width={24} height={24} />
              Puntos Por Vencer
            </h2>
            {hasPoints && data.porVencer.length > 0 ? (
              <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                {data.porVencer.map(lote => {
                  const { monthYear, full } = formatVencimiento(lote.fechaExpiracion);
                  return (
                    <div key={lote.id} className="flex justify-start items-center gap-x-12 border-b border-gray-200 pb-3">
                      <div>
                        <p className="font-bold text-gray-700">{monthYear}</p>
                        <p className="text-sm text-gray-500">{full}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg text-orange-500">{lote.cantidad} pt.</p>
                        <p className="text-sm text-gray-500">{lote.diasRestantes} días restantes</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500">No hay puntos por vencer.</p>
            )}
            {hasPoints && (
              <div className="mt-6 bg-yellow-100 border-l-4 border-yellow-400 text-yellow-800 p-4 rounded-md text-sm">
                <p><strong>Recordatorio importante:</strong> Los puntos acumulados caducan seis meses después, el último día del mes a las 23:59:59.</p>
              </div>
            )}
          </div>
        </div>

        {/* Columna Derecha: Historial */}
        <div className="bg-gray-100  p-6 rounded-lg h-fit">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Image src="/images/icon/dromopuntos_historial.png" alt="Historial" width={24} height={24} />
            Historial de Movimientos
          </h2>
          {movimientos && movimientos.length > 0 ? (
            <div className="space-y-2">
              {currentMovimientos.map(mov => <MovimientoItem key={mov.id} movimiento={mov} />)}
            </div>
          ) : (
            <div className="py-8 text-center text-gray-500">
              <p>No existe historial de movimientos.</p>
            </div>
          )}
          <Paginador
            totalItems={movimientos.length}
            itemsPerPage={ITEMS_PER_PAGE}
            currentPage={currentPage}
            onPageChange={onPageChange}
          />
        </div>
      </div>
    </div>
  );
}