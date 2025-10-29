'use client'
import { obtenerDatosParaPagina } from "./controller";
import { CarruselView } from "./CarruselView";
import { EventosListView } from "./EventosListView";
import { LocalesView } from "./LocalesView.js";
import { useEffect,useState } from 'react';

async function EventosPage() {
  // 1. El 'page' (orquestador) llama al controller para obtener los datos.
    let [datos,setDatos] = useState({})
    useEffect(async () => {
        let _datos = await obtenerDatosParaPagina()
        console.log(_datos)
        setDatos(_datos);
    }, []);
  // 2. El 'page' pasa los datos a los componentes de la 'vista'.
  return (
    <div>
      <CarruselView eventos={datos?.destacados ?? []} />
      <EventosListView
        destacados={datos?.destacados ?? []}
        conciertos={datos?.conciertos ?? []}
        culturales={datos?.culturales ?? []}
        deportes={datos?.deportes ?? []}
        isAuthenticated={true}
      />
      <LocalesView locales={datos?.locales ?? []} />
    </div>
  );
}

export default EventosPage;
