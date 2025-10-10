"use client"
import styles from '@/css/entradaDetalle.module.css';
import { TablaEntradas } from "@/components/carrito/tablaEntradas.tsx";
import CostoDetalleEntradas from '@/components/carrito/costoDetalleEntradas';
import CheckboxCarrito from '@/components/carrito/CheckboxCarrito';
import { useState } from 'react';
// Importamos los archivos SVG directamente. Next.js nos dará un objeto con la ruta en .src
import iconoFlechaIzq from '@/assets/icons/flecha_izquierda.svg';

function EntradaDetallePage() {
    // Estados para los checkboxes
    const [aceptaTerminos, setAceptaTerminos] = useState(false);
    const [autorizaDatos, setAutorizaDatos] = useState(false);

    // Handlers para los checkboxes
    const handleTerminos = (e) => setAceptaTerminos(e.target.checked);
    const handleAutoriza = (e) => setAutorizaDatos(e.target.checked);

    return (
        <div className={styles.pageContainer}>
            <div className={styles.header}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <h1 className={styles.title}>Mi Carrito</h1>
            </div>
            <section className="flex flex-col gap-8 lg:flex-row lg:gap-20">
                <div className="w-full lg:w-2/3">
                    {/* TablaEntradas ahora es autónomo y se encarga de su propia data */}
                    <TablaEntradas />
                </div>
                <div id="colDerechaPrecuenta" className="w-full lg:w-1/3 rounded-lg bg-[#EFECEC] p-8 self-start">
                    <h2 className="pt-4 text-xl font-semibold ">Detalle de pago</h2>
                    {/* CostoDetalleEntradas ahora es autónomo y obtiene sus propios datos */}
                    <CostoDetalleEntradas />
                    <div className="mt-8 flex flex-col gap-6 text-xs">
                        <CheckboxCarrito checked={aceptaTerminos} onChange={handleTerminos} required={true} label="He leído y acepto los términos y condiciones de compra en Eventódromo. Acepto igualmente la política de privacidad y seguridad, y la política de cookies" />
                        <CheckboxCarrito checked={autorizaDatos} onChange={handleAutoriza} required={false} label="Autorizo el uso de mis datos para finalidades adicionales" />
                    </div>
                    <div className="mt-10 flex flex-col items-center gap-5">
                        <button
                            className="flex w-full max-w-sm items-center justify-center gap-4 rounded-2xl bg-[#00C49A] py-10 text-lg font-bold text-white transition hover:bg-[#00b07e] disabled:cursor-not-allowed disabled:bg-gray-400"
                            disabled={!aceptaTerminos}
                            onClick={() => {
                                if (aceptaTerminos) {
                                    window.location.href = '/user/carrito/identificacion';
                                }
                            }}
                        >
                            {/* Usamos la etiqueta <img> con la ruta del SVG importado */}
                            <img src="/assets/logos/icono_carrito.svg" alt="" width="24" height="24" style={{ filter: 'brightness(0) invert(1)' }} />
                            Finalizar Pedido
                        </button>
                        <button className="w-full flex flex-row  justify-center items-center  gap-4 max-w-sm rounded-2xl bg-[#EFECEC] py-4 text-base font-bold text-gray-500 transition border-gray-400 border-2">
                            <img src={iconoFlechaIzq.src} alt="" width="30" height="30" />
                            Elegir más eventos
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default EntradaDetallePage;