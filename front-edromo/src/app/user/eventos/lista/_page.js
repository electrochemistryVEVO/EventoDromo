import { obtenerDatosParaPagina } from "./controller";
import { CarruselView } from "./CarruselView";
import { EventosListView } from "./EventosListView";
import { LocalesView } from "./LocalesView.js";

async function EventosPage() {
  // 1. El 'page' (orquestador) llama al controller para obtener los datos.
  const { destacados, conciertos, culturales, deportes, locales } =
    await obtenerDatosParaPagina();

  // 2. El 'page' pasa los datos a los componentes de la 'vista'.
  return (
    <div>
      <CarruselView eventos={destacados} />
      <EventosListView
        destacados={destacados}
        conciertos={conciertos}
        culturales={culturales}
        deportes={deportes}
        isAuthenticated={false}
      />
      <LocalesView locales={locales} />
    </div>
  );
}

export default EventosPage;
