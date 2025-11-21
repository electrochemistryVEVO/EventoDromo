import React from "react";
import Image from "next/image";

const MovimientoItem = ({ movimiento }) => {
  const config = {
    ingreso: {
      iconSrc: "/images/icon/ingreso_dromopuntos.svg",
      color: "text-green-500",
      signo: "+",
      texto: `Compra de entrada: ${movimiento.nombreEventoAsociado}`
    },
    salida: {
      iconSrc: "/images/icon/salida_dromopuntos.svg",
      color: "text-red-500",
      signo: "-",
      texto: `Canjeaste en: ${movimiento.nombreEventoAsociado}`
    },
    expiracion: {
      iconSrc: "/images/icon/expira_dromopuntos.png",
      color: "text-gray-500",
      signo: "-",
      texto: "Expiraron por inactividad"
    }
  };

  const { iconSrc, color, signo, texto } = config[movimiento.tipoMovimiento];
  const fecha = new Date(movimiento.fechaMovimiento).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
  
  // Usar valor absoluto para evitar doble signo negativo
  const cantidadAbsoluta = Math.abs(movimiento.cantidad);

  return (
    <div className="flex items-center gap-3 py-2 border-b border-gray-300 last:border-b-0">
      <Image src={iconSrc} alt={movimiento.tipoMovimiento} width={36} height={36} className="w-9 h-9" />
      <div className="grow text-base"><p className="font-medium text-gray-800">{texto}</p></div>
      <div className="text-right shrink-0 min-w-[90px]">
        <p className={`font-semibold text-lg ${color}`}>{signo}{cantidadAbsoluta} pt.</p>
        <p className="text-xs text-gray-500">{fecha}</p>
      </div>
    </div>
  );
};

export default MovimientoItem;