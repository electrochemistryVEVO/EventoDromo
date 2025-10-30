import React, { useState, useEffect, useMemo } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from "react-datepicker";
import es from "date-fns/locale/es";
registerLocale("es", es);
import "@/css/detalle-Evento/BookingPanel.css";
import { dateFormat,timeFormat } from "@/lib/format-number";
const formatDate = (date) => {
  if (!date) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // getMonth() es 0-indexed
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const BookingPanel = ({ eventName, functions, ticketTiers, onAddToCart }) => {
  // --- ESTADOS ---
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedFunctionId, setSelectedFunctionId] = useState("");
  const [ticketQuantities, setTicketQuantities] = useState(() => {
    const initialQuantities = {};
    ticketTiers.forEach((tier) => {
      initialQuantities[tier.id] = 0;
    });
    return initialQuantities;
  });
  const [totalPrice, setTotalPrice] = useState(0);

  // --- DATOS DERIVADOS Y MEMOIZADOS ---
  // Procesa las funciones para agruparlas por fecha.
  const availableDates = useMemo(() => {
    const dates = {};
    functions.forEach((func) => {
      const date = dateFormat(func.fechaHora);
      if (!dates[date]) {
        dates[date] = [];
      }
      dates[date].push({
        id: func.id,
        time: timeFormat(func.fechaHora),
      });
    });
    return dates;
  }, [functions]);

  // 2. CREAMOS UN ARRAY DE FECHAS HABILITADAS PARA EL CALENDARIO
  // Convertimos las fechas de string a objetos Date
  const enabledDates = useMemo(() => {
    return Object.keys(availableDates).map((dateStr) => {
      // CAMBIO CLAVE: Dividimos el string "YYYY-MM-DD" en sus partes
      const [year, month, day] = dateStr.split("-").map(Number);

      // Creamos la fecha usando new Date(año, mes - 1, día).
      // El mes es 0-indexado en JavaScript (Enero=0, Diciembre=11), por eso restamos 1.
      // Este método SIEMPRE usa la zona horaria local del navegador.
      return new Date(year, month - 1, day);
    });
  }, [availableDates]);

  // Obtenemos la fecha seleccionada en formato string para buscar las horas
  // Usamos nuestra función auxiliar para evitar problemas de timezone
  const selectedDateString = formatDate(selectedDate);

  // Ahora, si la fecha seleccionada es correcta, availableDates[selectedDateString]
  // nunca será undefined, sino un array (posiblemente vacío, pero no undefined).
  const timesForSelectedDate = selectedDateString
    ? availableDates[selectedDateString]
    : [];

  // --- EFECTOS ---
  // Recalcula el precio total cuando cambian las cantidades.
  useEffect(() => {
    const newTotal = ticketTiers.reduce((total, tier) => {
      const quantity = ticketQuantities[tier.id] || 0;
      return total + quantity * tier.precio;
    }, 0);
    setTotalPrice(newTotal);
  }, [ticketQuantities, ticketTiers]);

  // --- MANEJADORES DE EVENTOS ---
  const handleDateChange = (date) => {
    setSelectedDate(date);
    setSelectedFunctionId(""); // Reinicia la hora
  };

  const handleTimeChange = (e) => {
    console.log(e.target.value)
    setSelectedFunctionId(e.target.value);
  };

  const handleQuantityChange = (tierId, amount) => {
    setTicketQuantities((prevQuantities) => ({
      ...prevQuantities,
      [tierId]: Math.max(0, prevQuantities[tierId] + amount),
    }));
  };

  const handleSubmit = () => {
    if (!selectedFunctionId) {
      alert("Por favor, seleccione una fecha y hora.");
      return;
    }
    if (totalPrice === 0) {
      alert("Por favor, seleccione al menos una entrada.");
      return;
    }
    onAddToCart({
      selectedFunctionId,
      ticketQuantities,
      totalPrice,
    });
  };

  return (
    <div className="booking-panel">
      <h3 className="booking-title">{eventName}</h3>
      <hr className="booking-divider" />
      <div className="booking-selectors">
        <div className="selector-group">
          <label htmlFor="date-picker">Fecha:</label>

          {/* 3. REEMPLAZAMOS EL <select> POR <DatePicker> */}
          <DatePicker
            id="date-picker"
            locale="es" // Calendario en español
            selected={selectedDate} // Fecha seleccionada
            onChange={handleDateChange} // Función que se llama al seleccionar
            includeDates={enabledDates} // ¡CLAVE! Solo habilita estas fechas
            placeholderText="Seleccionar Fecha"
            dateFormat="dd-MM-yyyy" // Formato de texto en el input
            className="custom-datepicker-input" // Clase para darle estilos
          />
        </div>
        <div className="selector-group">
          <label htmlFor="time-select">Horario:</label>
          <select
            id="time-select"
            value={selectedFunctionId}
            onChange={handleTimeChange}
            disabled={!selectedDate}
          >
            <option value="" disabled>
              Seleccionar Hora
            </option>
            {/* Comprobación de seguridad para evitar el error .map() */}
            {Array.isArray(timesForSelectedDate) &&
              timesForSelectedDate.map((timeInfo) => (
                <option key={timeInfo.id} value={timeInfo.id}>
                  {timeInfo.time}
                </option>
              ))}
          </select>
        </div>
      </div>

      <div className="tickets-section">
        <h4 className="tickets-title">Entradas</h4>
        {ticketTiers
          .filter((tier) => {
            if (!selectedFunctionId) return true;
            if (tier?.idFechaEvento == null) return false;
            return tier.idFechaEvento.toString() === selectedFunctionId;
          })
          .map((tier) => (
            <div
              key={tier.id}
              className={`ticket-tier-row ${
                tier.agotado ? "ticket-tier-row--agotado" : ""
              }`}
            >
              <div className="ticket-info">
                <span className="ticket-name">{tier.nombre}</span>
                <span className="ticket-price">S/ {tier.precio.toFixed(2)}</span>
              </div>
              <div className="quantity-control">
                <button
                  onClick={() => handleQuantityChange(tier.id, -1)}
                  disabled={ticketQuantities[tier.id] === 0 || tier.agotado}
                >
                  -
                </button>
                <span>{ticketQuantities[tier.id]}</span>
                {tier.agotado ? (
                  <button disabled className="ban-icon-button">
                    <svg
                      className="ban-icon"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path
                        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5-9h10v2H7v-2z"
                        transform="rotate(45 12 12)"
                      ></path>
                    </svg>
                  </button>
                ) : (
                  <button onClick={() => handleQuantityChange(tier.id, 1)}>
                    +
                  </button>
                )}
              </div>
            </div>
          ))}
      </div>

      <div className="booking-total">
        <span>Total</span>
        <span>S/ {totalPrice.toFixed(2)}</span>
      </div>

      <button className="add-to-cart-btn" onClick={handleSubmit}>
        Agregar al Carrito
      </button>
    </div>
  );
};

export default BookingPanel;
