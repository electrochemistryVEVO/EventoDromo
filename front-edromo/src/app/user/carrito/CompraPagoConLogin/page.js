"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import { useCart } from "@/context/CartContext";
import { useUser } from "@/context/UserContext";
import styles from "@/css/compraPagoConLogin.module.css";
import { CostoDetalleEntradasController } from "@/components/carrito/CostoDetalleEntradas.controller";
import CartTimer from "@/components/carrito/CartTimer";

// --- COMPONENTES INTERNOS DE LA PÁGINA ---

const UserInfo = () => {
    const { user } = useUser();
    const [formData, setFormData] = useState(null);

    useEffect(() => {
        const storedData = sessionStorage.getItem("userData"); 
        if (storedData) {
            setFormData(JSON.parse(storedData));
        }
    }, []);

    if (!formData) {
        return (
            <section className={styles.card}>
                <h2 className={styles.cardTitle}>Identificación</h2>
                <div className="flex flex-col gap-1 -mt-2 text-base text-gray-700">
                    <p>Cargando datos...</p>
                </div>
            </section>
        );
    }

    return (
        <section className={styles.card}>
            <h2 className={styles.cardTitle}>Identificación</h2>
            <div className="flex flex-col gap-1 -mt-2 text-base text-gray-700">
                <p>{formData.email || user?.email}</p>
                <p>{`${formData.nombre || ""} ${formData.apellido || ""}`.trim()}</p>
                <p>{`${formData.tipoDoc || ""} ${formData.numDoc || ""}`.trim()}</p>
                <p>
                    {formData.ciudad || "No disponible"},{" "}
                    {formData.pais || "No disponible"}
                </p>
            </div>
        </section>
    );
};

// --- Formulario de Tarjeta de Crédito ---
const CreditCardForm = ({ cardDetails, formErrors, handleInputChange }) => (
    <div className="flex flex-col gap-4 ml-7 mt-4">
        {/* Campo Error General */}
        {formErrors.general && <div className="text-red-600 text-sm font-semibold">{formErrors.general}</div>}

        {/* Fila: Número de Tarjeta */}
        <div className="flex flex-col gap-1">
            <label htmlFor="number" className="text-sm font-medium text-gray-700">Número de Tarjeta</label>
            <input
                type="text"
                id="number"
                name="number"
                value={cardDetails.number}
                onChange={handleInputChange}
                placeholder="0000 0000 0000 0000"
                maxLength={19}
                className={`${styles.input} ${formErrors.number ? 'border-red-500' : 'border-gray-300'}`}
            />
            {formErrors.number && <p className="text-red-500 text-xs">{formErrors.number}</p>}
        </div>

        {/* Fila: Nombre en Tarjeta */}
        <div className="flex flex-col gap-1">
            <label htmlFor="name" className="text-sm font-medium text-gray-700">Nombre del Titular</label>
            <input
                type="text"
                id="name"
                name="name"
                value={cardDetails.name}
                onChange={handleInputChange}
                placeholder="Juan Perez"
                className={`${styles.input} ${formErrors.name ? 'border-red-500' : 'border-gray-300'}`}
            />
            {formErrors.name && <p className="text-red-500 text-xs">{formErrors.name}</p>}
        </div>

        {/* Fila: Expiración y CVV */}
        <div className="flex gap-4">
            <div className="flex flex-col gap-1 w-1/2">
                <label htmlFor="expiry" className="text-sm font-medium text-gray-700">Expira (MM/AA)</label>
                <input
                    type="text"
                    id="expiry"
                    name="expiry"
                    value={cardDetails.expiry}
                    onChange={handleInputChange}
                    placeholder="MM / AA"
                    maxLength={7}
                    className={`${styles.input} ${formErrors.expiry ? 'border-red-500' : 'border-gray-300'}`}
                />
                {formErrors.expiry && <p className="text-red-500 text-xs">{formErrors.expiry}</p>}
            </div>
            <div className="flex flex-col gap-1 w-1/2">
                <label htmlFor="cvv" className="text-sm font-medium text-gray-700">CVV</label>
                <input
                    type="text"
                    id="cvv"
                    name="cvv"
                    value={cardDetails.cvv}
                    onChange={handleInputChange}
                    placeholder="123"
                    maxLength={4}
                    className={`${styles.input} ${formErrors.cvv ? 'border-red-500' : 'border-gray-300'}`}
                />
                {formErrors.cvv && <p className="text-red-500 text-xs">{formErrors.cvv}</p>}
            </div>
        </div>
    </div>
);

// --- Info de DromoPuntos ---
const DromoPuntosInfo = () => (
    <div className="p-4 rounded-lg border-2 border-gray-300 flex flex-col items-start bg-white w-full max-w-[340px] ml-7">
        <p className="font-semibold text-gray-800">Tienes 1250 DromoPuntos</p>
        <p className="text-sm text-gray-600">Esta compra requiere 800 puntos.</p>
        <button className="mt-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-md px-3 py-1 font-medium">
            Usar mis puntos
        </button>
    </div>
);

// --- Contenedor de Métodos de Pago ---
const PaymentMethod = ({ 
    selectedPaymentMethod, 
    handlePaymentMethodChange, 
    cardDetails, 
    formErrors, 
    handleCardInputChange 
}) => (
    <section className={styles.card}>
        <h2 className={styles.cardTitle}>Método de Pago</h2>
        <div className="flex flex-col gap-4 -mt-2">
            <label className={styles.radioLabel}>
                <input
                    type="radio"
                    className={styles.radioInput}
                    name="paymentGroup"
                    value="tarjeta"
                    checked={selectedPaymentMethod === "tarjeta"}
                    onChange={handlePaymentMethodChange}
                />
                Pago con tarjeta de crédito / débito
            </label>
            
            {selectedPaymentMethod === "tarjeta" && (
                <CreditCardForm 
                    cardDetails={cardDetails}
                    formErrors={formErrors}
                    handleInputChange={handleCardInputChange}
                />
            )}
            
            <label className={styles.radioLabel}>
                <input
                    type="radio"
                    className={styles.radioInput}
                    name="paymentGroup"
                    value="dromopuntos"
                    checked={selectedPaymentMethod === "dromopuntos"}
                    onChange={handlePaymentMethodChange}
                />
                Usar DromoPuntos
            </label>
            {selectedPaymentMethod === "dromopuntos" && <DromoPuntosInfo />}
        </div>
    </section>
);

// --- Modal de Compra Exitosa ---
const SuccessModal = ({ onClose }) => {
    const router = useRouter();
    const { clearCart } = useCart();

    const handleRedirect = () => {
        clearCart();
        router.push("/user/web/perfil?tab=entradas");
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-2xl p-8 flex flex-col items-center shadow-lg relative min-w-[350px]">
                <h2 className="mb-2 text-3xl font-bold text-center">Compra Exitosa</h2>
                <p className="mb-6 text-center text-gray-600">
                    Puede visualizar y descargar su(s) ticket en la pagina de Mis Entradas
                </p>
                <button
                    className="bg-[#00C49A] text-white rounded-xl px-8 py-2 font-bold text-lg shadow hover:bg-[#00b07e] transition"
                    onClick={handleRedirect}
                >
                    Mis Entradas
                </button>
            </div>
        </div>
    );
};


// --- COMPONENTE PRINCIPAL (PÁGINA) ---

function CompraPagoConLoginPage() {
    const router = useRouter();
    const {
        isLoading: isCartLoading,
        itemCount,
        totalPrice,
    } = useCart();
    const { isAuthenticated, isLoading: isUserLoading } = useUser();

    const [showModal, setShowModal] = useState(false);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);

    // --- ESTADO PARA EL FORMULARIO DE TARJETA ---
    const [cardDetails, setCardDetails] = useState({
        number: "",
        name: "",
        expiry: "",
        cvv: "",
    });
    const [formErrors, setFormErrors] = useState({});
    const [isProcessing, setIsProcessing] = useState(false); // Para el loader del botón "Pagar"

    const isLoading = isCartLoading || isUserLoading;

    // Efecto de protección (sin cambios)
    useEffect(() => {
        if (isLoading) return;
        if (!isAuthenticated) {
            router.replace("/user/carrito/identificacion");
        }
        if (itemCount === 0) {
            router.replace("/user/carrito/entradaDetalle");
        }
    }, [isLoading, isAuthenticated, itemCount, router]);

    // --- HANDLERS PARA EL FORMULARIO ---

    // Manejador para formatear y actualizar los inputs de la tarjeta
    const handleCardInputChange = (e) => {
        const { name, value } = e.target;
        let formattedValue = value;

        // Limpia errores de este campo al empezar a escribir
        if (formErrors[name] || formErrors.general) {
            setFormErrors(prev => ({ ...prev, [name]: undefined, general: undefined }));
        }

        // Formateo automático
        if (name === "number") {
            formattedValue = value.replace(/\D/g, "").replace(/(\d{4})(?=\d)/g, "$1 ");
        } else if (name === "expiry") {
            formattedValue = value.replace(/\D/g, "").replace(/(\d{2})(\d{0,2})/, "$1 / $2").trim().slice(0, 7);
        } else if (name === "cvv") {
            formattedValue = value.replace(/\D/g, "");
        } else if (name === "name") {
            formattedValue = value.replace(/[^a-zA-Z\s]/g, ""); // Solo letras y espacios
        }

        setCardDetails(prev => ({ ...prev, [name]: formattedValue }));
    };

    // Validador simple (simulación realista)
    const validateForm = () => {
        const errors = {};
        const { number, name, expiry, cvv } = cardDetails;

        if (number.replace(/\s/g, "").length !== 16) {
            errors.number = "El número de tarjeta debe tener 16 dígitos.";
        }
        if (name.trim().split(" ").length < 2) {
            errors.name = "Ingrese su nombre y apellido completos.";
        }
        if (!/^(0[1-9]|1[0-2]) \/ ([2-9][0-9])$/.test(expiry)) {
            // Acepta años de 2024 (24) a 2099 (99)
            errors.expiry = "Formato de fecha inválido (MM / AA).";
        }
        if (cvv.length < 3) {
            errors.cvv = "El CVV debe tener 3 o 4 dígitos.";
        }
        
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Manejador del botón "Pagar"
    const handlePaymentSubmit = async () => {
        // 1. Validar el formulario de tarjeta
        if (selectedPaymentMethod === "tarjeta") {
            if (!validateForm()) {
                return; // Detiene si hay errores
            }
        }
        
        // 2. Simular pago (Estado de carga)
        setIsProcessing(true);
        setFormErrors({}); // Limpia errores antiguos
        
        // Simula la llamada a la API (2 segundos)
        await new Promise(resolve => setTimeout(resolve, 2000));

        // 3. Simular un pago rechazado (para realismo)
        // Puedes probar escribiendo "111" en el CVV
        if (cardDetails.cvv === "111") {
            setFormErrors({ general: "Pago rechazado. Fondos insuficientes." });
            setIsProcessing(false);
            return;
        }

        // 4. Simular pago exitoso
        setIsProcessing(false);
        setShowModal(true); // Muestra el modal de "Compra Exitosa"
    };


    if (isLoading || !isAuthenticated || itemCount === 0) {
        return (
            <div className={styles.pageContainer}>
                <h1 className={styles.cardTitle}>Cargando...</h1>
            </div>
        );
    }

    // --- RENDERIZADO PRINCIPAL ---
    return (
        <div className={styles.pageContainer}>
            <header className={styles.header}>
                <div>
                    <Link href="/user/carrito/entradaDetalle" className={styles.backButton}>
                        <Image
                            src={"/images/icon/flecha_izquierda.svg"}
                            alt="Flecha izquierda"
                            width={36}
                            height={36}
                        />
                    </Link>
                </div>
                <div className={styles.steps}>
                    <div className="flex flex-row items-center gap-2">
                        <Image
                            src={"/images/icon/LogoUsuarioApagado.svg"}
                            alt="Identificación"
                            width={36}
                            height={36}
                        />
                        <div className={styles.stepInactive}>Identificación</div>
                    </div>
                    <div className="flex flex-row items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-[#00C49A] flex items-center justify-center">
                            <Image
                                src={"/images/icon/LogoPagoEncendido.svg"}
                                alt="Método de Pago"
                                width={20}
                                height={20}
                            />
                        </div>
                        <div className={styles.stepActive}>Método de Pago</div>
                    </div>
                </div>
                <div />
            </header>

            <main className={styles.mainGrid}>
                {/* 1. Componente de Información del Usuario */}
                <UserInfo /> 
                
                {/* 2. Componente de Métodos de Pago */}
                <PaymentMethod
                    selectedPaymentMethod={selectedPaymentMethod}
                    handlePaymentMethodChange={(e) => setSelectedPaymentMethod(e.target.value)}
                    cardDetails={cardDetails}
                    formErrors={formErrors}
                    handleCardInputChange={handleCardInputChange}
                />
                
                {/* 3. Columna de Resumen de Compra */}
                <section className={styles.card}>
                    <h2 className={styles.cardTitle}>Resumen de la compra</h2>
                    <CartTimer variant="minimal"/>
                    <div className="flex flex-col h-full gap-4">
                        <CostoDetalleEntradasController />
                        <div className="flex flex-col items-center gap-4 pt-4 mt-auto border-t border-gray-300">
                            
                            {selectedPaymentMethod === "tarjeta" && (
                                <div className="flex flex-col items-center w-full gap-1">
                                    <div className="text-xl font-bold">Total: S/. {totalPrice.toFixed(2)}</div>
                                </div>
                            )}

                            {selectedPaymentMethod ? (
                                <button
                                    className="w-full max-w-xs bg-[#00C49A] text-white rounded-lg py-3 font-bold text-lg shadow-md hover:bg-[#00b07e] transition disabled:bg-gray-400 disabled:cursor-wait"
                                    onClick={handlePaymentSubmit} // <-- Llama al handler de pago
                                    disabled={isProcessing} // <-- Se deshabilita mientras paga
                                >
                                    {isProcessing ? "Procesando..." : "Pagar"}
                                </button>
                            ) : (
                                <div className="text-center text-gray-500">
                                    Seleccione un método de pago para continuar.
                                </div>
                            )}
                        </div>
                        {showModal && <SuccessModal onClose={() => setShowModal(false)} />}
                    </div>
                </section>
            </main>
        </div>
    );
}

export default CompraPagoConLoginPage;