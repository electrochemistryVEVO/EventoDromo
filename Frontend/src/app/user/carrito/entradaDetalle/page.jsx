"use client"
import '@/css/styles.css'
import { TablaEntradas } from "@/components/carrito/tablaEntradas";
import { cantidadEntradas, items } from "./controller";
import CostoDetalleEntradas from '@/components/carrito/costoDetalleEntradas';
import CheckboxCarrito from '@/components/carrito/CheckboxCarrito';
import { useState } from 'react';

function App() {
    const [aceptaTerminos, setAceptaTerminos] = useState(false);
    const [autorizaDatos, setAutorizaDatos] = useState(false);

    const handleTerminos = (e) => setAceptaTerminos(e.target.checked);
    const handleAutoriza = (e) => setAutorizaDatos(e.target.checked);

    return (
        <div>
            <div className="carrito-header">
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '12px' }}>
                    <div>Icono</div>
                    <h1>Mi Carrito</h1>
                </div>
            </div>
            <section className="carrito-main-row flex flex-row">
                <div className="carrito-col">
                    <div className="costo-detalle-title pt-4 pb-2 text-lg">
                        Tienes {cantidadEntradas()} entradas
                    </div>
                    <TablaEntradas items={items} />
                </div>
                <div className="carrito-col">
                    <h2 className="costo-detalle-title pt-4">Precuenta de Entradas</h2>
                    <CostoDetalleEntradas entradas={items} />
                    <div className="mt-6">
                        <CheckboxCarrito
                            checked={aceptaTerminos}
                            onChange={handleTerminos}
                            required={true}
                            label="He leído y acepto los términos y condiciones de compra en Eventódromo. Acepto igualmente la política de privacidad y seguridad, y la política de cookies"
                        />
                        <CheckboxCarrito
                            checked={autorizaDatos}
                            onChange={handleAutoriza}
                            required={false}
                            label="Autorizo el uso de mis datos para finalidades adicionales"
                        />
                    </div>
                    <div className="botones-carrito-container">
                        <button
                            className={"boton-pedido-finalizar" + (aceptaTerminos ? "" : " boton-pedido-finalizar-disabled")}
                            disabled={!aceptaTerminos}
                            onClick={() => {
                                if (aceptaTerminos) {
                                    window.location.href = '/user/carrito/identificacion';
                                }
                            }}
                        >
                            Finalizar Pedido
                        </button>
                        <button
                            className="boton-pedido-eventos"
                        >
                            Elegir más eventos
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default App;