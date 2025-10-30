"use client";

import { useUser } from "@/context/UserContext";
import { CarruselView } from "./CarruselView";
import { EventosListView } from "./EventosListView";
import { LocalesView } from "./LocalesView";

export function EventosPageContent({ destacados, conciertos, culturales, deportes, locales }) {
  const { isAuthenticated } = useUser();

  return (
    <div>
      <CarruselView eventos={destacados} />
      <EventosListView
        destacados={destacados}
        conciertos={conciertos}
        culturales={culturales}
        deportes={deportes}
        isAuthenticated={isAuthenticated}
      />
      <LocalesView locales={locales} />
    </div>
  );
}
