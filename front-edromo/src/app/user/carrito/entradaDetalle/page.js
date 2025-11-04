"use client";
import styles from "@/css/entradaDetalle.module.css";

import { TablaEntradasController } from "@/components/carrito/TablaEntradas.controller";
import { CostoDetalleEntradasController } from "@/components/carrito/CostoDetalleEntradas.controller";

import CheckboxCarrito from "@/components/carrito/CheckboxCarrito";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";

function EntradaDetallePage() {
  const { isLoading, itemCount } = useCart();
  const router = useRouter();

  const [aceptaTerminos, setAceptaTerminos] = useState(false);
  const [autorizaDatos, setAutorizaDatos] = useState(false);

  const handleTerminos = (e) => setAceptaTerminos(e.target.checked);
  const handleAutoriza = (e) => setAutorizaDatos(e.target.checked);

  if (isLoading) {
    return (
      <div className={styles.pageContainer}>
        <h1 className={styles.title}>Cargando Carrito...</h1>
      </div>
    );
  }

  if (itemCount === 0) {
    return (
      <div className={styles.pageContainer}>
        <div className={styles.header}>
          <svg /* ... (ícono de carrito) ... */ />
          <h1 className={styles.title}>Mi Carrito está vacío</h1>
        </div>
        <button
          onClick={() => router.push("/user/eventos/lista")}
          className="w-full flex flex-row justify-center items-center gap-4 max-w-sm rounded-2xl bg-[#EFECEC] py-4 text-base font-bold text-gray-500 transition border-gray-400 border-2"
        >
          <img
            src={"/images/icon/flecha_izquierda.svg"}
            alt=""
            width="30"
            height="30"
          />
          Elegir eventos
        </button>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        {/* ... (ícono de carrito svg) ... */}
        <h1 className={styles.title}>Mi Carrito</h1>
      </div>
      <section className="flex flex-col gap-8 lg:flex-row lg:gap-20">
        <div className="w-full lg:w-2/3">
          <TablaEntradasController />
        </div>
        <div
          id="colDerechaPrecuenta"
          className="w-full lg:w-1/3 rounded-lg bg-[#EFECEC] p-8 self-start"
        >
          <h2 className="pt-4 text-xl font-semibold ">Detalle de pago</h2>
          <CostoDetalleEntradasController />
          <div className="flex flex-col gap-6 mt-8 text-xs">
            <CheckboxCarrito
              checked={aceptaTerminos}
              onChange={handleTerminos}
              required={true}
              label="He leído y acepto los términos y condiciones de compra..."
            />
            <CheckboxCarrito
              checked={autorizaDatos}
              onChange={handleAutoriza}
              required={false}
              label="Autorizo el uso de mis datos para finalidades adicionales"
            />
          </div>
          <div className="flex flex-col items-center gap-5 mt-10">
            <button
              className="flex w-full max-w-sm items-center justify-center gap-4 rounded-2xl bg-[#00C49A] py-10 text-lg font-bold text-white transition hover:bg-[#00b07e] disabled:cursor-not-allowed disabled:bg-gray-400"
              disabled={!aceptaTerminos || itemCount === 0}
              onClick={() => {
                if (aceptaTerminos) {
                  router.push("/user/carrito/identificacion");
                }
              }}
            >
              <img
                src="/images/icon/carrito_blanco.svg"
                alt="carrito_blanco"
                width="24"
                height="24"
              />
              Finalizar Pedido
            </button>
            <button
              onClick={() => router.push("/user/eventos/lista")}
              className="w-full flex flex-row justify-center items-center gap-4 max-w-sm rounded-2xl bg-[#EFECEC] py-4 text-base font-bold text-gray-500 transition border-gray-400 border-2"
            >
              <img src={"/images/icon/flecha_izquierda.svg"} alt="" width="30" height="30" />
              Elegir más eventos
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default EntradaDetallePage;