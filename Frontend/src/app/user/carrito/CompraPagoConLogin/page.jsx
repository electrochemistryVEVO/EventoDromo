"use client";
import { cantidadEntradas, importeTotal } from "./controller";
import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import CostoDetalleEntradas from '@/components/carrito/costoDetalleEntradas';
import styles from '@/css/compraPagoConLogin.module.css'; 
import arrow_left from '@/assets/icons/arrow_left.svg'; 
import LogoUsuarioApagado from '@/assets/icons/LogoUsuarioApagado.svg';
import LogoPagoEncendido from '@/assets/icons/LogoPagoEncendido.svg';
import Image from 'next/image';
import Link from 'next/link';

const UserInfo = () => {
    const [user, setUser] = useState({ email: '', name: 'Cargando...', ciudad: '', pais: '' });

    useEffect(() => {
        // Asegurarnos de que sessionStorage solo se accede en el lado del cliente
        if (typeof window !== 'undefined') {
            const userDataString = sessionStorage.getItem('userData');
            if (userDataString) {
                const userData = JSON.parse(userDataString);
                setUser({
                    email: userData.email || 'No disponible',
                    name: `${userData.nombre || ''} ${userData.apellido || ''}`.trim(),
                    ciudad: userData.ciudad || 'No disponible',
                    pais: userData.pais || 'No disponible'
                });
            }
        }
    }, []);

    
    return (
    <section className={styles.card}>
        <h2 className={styles.cardTitle}>Identificación</h2>
        {/* Se usa un div adicional para mantener el espaciado de 'gap' de la tarjeta */}
        <div className="flex flex-col text-base gap-1 text-gray-700 -mt-2">
            <p>{user.email}</p>
            <p>{user.name}</p>
            <p>{user.ciudad}, {user.pais}</p>
        </div>
    </section>
    );
};

const CreditCardForm = () => (
    <div className="flex flex-col gap-4 ml-7">
        <div className={styles.formField}>
            <label htmlFor="cardNumber" className={styles.formLabel}>Número</label>
            <input id="cardNumber" type="text" className={styles.input} placeholder="Número de tarjeta" />
        </div>
        <div className={styles.formField}>
            <label htmlFor="cardName" className={styles.formLabel}>Nombre Completo</label>
            <input id="cardName" type="text" className={styles.input} placeholder="Nombre como aparece en la tarjeta" />
        </div>
        <div className="flex gap-4">
            <div className={`w-full ${styles.formField}`}>
                <label htmlFor="cardExpiryMonth" className={styles.formLabel}>Vencimiento</label>
                <div className="flex gap-2">
                    <input id="cardExpiryMonth" type="text" className={styles.input} placeholder="MM" />
                    <input id="cardExpiryYear" aria-label="Año de vencimiento" type="text" className={styles.input} placeholder="AA" />
                </div>
            </div>
            <div className={`w-1/2 ${styles.formField}`}>
                <label htmlFor="cardCVV" className={styles.formLabel}>CVV</label>
                <input id="cardCVV" type="text" className={styles.input} placeholder="CVV" />
            </div>
        </div>
    </div>
);

const DromoPuntosInfo = () => (
    <div className="p-4 rounded-lg border-2 border-gray-300 flex flex-col items-start bg-white w-full max-w-[340px] ml-7">
        <div className="flex items-center gap-3">
            <span className="text-4xl text-[#00C49A]">&#36;</span>
            {/* TODO: Reemplazar con datos dinámicos */}
            <span className="font-bold text-2xl text-gray-600">120 Dromopuntos</span>
        </div>
        <div className="text-gray-500 font-semibold mt-2">
            Restantes: <span className="font-bold">1000 Dromopuntos</span>
        </div>
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
                    checked={selectedPaymentMethod === 'tarjeta'}
                    onChange={handlePaymentMethodChange}
                />
                Pago con tarjeta de crédito / débito
            </label>
            {selectedPaymentMethod === 'tarjeta' && <CreditCardForm />}
            <label className={styles.radioLabel}>
                <input
                    type="radio"
                    className={styles.radioInput}
                    name="paymentGroup"
                    value="dromopuntos"
                    checked={selectedPaymentMethod === 'dromopuntos'}
                    onChange={handlePaymentMethodChange}
                />
                Usar DromoPuntos
            </label>
            {selectedPaymentMethod === 'dromopuntos' && <DromoPuntosInfo />}
        </div>
    </section>
);

const SuccessModal = ({ onClose }) => {
    const router = useRouter();

    const handleRedirect = () => {
        router.push('/mis-entradas');
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white rounded-2xl p-8 flex flex-col items-center shadow-lg relative min-w-[350px]">
                <button className="absolute top-4 right-4 text-3xl font-bold text-gray-400 hover:text-gray-700" onClick={onClose} aria-label="Cerrar">&times;</button>
                <div className="mb-4">
                    <div style={{ width: '120px', height: '120px', background: '#38E86B', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="70" height="70" viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20 36L32 48L50 30" stroke="white" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                </div>
                <h2 className="text-3xl font-bold text-center mb-2">Compra Exitosa</h2>
                <p className="text-gray-600 text-center mb-6">Puede visualizar y descargar su(s) ticket en la pagina de Mis Entradas</p>
                <button className="bg-[#00C49A] text-white rounded-xl px-8 py-2 font-bold text-lg shadow hover:bg-[#00b07e] transition" onClick={handleRedirect}>
                    Mis Entradas
                </button>
            </div>
        </div>
    );
};

function App() {
    const [showModal, setShowModal] = useState(false);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
    const router = useRouter();

    const handlePaymentMethodChange = (event) => {
        setSelectedPaymentMethod(event.target.value);
    };

    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        // Cargar los items del carrito desde sessionStorage en el cliente
        if (typeof window !== 'undefined') {
            const storedItems = sessionStorage.getItem('cartItems');
            if (storedItems) {
                setCartItems(JSON.parse(storedItems));
            }
        }
    }, []);

    return (
        <div className={styles.pageContainer}>
            <header className={styles.header}>
                <div>
                    <Link href="/user/carrito/identificacion" className={styles.backButton}>
                        <Image  src={arrow_left} alt="Flecha izquierda" width={36} height={36} />
                    </Link>
                </div>
                <div className={styles.steps}>
                    <div className="flex flex-row items-center gap-2">
                        <Image src={LogoUsuarioApagado} alt="Identificación" width={36} height={36} />
                        <div className={styles.stepInactive}>Identificación</div>
                    </div>
                    <div className="flex flex-row items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-[#00C49A] flex items-center justify-center">
                            <Image src={LogoPagoEncendido} alt="Método de Pago" width={20} height={20} />
                        </div>
                        <div className={styles.stepActive}>Método de Pago</div>
                    </div>
                </div>
                <div /> {/* Elemento vacío para centrar el título */}
            </header>
            <main className={styles.mainGrid}>
                <UserInfo />
                <PaymentMethod
                    selectedPaymentMethod={selectedPaymentMethod}
                    handlePaymentMethodChange={handlePaymentMethodChange}
                />
                <section className={styles.card}>
                    <h2 className={styles.cardTitle}>Resumen de la compra</h2>
                    <div className="flex flex-col h-full gap-4">
                        <CostoDetalleEntradas />
                        <div className="mt-auto pt-4 border-t border-gray-300 flex flex-col items-center gap-4">
                            {selectedPaymentMethod === 'dromopuntos' && (
                                <span className="flex items-center gap-2 ml-6">
                                    <span className="flex items-center justify-center text-4xl text-[#00C49A] border-2 border-[#00C49A] rounded-full w-10 h-10">
                                        &#36;
                                    </span>
                                    <span className="font-bold text-xl text-[#00C49A]">120</span>
                                </span>
                            )}
                            {selectedPaymentMethod === 'tarjeta' && (
                                <div className="flex flex-col items-center gap-1 w-full">
                                    <div className="text-xl font-bold">
                                        Total: S/. {importeTotal()}
                                    </div>
                                    <div className="flex items-center">
                                        <span className="text-2xl text-[#00C49A]">
                                            &#36;
                                        </span>
                                        <span className="font-bold text-base text-[#00C49A] ml-1">+12 Dromopuntos</span>
                                    </div>
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

export default App;