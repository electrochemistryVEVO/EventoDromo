/**
 * @file EventsTable.jsx
 * @description Tabla para mostrar la lista de eventos con sus acciones.
 */

import React from "react";
import StatusBadge from "./StatusBadge.jsx";
import ActionButton from "./ActionButton.jsx";

// Función helper para formatear fechas
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return (
    date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }) +
    " " +
    date.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
  );
};

// Función helper para formatear moneda
const formatCurrency = (amount) => {
  return amount.toLocaleString("es-PE", { style: "currency", currency: "PEN" });
};

const EventsTable = ({ events, isLoading, error, onActionClick }) => {
  // Función para manejar el clic en un botón de acción
  const handleAction = (actionType, event) => {
    console.log(`Acción: ${actionType}, Evento ID: ${event.id}`);
    if (onActionClick) {
      onActionClick(actionType, event); // Pasamos el tipo de acción y el evento completo
    }
  };

  const renderTableContent = () => {
    if (isLoading) {
      return (
        <tr>
          <td colSpan="9" className="text-center py-10 text-gray-500">
            Cargando eventos...
          </td>
        </tr>
      );
    }

    if (error) {
      return (
        <tr>
          <td colSpan="9" className="text-center py-10 text-red-500">
            {error}
          </td>
        </tr>
      );
    }

    if (!events || events.length === 0) {
      return (
        <tr>
          <td colSpan="9" className="text-center py-10 text-gray-500">
            No se encontraron eventos.
          </td>
        </tr>
      );
    }

    return events.map((event) => {
      const ocupacionActual = event?.horarios?.[0]?.ocupacion?.actual;
      const ocupacionTotal = event?.horarios?.[0]?.ocupacion?.total;

      // Calculamos el porcentaje, asegurándonos de que los valores sean numéricos.
      // Usamos el operador "Nullish Coalescing" (??) para dar un valor por defecto de 0.
      const ocupacionPercent =
        (ocupacionTotal ?? 0) > 0
          ? (((ocupacionActual ?? 0) / ocupacionTotal) * 100).toFixed(0)
          : 0;

      // 1. Obtenemos la fecha del horario de forma segura.
      // Si no existe, `horarioDate` será `undefined`.
      const horarioDate = event?.horarios?.[0]?.horario;
      return (
        <tr key={event.id} className="border-b hover:bg-gray-50">
          <td className="px-4 py-3 font-medium text-gray-900">
            {event.nombre}
          </td>
          <td className="px-4 py-3 text-gray-600">{event.local}</td>
          <td className="px-4 py-3 text-gray-600">{event.tipo}</td>
          <td className="px-4 py-3 text-gray-600">
            {formatDate(event.fechaPublicacion)}
          </td>
          <td className="px-4 py-3 text-gray-600">
            {formatDate(event.fechaCompra)}
          </td>
          <td className="px-4 py-3 text-gray-600">
            {horarioDate ? formatDate(horarioDate) : "No disponible"}
          </td>
          <td className="px-4 py-3 text-gray-600">
            {`${ocupacionActual ?? 0}/${ocupacionTotal ?? 0}`}
            <br />
            <span className="text-xs font-semibold">
              OCUPACIÓN: %{ocupacionPercent}
            </span>
          </td>
          <td className="px-4 py-3 text-gray-600">
            {formatCurrency(event.ingresosBrutos)}
          </td>
          <td className="px-4 py-3">
            <StatusBadge status={event.estado} />
          </td>
          <td className="px-4 py-3">
            <div className="flex items-center space-x-[-17px]">
              {/* Lógica condicional: si el estado es 'Creado', muestra todos los botones */}
              {event.estado === "Creado" ? (
                <>
                  <ActionButton
                    variant="icon"
                    onClick={() => handleAction("edit", event)}
                  >
                    <img
                      src="/images/icon/edit-icon.png"
                      alt="Editar"
                      className="w-12 h-8"
                    />
                  </ActionButton>
                  <ActionButton
                    variant="icon"
                    onClick={() => handleAction("delete", event)}
                  >
                    <img
                      src="/images/icon/delete-icon.png"
                      alt="Eliminar"
                      className="w-12 h-8"
                    />
                  </ActionButton>
                  <ActionButton
                    variant="icon"
                    onClick={() => handleAction("view", event)}
                  >
                    <img
                      src="/images/icon/view-icon.png"
                      alt="Ver"
                      className="w-15 h-8"
                    />
                  </ActionButton>
                </>
              ) : (
                /* Para cualquier otro estado, solo muestra el botón de ver */
                <ActionButton
                  variant="icon"
                  onClick={() => handleAction("view", event)}
                >
                  <img
                    src="/images/icon/view-icon.png"
                    alt="Ver"
                    className="w-5 h-5"
                  />
                </ActionButton>
              )}
            </div>
          </td>
        </tr>
      );
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto">
      <table className="w-full text-sm text-left text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th scope="col" className="px-4 py-3">
              Evento
            </th>
            <th scope="col" className="px-4 py-3">
              Local
            </th>
            <th scope="col" className="px-4 py-3">
              Tipo
            </th>
            <th scope="col" className="px-4 py-3">
              Fecha de Publicación
            </th>
            <th scope="col" className="px-4 py-3">
              Fecha de Compra
            </th>
            <th scope="col" className="px-4 py-3">
              Horario(s)
            </th>
            <th scope="col" className="px-4 py-3">
              Ocupación
            </th>
            <th scope="col" className="px-4 py-3">
              Ingresos brutos
            </th>
            <th scope="col" className="px-4 py-3">
              Estado
            </th>
            <th scope="col" className="px-4 py-3">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>{renderTableContent()}</tbody>
      </table>
    </div>
  );
};

export default EventsTable;
