import EventCard from "@/components/card-evento/eventCard.jsx";
import Image from "next/image";
import "@/css/eventos-list.css"; // Mantenemos la importación del CSS

// Componente auxiliar para renderizar una tarjeta de evento (sin cambios)
const EventoCardItem = ({ evento }) => (
  <div key={evento.id} className="col-12 col-md-6 col-lg-3 mb-4">
    <EventCard event={evento} />
  </div>
);

// Componente auxiliar para una sección de la lista (sin cambios)
const EventosSection = ({ titulo, eventos }) => (
  // Añadimos un div contenedor con margen inferior para separar secciones
  <div className="mb-5"> 
    <div className="section-header">
      <h2 className="titulo-destacado">{titulo}</h2>
      {/* TODO: Implementar funcionalidad "Ver más" */}
      <button className="ver-mas-btn">Ver más</button> 
    </div>
    <div className="row mt-4"> {/* Usa 'row' para el grid de Bootstrap/CSS */}
      {eventos && eventos.length > 0 ? (
        eventos.map((evento) => (
          <EventoCardItem key={evento.id} evento={evento} />
        ))
      ) : (
        // Mensaje si no hay eventos en esta categoría (después de aplicar filtros)
        <p className="col-12">No hay eventos en esta categoría que coincidan con tu búsqueda.</p> 
      )}
    </div>
  </div>
);

// --- COMPONENTE PRINCIPAL ACTUALIZADO ---
// 1. Recibe 'eventosPorCategoria' en lugar de las listas separadas
export function EventosListView({
  destacados,
  eventosPorCategoria 
}) {
  // Tomamos solo los primeros 4 eventos para el grid superior (sin cambios)
  const primerosCuatroDestacados = destacados ? destacados.slice(0, 4) : []; 

  return (
    <section className="py-5">
      <div className="container-fluid px-4 px-lg-5 mt-5">
        {/* --- SECCIÓN DE DESTACADOS (sin cambios) --- */}
        {primerosCuatroDestacados.length > 0 && (
            <>
                <h2 className="titulo-destacado">Eventos Destacados</h2>
                <div className="destacados-grid-container mb-5"> 
                    {primerosCuatroDestacados.map((evento) => (
                    <EventCard key={evento.id} event={evento} />
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
            // Solo renderiza la sección si hay eventos en esa categoría
            eventosDeCategoria.length > 0 && (
              <EventosSection
                key={categoria}
                titulo={categoria} // Pasa el nombre real de la categoría como título
                eventos={eventosDeCategoria} 
              />
            )
          ))
        ) : (
           // Mensaje si no hay NINGÚN evento después de aplicar filtros
           primerosCuatroDestacados.length === 0 &&
             <p className="text-center my-5">No se encontraron eventos que coincidan con los filtros seleccionados.</p>
        )}

        {/* Las secciones hardcodeadas anteriores se eliminan */}

      </div>
    </section>
  );
}
