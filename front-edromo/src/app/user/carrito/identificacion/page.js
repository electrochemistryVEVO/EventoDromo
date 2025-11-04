"use client";

import styles from "@/css/identificacion.module.css";
import Link from "next/link";
import Image from "next/image";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useUser } from "@/context/UserContext";
import CostoDetalleEntradas from "@/components/carrito/costoDetalleEntradas";
import { CostoDetalleEntradasController } from "@/components/carrito/CostoDetalleEntradas.controller";

function IdentificacionPage() {
  const router = useRouter();
  const cartContext = useCart();
  const userContext = useUser();

  const { isLoading: isCartLoading, itemCount } = cartContext;
  const { isAuthenticated, isLoading: isUserLoading } = userContext;

  const isLoading = isCartLoading || isUserLoading;

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (isAuthenticated) {
      router.replace("/user/carrito/compraConLogin");
      return;
    }

    if (itemCount === 0) {
      router.replace("/user/carrito/entradaDetalle");
    }
  }, [isLoading, isAuthenticated, itemCount, router, isCartLoading, isUserLoading]);

  if (isLoading || isAuthenticated || itemCount === 0) {
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
              src={"/images/icon/arrow_left.svg"}
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
        <div />
      </header>

      <main className={styles.mainGrid}>
        <section className={styles.card}>
          <h2 className={styles.cardTitle}>Identificación</h2>
          <p className={styles.cardText}>
            Para poder comprar tus entradas inicia sesion o registrate.
          </p>
          <div className={styles.buttonContainer}>
            <Link
              href="/auth/login?redirect=/user/carrito/compraConLogin"
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

        <section className={styles.card}>
          <h2 className={styles.cardTitle}>Método de Pago</h2>
          <p className={styles.cardText}>
            Esperando a que se complete la informacion.
          </p>
        </section>

        <section className={styles.card}>
          <h2 className={styles.cardTitle}>Resumen de la compra</h2>
          <CostoDetalleEntradasController />
        </section>
      </main>
    </div>
  );
}

export default IdentificacionPage;