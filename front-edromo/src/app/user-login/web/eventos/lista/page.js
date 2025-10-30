import { obtenerDatosParaPagina } from "./controller.js"; // Añadida extensión .js
import { CarruselView } from "./CarruselView.js"; // Añadida extensión .jsx
import { EventosListView } from "./EventosListView.js"; // Añadida extensión .jsx
import { LocalesView } from "./LocalesView.js"; // Ya tenía extensión .js

// 1. La función ahora recibe { searchParams }
async function EventosPage({ searchParams }) {
  // 2. Pasamos searchParams al controlador para filtrar
  // 3. Destructuramos la nueva estructura de datos devuelta:
  //    destacados, eventosPorCategoria (objeto), locales
  const { destacados, eventosPorCategoria, locales } =
    await obtenerDatosParaPagina(searchParams);

  // 4. Pasamos los datos actualizados a los componentes de vista
  return (
    <div>
      {/* Carrusel sigue usando destacados */}
      <CarruselView eventos={destacados} />

      {/* EventosListView ahora recibe eventosPorCategoria */}
      <EventosListView
        destacados={destacados} // Para el grid superior
        eventosPorCategoria={eventosPorCategoria} // Objeto agrupado dinámicamente
        // Las props antiguas (conciertos, culturales, deportes) ya no se pasan
        isAuthenticated={true} // Mantener si se usa
      />

      {/* LocalesView recibe locales */}
      <LocalesView locales={locales} />
    </div>
  );
}

export default EventosPage;

