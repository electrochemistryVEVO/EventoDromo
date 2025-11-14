import React, {Suspense} from "react";
// Importamos el controller que tiene toda la lógica y los componentes.
import EventPageController from "./controller";
// Importamos los estilos específicos para este layout.
import "@/css/detalle-Evento/detalle-evento-style.css";

const EventPage = () => {
  // Aquí usamos un "render prop" o componente hijo para obtener los datos
  // del controller y distribuirlos. Es un patrón avanzado pero muy limpio.
  // Para simplificar, en este ejemplo vamos a duplicar un poco la lógica de render.
  // Si prefieres, puedes simplemente poner <EventPageController /> y aplicar CSS
  // directamente, pero separar las columnas es más robusto.

  return (
    <div className="event-page-background">
      <div className="event-page-container">
        {/* Aquí renderizamos el controller que se encarga de todo el estado y la lógica */}
        <Suspense fallback={<div>Cargando...</div>}>
          <EventPageController />
        </Suspense>
      </div>
    </div>
  );
};

export default EventPage;
