import React from "react";
import StatusBadge from "./StatusBadge.jsx";
import { FiEdit, FiSlash, FiEye } from "react-icons/fi";

// Helper para formatear moneda
const formatCurrency = (amount) => {
  return amount.toLocaleString("es-PE", { style: "currency", currency: "PEN" });
};

// COMPONENTE HELPER: Para mostrar fechas en dos líneas
const DateCell = ({ dateString }) => {
  if (!dateString) return <span className="text-gray-400">-</span>;
  const date = new Date(dateString);
  const fecha = date.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });
  const hora = date.toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <div className="flex flex-col items-center leading-tight">
      <span className="font-normal text-gray-700">{fecha}</span>
      <span className="text-[10px] text-gray-500 uppercase">{hora}</span>
    </div>
  );
};

const EventsTable = ({ events, isLoading, error, onActionClick }) => {
  const handleAction = (actionType, event) => {
    if (onActionClick) {
      onActionClick(actionType, event);
    }
  };

  const renderTableContent = () => {
    if (isLoading) {
      return (
        <tr>
          <td colSpan="10" className="text-center py-10 text-gray-500">
            <div className="flex justify-center items-center gap-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
              <span>Cargando eventos...</span>
            </div>
          </td>
        </tr>
      );
    }

    if (error) {
      return (
        <tr>
          <td colSpan="10" className="text-center py-10 text-red-500 bg-red-50">
            {error}
          </td>
        </tr>
      );
    }

    if (!events || events.length === 0) {
      return (
        <tr>
          <td colSpan="10" className="text-center py-10 text-gray-500">
            No se encontraron eventos registrados.
          </td>
        </tr>
      );
    }

    return events.map((event) => {
      const ocupacionActual = event?.horarios?.[0]?.ocupacion?.actual ?? 0;
      const ocupacionTotal = event?.horarios?.[0]?.ocupacion?.total ?? 0;
      const ocupacionPercent =
        ocupacionTotal > 0
          ? Math.round((ocupacionActual / ocupacionTotal) * 100)
          : 0;

      const horarioDate = event?.horarios?.[0]?.horario;

      return (
        <tr
          key={event.id}
          className="border-b border-gray-100 hover:bg-blue-50/50 transition-colors duration-200"
        >
          {/* 1. EVENTO: Aumenté el padding izquierdo (pl-6) para separarlo del borde */}
          <td className="pl-6 pr-2 py-3 align-middle">
            <div
              className="text-sm font-semibold text-gray-800 leading-snug line-clamp-2"
              title={event.nombre}
            >
              {event.nombre}
            </div>
          </td>

          {/* 2. LOCAL */}
          <td className="px-2 py-3 align-middle">
            <div
              className="text-xs text-gray-600 leading-snug line-clamp-2"
              title={event.local}
            >
              {event.local}
            </div>
          </td>

          {/* 3. TIPO */}
          <td className="px-1 py-3 align-middle text-center">
            <span className="inline-block px-2 py-1 text-[10px] font-medium text-gray-600 bg-gray-100 rounded-full border border-gray-200 whitespace-nowrap">
              {event.tipo}
            </span>
          </td>

          {/* 4, 5, 6. FECHAS */}
          <td className="px-1 py-3 align-middle text-center">
            <DateCell dateString={event.fechaPublicacion} />
          </td>
          <td className="px-1 py-3 align-middle text-center">
            <DateCell dateString={event.fechaCompra} />
          </td>
          <td className="px-1 py-3 align-middle text-center">
            <DateCell dateString={horarioDate} />
          </td>

          {/* 7. AFORO (Ocupación): Reducido espacio horizontal */}
          <td className="px-1 py-3 align-middle text-center">
            <div className="flex flex-col items-center w-full max-w-[70px] mx-auto">
              <span className="text-xs text-gray-700 font-medium">
                {ocupacionActual}/{ocupacionTotal}
              </span>
              <div className="w-full h-1.5 bg-gray-200 rounded-full mt-1 overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    ocupacionPercent > 80 ? "bg-green-500" : "bg-blue-500"
                  }`}
                  style={{ width: `${ocupacionPercent}%` }}
                ></div>
              </div>
              <span className="text-[10px] text-gray-500 mt-0.5">
                {ocupacionPercent}%
              </span>
            </div>
          </td>

          {/* 8. INGRESOS: Se verá más cerca del aforo al ajustar columnas */}
          <td className="px-3 py-3 align-middle text-right">
            <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
              {formatCurrency(event.ingresosBrutos)}
            </span>
          </td>

          {/* 9. ESTADO */}
          <td className="px-1 py-3 align-middle text-center">
            <div className="transform scale-90">
              <StatusBadge status={event.estado} />
            </div>
          </td>

          {/* 10. ACCIONES */}
          <td className="px-2 py-3 align-middle text-center">
            <div className="flex items-center justify-center gap-2">
              {event.estado === "Creado" ? (
                <>
                  <button
                    onClick={() => handleAction("edit", event)}
                    className="text-blue-500 hover:text-blue-700 transition-colors p-1 rounded hover:bg-blue-100"
                    title="Editar"
                  >
                    <FiEdit size={16} />
                  </button>
                  <button
                    onClick={() => handleAction("delete", event)}
                    className="text-red-500 hover:text-red-700 transition-colors p-1 rounded hover:bg-red-100"
                    title="Eliminar"
                  >
                    <FiSlash size={16} />
                  </button>
                </>
              ) : null}
              <button
                onClick={() => handleAction("view", event)}
                className="text-gray-500 hover:text-gray-700 transition-colors p-1 rounded hover:bg-gray-100"
                title="Ver detalle"
              >
                <FiEye size={16} />
              </button>
            </div>
          </td>
        </tr>
      );
    });
  };

  return (
    <div className="w-full bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
      <table className="w-full table-fixed text-left border-collapse">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="pl-6 pr-2 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider w-[20%]">
              Evento
            </th>
            <th className="px-2 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider w-[12%]">
              Local
            </th>
            <th className="px-1 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider w-[7%] text-center">
              Tipo
            </th>
            <th className="px-1 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider w-[8%] text-center">
              F.Public.
            </th>
            <th className="px-1 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider w-[8%] text-center">
              F.Compra
            </th>
            <th className="px-1 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider w-[8%] text-center">
              Horario
            </th>
            <th className="px-1 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider w-[8%] text-center">
              Aforo
            </th>
            <th className="px-3 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider w-[6%] text-right">
              Ingresos
            </th>
            <th className="px-1 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider w-[6%] text-center">
              Estado
            </th>
            <th className="px-2 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider w-[10%] text-center">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {renderTableContent()}
        </tbody>
      </table>
    </div>
  );
};

export default EventsTable;
