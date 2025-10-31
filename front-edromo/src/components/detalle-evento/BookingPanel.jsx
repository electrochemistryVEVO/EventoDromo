"use client";
import React, { useState, useEffect, useMemo } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from "react-datepicker";
import es from "date-fns/locale/es";
registerLocale("es", es);
import "@/css/detalle-Evento/BookingPanel.css";

const formatDate = (date) => {
  if (!date) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // getMonth() es 0-indexed
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// <-- 1. ELIMINAMOS 'ticketTiers' DE LOS PROPS
const BookingPanel = ({ eventName, functions, onAddToCart }) => {
  // --- ESTADOS ---
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedFunctionId, setSelectedFunctionId] = useState("");
  // <-- 2. SIMPLIFICAMOS EL ESTADO INICIAL. Se llenará con un Effect.
  const [ticketQuantities, setTicketQuantities] = useState({});
  const [totalPrice, setTotalPrice] = useState(0);

  // --- DATOS DERIVADOS Y MEMOIZADOS ---
  // Procesa las funciones para agruparlas por fecha.
  const availableDates = useMemo(() => {
    const dates = {};
    // <-- 3. AÑADIMOS '|| []' como protección si 'functions' es undefined
    (functions || []).forEach((func) => {
      const date = func.fecha;
      if (!dates[date]) {
        dates[date] = [];
      }
      dates[date].push({
        id: func.id,
        time: func.hora,
        // <-- 4. IMPORTANTE: Guardamos los tickets de ESTA función
        tiposDeEntrada: func.tiposDeEntrada || [],
      });
    });
    return dates;
  }, [functions]);

  // Convertimos las fechas de string a objetos Date
  const enabledDates = useMemo(() => {
    return Object.keys(availableDates).map((dateStr) => {
      const [year, month, day] = dateStr.split("-").map(Number);
      return new Date(year, month - 1, day);
    });
  }, [availableDates]);

  const selectedDateString = formatDate(selectedDate);
  const timesForSelectedDate = selectedDateString
    ? availableDates[selectedDateString]
    : [];

  // <-- 5. NUEVO DATO DERIVADO: Obtenemos los tickets para la HORA seleccionada
  const currentTicketTiers = useMemo(() => {
    if (!selectedFunctionId) {
      return []; // Si no hay hora, no hay tickets
    }
    // Buscamos la función (hora) seleccionada
    const selectedTime = timesForSelectedDate.find(
      // Comparamos 'find' con el ID (que viene como string del select)
      (time) => time.id.toString() === selectedFunctionId
    );
    // Devolvemos la lista de tickets de esa función
    return selectedTime?.tiposDeEntrada || [];
  }, [selectedFunctionId, timesForSelectedDate]);

  // --- EFECTOS ---

  // <-- 6. NUEVO EFFECT: Resetea las cantidades cuando la HORA cambia
  useEffect(() => {
    // Cuando 'currentTicketTiers' cambia (porque se eligió otra hora),
    // creamos un nuevo objeto de cantidades inicializado en 0.
    const initialQuantities = {};
    currentTicketTiers.forEach((tier) => {
      initialQuantities[tier.id] = 0;
    });
    setTicketQuantities(initialQuantities);
    // También reseteamos el precio total
    setTotalPrice(0);
  }, [currentTicketTiers]);

  // <-- 7. EFFECT MODIFICADO: Recalcula el precio total
  // Ahora depende de 'currentTicketTiers' en lugar del prop 'ticketTiers'
  useEffect(() => {
    const newTotal = currentTicketTiers.reduce((total, tier) => {
      const quantity = ticketQuantities[tier.id] || 0;
      return total + quantity * tier.precio;
    }, 0);
    setTotalPrice(newTotal);
  }, [ticketQuantities, currentTicketTiers]); // <-- 8. Dependencia actualizada

  // --- MANEJADORES DE EVENTOS ---
  const handleDateChange = (date) => {
    setSelectedDate(date);
    setSelectedFunctionId(""); // Reinicia la hora
  };

  const handleTimeChange = (e) => {
    setSelectedFunctionId(e.target.value);
  };

  const handleQuantityChange = (tierId, amount) => {
    setTicketQuantities((prevQuantities) => ({
      ...prevQuantities,
      [tierId]: Math.max(0, (prevQuantities[tierId] || 0) + amount),
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

  // --- RENDERIZADO ---
  return (
    <div className="booking-panel">
      <h3 className="booking-title">{eventName}</h3>
      <hr className="booking-divider" />
      <div className="booking-selectors">
        <div className="selector-group">
          <label htmlFor="date-picker">Fecha:</label>
          <DatePicker
            id="date-picker"
            locale="es"
            selected={selectedDate}
            onChange={handleDateChange}
            includeDates={enabledDates}
            placeholderText="Seleccionar Fecha"
            dateFormat="dd-MM-yyyy"
            className="custom-datepicker-input"
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
        
        {/* <-- 9. LÓGICA DE RENDERIZADO MODIFICADA --> */}
        {!selectedFunctionId ? (
          <p className="tickets-placeholder">
            Seleccione un horario para ver las entradas.
          </p>
        ) : (
          // Usamos 'currentTicketTiers' para renderizar
          currentTicketTiers.map((tier) => (
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
                <span>{ticketQuantities[tier.id] || 0}</span>
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
          ))
        )}
        {/* <-- Fin de la lógica modificada --> */}

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