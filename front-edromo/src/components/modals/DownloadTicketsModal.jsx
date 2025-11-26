import React from 'react';
import PropTypes from 'prop-types';
import { FiDownload, FiX } from 'react-icons/fi';
import { generateEntradaPDF } from '../../services/PDFGenerator.service';

const TicketItem = ({ ticket }) => (
  <div 
    style={{
      width: '480px',
      height: '116px',
      padding: '10px',
      backgroundColor: '#F4F4F4',
      borderRadius: '9.959px',
      boxSizing: 'content-box',
      flexShrink: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      margin: '10px auto'
    }}
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
      <div style={{ flexShrink: 0 }}>
        <img
          src={ticket.image}
          alt={`Entrada ${ticket.id}`}
          style={{
            width: '96px',
            height: '96px',
            objectFit: 'cover',
            borderRadius: '9.959px'
          }}
        />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <span style={{ 
            padding: '4px 8px',
            backgroundColor: '#E3F2FF',
            color: '#0066CC',
            fontSize: '12px',
            fontWeight: 500,
            borderRadius: '4px'
          }}>
            {ticket.id}
          </span>
          <span style={{ 
            padding: '4px 8px',
            backgroundColor: '#F3E8FF',
            color: '#6B21A8',
            fontSize: '12px',
            fontWeight: 500,
            borderRadius: '4px'
          }}>
            {ticket.type}
          </span>
        </div>
        <h3 style={{ 
          fontSize: '14px',
          fontWeight: 500,
          color: '#1F2937',
          marginBottom: '4px',
          lineHeight: 1.4
        }}>
          {ticket.eventInfo}
        </h3>
        <p style={{ 
          fontSize: '12px',
          color: '#6B7280'
        }}>
          Válido para 1 persona
        </p>
      </div>
    </div>
    <button
      className="flex items-center justify-center"
      onClick={async () => {
        const entradaData = {
          nombreEvento: ticket.eventInfo,
            idEvento: ticket.idEvento || 67,
          lugar: ticket.lugar || "Estadio San Marcos",
          fechaHora: ticket.fechaHora || "30 de octubre de 2025 - 07:00 P.M",
          nombreCliente: ticket.nombreCliente || "Usuario Registrado",
          dniCliente: ticket.dniCliente || "12345678",
          tipoEntrada: ticket.type,
          precio: ticket.precio || 500.00
        };
        let blob = await generateEntradaPDF(entradaData);
        let url = URL.createObjectURL(blob)
        // Crear elemento anchor temporal
        const link = document.createElement('a');
        link.href = url;
        link.download = `entrada-${entradaData.nombreEvento.toLowerCase().replace(/\s+/g, '-')}.pdf`;

        // Simular click para descargar
        document.body.appendChild(link);
        link.click();

        // Limpiar
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }}
      title="Descargar entrada"
      style={{
        width: '60px',
        height: '60px',
        borderRadius: '8px',
        backgroundColor: '#00C49A',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'transform 0.2s ease-in-out',
      }}
      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
    >
      <FiDownload 
        style={{
          width: '32px',
          height: '32px',
          color: '#FFFFFF',
          strokeWidth: 2.5
        }}
      />
    </button>
  </div>
);

TicketItem.propTypes = {
  ticket: PropTypes.shape({
    id: PropTypes.string.isRequired,
    image: PropTypes.string,
    eventInfo: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    lugar: PropTypes.string,
    fechaHora: PropTypes.string,
    nombreCliente: PropTypes.string,
    dniCliente: PropTypes.string,
    precio: PropTypes.number,
  }).isRequired,
};

const DownloadTicketsModal = ({ isOpen, onClose, tickets }) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 relative max-h-[90vh] flex flex-col">
        <header className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            Descarga tus entradas
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors duration-200"
            aria-label="Cerrar modal"
          >
            <FiX className="w-6 h-6 text-gray-500" />
          </button>
        </header>

        <div className="overflow-y-auto flex-1 p-2.5">
          {(tickets?.length ?? 0) > 0 ? (
            <div className="space-y-2.5">
              {tickets.map((ticket) => (
                <TicketItem key={ticket.id} ticket={ticket} />
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500">
              No hay entradas disponibles para descargar.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

DownloadTicketsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  tickets: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    image: PropTypes.string,
    eventInfo: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
  })).isRequired,
};

export default DownloadTicketsModal;