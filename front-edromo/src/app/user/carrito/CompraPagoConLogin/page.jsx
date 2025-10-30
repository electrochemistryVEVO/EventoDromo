"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import { useCart } from "@/context/CartContext";
import { useUser } from "@/context/UserContext";
import styles from "@/css/compraPagoConLogin.module.css";
import { CostoDetalleEntradasController } from "@/components/carrito/CostoDetalleEntradas.controller";

const UserInfo = () => {
    const { user } = useUser();

    return (
        <section className={styles.card}>
            <h2 className={styles.cardTitle}>Identificación</h2>
            <div className="flex flex-col gap-1 -mt-2 text-base text-gray-700">
                <p>{user?.email || "Cargando..."}</p>
                <p>{`${user?.nombre || ""} ${user?.apellido || ""}`.trim()}</p>
                <p>
                    {user?.ciudad || "No disponible"},{" "}
                    {user?.pais || "No disponible"}
                </p>
            </div>
        </section>
    );
};

const CreditCardForm = () => (
    <div className="flex flex-col gap-4 ml-7">
        {/* Inputs del formulario */}
    </div>
);

const DromoPuntosInfo = () => (
    <div className="p-4 rounded-lg border-2 border-gray-300 flex flex-col items-start bg-white w-full max-w-[340px] ml-7">
        {/* Información de dromopuntos */}
    </div>
);

const PaymentMethod = ({ selectedPaymentMethod, handlePaymentMethodChange }) => (
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
            {selectedPaymentMethod === "tarjeta" && <CreditCardForm />}
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

const SuccessModal = ({ onClose }) => {
    const router = useRouter();
    const { clearCart } = useCart();

    const handleRedirect = () => {
        clearCart();
        router.push("/user/perfil?tab=entradas");
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

    const isLoading = isCartLoading || isUserLoading;

    useEffect(() => {
        if (isLoading) return;

        if (!isAuthenticated) {
            router.replace("/user/carrito/identificacion");
        }

        if (itemCount === 0) {
            router.replace("/user/carrito/entradaDetalle");
        }
    }, [isLoading, isAuthenticated, itemCount, router]);

    if (isLoading || !isAuthenticated || itemCount === 0) {
        return (
            <div className={styles.pageContainer}>
                <h1 className={styles.cardTitle}>Cargando...</h1>
            </div>
        );
    }

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
                <UserInfo />
                <PaymentMethod
                    selectedPaymentMethod={selectedPaymentMethod}
                    handlePaymentMethodChange={(e) => setSelectedPaymentMethod(e.target.value)}
                />
                <section className={styles.card}>
                    <h2 className={styles.cardTitle}>Resumen de la compra</h2>
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
                                    className="w-full max-w-xs bg-[#00C49A] text-white rounded-lg py-3 font-bold text-lg shadow-md hover:bg-[#00b07e] transition"
                                    onClick={() => setShowModal(true)}
                                >
                                    Pagar
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