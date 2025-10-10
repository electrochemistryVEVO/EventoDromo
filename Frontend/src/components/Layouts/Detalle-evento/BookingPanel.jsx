import React, { useState, useEffect, useMemo } from "react";
import "./BookingPanel.css";

const BookingPanel = ({ eventName, functions, ticketTiers, onAddToCart }) => {
  // --- ESTADOS ---
  const [selectedDate, setSelectedDate] = useState("");
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
      const date = func.fecha;
      if (!dates[date]) {
        dates[date] = [];
      }
      dates[date].push({
        id: func.id,
        time: func.hora,
      });
    });
    return dates;
  }, [functions]);

  const uniqueDates = Object.keys(availableDates);
  const timesForSelectedDate = selectedDate ? availableDates[selectedDate] : [];

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
  const handleDateChange = (e) => {
    const newDate = e.target.value;
    setSelectedDate(newDate);
    setSelectedFunctionId(""); // Reinicia la hora al cambiar la fecha
  };

  const handleTimeChange = (e) => {
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

      <div className="booking-selectors">
        <div className="selector-group">
          <label htmlFor="date-select">Fecha:</label>
          <select
            id="date-select"
            value={selectedDate}
            onChange={handleDateChange}
          >
            <option value="" disabled>
              Seleccionar Fecha
            </option>
            {uniqueDates.map((date) => (
              <option key={date} value={date}>
                {date}
              </option>
            ))}
          </select>
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
            {timesForSelectedDate.map((timeInfo) => (
              <option key={timeInfo.id} value={timeInfo.id}>
                {timeInfo.time}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="tickets-section">
        <h4 className="tickets-title">Entradas</h4>
        {ticketTiers.map((tier) => (
          <div
            key={tier.id}
            className={`ticket-tier-row ${tier.agotado ? "ticket-tier-row--agotado" : ""}`}
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
