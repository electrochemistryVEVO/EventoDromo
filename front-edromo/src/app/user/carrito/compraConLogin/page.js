"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "@/css/compraConLogin.module.css";
import Image from "next/image";

import { useCart } from "@/context/CartContext";
import { useUser } from "@/context/UserContext";
import { CostoDetalleEntradasController } from "@/components/carrito/CostoDetalleEntradas.controller";
import { getMisDatos } from "@/services/User.service.js";

// --- 1. IMPORTA EL SERVICIO QUE TRAE LAS LISTAS ---
// (Ajusta la ruta si es diferente, ej. @/services/signUpService.js)
import { obtenerDatosDeRegistro } from "@/services/signUpService.js"; 
import CartTimer from "@/components/carrito/CartTimer";

function CompraConLoginPage() {
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
    const router = useRouter();
    const formRef = useRef(null);

    const { isLoading: isCartLoading, itemCount } = useCart();
    const { user, isAuthenticated, isLoading: isUserLoading } = useUser();

    // --- 2. AÑADE ESTADO PARA LAS LISTAS ---
    const [listas, setListas] = useState({ paises: [], ciudades: [], tiposDocumento: [] });
    const [isLoadingListas, setIsLoadingListas] = useState(true);

    //isLoading ahora incluye la carga de las listas
    const isLoading = isCartLoading || isUserLoading || isLoadingListas;

    // --- 3. NUEVO useEffect PARA CARGAR LAS LISTAS (PAÍS, CIUDAD, ETC.) ---
    useEffect(() => {
        const fetchListas = async () => {
            try {
                const data = await obtenerDatosDeRegistro();
                setListas({
                    paises: data.paises || [],
                    ciudades: data.ciudades || [],
                    // Asegúrate que el JSON de tu API use "tiposDocumento"
                    tiposDocumento: data.tiposDocumento || [] 
                });
            } catch (error) {
                console.error("Error cargando listas para el formulario:", error);
            } finally {
                setIsLoadingListas(false);
            }
        };
        fetchListas();
    }, []); // Array vacío, se ejecuta solo una vez al montar

    // --- 4. useEffect EXISTENTE (MODIFICADO) PARA RELLENAR EL FORMULARIO ---
    useEffect(() => {
        // Helper para rellenar el formulario (sin cambios)
        const populateForm = (data) => {
            if (formRef.current && data) {
                const { elements } = formRef.current;
                const setValue = (fieldName, value) => {
                    const field = elements?.namedItem(fieldName);
                    if (field && "value" in field) {
                        field.value = value ?? "";
                    }
                };
                
                // Rellena el formulario
                setValue("email", data.email);
                setValue("nombre", data.nombre);
                setValue("apellido", data.apellido);
                setValue("tipoDoc", data.tipoDoc);
                setValue("numDoc", data.numDoc);
                setValue("pais", data.pais);
                setValue("ciudad", data.ciudad); // <-- Ahora SÍ encontrará "Callao" en la lista
            }
        };

        const loadAndPopulateData = async () => {
            if (user?.token) {
                try {
                    const clienteData = await getMisDatos(user.token);
                    populateForm(clienteData);
                } catch (error) {
                    console.error("Error al cargar datos del cliente:", error);
                    populateForm(user); // Fallback
                }
            }
        };

        // Solo rellena el formulario si:
        // 1. El usuario está autenticado
        // 2. Las listas de los dropdowns YA se han cargado
        if (isAuthenticated && !isLoadingListas) {
            loadAndPopulateData();
        }

    }, [isAuthenticated, user, isLoadingListas]); // <-- Depende ahora de isLoadingListas

    // useEffect de protección (sin cambios)
    useEffect(() => {
        if (isLoading) return;

        if (!isAuthenticated) {
            router.replace("/user/carrito/identificacion");
        }

        if (itemCount === 0) {
            router.replace("/user/carrito/entradaDetalle");
        }
    }, [isLoading, isAuthenticated, itemCount, router]);

    // Handlers (sin cambios)
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

    // Return de Carga (ahora incluye isLoadingListas)
    if (isLoading || !isAuthenticated || itemCount === 0) {
        return (
            <div className={styles.pageContainer}>
                <h1 className={styles.cardTitle}>Cargando...</h1>
            </div>
        );
    }

    // --- 5. RENDERIZADO DEL FORMULARIO (ACTUALIZADO CON LISTAS DINÁMICAS) ---
    return (
        <div className={styles.pageContainer}>
            <header className={styles.header}>
                {/* ... (tu header con los steps no cambia) ... */}
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
                                    {/* SELECT DE TIPO DOC DINÁMICO */}
                                    <select id="tipoDoc" name="tipoDoc" className={styles.select}>
                                        <option value="">Seleccione un tipo</option>
                                        {listas.tiposDocumento.map(doc => (
                                            <option key={doc.id} value={doc.nombre}>
                                                {doc.nombre}
                                            </option>
                                        ))}
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
                                    {/* SELECT DE PAÍS DINÁMICO */}
                                    <select id="pais" name="pais" className={styles.select}>
                                        <option value="">Seleccione un País</option>
                                        {listas.paises.map(pais => (
                                            <option key={pais.id} value={pais.nombre}>
                                                {pais.nombre}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className={`w-full ${styles.formField}`}>
                                    <label htmlFor="ciudad" className={styles.formLabel}>
                                        Ciudad
                                    </label>
                                    {/* SELECT DE CIUDAD DINÁMICO */}
                                    <select id="ciudad" name="ciudad" className={styles.select}>
                                        <option value="">Seleccione su ciudad</option>
                                        {listas.ciudades.map(ciudad => (
                                            <option key={ciudad.id} value={ciudad.nombre}>
                                                {ciudad.nombre}
                                            </option>
                                        ))}
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
                    <CartTimer variant="minimal"/>
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