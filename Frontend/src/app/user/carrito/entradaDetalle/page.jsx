import '@/css/styles.css'
import { TablaEntradas } from "@/components/carrito/tablaEntradas";
import { cantidadEntradas, items } from "./controller";

function App() {
    return (
        <div className="flex flex-col">
            <section className="flex items-center">
                <div className="flex flex-row items-center pl-20 gap-2">
                    <div>Icono</div>
                    <h1>Mi Carrito</h1>
                </div>
            </section>
            <section className="flex flex-row">
                <section className="flex flex-col">
                    <div>
                        Tienes {cantidadEntradas()} entradas
                    </div>
                    <div>
                        <TablaEntradas items={items} />
                    </div>
                </section>
                <section>
                    
                </section>
            </section>
        </div>
    );
}

export default App;