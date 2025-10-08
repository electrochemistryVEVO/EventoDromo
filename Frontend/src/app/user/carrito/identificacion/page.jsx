import '@/css/styles.css'
import Link from 'next/link';

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
                <div className="flex flex-row gap-2 w-100 justify-center gap-5 items-center">
                    <div className="flex flex-row gap-2 items-center">
                        <div className="text-[#00C49A] font-extrabold text-5xl">Identificación</div>
                    </div>
                    <div className="flex flex-row gap-2 items-center">
                        <div className="text-[#00C49A] font-extrabold text-5xl">Metodo de Pago</div>
                    </div>
                </div>
            </section>
            <section className="flex flex-row gap-7 justify-between">
                <section className="flex flex-col bg-[#EFECEC] w-1/3 rounded-3 p-4 gap-3">
                    <div className="flex flex-row gap-2 items-center">
                        <div className="text-[#00C49A] font-semibold text-4xl text-center">Identificación</div>
                    </div>
                    <span className="text-justify text-2xl">
                        Para poder comprar tus entradas inicia sesion o registrate.
                    </span>
                    <div className="flex flex-col items-center gap-3">
                        <Link href=""
                            className={"boton-verde-activo w-3/5 text-2xl no-underline"}>
                            Inicia Sesion
                        </Link>
                        <Link href=""
                            className={"boton-borde-verde w-3/5 text-2xl no-underline"}>
                            Registrate
                        </Link>
                    </div>
                </section>
                <section className="flex flex-col bg-[#EFECEC] w-1/3 rounded-3 p-4 gap-3">
                    <div className="flex flex-row gap-2 items-center">
                        <div className="text-[#00C49A] font-semibold text-4xl">Metodo de Pago</div>
                    </div>
                    <span className="text-justify text-2xl">
                        Esperando a que se complete la informacion.
                    </span>
                </section>
                <section className="flex flex-col bg-[#EFECEC] w-1/3 rounded-3 p-4 gap-3">
                    <div className="flex flex-row gap-2 items-center">
                        <div className="text-[#00C49A] font-semibold text-4xl">Resumen de la compra</div>
                    </div>
                    <span className="text-center">

                    </span>
                </section>
            </section>
        </div>
    );
}

export default App;