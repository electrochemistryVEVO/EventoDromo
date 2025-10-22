import EventCard from "../../../../../../front-edromo/src/components/eventCard";
import Image from "next/image";
import "@/css/eventos-list.css";

// Componente auxiliar para renderizar una tarjeta de evento
const EventoCardItem = ({ evento }) => (
  <div key={evento.id} className="col-12 col-md-6 col-lg-3 mb-4">
    <EventCard event={evento} />
  </div>
);

// Componente auxiliar para una sección de la lista
const EventosSection = ({ titulo, eventos }) => (
  <>
    <div className="section-header">
      <h2 className="titulo-destacado">{titulo}</h2>
      <button className="ver-mas-btn">Ver más</button>
    </div>
    <div className="row mt-4">
      {eventos && eventos.length > 0 ? (
        eventos.map((evento) => (
          <EventoCardItem key={evento.id} evento={evento} />
        ))
      ) : (
        <p>No hay eventos en esta categoría por el momento.</p>
      )}
    </div>
  </>
);

export function EventosListView({
  destacados,
  conciertos,
  culturales,
  deportes,
}) {
  // Tomamos solo los primeros 4 eventos para el grid
  const primerosCuatroDestacados = destacados.slice(0, 4);

  return (
    <section className="py-5">
      <div className="container-fluid px-lg-5 mt-5 px-4">
        {/* --- NUEVA SECCIÓN DE DESTACADOS --- */}
        <h2 className="titulo-destacado">Eventos Destacados</h2>
        <div className="destacados-grid-container">
          {/* Mapeamos los 4 eventos destacados en el grid */}
          {primerosCuatroDestacados.map((evento) => (
            <EventCard key={evento.id} event={evento} />
          ))}
          {/* Añadimos la imagen de publicidad que ocupa 2 espacios */}
          <div className="destacados-publicidad">
            <Image
              src="/images/eventos/publicidadDromoPuntos.png"
              alt="Publicidad Dromo Puntos"
              layout="fill"
            />
          </div>
        </div>

        <EventosSection titulo="Conciertos" eventos={conciertos} />

        <EventosSection titulo="Culturales" eventos={culturales} />

        <EventosSection titulo="Deportes" eventos={deportes} />
      </div>
    </section>
  );
}
