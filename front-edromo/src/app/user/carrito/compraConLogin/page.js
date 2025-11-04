"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "@/css/compraConLogin.module.css";
import Image from "next/image";

import { useCart } from "@/context/CartContext";
import { useUser } from "@/context/UserContext";
import { CostoDetalleEntradasController } from "@/components/carrito/CostoDetalleEntradas.controller";

function CompraConLoginPage() {
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
    const router = useRouter();
    const formRef = useRef(null);

    const { isLoading: isCartLoading, itemCount } = useCart();
    const { user, isAuthenticated, isLoading: isUserLoading } = useUser();

    const isLoading = isCartLoading || isUserLoading;

    useEffect(() => {
        if (user && formRef.current) {
            const { elements } = formRef.current;
            const setValue = (fieldName, value) => {
                const field = elements?.namedItem(fieldName);
                if (field && "value" in field) {
                    field.value = value ?? "";
                }
            };

            setValue("email", user.email);
            setValue("nombre", user.nombre);
            setValue("apellido", user.apellido);
        }
    }, [user]);

    useEffect(() => {
        if (isLoading) return;

        if (!isAuthenticated) {
            router.replace("/user/carrito/identificacion");
        }

        if (itemCount === 0) {
            router.replace("/user/carrito/entradaDetalle");
        }
    }, [isLoading, isAuthenticated, itemCount, router]);

    const handlePaymentMethodChange = (event) => {
        setSelectedPaymentMethod(event.target.value);
    };

    const handleVerifyData = () => {
        const formData = new FormData(formRef.current);
        const userData = {
            nombre: formData.get("nombre"),
            apellido: formData.get("apellido"),
            email: formData.get("email"),
            tipoDoc: formData.get("tipoDoc"),
            numDoc: formData.get("numDoc"),
            pais: formData.get("pais"),
            ciudad: formData.get("ciudad"),
        };
        sessionStorage.setItem("userData", JSON.stringify(userData));

        router.push("/user/carrito/CompraPagoConLogin");
    };

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
                <form ref={formRef}>
                    <section className={styles.card}>
                        <h2 className={styles.cardTitle}>Identificación</h2>
                        <p className="text-base text-gray-700">
                            Verifica tu información. Esta se utilizará solamente para la finalización de la compra.
                        </p>
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col gap-4 sm:flex-row">
                                <div className={`w-full ${styles.formField}`}>
                                    <label htmlFor="nombre" className={styles.formLabel}>
                                        Nombre
                                    </label>
                                    <input
                                        id="nombre"
                                        name="nombre"
                                        type="text"
                                        className={styles.input}
                                        placeholder="Ingresa tu nombre"
                                    />
                                </div>
                                <div className={`w-full ${styles.formField}`}>
                                    <label htmlFor="apellido" className={styles.formLabel}>
                                        Apellido
                                    </label>
                                    <input
                                        id="apellido"
                                        name="apellido"
                                        type="text"
                                        className={styles.input}
                                        placeholder="Ingresa tu apellido"
                                    />
                                </div>
                            </div>

                            <div className={styles.formField}>
                                <label htmlFor="email" className={styles.formLabel}>
                                    Correo Electrónico
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    className={styles.input}
                                    placeholder="Ingresa tu correo electrónico"
                                />
                            </div>

                            <div className="flex flex-col gap-4 sm:flex-row">
                                <div className={`w-full ${styles.formField}`}>
                                    <label htmlFor="tipoDoc" className={styles.formLabel}>
                                        Tipo de Documento
                                    </label>
                                    <select id="tipoDoc" name="tipoDoc" className={styles.select}>
                                        <option>Seleccione un tipo de documento</option>
                                        <option>DNI</option>
                                    </select>
                                </div>
                                <div className={`w-full ${styles.formField}`}>
                                    <label htmlFor="numDoc" className={styles.formLabel}>
                                        Número de documento
                                    </label>
                                    <input
                                        id="numDoc"
                                        name="numDoc"
                                        type="text"
                                        className={styles.input}
                                        placeholder="Ingresa tu documento"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-4 sm:flex-row">
                                <div className={`w-full ${styles.formField}`}>
                                    <label htmlFor="pais" className={styles.formLabel}>
                                        País
                                    </label>
                                    <select id="pais" name="pais" className={styles.select}>
                                        <option>Seleccione un País</option>
                                        <option>Perú</option>
                                    </select>
                                </div>
                                <div className={`w-full ${styles.formField}`}>
                                    <label htmlFor="ciudad" className={styles.formLabel}>
                                        Ciudad
                                    </label>
                                    <select id="ciudad" name="ciudad" className={styles.select}>
                                        <option>Seleccione su ciudad</option>
                                        <option>Lima</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={handleVerifyData}
                            className={`${styles.payButton} mt-4`}
                        >
                            Verificar Datos
                        </button>
                    </section>
                </form>

                <section className={styles.card}>
                    <h2 className={styles.cardTitle}>Método de Pago</h2>
                    <div className="flex flex-col gap-4">
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
                    </div>
                </section>

                <section className={styles.card}>
                    <h2 className={styles.cardTitle}>Resumen de la compra</h2>
                    <CostoDetalleEntradasController />
                    <div className="flex flex-col items-center gap-4 mt-4">
                        {selectedPaymentMethod ? (
                            <button className={styles.payButton} disabled={true}>
                                Complete su identificación
                            </button>
                        ) : (
                            <p className="text-center text-gray-500">
                                Seleccione un método de pago para continuar.
                            </p>
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
}

export default CompraConLoginPage;