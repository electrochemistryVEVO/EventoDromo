import { CarruselEventos, ListaEventos } from "./controller";

//NOTA: En lo posible, usar componentes de react-bootstrap en vez de usar las clases manualmente
//Usar las clases manualmente no implementa el javascript necesario para el funcionamiento de algunos elementos
//Procurar usar .jsx en vez de .js para las paginas

function App() {
  return (
    <div>
      <CarruselEventos></CarruselEventos>
      <section className="py-5">
        <ListaEventos></ListaEventos>
      </section>
    </div>
  );
}

export default App;