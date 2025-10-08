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
                        <label className="flex items-center gap-2">
                            <input
                                type="radio"
                                className="custom-radio"
                                name="paymentGroup"
                                value="tarjeta"
                                checked={selectedPaymentMethod === 'tarjeta'}
                                onChange={handlePaymentMethodChange}
                            />
                            Pago con tarjeta de crédito / débito
                        </label>
                        {selectedPaymentMethod === 'tarjeta' && (
                            <div className="flex flex-col gap-4 mt-4 ml-7">
                                <label className="font-semibold">Número</label>
                                <input type="text" className="bg-[#F5F5F5] rounded-md p-2 w-64" placeholder="Número" />
                                <label className="font-semibold">Nombre Completo</label>
                                <input type="text" className="bg-[#F5F5F5] rounded-md p-2 w-64" placeholder="Nombre Completo" />
                                <div className="flex gap-4">
                                    <div className="flex flex-col">
                                        <label className="font-semibold">Fecha de Vencimiento</label>
                                        <div className="flex gap-2">
                                            <input type="text" className="bg-[#F5F5F5] rounded-md p-2 w-16" placeholder="MM" />
                                            <input type="text" className="bg-[#F5F5F5] rounded-md p-2 w-16" placeholder="AA" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col">
                                        <label className="font-semibold">CVV</label>
                                        <input type="text" className="bg-[#F5F5F5] rounded-md p-2 w-16" placeholder="CVV" />
                                    </div>
                                </div>
                            </div>
                        )}
                        <label className="flex items-center gap-2">
                            <input
                                type="radio"
                                className="custom-radio"
                                name="paymentGroup"
                                value="dromopuntos"
                                checked={selectedPaymentMethod === 'dromopuntos'}
                                onChange={handlePaymentMethodChange}
                            />
                            Usar DromoPuntos 
                        </label>
                        {selectedPaymentMethod === 'dromopuntos' && (
                            <div className="mt-4 ml-7 p-4 rounded-2xl border-4 border-gray-400 flex flex-col items-start bg-white w-[340px]">
                                <div className="flex items-center gap-3">
                                    <span style={{fontSize: '2.2rem', color: '#00C49A'}}>
                                        &#36;
                                    </span>
                                    <span className="font-bold text-2xl text-gray-600">120 Dromopuntos</span>
                                </div>
                                <div className="text-gray-500 font-semibold mt-2">
                                    Restantes: <span className="font-bold">1000 Dromopuntos</span>
                                </div>
                            </div>
                        )}
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
                        <div className="costo-detalle-total flex justify-between items-center">
                            <span className="font-bold text-xl">Total</span>
                            {selectedPaymentMethod === 'dromopuntos' && (
                                <span className="flex items-center gap-2 ml-6">
                                    <span style={{fontSize: '2.2rem', color: '#00C49A', border: '2px solid #00C49A', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                        &#36;
                                    </span>
                                    <span className="font-bold text-xl text-[#00C49A]">120</span>
                                </span>
                            )}
                        </div>
                        {selectedPaymentMethod === 'tarjeta' && (
                            <div className="flex items-center gap-3 mt-2">
                                <span style={{fontSize: '2.2rem', color: '#00C49A'}}>
                                    &#36;
                                </span>
                                <span className="font-bold text-lg text-[#00C49A]">+12 Dromopuntos</span>
                            </div>
                        )}
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