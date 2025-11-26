import { useState, useEffect } from 'react';
import DownloadTicketsModal from '../../../modals/DownloadTicketsModal';
import {api} from '@/lib/api.js';

const DescargarButton = ({entrada}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
          console.log(localStorage.getItem("user"))
        const data = await api.get(`/Entrada/ListarMisEntradas?numeroTransaccion=${entrada.transaccion}`)
            .then((res)=>{
                let i=0;
                return res.map((tipoEvento)=>({
                    id: entrada.transaccion,
                    key: `${entrada.transaccion}-${i++}`,
                    image: entrada.imagen,
                    lugar: entrada.localNombre,
                    fechaHora: `${entrada.fecha} - ${entrada.hora}`,
                    //eventInfo: "Overpass Lima - 8:00 PM - LIMA,PE",
                    eventInfo: `${entrada.titulo} - ${entrada.hora} - ${entrada.ciudadNombre},${entrada.paisNombre}`,
                    type: tipoEvento.nombre,
                    nombreCliente: tipoEvento.nombreCliente,
                    dniCliente: tipoEvento.dniCliente,
                    precio: tipoEvento.precio
                }))
            })
        setTickets(data);
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