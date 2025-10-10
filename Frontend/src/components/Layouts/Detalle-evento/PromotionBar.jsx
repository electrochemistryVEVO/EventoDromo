import React from "react";
import Image from "next/image";
import "./PromotionBar.css";

/**
 * Muestra la barra de promoción de DromoPuntos.
 * @param {object} props - Propiedades del componente.
 * @param {number} props.maxPoints - El número máximo de puntos que se pueden obtener.
 */

const PromotionBar = ({ maxPoints }) => {
  // En tu CSS, la clase .promo-icon tiene width: 40px y height: 40px.
  // Esos valores los pasamos como props a Image.
  const iconSize = 40;

  return (
    <div className="promo-container">
      {/* 2. Usa el componente Image con la ruta pública y las dimensiones */}
      <Image
        src="/images/icon/icon-dromopuntos.png"
        alt="Icono DromoPuntos"
        width={iconSize}
        height={iconSize}
        className="promo-icon"
      />
      <div className="promo-text-content">
        <p className="promo-title">
          Por cada compra llévate hasta <strong>{maxPoints} DromoPuntos</strong>
        </p>
        <p className="promo-description">
          Disfruta esta promoción exclusiva por tus compras con Tarjeta de
          crédito y Débito
        </p>
      </div>
    </div>
  );
};

export default PromotionBar;
