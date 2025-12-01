"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from "react-datepicker";
import es from "date-fns/locale/es";
registerLocale("es", es);
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import "@/css/detalle-Evento/BookingPanel.css";

const formatDate = (date) => {
  if (!date) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const BookingPanel = ({ eventName, eventId, functions, onAddToCart }) => {
  // --- HOOKS ---
  const router = useRouter();
  const { isAuthenticated } = useUser();
  
  // --- ESTADOS ---
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedFunctionId, setSelectedFunctionId] = useState("");
  const [ticketQuantities, setTicketQuantities] = useState({});
  const [totalPrice, setTotalPrice] = useState(0);

  // --- DATOS DERIVADOS Y MEMOIZADOS ---
  const availableDates = useMemo(() => {
    const dates = {};
    const ahora = new Date();
    ahora.setHours(0, 0, 0, 0); // Inicio del día actual
    
    (functions || []).forEach((func) => {
      const [year, month, day] = func.fecha.split("-").map(Number);
      const fechaEvento = new Date(year, month - 1, day);
      
      // ✅ Solo incluir fechas futuras o del día actual
      if (fechaEvento >= ahora) {
        const date = func.fecha;
        if (!dates[date]) {
          dates[date] = [];
        }
        dates[date].push({
          id: func.id,
          time: func.hora,
          tiposDeEntrada: (func.tiposDeEntrada || []).sort((a, b) => b.precio - a.precio),
        });
      }
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
    
    // Calcular disponibilidad para cada tipo de entrada
    const tiers = selectedTime?.tiposDeEntrada?.map(tier => {
      const disponibles = tier.cantidadEntradas - tier.cantidadVendida;
      const disponiblesActual = disponibles - (ticketQuantities[tier.id] || 0);
      
      return {
        ...tier,
        disponibles,
        disponiblesActual,
        agotado: disponibles <= 0
      };
    }).sort((a, b) => b.precio - a.precio) || [];
    
    return tiers;
  }, [selectedFunctionId, timesForSelectedDate, ticketQuantities]);

  // --- EFECTOS CORREGIDOS ---

  // ✅ CORREGIDO: Efecto para resetear cantidades cuando cambia la función seleccionada
  useEffect(() => {
    if (!selectedFunctionId) {
      setTicketQuantities({});
      setTotalPrice(0);
      return;
    }
    
    const selectedTime = timesForSelectedDate.find(
      (time) => time.id.toString() === selectedFunctionId
    );
    
    const initialQuantities = {};
    selectedTime?.tiposDeEntrada?.forEach((tier) => {
      initialQuantities[tier.id] = 0;
    });
    setTicketQuantities(initialQuantities);
    setTotalPrice(0);
  }, [selectedFunctionId, timesForSelectedDate]);

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

  // ✅ CORREGIDO: Efecto para inicializar la primera fecha FUTURA disponible
  useEffect(() => {
    if (functions && functions.length > 0 && !selectedDate) {
      const ahora = new Date();
      ahora.setHours(0, 0, 0, 0);
      
      // Encontrar la primera función con fecha futura
      const primeraFuncionFutura = functions.find(func => {
        const [year, month, day] = func.fecha.split("-").map(Number);
        const fechaEvento = new Date(year, month - 1, day);
        return fechaEvento >= ahora;
      });
      
      if (primeraFuncionFutura) {
        const firstDateStr = primeraFuncionFutura.fecha;
        const [year, month, day] = firstDateStr.split("-").map(Number);
        setSelectedDate(new Date(year, month - 1, day));
      }
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
    setTicketQuantities((prevQuantities) => {
      const currentQty = prevQuantities[tierId] || 0;
      const newQty = currentQty + amount;
      
      // Encontrar el tier para obtener su disponibilidad
      const tier = currentTicketTiers.find(t => t.id === tierId);
      if (!tier) return prevQuantities;
      
      const maxDisponible = tier.cantidadEntradas - tier.cantidadVendida;
      const maxPermitido = tier.limiteCompra > 0 
        ? Math.min(tier.limiteCompra, maxDisponible)
        : maxDisponible;
      
      // Limitar entre 0 y el máximo permitido
      const finalQty = Math.max(0, Math.min(newQty, maxPermitido));
      
      return {
        ...prevQuantities,
        [tierId]: finalQty,
      };
    });
  };

  const handleRedirectToLogin = () => {
    if (!eventId) {
      console.error("EventId no disponible para redirección");
      return;
    }
    const currentUrl = `/user/web/eventos/detalle?id=${eventId}`;
    const loginUrl = `/auth/login?redirect=${encodeURIComponent(currentUrl)}`;
    router.push(loginUrl);
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
        ) : currentTicketTiers.length === 0 ? (
          <p className="tickets-placeholder text-red-600">
            No hay entradas disponibles para este horario.
          </p>
        ) : (
          currentTicketTiers.map((tier) => {
            const cantidadActual = ticketQuantities[tier.id] || 0;
            const disponiblesRestantes = tier.disponibles - cantidadActual;
            const maxPermitido = tier.limiteCompra > 0 
              ? Math.min(tier.limiteCompra, tier.disponibles)
              : tier.disponibles;
            const puedeAgregar = cantidadActual < maxPermitido && disponiblesRestantes > 0;
            
            return (
              <div
                key={tier.id}
                className={`ticket-tier-row ${tier.agotado ? "ticket-tier-row--agotado" : ""}`}
              >
                <div className="ticket-info">
                  <div className="flex flex-col">
                    <span className="ticket-name">{tier.nombre}</span>
                    <span className={`text-xs ${tier.agotado ? 'text-red-500' : disponiblesRestantes <= 5 ? 'text-orange-500' : 'text-gray-500'}`}>
                      {tier.agotado 
                        ? 'Agotado' 
                        : `Quedan ${disponiblesRestantes} entrada${disponiblesRestantes !== 1 ? 's' : ''}`
                      }
                      {tier.limiteCompra > 0 && !tier.agotado && ` (Máx. ${tier.limiteCompra} por persona)`}
                    </span>
                  </div>
                  <span className="ticket-price">S/ {tier.precio.toFixed(2)}</span>
                </div>
                
                {/* Mostrar controles solo si está autenticado, sino solo info */}
                {isAuthenticated ? (
                  <div className="quantity-control">
                    <button
                      onClick={() => handleQuantityChange(tier.id, -1)}
                      disabled={cantidadActual === 0 || tier.agotado}
                      className="disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      -
                    </button>
                    <span>{cantidadActual}</span>
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
                      <button
                        onClick={() => handleQuantityChange(tier.id, 1)}
                        disabled={!puedeAgregar}
                        className="disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        +
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="quantity-control">
                    <span className="text-sm text-gray-500 italic">Inicia sesión para comprar</span>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      <div className="booking-total">
        <span>Total</span>
        <span>S/ {totalPrice.toFixed(2)}</span>
      </div>

      {isAuthenticated ? (
        <button className="add-to-cart-btn" onClick={handleSubmit}>
          Agregar al Carrito
        </button>
      ) : (
        <button 
          className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2"
          onClick={handleRedirectToLogin}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          Inicia sesión para comprar
        </button>
      )}
    </div>
  );
};

export default BookingPanel;