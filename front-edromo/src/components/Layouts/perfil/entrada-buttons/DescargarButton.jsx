import { useState, useEffect } from 'react';
import DownloadTicketsModal from '../../../modals/DownloadTicketsModal';
import { obtenerDetalleTransaccion } from '@/services/detalle-transaccion.service';
import { useUser } from '@/context/UserContext';

const DescargarButton = ({entrada}) => {
  const { user } = useUser();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        if (!entrada.transaccion || !entrada.id || !user?.token) {
          console.warn('Faltan datos para cargar tickets:', { transaccion: entrada.transaccion, idEvento: entrada.id, token: !!user?.token });
          setTickets([]);
          return;
        }

        // Usar el mismo servicio que Ver Detalle
        const detalle = await obtenerDetalleTransaccion(entrada.transaccion, entrada.id, user.token);
        
        if (!detalle || !detalle.entradas) {
          console.warn('No se obtuvieron entradas del detalle');
          setTickets([]);
          return;
        }

        // Transformar las entradas del detalle al formato que espera el modal de descarga
        let contadorGlobal = 0;
        const ticketsData = detalle.entradas.flatMap((entrada) => {
          // Crear un ticket por cada cantidad de ese tipo de entrada
          return Array.from({ length: entrada.cantidad }).map(() => ({
            id: detalle.transaccion.numeroTransaccion,
            key: `${detalle.transaccion.numeroTransaccion}-${entrada.tipoEntrada}-${contadorGlobal++}`,
            image: detalle.evento.imagen,
            lugar: detalle.evento.ubicacion,
            fechaHora: `${new Date(detalle.evento.fecha).toLocaleDateString('es-PE')} - ${new Date(detalle.evento.fecha).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })}`,
            eventInfo: `${detalle.evento.titulo} - ${new Date(detalle.evento.fecha).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })} - ${detalle.evento.ubicacion}`,
            type: entrada.tipoEntrada,
            nombreCliente: detalle.cliente.nombre,
            dniCliente: detalle.cliente.numeroDocumento,
            precio: entrada.precioUnitario
          }));
        });

        setTickets(ticketsData);
      } catch (error) {
        console.error('Error al cargar los tickets:', error);
        setTickets([]);
      }
    };

    fetchTickets();
  }, [entrada.transaccion, entrada.id, user?.token]);

  return (
    <>
      <button
        type="button"
        className="mei-btn mei-btn--descargar"
        onClick={() => setIsModalOpen(true)}
      >
        Descargar
      </button>
      
      <DownloadTicketsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        tickets={tickets}
      />
    </>
  );
};

export default DescargarButton;