import '@/css/styles.css'
//import { CircleUser, WalletMinimal, ArrowLeftFromLine, File } from 'lucide-react';

function App() {
    return (
        <div className="flex flex-col mx-5">
            <section className="flex flex-row h-20 items-center ">
                <div>
                    <button>
                        <ArrowLeftFromLine strokeWidth={3} stroke="#898686"/>
                    </button>
                </div>
                <div className="flex flex-row gap-2 w-100 justify-center gap-5 items-center">
                    <div className="flex flex-row gap-2 items-center">
                        <CircleUser fill="white" strokeWidth={2} stroke="#00C49A"/>
                        <div className="text-[#00C49A] font-bold text-2xl">Identificación</div>
                    </div>
                    <div className="flex flex-row gap-2 items-center">
                        <WalletMinimal fill="white" strokeWidth={2} stroke="#00C49A"/>
                        <div className="text-[#00C49A] font-bold text-2xl">Metodo de Pago</div>
                    </div>
                </div>
            </section>
            <section className="flex flex-row gap-7 justify-between">
                <section className="flex flex-col bg-[#EFECEC] w-1/3 rounded-3 p-3">
                    <div className="flex flex-row gap-2 items-center">
                        <CircleUser fill="#EFECEC" strokeWidth={2} stroke="#00C49A"/>
                        <div className="text-[#00C49A] font-semibold text-lg">Identificación</div>
                    </div>
                    <span className="text-center">
                        Para poder comprar tus entradas inicia sesion o registrate.
                    </span>
                    <div className="flex flex-col">
                        <button>Inicia Sesion</button>
                        <button>Registrate</button>
                    </div>
                </section>
                <section className="flex flex-col bg-[#EFECEC] w-1/3 rounded-3 p-3">
                    <div className="flex flex-row gap-2 items-center">
                        <WalletMinimal fill="#EFECEC" strokeWidth={2} stroke="#00C49A"/>
                        <div className="text-[#00C49A] font-semibold text-lg">Metodo de Pago</div>
                    </div>
                    <span className="text-center">
                        Esperando a que se complete la informacion.
                    </span>
                </section>
                <section className="flex flex-col bg-[#EFECEC] w-1/3 rounded-3 p-3">
                    <div className="flex flex-row gap-2 items-center">
                        <File fill="#EFECEC" strokeWidth={2} stroke="#00C49A"/>
                        <div className="text-[#00C49A] font-semibold text-lg">Resumen de la compra</div>
                    </div>
                    <span className="text-center">
                        Resumen de la compra
                    </span>
                </section>
            </section>
        </div>
    );
}

export default App;