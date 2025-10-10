import styles from '@/css/identificacion.module.css';
import Link from 'next/link';
import { ResumenCompra } from '@/components/carrito/ResumenCompra';

function App() {
    return (
        <div className={styles.pageContainer}>
            {/* --- ENCABEZADO DE LA PÁGINA --- */}
            <header className={styles.header}>
                <div>
                    <Link href="/user/carrito/entradaDetalle" className={styles.backButton}>
                        Regresar
                    </Link>
                </div>
                <div className={styles.steps}>
                    <div className={styles.stepActive}>Identificación</div>
                    <div className={styles.stepInactive}>Método de Pago</div>
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
                        <Link href="/auth/login" className={`${styles.button} ${styles.buttonPrimary}`}>
                            Inicia Sesion
                        </Link>
                        <Link href="/auth/signup" className={`${styles.button} ${styles.buttonSecondary}`}>
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
                    {/* ResumenCompra ahora es autónomo y obtiene sus propios datos */}
                    <ResumenCompra />
                </section>
            </main>
        </div>
    );
}

export default App;