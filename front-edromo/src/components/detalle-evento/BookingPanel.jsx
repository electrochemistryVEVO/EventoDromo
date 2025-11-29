"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from "react-datepicker";
import es from "date-fns/locale/es";
registerLocale("es", es);
import "@/css/detalle-Evento/BookingPanel.css";

const formatDate = (date) => {
  if (!date) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const BookingPanel = ({
  eventName,
  functions,
  ticketAvailability = {}, // Recibimos la nueva prop con un valor por defecto
  onAddToCart,
}) => {
  // --- ESTADOS ---
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedFunctionId, setSelectedFunctionId] = useState("");
  const [ticketQuantities, setTicketQuantities] = useState({});
  const [totalPrice, setTotalPrice] = useState(0);

  // --- DATOS DERIVADOS Y MEMOIZADOS ---
  const availableDates = useMemo(() => {
    const dates = {};
    (functions || []).forEach((func) => {
      const date = func.fecha;
      if (!dates[date]) {
        dates[date] = [];
      }
      dates[date].push({
        id: func.id,
        time: func.hora,
        tiposDeEntrada: (func.tiposDeEntrada || []).sort((a, b) => b.precio - a.precio),
      });
    });
    return dates;
  }, [functions]);

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

  const currentTicketTiers = useMemo(() => {
    if (!selectedFunctionId) {
      return [];
    }
    const selectedTime = timesForSelectedDate.find(
      (time) => time.id.toString() === selectedFunctionId
    );
    return selectedTime?.tiposDeEntrada?.sort((a, b) => b.precio - a.precio) || [];
  }, [selectedFunctionId, timesForSelectedDate]);

  // --- EFECTOS CORREGIDOS ---

  // ✅ CORREGIDO: Efecto para resetear cantidades cuando cambian los tickets disponibles
  useEffect(() => {
    const initialQuantities = {};
    currentTicketTiers.forEach((tier) => {
      initialQuantities[tier.id] = 0;
    });
    setTicketQuantities(initialQuantities);
    setTotalPrice(0);
  }, [currentTicketTiers]);

  // ✅ CORREGIDO: Cálculo del total usando useCallback para evitar recreación
  const calculateTotal = useCallback(() => {
    return currentTicketTiers.reduce((total, tier) => {
      const quantity = ticketQuantities[tier.id] || 0;
      return total + quantity * tier.precio;
    }, 0);
  }, [ticketQuantities, currentTicketTiers]);

  // ✅ CORREGIDO: Efecto para actualizar el precio total
  useEffect(() => {
    const newTotal = calculateTotal();
    setTotalPrice(newTotal);
  }, [calculateTotal]);

  // ✅ CORREGIDO: Efecto para inicializar la primera fecha disponible
  useEffect(() => {
    if (functions && functions.length > 0 && !selectedDate) {
      const firstDateStr = functions[0].fecha;
      const [year, month, day] = firstDateStr.split("-").map(Number);
      setSelectedDate(new Date(year, month - 1, day));
    }
  }, [functions, selectedDate]);

  // --- MANEJADORES DE EVENTOS ---
  const handleDateChange = (date) => {
    setSelectedDate(date);
    setSelectedFunctionId(""); // Reinicia la hora
  };

  const handleTimeChange = (e) => {
    console.log("Hora seleccionada:", e.target.value);
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

    // ✅ Aseguramos que solo enviemos tickets con cantidad > 0
    const validTicketQuantities = Object.fromEntries(
      Object.entries(ticketQuantities).filter(([_, quantity]) => quantity > 0)
    );

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

        {!selectedFunctionId ? (
          <p className="tickets-placeholder">
            Seleccione un horario para ver las entradas.
          </p>
        ) : (
          currentTicketTiers.map((tier) => {
            // --- NUEVA LÓGICA DE DISPONIBILIDAD ---
            const availability = ticketAvailability[tier.id];
            const restantes = availability
              ? availability.total - availability.vendidas
              : undefined;
            // Una entrada está agotada si la data de disponibilidad lo indica,
            // o si se mantiene la prop 'agotado' del backend.
            const isSoldOut = availability ? restantes <= 0 : tier.agotado;

            return (
              <div
                key={tier.id}
                className={`ticket-tier-row ${
                  isSoldOut ? "ticket-tier-row--agotado" : ""
                }`}
              >
                <div className="ticket-info">
                  <span className="ticket-name">{tier.nombre}</span>
                  <span className="ticket-price">
                    S/ {tier.precio.toFixed(2)}
                  </span>
                  {/* Mostramos la disponibilidad si existe */}
                  {availability && (
                    <span className="ticket-availability text-xs">
                      Quedan: {restantes} / {availability.total}
                    </span>
                  )}
                </div>
                <div className="quantity-control">
                  <button
                    onClick={() => handleQuantityChange(tier.id, -1)}
                    disabled={
                      (ticketQuantities[tier.id] || 0) === 0 || isSoldOut
                    }
                  >
                    +
                  </button>
                  <span>{ticketQuantities[tier.id] || 0}</span>
                  {isSoldOut ? (
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
                    <button
                      onClick={() => handleQuantityChange(tier.id, 1)}
                      disabled={
                        isSoldOut ||
                        // Deshabilitar si se alcanza el límite de compra por usuario
                        (tier.limiteCompra > 0 &&
                          (ticketQuantities[tier.id] || 0) >=
                            tier.limiteCompra) ||
                        // Deshabilitar si se alcanza el total de entradas restantes
                        (availability &&
                          (ticketQuantities[tier.id] || 0) >= restantes)
                      }
                    >
                      +
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
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