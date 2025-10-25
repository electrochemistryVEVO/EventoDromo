"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "@/css/compraConLogin.module.css";
import CostoDetalleEntradas from "@/components/carrito/costoDetalleEntradas";
import Image from "next/image";

function App() {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);

  const router = useRouter();
  const formRef = useRef(null);

  const handlePaymentMethodChange = (event) => {
    setSelectedPaymentMethod(event.target.value);
  };

  const handleVerifyData = () => {
    // Guardar los datos del formulario en sessionStorage
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

    // Navegar a la siguiente página
    router.push("/user/carrito/CompraPagoConLogin");
  };

  useEffect(() => {
    // Asegurarnos de que estamos en el navegador
    if (typeof window !== "undefined") {
      const sessionData = sessionStorage.getItem("session");

      // Comprobar que existen los datos de sesión y la referencia al formulario
      if (sessionData && formRef.current) {
        const parsedSession = JSON.parse(sessionData);

        // La clave podría ser 'user', 'email' o estar anidada.
        // Revisa tu objeto de sesión para estar seguro. Usaremos 'user' como en tu ejemplo.
        const email = parsedSession.user;

        // --- ¡ESTA ES LA CORRECCIÓN CLAVE! ---
        // Verificamos que 'email' sea un string con contenido antes de continuar.
        if (typeof email === "string" && email) {
          const nameParts = email.split("@")[0].split(".");
          const nombre = nameParts[0]
            ? nameParts[0].charAt(0).toUpperCase() + nameParts[0].slice(1)
            : "";
          const apellido = nameParts[1]
            ? nameParts[1].charAt(0).toUpperCase() + nameParts[1].slice(1)
            : "";

          // Asignamos los valores al formulario de forma segura
          formRef.current.elements.email.value = email;
          formRef.current.elements.nombre.value = nombre;
          formRef.current.elements.apellido.value = apellido;
        }
      }
    }
  }, []); // El array de dependencias vacío asegura que se ejecute solo una vez

  return (
    <div className={styles.pageContainer}>
      {/* --- ENCABEZADO DE LA PÁGINA --- */}
      <header className={styles.header}>
        <div>
          <Link
            href="/user/carrito/entradaDetalle"
            className={styles.backButton}
          >
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
              src={"/images/icon/LogoUsuarioEncendido.svg"}
              alt="Identificación"
              width={36}
              height={36}
            />
            <div className={styles.stepActive}>Identificación</div>
          </div>
          <div className="flex flex-row items-center gap-2">
            <div className="w-8 h-8 rounded-full border-2 border-[#d9d9d9] flex items-center justify-center">
              <Image
                src={"/images/icon/LogoPagoApagado.svg"}
                alt="Método de Pago"
                width={20}
                height={20}
              />
            </div>
            <div className={styles.stepInactive}>Método de pago</div>
          </div>
        </div>
        <div /> {/* Elemento vacío para centrar el título */}
      </header>

      {/* --- CONTENIDO PRINCIPAL EN 3 COLUMNAS --- */}
      <main className={styles.mainGrid}>
        {/* --- COLUMNA 1: IDENTIFICACIÓN --- */}
        <form ref={formRef}>
          <section className={styles.card}>
            <h2 className={styles.cardTitle}>Identificación</h2>
            <p className="text-base text-gray-700">
              Verifica tu información. Esta se utilizará solamente para la
              finalización de la compra.
            </p>
            <div className="flex flex-col gap-4">
              {/* Fila Nombre y Apellido */}
              <div className="flex flex-col sm:flex-row gap-4">
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
              {/* Correo Electrónico */}
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
              {/* Fila Tipo y Número de Documento */}
              <div className="flex flex-col sm:flex-row gap-4">
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
              {/* Fila País y Ciudad */}
              <div className="flex flex-col sm:flex-row gap-4">
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

        {/* --- COLUMNA 2: MÉTODO DE PAGO --- */}
        <section className={styles.card}>
          <h2 className={styles.cardTitle}>Método de Pago</h2>
          <div className="flex flex-col gap-4">
            <label className={styles.radioLabel}>
              <input
                type="radio"
                name="paymentGroup"
                value="tarjeta"
                checked={selectedPaymentMethod === "tarjeta"}
                onChange={handlePaymentMethodChange}
                className={styles.radioInput}
              />
              Pago con tarjeta
            </label>
            <label className={styles.radioLabel}>
              <input
                type="radio"
                name="paymentGroup"
                value="dromopuntos"
                checked={selectedPaymentMethod === "dromopuntos"}
                onChange={handlePaymentMethodChange}
                className={styles.radioInput}
              />
              Usar DromoPuntos
            </label>
          </div>
        </section>

        {/* --- COLUMNA 3: RESUMEN DE COMPRA --- */}
        <section className={styles.card}>
          <h2 className={styles.cardTitle}>Resumen de la compra</h2>
          {/* CostoDetalleEntradas ahora es autónomo y obtiene sus propios datos */}
          <CostoDetalleEntradas />
          <div className="mt-4 flex flex-col items-center gap-4">
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

export default App;
