"use client";
import { cantidadEntradas, items, importeTotal } from "./controller";
import React, { useState } from 'react'; // <--- 1. Import useState
import '@/css/styles.css'
import { ResumenCompra } from "@/components/carrito/ResumenCompra";
import "@/css/compraPagoConLogin.css";

// Rename from App to a component name (optional, but good practice)
function CompraPagoConLogin() { 
    // <--- 2. Use useState hook to initialize and manage state
    const [selectedOption, setSelectedOption] = useState('opcionA');
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);

    // <--- 3. Define the handler function
    const handleOptionChange = (event) => {
        setSelectedOption(event.target.value);
    };
    
    const handlePaymentMethodChange = (event) => {
        setSelectedPaymentMethod(event.target.value);
    };

    return (
        <div className="flex flex-col mx-5">
            <section className="flex flex-row h-20 items-center ">
                <div>
                    <button>
                        Regresar
                    </button>
                </div>
                <div className="flex flex-row gap-2 w-100 justify-center gap-5 items-center">
                    <div className="flex flex-row gap-2 items-center">
                        <div className="text-[#00C49A] font-bold text-4xl">Identificación</div>
                    </div>
                    <div className="flex flex-row gap-2 items-center">
                        <div className="text-[#00C49A] font-bold text-4xl">Metodo de Pago</div>
                    </div>
                    
                </div>
            </section>
            <section className="flex flex-row gap-7 justify-between">
                <section className="flex flex-col bg-[#EFECEC] w-1/3 rounded-3 p-3">
                    <div className="flex flex-row gap-2 items-center">
                        <div className="text-[#00C49A] font-semibold text-4xl">Identificación</div>
                    </div>
                    <div className="flex flex-col">
                        <br></br>
                        cperez@email.com<br></br>
                        Carlos Perez<br></br>
                        Perú, Callao<br></br>
                    </div>
                </section>
                <section className="flex flex-col bg-[#EFECEC] w-1/3 rounded-3 p-3">
                    <div className="flex flex-row gap-2 items-center">
                        <div className="text-[#00C49A] font-semibold text-4xl">Metodo de Pago</div>
                    </div>
                    {/* Radio Buttons for Payment Method */}
                    <div className="flex flex-col gap-3 items-start p-4">
                        <label className="flex items-center gap-2 radio-green ">
                            <input
                                type="radio"
                                name="paymentGroup"
                                value="tarjeta"
                                checked={selectedPaymentMethod === 'tarjeta'}
                                onChange={handlePaymentMethodChange}
                            />
                            Pago con tarjeta de crédito / débito
                        </label>
                        <label className="flex items-center gap-2 radio-green">
                            <input
                                type="radio"
                                name="paymentGroup"
                                value="transferencia"
                                checked={selectedPaymentMethod === 'transferencia'}
                                onChange={handlePaymentMethodChange}
                            />
                            Usar DromoPuntos 
                        </label>
                    </div>
                </section>
                <section className="flex flex-col bg-[#EFECEC] w-1/3 rounded-3 p-3">
                    <div className="flex flex-row gap-2 items-center">
                        <div className="text-[#00C49A] font-semibold text-4xl">Resumen de la compra</div>
                    </div>
                    <div className="carrito-col">
                        <div className="costo-detalle-title pt-4 pb-2  text-lg">
                            Tienes {cantidadEntradas()} entradas
                        </div>
                        <ResumenCompra items={items} />
                        <div className="costo-detalle-total">
                            Importe total: S/. {importeTotal()} 
                        </div>
                        <div className="costo-detalle-puntos">
                            Seleccione un método de pago válido
                        </div>
                    </div>
                </section>
            </section>
        </div>
    );
}

// Ensure you export the correct component name if you changed it
export default CompraPagoConLogin;