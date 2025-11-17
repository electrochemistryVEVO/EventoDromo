/**
 * @file EventsTable.jsx
 * @description Tabla para mostrar la lista de eventos con sus acciones.
 */

import React from "react";
import StatusBadge from "./StatusBadge.jsx";
import { FiEdit, FiSlash, FiEye } from 'react-icons/fi';

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
          <td colSpan="10" className="text-center py-8 text-gray-500">
            Cargando eventos...
          </td>
        </tr>
      );
    }

    if (error) {
      return (
        <tr>
          <td colSpan="10" className="text-center py-8 text-red-500">
            {error}
          </td>
        </tr>
      );
    }

    if (!events || events.length === 0) {
      return (
        <tr>
          <td colSpan="10" className="text-center py-8 text-gray-500">
            No se encontraron eventos.
          </td>
        </tr>
      );
    }

    return events.map((event) => {
      const ocupacionActual = event?.horarios?.[0]?.ocupacion?.actual;
      const ocupacionTotal = event?.horarios?.[0]?.ocupacion?.total;

      // Calculamos el porcentaje, asegurándonos de que los valores sean numéricos.
      const ocupacionPercent =
        (ocupacionTotal ?? 0) > 0
          ? (((ocupacionActual ?? 0) / ocupacionTotal) * 100).toFixed(0)
          : 0;

      // Obtenemos la fecha del horario de forma segura.
      const horarioDate = event?.horarios?.[0]?.horario;
      
      return (
        <tr key={event.id}>
          <td>{event.nombre}</td>
          <td>{event.local}</td>
          <td>{event.tipo}</td>
          <td>{formatDate(event.fechaPublicacion)}</td>
          <td>{formatDate(event.fechaCompra)}</td>
          <td>{horarioDate ? formatDate(horarioDate) : "No disponible"}</td>
          <td>
            {`${ocupacionActual ?? 0}/${ocupacionTotal ?? 0}`}
            <br />
            <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>
              OCUPACIÓN: {ocupacionPercent}%
            </span>
          </td>
          <td>{formatCurrency(event.ingresosBrutos)}</td>
          <td>
            <StatusBadge status={event.estado} />
          </td>
          <td>
            <div className="action-icons">
              {/* Lógica condicional: si el estado es 'Creado', muestra todos los botones */}
              {event.estado === "Creado" ? (
                <>
                  <button 
                    onClick={() => handleAction("edit", event)}
                    aria-label="Editar evento"
                    title="Editar evento"
                  >
                    <FiEdit />
                  </button>
                  <button 
                    onClick={() => handleAction("delete", event)}
                    aria-label="Eliminar evento"
                    title="Eliminar evento"
                  >
                    <FiSlash />
                  </button>
                  <button 
                    onClick={() => handleAction("view", event)}
                    aria-label="Ver evento"
                    title="Ver evento"
                  >
                    <FiEye />
                  </button>
                </>
              ) : (
                /* Para cualquier otro estado, solo muestra el botón de ver */
                <button 
                  onClick={() => handleAction("view", event)}
                  aria-label="Ver evento"
                  title="Ver evento"
                >
                  <FiEye />
                </button>
              )}
            </div>
          </td>
        </tr>
      );
    });
  };

  return (
    <div className="table-container">
      <table className="eventos-table">
        <thead>
          <tr>
            <th>Evento</th>
            <th>Local</th>
            <th>Tipo</th>
            <th>Fecha de Publicación</th>
            <th>Fecha de Compra</th>
            <th>Horario(s)</th>
            <th>Ocupación</th>
            <th>Ingresos brutos</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>{renderTableContent()}</tbody>
      </table>
    </div>
  );
};

export default EventsTable;
