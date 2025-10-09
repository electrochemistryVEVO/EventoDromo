import React from "react";
import "./mis-entrada-item.css";

import DescargarButton from "./entrada-buttons/DescargarButton";
import TransferirButton from "./entrada-buttons/TransferirButton";
import VerDetalleButton from "./entrada-buttons/VerDetalleButton";

export default function MisEntradaItem({ entrada, index }) {
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
                  e.currentTarget.src = "/images/cards-04.png";
                }}
              />
            ) : (
              <span className="text-muted">LOGO</span>
            )}
          </div>

          <div className="mei-meta">
            <h3 className="mei-title">{entrada.titulo ?? "Evento"}</h3>

            <div className="mei-sub small text-muted">
              <div className="mei-row"><span className="mei-label">Fecha:</span> <span className="mei-value">{entrada.fecha ?? "-"}</span></div>
              <div className="mei-row"><span className="mei-label">Horario:</span> <span className="mei-value">{entrada.hora ?? "-"}</span></div>
              <div className="mei-row"><span className="mei-label">Ubicación:</span> <span className="mei-value mei-value--location">{entrada.direccion ?? entrada.ubicacion ?? "-"}</span></div>

              {/* transacción debajo de ubicación */}
              <div className="mei-row mei-transaccion"><span className="mei-label">Transacción:</span> <span className="mei-value">{entrada.transaccion ?? "-"}</span></div>
            </div>
          </div>
        </div>

        {/* divisor vertical entre contenido y panel derecho */}
        <div className="mei-divider" />

        <div className="mei-item-right">
          <div className="mei-info-grid">
            <strong>Estado:</strong>
            <div className="mei-status-badge">
              <span className={`mei-dot ${entrada.estado === "vigente" ? "mei-dot--green" : "mei-dot--gray"}`} />
              <span className="mei-status-text">{entrada.estado ?? "desconocido"}</span>
            </div>

            <strong>Número de entradas:</strong>
            <span>{entrada.cantidad ?? 1}</span>

            <strong>Costo total:</strong>
            <span>S/. {entrada.precio ?? "-"}</span>
          </div>

          <div className="mei-buttons">
            <DescargarButton />
            <TransferirButton />
            <VerDetalleButton />
          </div>
        </div>
      </div>
    </div>
  );
}