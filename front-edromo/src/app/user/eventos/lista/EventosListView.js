import EventCard from "@/components/card-evento/eventCard.jsx";
import Image from "next/image";
import "@/css/eventos-list.css"; // Mantenemos la importación del CSS

// Componente auxiliar para renderizar una tarjeta de evento
const EventoCardItem = ({ evento, isAuthenticated }) => (
  <div key={evento.id} className="mb-4 col-12 col-md-6 col-lg-3">
    <EventCard event={evento} isAuthenticated={isAuthenticated} />
  </div>
);

// Componente auxiliar para una sección de la lista
const EventosSection = ({ titulo, eventos, isAuthenticated }) => (
  <div>
    <div className="section-header">
      <h2 className="titulo-destacado">{titulo}</h2>
      {/* TODO: Implementar funcionalidad "Ver más" */}
      <button className="ver-mas-btn">Ver más</button> 
    </div>
    <div className="mt-4 row"> {/* Usa 'row' para el grid de Bootstrap/CSS */}
      {eventos && eventos.length > 0 ? (
        eventos.map((evento) => (
          <EventoCardItem
            key={evento.id}
            evento={evento}
            isAuthenticated={isAuthenticated}
          />
        ))
      ) : (
        // Mensaje si no hay eventos en esta categoría (después de aplicar filtros)
        <p className="col-12">No hay eventos en esta categoría que coincidan con tu búsqueda.</p> 
      )}
    </div>
  </div>
);

// --- COMPONENTE PRINCIPAL ---
export function EventosListView({ destacados, eventosPorCategoria, isAuthenticated }) {
  // Tomamos solo los primeros 4 eventos para el grid superior (sin cambios)
  const primerosCuatroDestacados = destacados ? destacados.slice(0, 4) : []; 

  return (
    <section className="py-5">
      <div className="px-4 mt-5 container-fluid px-lg-5">
        {/* --- SECCIÓN DE DESTACADOS (sin cambios) --- */}
        {primerosCuatroDestacados.length > 0 && (
            <>
                <h2 className="titulo-destacado">Eventos Destacados</h2>
                <div className="mb-5 destacados-grid-container"> 
                    {primerosCuatroDestacados.map((evento) => (
                    <EventCard key={evento.id} event={evento} isAuthenticated={isAuthenticated}/>
                    ))}
                    <div className="destacados-publicidad">
                    <Image
                        src="/images/eventos/publicidadDromoPuntos.png"
                        alt="Publicidad Dromo Puntos"
                        layout="fill"
                        objectFit="cover" 
                    />
                    </div>
                </div>
            </>
        )}

        {/* --- 2. Iterar dinámicamente sobre las categorías --- */}
        {eventosPorCategoria && Object.keys(eventosPorCategoria).length > 0 ? (
          Object.entries(eventosPorCategoria).map(([categoria, eventosDeCategoria]) => (
            eventosDeCategoria.length > 0 && (
              <EventosSection
                key={categoria}
                titulo={categoria}
                eventos={eventosDeCategoria}
                isAuthenticated={isAuthenticated}
              />
            )
          ))
        ) : (
          primerosCuatroDestacados.length === 0 && (
            <p className="my-5 text-center">
              No se encontraron eventos que coincidan con los filtros seleccionados.
            </p>
          )
        )}
      </div>
    </section>
  );
}
