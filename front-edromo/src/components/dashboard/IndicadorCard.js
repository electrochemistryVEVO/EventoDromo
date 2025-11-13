import React from "react";

// Un componente simple para los íconos de flecha
const ArrowIcon = ({ isUp }) => (
  <svg
    className={`w-4 h-4 inline-block ${
      isUp ? "text-green-500" : "text-red-500"
    }`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d={isUp ? "M5 10l7-7m0 0l7 7m-7-7v18" : "M19 14l-7 7m0 0l-7-7m7 7V3"}
    ></path>
  </svg>
);

/**
 * Tarjeta para mostrar un indicador clave (KPI) en el dashboard.
 * @param {{
 *   icono: string, // Espera un componente de ícono SVG
 *   titulo: string,
 *   valor: string | number,
 *   porcentajeCambio: number,
 *   prefijoValor?: string,   // ej: 'S/'
 *   sufijoValor?: string     // ej: 'min'
 * }} props
 */
const IndicadorCard = ({
  icono,
  titulo,
  valor,
  porcentajeCambio,
  prefijoValor = "",
  sufijoValor = "",
}) => {
  const esPositivo = porcentajeCambio >= 0;

  return (
    <div className="bg-white p-5 rounded-lg shadow-md flex items-center space-x-4">
      <div
        className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full"
        style={{ backgroundColor: "#C2DEDC" }}
      >
        <img src={icono} alt={`Icono para ${titulo}`} className="w-6 h-6" />
      </div>
      <div>
        <p className="text-sm text-gray-500">{titulo}</p>
        <p className="text-2xl font-bold text-gray-800">
          {prefijoValor}
          {valor}
          {sufijoValor}
        </p>
        <div
          className={`text-sm flex items-center ${
            esPositivo ? "text-green-500" : "text-red-500"
          }`}
        >
          <ArrowIcon isUp={esPositivo} />
          <span className="font-semibold ml-1">
            {Math.abs(porcentajeCambio)}%
          </span>
          <span className="text-gray-400 ml-1">Vs Mes Pasado</span>
        </div>
      </div>
    </div>
  );
};

export default IndicadorCard;
