import { useState, useEffect } from 'react';
import DownloadTicketsModal from '../../../modals/DownloadTicketsModal';

const DescargarButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await fetch('/data/mockTickets.json');
        const data = await response.json();
        setTickets(data.tickets);
      } catch (error) {
        console.error('Error al cargar los tickets:', error);
        setTickets([]);
      }
    };

    fetchTickets();
  }, []);

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