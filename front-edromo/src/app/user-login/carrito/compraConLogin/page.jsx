// src/app/user/carrito/compraConLogin/page.jsx (o donde esté tu 'page.jsx')
"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "@/css/compraConLogin.module.css";
import Image from "next/image";

// 1. IMPORTAMOS LOS CONTEXTOS Y EL COMPONENTE DE VISTA
import { useCart } from "@/context/CartContext";
import { useUser } from "@/context/UserContext";
import { CostoDetalleEntradasController } from "@/components/carrito/CostoDetalleEntradas.controller";

// (Eliminada la importación del controller)

// 2. Renombramos 'App' para mayor claridad
function CompraConLoginPage() {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const router = useRouter();
  const formRef = useRef(null);

  // 3. OBTENEMOS DATOS DE LOS CONTEXTOS
  const { isLoading: isCartLoading, itemCount } = useCart();
  const { user, isAuthenticated, isLoading: isUserLoading } = useUser();

  const isLoading = isCartLoading || isUserLoading;

  // 4. EFECTO PARA PRE-RELLENAR EL FORMULARIO (MODIFICADO)
  useEffect(() => {
    if (user && formRef.current) {
      const { elements } = formRef.current;
      const setValueIfExists = (name, value) => {
        const control = elements?.namedItem?.(name);
        if (control && "value" in control) {
          control.value = value ?? "";
        }
      };

      setValueIfExists("email", user.email);
      setValueIfExists("nombre", user.nombre);
      setValueIfExists("apellido", user.apellido);
      // setValueIfExists("tipoDoc", user.tipoDoc);
      // setValueIfExists("numDoc", user.numDoc);
    }
  }, [user]);

  // 5. EFECTO PARA "GUARDIANES" (NUEVO)
  useEffect(() => {
    if (isLoading) return; // Espera a que carguen los contextos

    // Si NO está logueado, no debe estar aquí
    if (!isAuthenticated) {
      router.replace("/user-login/carrito/identificacion");
    }

    // Si el carrito está vacío, tampoco debe estar aquí
    if (itemCount === 0) {
      router.replace("/user-login/carrito/entradaDetalle");
    }
  }, [isLoading, isAuthenticated, itemCount, router]);

  const handlePaymentMethodChange = (event) => {
    setSelectedPaymentMethod(event.target.value);
  };

  const handleVerifyData = () => {
    // Esta función sigue siendo válida, guarda los datos del formulario
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
    router.push("/user-login/carrito/CompraPagoConLogin"); // (Esta ruta parece ser la misma que la actual, asegúrate de que sea la correcta)
  };

  // 6. MANEJO DE ESTADO DE CARGA O REDIRECCIÓN
  if (isLoading || !isAuthenticated || itemCount === 0) {
    return (
      <div className={styles.pageContainer}>
        <h1 className={styles.cardTitle}>Cargando...</h1>
        {/* Aquí puedes poner un Spinner/Loader global */}
      </div>
    );
  }

  // 7. RENDERIZADO DE LA PÁGINA
  return (
    <div className={styles.pageContainer}>
      {/* --- ENCABEZADO DE LA PÁGINA (sin cambios) --- */}
      <header className={styles.header}>
        {/* ... (resto del header) ... */}
      </header>

      {/* --- CONTENIDO PRINCIPAL EN 3 COLUMNAS --- */}
      <main className={styles.mainGrid}>
        {/* --- COLUMNA 1: IDENTIFICACIÓN (sin cambios) --- */}
        <form ref={formRef}>
          <section className={styles.card}>
            {/* ... (resto del formulario) ... */}
            <button
              type="button"
              onClick={handleVerifyData}
              className={`${styles.payButton} mt-4`}
            >
              Verificar Datos
            </button>
          </section>
        </form>

        {/* --- COLUMNA 2: MÉTODO DE PAGO (sin cambios) --- */}
        <section className={styles.card}>
          {/* ... (resto de método de pago) ... */}
        </section>

        {/* --- COLUMNA 3: RESUMEN DE COMPRA --- */}
        <section className={styles.card}>
          <h2 className={styles.cardTitle}>Resumen de la compra</h2>
          
          {/* 8. ¡CORREGIDO! Renderiza el componente autónomo */}
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