"use client";

import styles from "@/css/identificacion.module.css";
import Link from "next/link";
import Image from "next/image";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useUser } from "@/context/UserContext";
import CostoDetalleEntradas from "@/components/carrito/costoDetalleEntradas";

function IdentificacionPage() {
  const router = useRouter();
  // Obtenemos los datos completos del contexto para el log
  const cartContext = useCart();
  const userContext = useUser();

  // Desestructuramos para la lógica
  const { isLoading: isCartLoading, itemCount } = cartContext;
  const { isAuthenticated, isLoading: isUserLoading } = userContext;

  const isLoading = isCartLoading || isUserLoading;

  // EFECTO PARA MANEJAR REDIRECCIONES CON LOGS
  useEffect(() => {
    // Log inicial del estado al entrar al useEffect
    console.log("[IdentificacionPage Effect] Estado:", {
      isLoading,
      isCartLoading,
      isUserLoading,
      isAuthenticated,
      itemCount,
    });

    // Si aún está cargando, no hacemos nada más
    if (isLoading) {
        console.log("[IdentificacionPage Effect] Todavía cargando, esperando...");
        return;
    }

    // Comprobación de autenticación
    if (isAuthenticated) {
      console.log("[IdentificacionPage Effect] Usuario AUTENTICADO. Redirigiendo a /compraConLogin...");
      router.replace("/user-login/carrito/compraConLogin"); // Ensure correct path
      return; // Importante: Salir después de redirigir
    }
    // Comprobación de carrito vacío (solo si NO está autenticado)
    else if (itemCount === 0) {
      console.log("[IdentificacionPage Effect] Usuario NO autenticado Y itemCount es 0. Redirigiendo a /entradaDetalle...");
      router.replace("/user-login/carrito/entradaDetalle"); // Ensure correct path
      return; // Importante: Salir después de redirigir
    }
    
    // Si llegó hasta aquí, es invitado y tiene items
    console.log("[IdentificacionPage Effect] Usuario INVITADO con items. Permaneciendo en la página.");

  }, [isLoading, isAuthenticated, itemCount, router, isCartLoading, isUserLoading]); // Añadimos dependencias para el log

  // ESTADO DE CARGA O REDIRECCIÓN
  if (isLoading || isAuthenticated || itemCount === 0) {
     // Log para saber por qué muestra "Cargando..."
     console.log("[IdentificacionPage Render] Mostrando 'Cargando...' porque:", { isLoading, isAuthenticated, itemCountIsZero: itemCount === 0 });
    return (
      <div className={styles.pageContainer}>
        <h1 className={styles.cardTitle}>Cargando...</h1>
        {/* Spinner/Loader Component */}
      </div>
    );
  }

  // RENDERIZADO SI ES INVITADO Y EL CARRITO TIENE ITEMS
  console.log("[IdentificacionPage Render] Renderizando contenido principal.");
  return (
    <div className={styles.pageContainer}>
      {/* --- HEADER --- */}
      <header className={styles.header}>
        <div>
          <Link
            href="/user-login/carrito/entradaDetalle" // Corrected path
            className={styles.backButton}
          >
            <Image
              src={"/images/icon/arrow_left.svg"}
              alt="Flecha izquierda"
              width={36}
              height={36}
            />
          </Link>
        </div>
        <div className={styles.steps}>
          {/* Step 1: Identification (Active) */}
          <div className="flex flex-row items-center gap-2">
            <Image
              src={"/images/icon/LogoUsuarioEncendido.svg"}
              alt="Identificación"
              width={36}
              height={36}
            />
            <div className={styles.stepActive}>Identificación</div>
          </div>
          {/* Step 2: Payment (Inactive) */}
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
        <div /> {/* Spacer */}
      </header>

      {/* --- MAIN GRID --- */}
      <main className={styles.mainGrid}>
        {/* Col 1: Identification */}
        <section className={styles.card}>
          <h2 className={styles.cardTitle}>Identificación</h2>
          <p className={styles.cardText}>
            Para poder comprar tus entradas inicia sesion o registrate.
          </p>
          <div className={styles.buttonContainer}>
            <Link
              // Updated redirect path
              href="/auth/login?redirect=/user-login/carrito/compraConLogin"
              className={`${styles.button} ${styles.buttonPrimary}`}
            >
              Inicia Sesion
            </Link>
            <Link
              href="/auth/signup"
              className={`${styles.button} ${styles.buttonSecondary}`}
            >
              Registrate
            </Link>
          </div>
        </section>

        {/* Col 2: Payment Method */}
        <section className={styles.card}>
          <h2 className={styles.cardTitle}>Método de Pago</h2>
          <p className={styles.cardText}>
            Esperando a que se complete la informacion.
          </p>
        </section>

        {/* Col 3: Order Summary */}
        <section className={styles.card}>
          <h2 className={styles.cardTitle}>Resumen de la compra</h2>
          <CostoDetalleEntradas />
        </section>
      </main>
    </div>
  );
}

export default IdentificacionPage;
