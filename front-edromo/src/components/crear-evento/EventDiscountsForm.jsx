/**
 * @file EventDiscountsForm.jsx
 * @description Componente para añadir y gestionar los descuentos del evento.
 */
import React from "react";

// Sub-componente para una sola tarjeta de descuento
const DiscountCard = ({
  discountData,
  index,
  onRemove,
  onChange,
  tiposEntradaDisponibles, // Lista de tipos de entrada para el select
  isReadOnly = false,
}) => {
  return (
    <div className="p-4 border rounded-lg bg-white relative">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-gray-600">Descuento {index + 1}</h3>
        <button
          onClick={() => onRemove(discountData.id)}
          disabled={isReadOnly}
          className="text-gray-400 hover:text-red-500 font-bold text-xl"
        >
          &times;
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Fila 1 */}
        <div className="md:col-span-2">
          <label className="text-xs text-gray-500">Nombre del Descuento</label>
          <input
            type="text"
            placeholder="Ej: Venta Anticipada"
            name="nombre"
            value={discountData.nombre}
            onChange={(e) =>
              onChange(discountData.id, "nombre", e.target.value)
            }
            readOnly={isReadOnly}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        {/* Fila 2 */}
        <div>
          <label className="text-xs text-gray-500">Código</label>
          <input
            type="text"
            placeholder="EARLYBIRD10"
            name="codigo"
            value={discountData.codigo}
            onChange={(e) =>
              onChange(discountData.id, "codigo", e.target.value)
            }
            readOnly={isReadOnly}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="text-xs text-gray-500">
            Tipo de Entrada Vinculada
          </label>
          <select
            name="tipoEntradaId"
            value={discountData.tipoEntradaId}
            onChange={(e) =>
              onChange(discountData.id, "tipoEntradaId", e.target.value)
            }
            disabled={isReadOnly}
            className="w-full p-2 border border-gray-300 rounded-md bg-white"
          >
            <option value="" disabled>
              Seleccione un tipo de entrada
            </option>
            {tiposEntradaDisponibles.map((tipo) => (
              <option key={tipo.id} value={tipo.id}>
                {tipo.nombre || `Entrada sin nombre (ID: ${tipo.id})`}
              </option>
            ))}
          </select>
        </div>

        {/* Fila 3 */}
        <div>
          <label className="text-xs text-gray-500">Tipo de Descuento</label>
          <select
            name="tipo"
            value={discountData.tipo}
            onChange={(e) => onChange(discountData.id, "tipo", e.target.value)}
            disabled={isReadOnly}
            className="w-full p-2 border border-gray-300 rounded-md bg-white"
          >
            <option value="Porcentaje">Porcentaje (%)</option>
            <option value="Fijo">Monto Fijo (S/)</option>
          </select>
        </div>
        <div>
          <label className="text-xs text-gray-500">Valor</label>
          <input
            type="number"
            placeholder="15"
            name="valor"
            value={discountData.valor}
            onChange={(e) => onChange(discountData.id, "valor", e.target.value)}
            readOnly={isReadOnly}
            className="w-full p-2 border border-gray-300 rounded-md"
            min="0"
          />
        </div>

        {/* Fila 4 */}
        <div>
          <label className="text-xs text-gray-500">Fecha de Inicio</label>
          <input
            type="datetime-local"
            name="fechaInicio"
            value={discountData.fechaInicio}
            onChange={(e) =>
              onChange(discountData.id, "fechaInicio", e.target.value)
            }
            readOnly={isReadOnly}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="text-xs text-gray-500">Fecha de Fin</label>
          <input
            type="datetime-local"
            name="fechaFin"
            value={discountData.fechaFin}
            onChange={(e) =>
              onChange(discountData.id, "fechaFin", e.target.value)
            }
            readOnly={isReadOnly}
            className="w-full p-2 border border-gray-300 rounded-md"
            min={discountData.fechaInicio || ""}
          />
        </div>

        {/* Fila 5 */}
        <div className="md:col-span-2">
          <label className="text-xs text-gray-500">Máximo de Usos</label>
          <input
            type="number"
            placeholder="100"
            name="usosMaximos"
            value={discountData.usosMaximos}
            onChange={(e) =>
              onChange(discountData.id, "usosMaximos", e.target.value)
            }
            readOnly={isReadOnly}
            className="w-full p-2 border border-gray-300 rounded-md"
            min="1"
          />
        </div>
      </div>
    </div>
  );
};

export const EventDiscountsForm = ({
  descuentos,
  tiposEntrada, // Necesitamos recibir los tipos de entrada para el select y la validación
  addDescuento,
  removeDescuento,
  handleDescuentoChange,
  isReadOnly = false,
}) => {
  const hayTiposDeEntrada = tiposEntrada && tiposEntrada.length > 0;

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mt-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800">
            Descuentos del Evento
          </h2>
          <p className="text-sm text-gray-500">
            Añade códigos de descuento para tipos de entrada específicos.
          </p>
        </div>
        <button
          onClick={addDescuento}
          disabled={!hayTiposDeEntrada || isReadOnly}
          className="bg-[#00C49A] text-white font-semibold px-4 py-2 rounded-lg hover:bg-[#00A37E] flex items-center gap-2 whitespace-nowrap disabled:bg-gray-300 disabled:cursor-not-allowed"
          title={
            !hayTiposDeEntrada
              ? "Debe crear al menos un tipo de entrada primero"
              : "Ingresar Descuento"
          }
        >
          + Ingresar Descuento
        </button>
      </div>

      {!hayTiposDeEntrada && (
        <div className="text-center p-4 border-2 border-dashed rounded-lg text-gray-500">
          <p>
            Para agregar un descuento, primero debe crear al menos un tipo de
            entrada en la sección anterior.
          </p>
        </div>
      )}

      <div className="space-y-4">
        {descuentos.map((descuento, index) => (
          <DiscountCard
            key={descuento.id}
            discountData={descuento}
            index={index}
            onRemove={removeDescuento}
            onChange={handleDescuentoChange}
            tiposEntradaDisponibles={tiposEntrada}
            isReadOnly={isReadOnly}
          />
        ))}
      </div>
    </div>
  );
};
