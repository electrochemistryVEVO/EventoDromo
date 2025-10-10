"use client"
import '@/css/styles.css'
import styles from './page.module.css';
import { TablaEntradas } from "@/components/carrito/tablaEntradas.tsx";
// --- PASO 1: Importa los datos de guía (estáticos) ---
import { items as mockItems } from './controller';
import CostoDetalleEntradas from '@/components/carrito/costoDetalleEntradas';
import CheckboxCarrito from '@/components/carrito/CheckboxCarrito';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import iconoCarrito from '@/assets/logos/icono_carrito.png';
import iconoFlechaIzq from '@/assets/icons/flecha_izquierda.svg';
import { fetchCart } from '@/services/ModalCarrito.service';

// --- PASO 2: Variable para controlar qué datos usar ---
// Cambia a `false` para usar los datos reales del servicio.
const USE_MOCK_DATA = true;

function App() {

    // Estados para los datos del carrito, carga y errores
    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Estados para los checkboxes
    const [aceptaTerminos, setAceptaTerminos] = useState(false);
    const [autorizaDatos, setAutorizaDatos] = useState(false);

    // Cargar datos del carrito al montar el componente
    useEffect(() => {
        if (USE_MOCK_DATA) {
            // --- Usa los datos de guía (estáticos) ---
            setItems(mockItems);
            setIsLoading(false);
        } else {
            // --- Usa los datos reales del servicio ---
            const loadCartData = async () => {
                setIsLoading(true);
                const response = await fetchCart();
                if (response.success) {
                    // Si response.data es un array, extraemos las entradas.
                    // Si es null (carrito vacío), el resultado será un array vacío.
                    const cartObject = Array.isArray(response.data) ? response.data[0] : null;
                    setItems(cartObject?.entradas || []);
                } else {
                    setError(response.error || "No se pudo cargar el carrito.");
                    setItems([]);
                }
                setIsLoading(false);
            };
            loadCartData();
        }
    }, []);

    // Placeholder para la función de eliminar. En una app real, esto llamaría al servicio.
    const handleRemoveItem = (id) => {
        setItems(prevItems => prevItems.filter(item => item.id !== id));
    };

    // Handlers para los checkboxes
    const handleTerminos = (e) => setAceptaTerminos(e.target.checked);
    const handleAutoriza = (e) => setAutorizaDatos(e.target.checked);

    return (
        <div className="px-40">
            <div className={styles.header}>
                {/* Icono de Carrito de Compras */}
                <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-10 w-10 text-gray-700" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor" 
                    strokeWidth={2}
                    aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <h1 className={styles.title}>Mi Carrito</h1>
            </div>
            {/* Estructura de dos columnas con Flexbox y Gap */}
            <section className="flex flex-col gap-8 lg:flex-row lg:gap-20">
                {/* Columna Izquierda (más ancha) */}
                <div className="w-full lg:w-2/3">
                    {isLoading ? (
                        <p>Cargando entradas...</p>
                    ) : error ? (
                        <p className="text-red-500">{error}</p>
                    ) : (
                        <>
                            <div className="pt-4 pb-2 text-4xl font-semibold text-gray-700">
                                {/* Ajustamos el cálculo para que funcione con ambos tipos de datos */}
                                Tienes {items.reduce((acc, item) => {
                                    // Los datos de guía usan 'quantity', los reales 'cantidadTotal'
                                    return acc + (item.cantidadTotal || item.quantity || 0);
                                }, 0)} entradas
                            </div>
                            <TablaEntradas items={items} onRemoveItem={handleRemoveItem} />
                        </>
                    )}
                </div>
                {/* Columna Derecha (más angosta y con fondo) */}
                <div id="colDerechaPrecuenta" className="w-full lg:w-1/3 rounded-lg bg-[#EFECEC] p-8 self-start">
                    <h2 className="pt-4 text-4xl font-semibold ">Detalle de pago</h2>
                    <CostoDetalleEntradas entradas={items} />
                    <div className="mt-8 flex flex-col gap-6 text-xl">
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
                    <div className="mt-10 flex flex-col items-center gap-5">
                        <button 
                            className="flex w-full max-w-sm items-center justify-center gap-4 rounded-2xl bg-[#00C49A] py-10 text-3xl font-bold text-white transition hover:bg-[#00b07e] disabled:cursor-not-allowed disabled:bg-gray-400"
                            disabled={!aceptaTerminos || isLoading || items.length === 0}
                            onClick={() => {
                                if (aceptaTerminos) {
                                    window.location.href = '/user/carrito/identificacion';
                                }
                            }}
                        >
                            <Image src={iconoCarrito} alt="" width={30} height={30} />
                            Finalizar Pedido
                        </button>
                        <button
                            className="w-full flex flex-row  justify-center items-center  gap-4 max-w-sm rounded-2xl bg-[#EFECEC] py-4 text-2xl font-bold text-gray-500 transition border-gray-400 border-2"
                        >
                            <Image src={iconoFlechaIzq} alt="" width={30} height={30} />    
                            Elegir más eventos
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default App;