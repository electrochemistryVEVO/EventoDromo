import '@/css/styles.css'
import { TablaEntradas } from "@/components/carrito/tablaEntradas";
import { cantidadEntradas, items } from "./controller";
import CostoDetalleEntradas from '@/components/carrito/costoDetalleEntradas';

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
                    <div className="pb-1 font-bold text-lg">
                        Tienes {cantidadEntradas()} entradas
                    </div>
                    <div>
                        <TablaEntradas items={items} />
                    </div>
                </section>
                <section className='flex flex-col pl-20'>
                    <div>
                        <div>
                            <h2 className="costo-detalle-title pt-4">Precuenta de Entradas</h2>
                        </div>
                        <div>
                            <CostoDetalleEntradas entradas={items} />
                        </div>
                    </div>
                </section>
            </section>
        </div>
    );
}

export default App;