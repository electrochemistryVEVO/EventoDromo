import React, { useState, useEffect } from "react";
import { servicePerfil } from "@/services/transferir.service";
import { useUser } from "@/context/UserContext";

export default function TransferirButton({ 
  transaccion = null, 
  tiposEntrada = [], // Array de { idTipoEntrada, nombreTipo, cantidadDisponible }
  onTransferComplete = null, // Callback cuando se completa la transferencia
  disabled = false, // Nuevo prop para deshabilitar el botón
  disabledReason = null // Razón específica para deshabilitar: 'expired', 'no-available', etc.
}) {
  const { user } = useUser();
  const [showModal, setShowModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
  const [selected, setSelected] = useState({});
  const [quantities, setQuantities] = useState({});
  const [transferEmail, setTransferEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isTransferring, setIsTransferring] = useState(false);
  const [availableQuantities, setAvailableQuantities] = useState({});

  // Actualizar cantidades disponibles cuando cambian los tipos de entrada
  useEffect(() => {
    const newAvailable = {};
    tiposEntrada.forEach(tipo => {
      newAvailable[tipo.idTipoEntrada] = tipo.cantidadDisponible;
    });
    setAvailableQuantities(newAvailable);
  }, [tiposEntrada]);

  // Cerrar modales con ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        closeAllModals();
      }
    };
    if (showModal || showConfirmModal || showSuccessModal) {
      document.addEventListener("keydown", handleEsc);
      return () => document.removeEventListener("keydown", handleEsc);
    }
  }, [showModal, showConfirmModal, showSuccessModal]);

  const closeAllModals = () => {
    setShowModal(false);
    setShowConfirmModal(false);
    setShowSuccessModal(false);
    setTransferEmail('');
    setEmailError('');
  };

  const toggleSelect = (idTipo) => {
    setSelected((prev) => {
      const newSelected = { ...prev, [idTipo]: !prev[idTipo] };
      // Si se deselecciona, resetear cantidad a 0
      if (!newSelected[idTipo]) {
        setQuantities((q) => ({ ...q, [idTipo]: 0 }));
      }
      return newSelected;
    });
  };

  const changeQty = (idTipo, delta) => {
    const tipo = tiposEntrada.find(t => t.idTipoEntrada === idTipo);
    if (!tipo) return;

    setQuantities((prev) => {
      const current = prev[idTipo] || 0;
      const next = Math.max(0, current + delta);
      // Usar las cantidades disponibles actualizadas
      const maxDisponible = availableQuantities[idTipo] || tipo.cantidadDisponible;
      const limited = Math.min(next, maxDisponible);
      return { ...prev, [idTipo]: limited };
    });
  };

  const totalSelected = Object.entries(selected)
    .filter(([id, sel]) => sel)
    .reduce((sum, [id]) => sum + (quantities[id] || 0), 0);

  const handleContinue = () => {
    if (totalSelected === 0) {
      setEmailError('Seleccione al menos una entrada para transferir');
      return;
    }
    setShowModal(false);
    setShowConfirmModal(true);
    setEmailError('');
  };

  const validateEmail = (email) => {
    if (!email) return false;
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleTransfer = async () => {
    if (!validateEmail(transferEmail)) {
      setEmailError('Ingrese un correo electrónico válido');
      return;
    }

    if (totalSelected === 0) {
      setEmailError('No hay entradas seleccionadas');
      return;
    }

    setIsTransferring(true);
    setEmailError('');

    try {
      // Validar que no se esté transfiriendo a sí mismo
      if (user?.email && transferEmail.toLowerCase() === user.email.toLowerCase()) {
        setEmailError('No puedes transferir entradas a ti mismo');
        setIsTransferring(false);
        return;
      }

      // Validar que el email exista en la base de datos
      try {
        const clienteDestino = await servicePerfil.obtenerPorEmail(transferEmail);
        if (!clienteDestino) {
          setEmailError('El correo electrónico no está registrado en el sistema');
          setIsTransferring(false);
          return;
        }
      } catch (emailValidationError) {
        console.error('Error al validar email:', emailValidationError);
        setEmailError('El correo electrónico no está registrado en el sistema');
        setIsTransferring(false);
        return;
      }

      // Preparar datos de transferencia
      const entradasATransferir = Object.entries(selected)
        .filter(([id, sel]) => sel && quantities[id] > 0)
        .map(([idTipoEntrada]) => ({
          numeroTransaccion: transaccion,
          idTipoEntrada: parseInt(idTipoEntrada),
          cantidad: quantities[idTipoEntrada]
        }));

      const transferData = {
        emailDestino: transferEmail,
        entradas: entradasATransferir
      };

      // Llamar al servicio de transferencia
      const response = await servicePerfil.transferirEntradas(transferData);

      if (response.success) {
        // Cerrar modal de confirmación y mostrar éxito
        setShowConfirmModal(false);
        setShowSuccessModal(true);
        
        // Limpiar estado
        setSelected({});
        setQuantities({});
        
        // Llamar al callback si existe
        if (onTransferComplete) {
          await onTransferComplete();
        }
        
        // Auto-cerrar después de 3 segundos
        setTimeout(() => {
          closeAllModals();
        }, 3000);
      }
    } catch (error) {
      console.error('Error al transferir:', error);
      setEmailError(error.message || 'Error al transferir. Intente nuevamente.');
    } finally {
      setIsTransferring(false);
    }
  };

  // Determinar mensaje de tooltip según la razón
  const getTooltipMessage = () => {
    if (!disabled) return "";
    if (disabledReason === 'expired') return "No se pueden transferir entradas de eventos pasados";
    if (!tiposEntrada || tiposEntrada.length === 0) return "No hay entradas disponibles para transferir";
    return "No hay entradas disponibles para transferir";
  };

  return (
    <>
      <button
        type="button"
        className="mei-btn mei-btn--transferir"
        onClick={() => setShowModal(true)}
        disabled={disabled || !tiposEntrada || tiposEntrada.length === 0}
        title={getTooltipMessage()}
      >
        Transferir
      </button>

      {/* Modal 1: Selección de entradas */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close"
              onClick={() => setShowModal(false)}
              aria-label="Cerrar"
            >
              ×
            </button>

            <h2 className="modal-title">¿Deseas Transferir tus entradas?</h2>
            <p className="modal-subtitle">Seleccione las entradas a transferir</p>

            <div className="transfer-list">
              {tiposEntrada.map((tipo) => {
                const isSelected = selected[tipo.idTipoEntrada];
                const qty = quantities[tipo.idTipoEntrada] || 0;

                return (
                  <div key={tipo.idTipoEntrada} className="transfer-item-wrapper">
                    {/* Item no seleccionado */}
                    {!isSelected && (
                      <div className="transfer-item">
                        <input
                          type="checkbox"
                          checked={false}
                          onChange={() => toggleSelect(tipo.idTipoEntrada)}
                          className="transfer-checkbox"
                        />
                        <span className="transfer-item-name">{tipo.nombreTipo}</span>
                        <div className="transfer-quantity">
                          <button
                            className="qty-btn"
                            onClick={() => changeQty(tipo.idTipoEntrada, -1)}
                            disabled
                          >
                            -
                          </button>
                          <span className="qty-value">0</span>
                          <button
                            className="qty-btn"
                            onClick={() => changeQty(tipo.idTipoEntrada, 1)}
                            disabled
                          >
                            +
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Item seleccionado */}
                    {isSelected && (
                      <div className="transfer-item transfer-item--selected">
                        <input
                          type="checkbox"
                          checked={true}
                          onChange={() => toggleSelect(tipo.idTipoEntrada)}
                          className="transfer-checkbox"
                        />
                        <span className="transfer-item-name">{tipo.nombreTipo}</span>
                        <div className="transfer-quantity">
                          <button
                            className="qty-btn"
                            onClick={() => changeQty(tipo.idTipoEntrada, -1)}
                            disabled={qty <= 0}
                          >
                            -
                          </button>
                          <span className="qty-value">{qty}</span>
                          <button
                            className="qty-btn"
                            onClick={() => changeQty(tipo.idTipoEntrada, 1)}
                            disabled={qty >= tipo.cantidadDisponible}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {emailError && !showConfirmModal && (
              <div className="error-message">{emailError}</div>
            )}

            <button
              className="modal-btn-continue"
              onClick={handleContinue}
              disabled={totalSelected === 0}
            >
              Continuar
            </button>
          </div>
        </div>
      )}

      {/* Modal 2: Confirmación con correo */}
      {showConfirmModal && (
        <div className="modal-overlay" onClick={() => setShowConfirmModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close"
              onClick={() => setShowConfirmModal(false)}
              aria-label="Cerrar"
            >
              ×
            </button>

            <h2 className="modal-title">¿Deseas Transferir tus entradas?</h2>
            <p className="modal-subtitle">
              Coloque el correo del usuario al que desea transferirle
            </p>

            <div className="email-input-group">
              <label htmlFor="transfer-email" className="email-label">
                Correo Electrónico
              </label>
              <input
                id="transfer-email"
                type="email"
                className="email-input"
                placeholder="ej: example@mail.com"
                value={transferEmail}
                onChange={(e) => {
                  setTransferEmail(e.target.value);
                  setEmailError('');
                }}
                disabled={isTransferring}
              />
            </div>

            {emailError && (
              <div className="error-message">{emailError}</div>
            )}

            <button
              className="modal-btn-transfer"
              onClick={handleTransfer}
              disabled={!transferEmail || isTransferring}
            >
              {isTransferring ? 'Transfiriendo...' : 'Transferir'}
            </button>
          </div>
        </div>
      )}

      {/* Modal 3: Éxito */}
      {showSuccessModal && (
        <div className="modal-overlay" onClick={closeAllModals}>
          <div className="modal-content modal-success" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close"
              onClick={closeAllModals}
              aria-label="Cerrar"
            >
              ×
            </button>

            <div className="success-icon">
              <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                <circle cx="40" cy="40" r="40" fill="#4CAF50"/>
                <path
                  d="M25 40L35 50L55 30"
                  stroke="white"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <h2 className="modal-title">Transferencia Exitosa</h2>
            <p className="modal-text">
              ¡Listo! Tu entrada ha sido enviada a{' '}
              <strong>{transferEmail}</strong>. Le notificaremos para que revise su
              correo y pueda obtenerla. La transferencia se ha completado.
            </p>
          </div>
        </div>
      )}

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }

        .modal-content {
          background: white;
          border-radius: 12px;
          padding: 32px;
          max-width: 500px;
          width: 100%;
          position: relative;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        }

        .modal-close {
          position: absolute;
          top: 16px;
          right: 16px;
          background: none;
          border: none;
          font-size: 32px;
          line-height: 1;
          cursor: pointer;
          color: #666;
          padding: 0;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .modal-close:hover {
          color: #333;
        }

        .modal-title {
          font-size: 24px;
          font-weight: 600;
          margin: 0 0 8px 0;
          text-align: center;
          color: #333;
        }

        .modal-subtitle {
          font-size: 14px;
          color: #666;
          text-align: center;
          margin: 0 0 24px 0;
        }

        .transfer-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 24px;
        }

        .transfer-item-wrapper {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .transfer-item {
          display: flex;
          align-items: center;
          padding: 16px;
          background: #f5f5f5;
          border-radius: 8px;
          gap: 12px;
        }

        .transfer-item--selected {
          background: #00C49A;
          color: white;
        }

        .transfer-checkbox {
          width: 20px;
          height: 20px;
          cursor: pointer;
        }

        .transfer-item-name {
          flex: 1;
          font-weight: 500;
        }

        .transfer-quantity {
          display: flex;
          align-items: center;
          gap: 12px;
          background: white;
          padding: 4px 12px;
          border-radius: 6px;
        }

        .transfer-item--selected .transfer-quantity {
          background: rgba(255, 255, 255, 0.2);
          color: white;
        }

        .qty-btn {
          background: none;
          border: none;
          font-size: 20px;
          font-weight: bold;
          cursor: pointer;
          padding: 0 8px;
          color: inherit;
        }

        .qty-btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        .qty-value {
          min-width: 30px;
          text-align: center;
          font-weight: 600;
        }

        .email-input-group {
          margin-bottom: 24px;
        }

        .email-label {
          display: block;
          font-size: 14px;
          font-weight: 500;
          margin-bottom: 8px;
          color: #333;
        }

        .email-input {
          width: 100%;
          padding: 12px 16px;
          border: 1px solid #ddd;
          border-radius: 8px;
          font-size: 14px;
          transition: border-color 0.2s;
        }

        .email-input:focus {
          outline: none;
          border-color: #00C49A;
        }

        .email-input:disabled {
          background: #f5f5f5;
          cursor: not-allowed;
        }

        .error-message {
          background: #ffebee;
          color: #c62828;
          padding: 12px 16px;
          border-radius: 8px;
          font-size: 14px;
          margin-bottom: 16px;
          text-align: center;
        }

        .modal-btn-continue,
        .modal-btn-transfer {
          width: 100%;
          padding: 14px 24px;
          background: #00C49A;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }

        .modal-btn-continue:hover,
        .modal-btn-transfer:hover {
          background: #00A57E;
        }

        .modal-btn-continue:disabled,
        .modal-btn-transfer:disabled {
          background: #ccc;
          cursor: not-allowed;
        }

        .modal-success {
          text-align: center;
        }

        .success-icon {
          margin: 0 auto 24px;
          width: 80px;
          height: 80px;
        }

        .modal-text {
          font-size: 14px;
          color: #666;
          line-height: 1.6;
          margin: 0;
        }

        @media (max-width: 640px) {
          .modal-content {
            padding: 24px;
          }

          .modal-title {
            font-size: 20px;
          }

          .transfer-item {
            padding: 12px;
          }
        }
      `}</style>
    </>
  );
}
