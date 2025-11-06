"use client";
import React from "react";
import styles from "@/css/compraPagoConLogin.module.css";
import CreditCardForm from "./CreditCardForm"; // Importa el nuevo formulario

// Placeholder para DromoPuntos (puedes moverlo a su propio archivo también)
const DromoPuntosInfo = () => (
    <div className="p-4 rounded-lg border-2 border-gray-300 flex flex-col items-start bg-white w-full max-w-[340px] ml-7">
        <p className="font-semibold text-gray-800">Tienes 1250 DromoPuntos</p>
        <p className="text-sm text-gray-600">Esta compra requiere 800 puntos.</p>
        <button className="mt-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-md px-3 py-1 font-medium">
            Usar mis puntos
        </button>
    </div>
);

// Este componente recibe todos los props desde la página principal
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

export default PaymentMethod;