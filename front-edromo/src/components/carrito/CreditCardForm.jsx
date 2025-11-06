"use client";
import React from "react";
// Importamos los mismos estilos que la página padre
import styles from "@/css/compraPagoConLogin.module.css"; 

// Recibe el estado, los errores y el manejador desde la página
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

export default CreditCardForm;