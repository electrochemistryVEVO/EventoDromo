import styles from "@/css/identificacion.module.css";
import Link from "next/link";
import CostoDetalleEntradas from "@/components/carrito/costoDetalleEntradas";

import { items } from "./controller";
import Image from "next/image";

function App() {
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
        <div /> {/* Elemento vacío para centrar el título */}
      </header>

      {/* --- CONTENIDO PRINCIPAL EN 3 COLUMNAS --- */}
      <main className={styles.mainGrid}>
        {/* --- COLUMNA 1: IDENTIFICACIÓN --- */}
        <section className={styles.card}>
          <h2 className={styles.cardTitle}>Identificación</h2>
          <p className={styles.cardText}>
            Para poder comprar tus entradas inicia sesion o registrate.
          </p>
          <div className={styles.buttonContainer}>
            <Link
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

        {/* --- COLUMNA 2: MÉTODO DE PAGO --- */}
        <section className={styles.card}>
          <h2 className={styles.cardTitle}>Método de Pago</h2>
          <p className={styles.cardText}>
            Esperando a que se complete la informacion.
          </p>
        </section>

        {/* --- COLUMNA 3: RESUMEN DE COMPRA --- */}
        <section className={styles.card}>
          <h2 className={styles.cardTitle}>Resumen de la compra</h2>
          {/* CostoDetalleEntradas ahora es autónomo y obtiene sus propios datos */}
          <CostoDetalleEntradas />
        </section>
      </main>
    </div>
  );
}

export default App;
