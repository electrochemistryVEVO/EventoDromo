"use client";
import '@/css/styles.css'
import Link from 'next/link';
import { ResumenCompra } from '@/components/carrito/ResumenCompra';
import { items } from './controller';

function App() {
    return (
        <div className="flex flex-col mx-5">
            <section className="flex flex-row h-20 items-center ">
                <div>
                    <Link
                        href="/user/carrito/entradaDetalle"
                        className={""}
                    >
                        Finalizar Pedido
                    </Link>
                </div>
                <div className="flex flex-row gap-2 w-100 justify-center items-center">
                    <div className="flex flex-row gap-2 items-center">
                        <div className="text-[#00C49A] font-bold text-4xl">Identificación</div>
                    </div>
                    <div className="flex flex-row gap-2 items-center">
                        <div className="text-[#00C49A] font-extrabold text-3xl">Metodo de Pago</div>
                    </div>
                </div>
            </section>
            <section className="flex flex-row gap-7 justify-between">
                <section className="flex flex-col bg-[#EFECEC] w-1/3 rounded-3 p-4 gap-3">
                    <div className="flex flex-row gap-2 items-center">
                        <div className="text-[#00C49A] font-semibold text-3xl text-center">Identificación</div>
                    </div>
                    <span className="text-justify text-xl">
                        Para poder comprar tus entradas inicia sesion o registrate.
                    </span>
                    <div className="flex flex-col items-center gap-3">
                        <button
                            className="w-3/5 text-2xl font-bold bg-[#00C49A] text-white rounded-lg py-3 mb-2 shadow hover:bg-[#00b07e] transition"
                            onClick={() => window.location.href = '/auth/login'}
                        >
                            Inicia Sesión
                        </button>
                        <button
                            className="w-3/5 text-2xl font-bold border-2 border-[#00C49A] text-[#00C49A] rounded-lg py-3 bg-white hover:bg-[#e6fff7] transition"
                            onClick={() => window.location.href = '/auth/signup'}
                        >
                            Regístrate
                        </button>
                    </div>
                </section>
                <section className="flex flex-col bg-[#EFECEC] w-1/3 rounded-3 p-4 gap-3">
                    <div className="flex flex-row gap-2 items-center">
                        <div className="text-[#00C49A] font-semibold text-3xl">Metodo de Pago</div>
                    </div>
                    <span className="text-justify text-xl">
                        Esperando a que se complete la informacion.
                    </span>
                </section>
                <section className="flex flex-col bg-[#EFECEC] w-1/3 rounded-3 p-4 gap-3">
                    <div className="flex flex-row gap-2 items-center">
                        <div className="text-[#00C49A] font-semibold text-3xl">Resumen de la compra</div>
                    </div>
                    <span className="text-center">
                        <ResumenCompra items={items} />
                    </span>
                </section>
            </section>
        </div>
    );
}

export default App;