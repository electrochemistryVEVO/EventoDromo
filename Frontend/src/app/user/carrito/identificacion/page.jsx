import styles from '@/css/identificacion.module.css';
import Link from 'next/link';
import { ResumenCompra } from '@/components/carrito/ResumenCompra';

import { items } from './controller';
import arrow_left from '@/assets/icons/arrow_left.svg';
import accountCircle from '@/assets/icons/account_circle.svg';
import paymentCard from '@/assets/icons/payment_card.svg';
import Image from 'next/image';

function App() {
    return (
        <div className={styles.pageContainer}>
            {/* --- ENCABEZADO DE LA PÁGINA --- */}
            <header className={styles.header}>
                <div>
                    <Link href="/user/carrito/entradaDetalle" className={styles.backButton}>
                        <Image src={arrow_left} alt="Flecha izquierda" width={36} height={36} />
                    </Link>
                </div>
                <div className={styles.steps}>
                    <div className="flex flex-row items-center gap-2">
                        <Image src={accountCircle} alt="Account Circle" width={32} height={32} />
                        <div className={styles.stepActive}>Identificación</div>
                    </div>
                    <div className="flex flex-row items-center gap-2">
                        <Image className="fill-[#9ca3af]" src={paymentCard} alt="Payment Card" width={32} height={32} />
                        <div className={styles.stepInactive}>Método de Pago</div>
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