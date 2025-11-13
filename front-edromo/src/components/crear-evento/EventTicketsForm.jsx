/**
 * @file EventTicketsForm.jsx
 * @description Componente para añadir dinámicamente los tipos de entrada del evento.
 */
import React from "react";

// Sub-componente para una sola tarjeta de tipo de entrada
const TicketTypeCard = ({
  ticketData,
  index,
  onRemove,
  onChange,
  isReadOnly = false,
  isLocked = false,
}) => {
  return (
    <div className="p-4 border rounded-lg bg-white relative">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-gray-600">
          Tipo de entrada {index + 1}
        </h3>
        <button
          onClick={() => onRemove(ticketData.id)}
          disabled={isReadOnly || isLocked}
          className="text-gray-400 hover:text-red-500 font-bold text-xl"
        >
          &times;
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-gray-500">Nombre del Tipo</label>
          <input
            type="text"
            placeholder="General"
            name="nombre"
            value={ticketData.nombre}
            onChange={(e) => onChange(ticketData.id, "nombre", e.target.value)}
            readOnly={isReadOnly}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="text-xs text-gray-500">Precio</label>
          <input
            type="number"
            placeholder="200"
            name="precio"
            value={ticketData.precio}
            onChange={(e) => onChange(ticketData.id, "precio", e.target.value)}
            readOnly={isReadOnly}
            className="w-full p-2 border border-gray-300 rounded-md"
            min="0"
          />
        </div>
        <div>
          <label className="text-xs text-gray-500">Cantidad de Entradas</label>
          <input
            type="number"
            placeholder="300"
            name="cantidad"
            value={ticketData.cantidad}
            readOnly={isReadOnly}
            onChange={(e) =>
              onChange(ticketData.id, "cantidad", e.target.value)
            }
            className="w-full p-2 border border-gray-300 rounded-md"
            min="0"
          />
        </div>
        <div>
          <label className="text-xs text-gray-500">Límite de compra</label>
          <input
            type="number"
            placeholder="10"
            name="limiteCompra"
            value={ticketData.limiteCompra}
            onChange={(e) =>
              onChange(ticketData.id, "limiteCompra", e.target.value)
            }
            readOnly={isReadOnly}
            className="w-full p-2 border border-gray-300 rounded-md"
            min="0"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="text-xs text-gray-500">Puntos por Compra</label>
          <input
            type="number"
            placeholder="2"
            name="puntos"
            value={ticketData.puntos}
            onChange={(e) => onChange(ticketData.id, "puntos", e.target.value)}
            readOnly={isReadOnly}
            className="w-full p-2 border border-gray-300 rounded-md"
            min="0"
          />
        </div>
      </div>
    </div>
  );
};

export const EventTicketsForm = ({
  tiposEntrada,
  addTipoEntrada,
  removeTipoEntrada,
  handleTipoEntradaChange,
  aforoRestante,
  descuentosAsociados,
  isReadOnly = false,
}) => {
  // Creamos un Set con los IDs de los tipos de entrada que están en uso
  const lockedTicketIds = new Set(
    descuentosAsociados.map((d) => parseInt(d.tipoEntradaId, 10))
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mt-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Tipos de entradas</h2>
          <p className="text-sm text-gray-500">
            Configura los diferentes tipos de entradas y los puntos por su
            compra
          </p>
        </div>
        <div className="flex items-center gap-4">
          <span
            className={`font-semibold text-sm ${
              aforoRestante < 0 ? "text-red-500" : "text-gray-600"
            }`}
          >
            Aforo Restante: {aforoRestante}
          </span>
          <button
            onClick={addTipoEntrada}
            disabled={isReadOnly}
            className="bg-[#00C49A] text-white font-semibold px-4 py-2 rounded-lg hover:bg-[#00A37E] flex items-center gap-2 whitespace-nowrap"
          >
            + Ingresar Tipo de Entrada
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {tiposEntrada.map((tipo, index) => (
          <TicketTypeCard
            key={tipo.id}
            ticketData={tipo}
            index={index}
            onRemove={removeTipoEntrada}
            onChange={handleTipoEntradaChange}
            isReadOnly={isReadOnly}
            isLocked={lockedTicketIds.has(tipo.id)}
          />
        ))}
      </div>
    </div>
  );
};
