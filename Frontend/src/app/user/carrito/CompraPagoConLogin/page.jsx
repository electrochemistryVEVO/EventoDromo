"use client";
import { cantidadEntradas, items, importeTotal } from "./controller";
import React, { useState } from 'react';
import '@/css/styles.css'
import { ResumenCompra } from "@/components/carrito/ResumenCompra";
import "@/css/compraPagoConLogin.css";

// Rename from App to a component name (optional, but good practice)
function CompraPagoConLogin() {
    const [showModal, setShowModal] = useState(false);
    const [selectedOption, setSelectedOption] = useState('opcionA');
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);

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
                <div className="flex flex-row w-100 justify-center gap-5 items-center">
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
                    <div className="flex flex-col text-2xl">
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
                    <div className="flex flex-col gap-3 items-start p-4 text-2xl">
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
                    <div className="">
                        <div className="costo-detalle-title pt-4 pb-2  text-lg">
                            Tienes {cantidadEntradas()} entradas
                        </div>
                        <ResumenCompra items={items} />
                        <div className="costo-detalle-total flex justify-between items-center">
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
                            <div className="flex flex-col items-start gap-1 mt-2">
                                <div className="costo-detalle-title pt-4 pb-2 text-lg text-left">
                                    Total: S/. {importeTotal()}
                                </div>
                                <div className="flex items-center">
                                    <span style={{fontSize: '2.2rem', color: '#00C49A'}}>
                                        &#36;
                                    </span>
                                    <span className="font-bold text-lg text-[#00C49A] ml-2">+12 Dromopuntos</span>
                                </div>
                            </div>
                        )}
                        <div className="flex justify-center mt-6">
                            {selectedPaymentMethod ? (
                                <button
                                    className="bg-[#00C49A] text-white rounded-2xl px-16 py-4 font-extrabold text-2xl shadow-lg hover:bg-[#00b07e] transition"
                                    style={{ minWidth: '220px' }}
                                    onClick={() => setShowModal(true)}
                                >
                                    Pagar
                                </button>
                            ) : (
                                <div className="costo-detalle-puntos text-center w-full">
                                    Seleccione un método de pago válido
                                </div>
                            )}
                        </div>
                        {showModal && (
                            <div className="fixed inset-0 flex items-center justify-center z-50">
                                <div className="bg-white rounded-2xl p-8 flex flex-col items-center shadow-lg relative min-w-[350px]">
                                    <button
                                        className="absolute top-4 right-4 text-3xl font-bold text-gray-400 hover:text-gray-700"
                                        onClick={() => setShowModal(false)}
                                        aria-label="Cerrar"
                                    >
                                        &times;
                                    </button>
                                    <div className="mb-4">
                                        <div className="flex items-center justify-center">
                                            <div style={{ width: '120px', height: '120px', background: '#38E86B', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <svg width="70" height="70" viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M20 36L32 48L50 30" stroke="white" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round"/>
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                    <h2 className="text-3xl font-bold text-center mb-2">Compra Exitosa</h2>
                                    <p className="text-gray-600 text-center mb-6">Puede visualizar y descargar su(s) ticket en la pagina de Mis Entradas</p>
                                    <button
                                        className="bg-[#00C49A] text-white rounded-xl px-8 py-2 font-bold text-lg shadow hover:bg-[#00b07e] transition"
                                        onClick={() => window.location.href = '/mis-entradas'}
                                    >
                                        Mis Entradas
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </section>
            </section>
        </div>
    );
}

export default CompraPagoConLogin;