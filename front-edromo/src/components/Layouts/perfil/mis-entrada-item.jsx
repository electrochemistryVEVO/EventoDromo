import React, { useState, useEffect } from "react";
import "@/css/mis-entrada-item.css";

import DescargarButton from "./entrada-buttons/DescargarButton";
import TransferirButton from "./entrada-buttons/TransferirButton";
import VerDetalleButton from "./entrada-buttons/VerDetalleButton";
import { servicePerfil } from "@/services/transferir.service";

export default function MisEntradaItem({ entrada, index, onTransferComplete }) {
  const [tiposEntrada, setTiposEntrada] = useState([]);
  const [loading, setLoading] = useState(false);
  const [estadoEntradas, setEstadoEntradas] = useState({ 
    total: 0, 
    disponibles: 0, 
    transferidas: 0, 
    pendientes: 0 
  });

  // Función para recargar el estado de las entradas
  const recargarEstado = async () => {
    if (!entrada.transaccion || !entrada.id) return;
    
    try {
      const estado = await servicePerfil.obtenerEstadoEntradas(entrada.transaccion, entrada.id);
      setEstadoEntradas(estado);
    } catch (error) {
      console.error('Error cargando estado de entradas:', error);
    }
  };

  // Función para recargar tipos de entrada disponibles
  const recargarTiposEntrada = async () => {
    if (!entrada.transaccion || !entrada.titulo || !entrada.fecha) return;
    
    try {
      const tipos = await servicePerfil.obtenerTiposEntradaPorTransaccion(
        entrada.transaccion,
        entrada.titulo,
        entrada.fecha
      );
      setTiposEntrada(tipos);
      console.log('🔄 Tipos de entrada recargados:', tipos);
    } catch (error) {
      console.error('Error recargando tipos de entrada:', error);
    }
  };

  // Cargar los tipos de entrada para esta transacción + evento + fecha
  useEffect(() => {
    const cargarTiposEntrada = async () => {
      if (!entrada.transaccion || !entrada.titulo || !entrada.fecha) return;
      
      setLoading(true);
      try {
        // Log para debug: ver qué clave se está buscando
        const clave = `${entrada.transaccion}_${entrada.titulo}_${entrada.fecha}`;
        console.log('🔍 Buscando tipos de entrada para:', clave);
        
        const tipos = await servicePerfil.obtenerTiposEntradaPorTransaccion(
          entrada.transaccion,
          entrada.titulo,
          entrada.fecha
        );
        
        if (tipos.length > 0) {
          console.log('✅ Tipos encontrados:', tipos);
        } else {
          console.log('⚠️ No se encontraron tipos de entrada. Agregar al JSON:', clave);
        }
        
        setTiposEntrada(tipos);
      } catch (error) {
        console.error('Error cargando tipos de entrada:', error);
        setTiposEntrada([]);
      } finally {
        setLoading(false);
      }
    };

    cargarTiposEntrada();
    recargarEstado(); // Cargar también el estado inicial
  }, [entrada.transaccion, entrada.titulo, entrada.fecha]);

  // Manejador cuando se completa una transferencia
  const handleTransferComplete = async () => {
    await recargarEstado();
    await recargarTiposEntrada(); // Recargar también los tipos disponibles
    if (onTransferComplete) {
      onTransferComplete();
    }
  };

  // Verificar si el evento está vencido
  const esEventoVencido = () => {
    if (!entrada.fecha || !entrada.hora) return false;
    
    try {
      // Parsear la fecha y hora del evento
      const [dia, mes, anio] = entrada.fecha.split('/').map(Number);
      const [horas, minutos] = entrada.hora.split(':').map(Number);
      
      // Crear fecha del evento (mes es 0-indexed en JS)
      const fechaEvento = new Date(anio, mes - 1, dia, horas, minutos);
      const ahora = new Date();
      
      return fechaEvento < ahora;
    } catch (error) {
      console.error('Error al verificar fecha del evento:', error);
      return false;
    }
  };

  const eventoVencido = esEventoVencido();

  return (
    <div className="mei-item" data-index={index}>
      <div className="mei-card">
        <div className="mei-item-left">
          <div className="mei-thumb">
            {entrada.imagen ? (
              <img
                src={entrada.imagen}
                alt={entrada.titulo}
                onError={(e) => {
                  e.currentTarget.src = "https://placehold.co/400";
                }}
              />
            ) : (
              <span className="text-muted">LOGO</span>
            )}
          </div>

          <div className="mei-meta">
            <h3 className="mei-title">{entrada.titulo ?? "Evento"}</h3>

            <div className="mei-sub small text-muted">
              <div className="mei-row">
                <span className="mei-label">Fecha:</span>{" "}
                <span className="mei-value">{entrada.fecha ?? "-"}</span>
              </div>
              <div className="mei-row">
                <span className="mei-label">Horario:</span>{" "}
                <span className="mei-value">{entrada.hora ?? "-"}</span>
              </div>
              <div className="mei-row">
                <span className="mei-label">Dirección:</span>{" "}
                <span className="mei-value mei-value--location">
                  {entrada.direccion ?? "-"}
                </span>
              </div>

              {/* transacción debajo de ubicación */}
              <div className="mei-row mei-transaccion">
                <span className="mei-label">Transacción:</span>{" "}
                <span className="mei-value">{entrada.transaccion ?? "-"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* divisor vertical entre contenido y panel derecho */}
        <div className="mei-divider" />

        <div className="mei-item-right">
          <div className="mei-info-grid">
            <strong>Estado:</strong>
            <div className="mei-status-badge">
              <span
                className={`mei-dot ${
                  entrada.estado === "vigente"
                    ? "mei-dot--green"
                    : "mei-dot--gray"
                }`}
              />
              <span className="mei-status-text">
                {entrada.estado ?? "desconocido"}
              </span>
            </div>

            <strong>Número de entradas:</strong>
            <span>
              {estadoEntradas.total > 0 ? estadoEntradas.total : (entrada.cantidad ?? 1)}
            </span>

            {/* Mostrar estado de transferencia si hay datos */}
            {estadoEntradas.total > 0 && (
              <>
                <strong>Disponibles:</strong>
                <span className="mei-estado-disponible" style={{ color: '#00C49A', fontWeight: 'bold' }}>
                  {estadoEntradas.disponibles}
                </span>

                {estadoEntradas.transferidas > 0 && (
                  <>
                    <strong>Transferidas:</strong>
                    <span className="mei-estado-transferida" style={{ color: '#ff9800', fontWeight: 'bold' }}>
                      {estadoEntradas.transferidas}
                    </span>
                  </>
                )}

                {estadoEntradas.pendientes > 0 && (
                  <>
                    <strong>Pendientes:</strong>
                    <span className="mei-estado-pendiente" style={{ color: '#2196f3', fontWeight: 'bold' }}>
                      {estadoEntradas.pendientes}
                    </span>
                  </>
                )}
              </>
            )}

            <strong>Costo total:</strong>
            <span>S/. {entrada.precio ?? "-"}</span>
          </div>

          <div className="mei-buttons">
            <DescargarButton entrada={entrada} />
            <TransferirButton 
              transaccion={entrada.transaccion}
              tiposEntrada={tiposEntrada}
              onTransferComplete={handleTransferComplete}
              disabled={
                eventoVencido || 
                (estadoEntradas.disponibles === 0 && estadoEntradas.total > 0)
              }
              disabledReason={eventoVencido ? 'expired' : 'no-available'}
            />
            <VerDetalleButton numeroTransaccion={entrada.transaccion} idEvento={entrada.id} />
          </div>
        </div>
      </div>
    </div>
  );
}
