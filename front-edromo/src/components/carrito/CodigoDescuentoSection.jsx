"use client";
import React, { useState } from "react";
import styles from "@/css/compraPagoConLogin.module.css";

/**
 * Componente para aplicar códigos de descuento en el proceso de compra
 */
const CodigoDescuentoSection = ({
  promocionAplicada,
  onAplicarCodigo,
  onRemoverCodigo,
  isProcessing,
  disabled = false
}) => {
  const [codigoInput, setCodigoInput] = useState("");

  const handleAplicar = () => {
    if (codigoInput.trim()) {
      onAplicarCodigo(codigoInput.trim().toUpperCase());
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && codigoInput.trim() && !isProcessing) {
      handleAplicar();
    }
  };

  return (
    <section className={styles.card}>
      <h2 className={styles.cardTitle}>Código de Descuento</h2>

      {!promocionAplicada ? (
        // Input para ingresar código
        <div className="flex gap-2 mt-2">
          <input
            type="text"
            placeholder="Ingresa tu código"
            value={codigoInput}
            onChange={(e) => setCodigoInput(e.target.value.toUpperCase())}
            onKeyPress={handleKeyPress}
            className={`${styles.input} flex-1`}
            disabled={isProcessing || disabled}
            maxLength={50}
          />
          <button
            onClick={handleAplicar}
            disabled={!codigoInput.trim() || isProcessing || disabled}
            className={`${styles.button} ${
              !codigoInput.trim() || isProcessing || disabled
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-[#00b07e]"
            } bg-[#00C49A] text-white px-6 py-2 rounded-lg font-semibold transition-colors`}
          >
            {isProcessing ? "Aplicando..." : "Aplicar"}
          </button>
        </div>
      ) : (
        // Mostrar código aplicado
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-2">
          <div className="flex justify-between items-center">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <svg
                  className="w-5 h-5 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="font-bold text-green-800">
                  Código "{promocionAplicada.codigo}" aplicado
                </p>
              </div>
              <p className="text-sm text-green-700">
                {promocionAplicada.tipo === "PORCENTAJE"
                  ? `${promocionAplicada.valor}% de descuento`
                  : `S/ ${promocionAplicada.valor.toFixed(2)} de descuento`}
              </p>
              <p className="text-sm font-semibold text-green-800 mt-1">
                Ahorras: S/ {promocionAplicada.montoDescuento.toFixed(2)}
              </p>
            </div>
            <button
              onClick={onRemoverCodigo}
              disabled={isProcessing || disabled}
              className={`text-red-600 hover:text-red-800 hover:bg-red-50 rounded-full p-2 transition-colors ${
                isProcessing || disabled ? "opacity-50 cursor-not-allowed" : ""
              }`}
              title="Remover código"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Mensaje informativo */}
      {!promocionAplicada && (
        <p className="text-xs text-gray-500 mt-2">
          Ingresa un código promocional válido para obtener descuentos en tu compra
        </p>
      )}
    </section>
  );
};

export default CodigoDescuentoSection;
