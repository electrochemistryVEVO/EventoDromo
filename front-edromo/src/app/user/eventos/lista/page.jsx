import { obtenerDatosParaPagina } from "./controller";
import { EventosPageContent } from "./EventosPageContent";

export default async function EventosPage({ searchParams }) {
  const { destacados, eventosPorCategoria, locales } =
    await obtenerDatosParaPagina(searchParams);

  return (
    <EventosPageContent
      destacados={destacados}
      eventosPorCategoria={eventosPorCategoria}
      locales={locales}
    />
  );
}
