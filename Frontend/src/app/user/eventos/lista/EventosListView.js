import EventCard from "@/components/ui-elements/cards/eventCard";

// Componente auxiliar para renderizar una tarjeta de evento
const EventoCardItem = ({ evento }) => (
  <div key={evento.id} className="col-12 col-md-6 col-lg-3 mb-4">
    <EventCard event={evento} />
  </div>
);

// Componente auxiliar para una sección de la lista
const EventosSection = ({ titulo, eventos }) => (
  <>
    <h2 className="titulo-destacado">{titulo}</h2>
    <div className="row px-lg-5 container-fluid mt-5 px-4">
      {eventos && eventos.length > 0 ? (
        eventos.map(evento => <EventoCardItem key={evento.id} evento={evento} />)
      ) : (
        <p>No hay eventos en esta categoría por el momento.</p>
      )}
    </div>
  </>
);

export function EventosListView({ destacados, conciertos, culturales, deportes }) {
  return (
    <section className="py-5">
      <div className="container-fluid px-4 px-lg-5 mt-5">
        
        <EventosSection titulo="Eventos Destacados" eventos={destacados} />
        
        <EventosSection titulo="Conciertos" eventos={conciertos} />
        
        <EventosSection titulo="Culturales" eventos={culturales} />
        
        <EventosSection titulo="Deportes" eventos={deportes} />

      </div>
    </section>
  );
}