import React from "react";
import Image from "next/image";

export default function DetalleTransaccionModal({ 
  isOpen, 
  onClose, 
  detalle,
  loading,
  error 
}) {
  if (!isOpen) return null;

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center" onClick={onClose}>
        <div className="bg-white rounded-lg p-8 max-w-2xl mx-4" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-center">
            <div className="spinner-border text-primary" role="status" />
            <span className="ms-2">Cargando detalles...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center" onClick={onClose}>
        <div className="bg-white rounded-lg p-8 max-w-2xl mx-4 relative" onClick={(e) => e.stopPropagation()}>
          <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-3xl" onClick={onClose}>×</button>
          <div className="alert alert-danger m-4">
            <strong>Error:</strong> {error.message || error}
          </div>
        </div>
      </div>
    );
  }

  if (!detalle || !detalle.data) return null;

  const { evento, transaccion, cliente, entradas, metodoPago, total } = detalle.data;

  // Determinar el tipo de pago
  const esTransferencia = metodoPago?.tipo === "transferencia";
  const esPendienteTransferencia = metodoPago?.tipo === "transferencia_pendiente";
  const esPuntos = metodoPago?.tipo === "puntos";
  const esTarjeta = metodoPago?.tipo === "tarjeta";

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-3xl" onClick={onClose}>×</button>

        {/* Header con imagen del evento */}
        <div className="bg-linear-to-r from-purple-600 to-blue-600 text-white p-6 rounded-t-lg">
          <div className="flex gap-6 items-start">
            <div className="shrink-0">
              <Image
                src={evento.imagen}
                alt={evento.titulo}
                width={200}
                height={200}
                className="rounded-lg shadow-lg object-cover"
              />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-4">{evento.titulo}</h2>
              <div className="space-y-2 text-sm">
                <p className="font-semibold">Fecha y hora del evento</p>
                <p>{new Date(evento.fecha).toLocaleDateString('es-PE', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}</p>
                <p className="font-semibold mt-3">Ubicación</p>
                <p>{evento.ubicacion}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Datos de transacción */}
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold mb-4">Datos de transacción</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-sm text-gray-600">Fecha de compra</span>
              <p className="font-medium">{new Date(transaccion.fecha).toLocaleDateString('es-PE')}</p>
            </div>
            <div>
              <span className="text-sm text-gray-600">Hora de compra</span>
              <p className="font-medium">{new Date(transaccion.fecha).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })}</p>
            </div>
            <div className="col-span-2">
              <span className="text-sm text-gray-600">N° Transacción</span>
              <p className="font-medium font-mono">{transaccion.numeroTransaccion}</p>
            </div>
          </div>
        </div>

        {/* Datos del cliente */}
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold mb-4">Datos del cliente</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-sm text-gray-600">Nombre</span>
              <p className="font-medium">{cliente.nombre}</p>
            </div>
            <div>
              <span className="text-sm text-gray-600">Correo</span>
              <p className="font-medium">{cliente.email}</p>
            </div>
            <div className="col-span-2">
              <span className="text-sm text-gray-600">Teléfono</span>
              <p className="font-medium">{cliente.telefono}</p>
            </div>
          </div>
        </div>

        {/* Datos de la compra */}
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold mb-4">Datos de la compra</h3>
          <p className="text-sm text-gray-600 mb-3">Entradas</p>
          <div className="space-y-2">
            {entradas.map((entrada, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <span className="font-semibold text-purple-600">x{entrada.cantidad}</span>
                <span className="flex-1 mx-4">{entrada.tipoEntrada}</span>
                <span className="font-medium">S/{entrada.precioUnitario.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Datos del pago / origen */}
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Datos del pago</h3>
          
          {/* Caso: Transferencia recibida */}
          {esTransferencia && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 flex gap-3">
              <div className="text-3xl">📨</div>
              <div>
                <strong className="text-blue-800 block mb-1">Entradas recibidas por transferencia</strong>
                <p className="text-sm text-blue-700">Estas entradas fueron transferidas a tu cuenta por otro usuario.</p>
              </div>
            </div>
          )}

          {/* Caso: Pendiente de transferencia */}
          {esPendienteTransferencia && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4 flex gap-3">
              <div className="text-3xl">⏳</div>
              <div>
                <strong className="text-orange-800 block mb-1">Transferencia en proceso</strong>
                <p className="text-sm text-orange-700">
                  Has enviado estas entradas a <strong>{metodoPago.detalles.emailDestino}</strong>. El destinatario debe aceptar la transferencia.
                </p>
              </div>
            </div>
          )}

          {/* Caso: Pago con tarjeta */}
          {esTarjeta && (
            <div className="bg-gray-50 rounded-lg p-4 mb-4 space-y-3">
              <div>
                <span className="text-sm text-gray-600">Método de pago</span>
                <p className="font-medium">Tarjeta Débito/ Crédito</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Número de Tarjeta</span>
                <p className="font-medium font-mono">XXXX XXXX XXXX {metodoPago.detalles.ultimos4Digitos}</p>
              </div>
            </div>
          )}

          {/* Caso: Pago con puntos */}
          {esPuntos && (
            <div className="bg-linear-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4 mb-4 space-y-3">
              <div>
                <span className="text-sm text-gray-600">Método de pago</span>
                <p className="font-medium">DromoPuntos</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Puntos utilizados</span>
                <p className="font-bold text-purple-600 text-lg">{metodoPago.detalles.puntosUtilizados} pt.</p>
              </div>
            </div>
          )}

          {/* Total */}
          <div className="border-t pt-4 flex justify-between items-center">
            <span className="text-lg font-semibold">Total</span>
            <span className="text-2xl font-bold text-purple-600">S/ {total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

