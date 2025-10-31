"use client";

import { useUser } from "@/context/UserContext";
import { CarruselView } from "./CarruselView";
import { EventosListView } from "./EventosListView";
import { LocalesView } from "./LocalesView";

export function EventosPageContent({ destacados, eventosPorCategoria, locales }) {
  const { isAuthenticated } = useUser();

  return (
    <div>
      <CarruselView eventos={destacados} />
      <EventosListView
        destacados={destacados}
        eventosPorCategoria={eventosPorCategoria}
        isAuthenticated={isAuthenticated}
      />
      <LocalesView locales={locales} />
    </div>
  );
}
