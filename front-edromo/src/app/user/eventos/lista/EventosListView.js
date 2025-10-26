import EventCard from "@/components/card-evento/eventCard.jsx";
import Image from "next/image";
import "@/css/eventos-list.css";

// Componente auxiliar para renderizar una tarjeta de evento
const EventoCardItem = ({ evento, isAuthenticated }) => (
  <div key={evento.id} className="col-12 col-md-6 col-lg-3 mb-4">
    <EventCard event={evento} isAuthenticated={isAuthenticated} />
  </div>
);

// Componente auxiliar para una sección de la lista
const EventosSection = ({ titulo, eventos, isAuthenticated }) => (
  <>
    <div className="section-header">
      <h2 className="titulo-destacado">{titulo}</h2>
      <button className="ver-mas-btn">Ver más</button>
    </div>
    <div className="row mt-4">
      {eventos && eventos.length > 0 ? (
        eventos.map((evento) => (
          <EventoCardItem
            key={evento.id}
            evento={evento}
            isAuthenticated={isAuthenticated}
          />
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
  isAuthenticated,
}) {
  // Tomamos solo los primeros 4 eventos para el grid
  const primerosCuatroDestacados = destacados.slice(0, 4);

  return (
    <section className="py-5">
      <div className="container-fluid px-4 px-lg-5 mt-5">
        {/* --- NUEVA SECCIÓN DE DESTACADOS --- */}
        <h2 className="titulo-destacado">Eventos Destacados</h2>
        <div className="destacados-grid-container">
          {/* Mapeamos los 4 eventos destacados en el grid */}
          {primerosCuatroDestacados.map((evento) => (
            <EventCard
              key={evento.id}
              event={evento}
              isAuthenticated={isAuthenticated}
            />
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

        <EventosSection
          titulo="Conciertos"
          eventos={conciertos}
          isAuthenticated={isAuthenticated}
        />

        <EventosSection
          titulo="Culturales"
          eventos={culturales}
          isAuthenticated={isAuthenticated}
        />

        <EventosSection
          titulo="Deportes"
          eventos={deportes}
          isAuthenticated={isAuthenticated}
        />
      </div>
    </section>
  );
}
