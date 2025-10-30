import { obtenerDatosParaPagina } from "./controller";
import { EventosPageContent } from "./EventosPageContent";

export default async function EventosPage() {
  const { destacados, conciertos, culturales, deportes, locales } =
    await obtenerDatosParaPagina();

  return (
    <EventosPageContent
      destacados={destacados}
      conciertos={conciertos}
      culturales={culturales}
      deportes={deportes}
      locales={locales}
    />
  );
}
