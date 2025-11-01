import React, { useState, useEffect } from "react";
import { transferByEmail } from '../../../../services/transferir.service.js';

export default function TransferirButton({ entries = [{ id: 1, name: "Super VIP", available: 2 }] }) {
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState({});
  const [quantities, setQuantities] = useState({});

  // Nuevo estado para el modal de confirmación (correo)
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [transferEmail, setTransferEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  // Estado para modal de éxito
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    if (showModal || showConfirmModal || showSuccessModal) {
      const onKey = (e) => {
        if (e.key === "Escape") {
          setShowModal(false);
          setShowConfirmModal(false);
          setShowSuccessModal(false);
        }
      };
      document.addEventListener("keydown", onKey);
      return () => document.removeEventListener("keydown", onKey);
    }
  }, [showModal]);
  // Nota: si prefieres separar dependencias usa [showModal, showConfirmModal, showSuccessModal]

  const toggleSelect = (id) => {
    setSelected((s) => ({ ...s, [id]: !s[id] }));
    setQuantities((q) => ({ ...q, [id]: q[id] || 0 }));
  };

  const changeQty = (id, delta) => {
    setQuantities((q) => {
      const next = Math.max(0, (q[id] || 0) + delta);
      return { ...q, [id]: Math.min(next, entries.find(e => e.id === id)?.available || next) };
    });
  };

  const totalSelected = Object.entries(quantities).reduce((sum, [id, qty]) => {
    return sum + (selected[id] ? Number(qty) : 0);
  }, 0);

  const handleContinue = () => {
    // abrir modal de confirmación con correo (solo si hay selección)
    if (totalSelected === 0) return;
    setShowModal(false);
    setTransferEmail('');
    setEmailError('');
    setShowConfirmModal(true);
  };

  const validateEmail = (email) => {
    if (!email) return false;
    // simple regex de validación
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleTransfer = async () => {
    if (!validateEmail(transferEmail)) {
      setEmailError('Ingrese un correo válido.');
      return;
    }

    const itemsToTransfer = Object.entries(selected)
      .filter(([id, sel]) => sel)
      .map(([id]) => ({ id: Number(id), qty: Number(quantities[id] || 0) }))
      .filter(it => it.qty > 0);

    if (itemsToTransfer.length === 0) {
      setEmailError('Seleccione cantidades a transferir.');
      return;
    }

    try {

      //var clienteOrigen = await obtenerClientePorEmail(); //Obtener cliente logeado
      var clienteOrigen = await obtenerClientePorId(ObtenerIdDesdeToken());
      var clienteDestino = await obtenerClientePorEmail(transferEmail);

      

      //Obtener la entrada seleccionada
      var entradasSeleccionadas = carritoOrigen.filter(item => itemsToTransfer.some(it => it.id === item.id));
      
      //Cambiar el carrito de la entrada seleccionada al cliente destino
      entradasSeleccionadas.carrito = carritoDestino;
      entradasSeleccionadas.idCliente = clienteDestino.id;
      ModificarEntrada(entradasSeleccionadas);

      setShowConfirmModal(false);
      setSelected({});
      setQuantities({});
      setShowSuccessModal(true);

      setTimeout(() => {
        setShowSuccessModal(false);
        setTransferEmail('');
      }, 4000);
    } catch (err) {
      console.error('Transfer failed', err);
      setEmailError(err.message || 'Error al transferir. Intenta nuevamente.');
    }
  };

  return (
    <>
      <button
        type="button"
        className="mei-btn mei-btn--transferir"
        onClick={() => setShowModal(true)}
      >
        Transferir
      </button>

      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onMouseDown={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}
          aria-modal="true"
          role="dialog"
        >
          <div className="bg-white rounded-xl max-w-md w-full shadow-lg p-6 relative">
            <button
              aria-label="Cerrar"
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl"
              onClick={() => setShowModal(false)}
            >
              ×
            </button>

            <h3 className="text-center text-xl font-bold mb-1">¿Deseas Transferir tus entradas?</h3>
            <p className="text-center text-sm text-gray-500 mb-6">Seleccione las entradas a transferir</p>

            <div className="space-y-4">
              {entries.map((entry) => (
                <label key={entry.id} className="flex items-center gap-4 bg-gray-50 p-3 rounded">
                  <input
                    type="checkbox"
                    checked={!!selected[entry.id]}
                    onChange={() => toggleSelect(entry.id)}
                    className="h-4 w-4"
                  />
                  <div className="flex-1 text-sm text-gray-700">{entry.name}</div>

                  <div className="flex items-center gap-2 bg-white border rounded px-2">
                    <button
                      type="button"
                      className="px-2 text-gray-600"
                      onClick={() => changeQty(entry.id, -1)}
                      disabled={!selected[entry.id] || (quantities[entry.id] || 0) <= 0}
                    >
                      -
                    </button>
                    <div className="w-8 text-center text-sm">{quantities[entry.id] || 0}</div>
                    <button
                      type="button"
                      className="px-2 text-gray-600"
                      onClick={() => changeQty(entry.id, +1)}
                      disabled={!selected[entry.id] || (quantities[entry.id] || 0) >= entry.available}
                    >
                      +
                    </button>
                  </div>
                </label>
              ))}
            </div>

            <div className="mt-6 flex justify-center">
              <button
                type="button"
                className={`px-6 py-2 rounded-md font-semibold text-white ${totalSelected > 0 ? 'bg-[#00C49A] hover:bg-[#00b07e]' : 'bg-gray-300 cursor-not-allowed'}`}
                onClick={handleContinue}
                disabled={totalSelected === 0}
              >
                Continuar
              </button>
            </div>
          </div>
        </div>
      )}

      {showConfirmModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onMouseDown={(e) => { if (e.target === e.currentTarget) setShowConfirmModal(false); }}
          aria-modal="true"
          role="dialog"
        >
          <div className="bg-white rounded-xl max-w-md w-full shadow-lg p-6 relative">
            <button
              aria-label="Cerrar"
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl"
              onClick={() => setShowConfirmModal(false)}
            >
              ×
            </button>

            <h3 className="text-center text-xl font-bold mb-1">¿Deseas Transferir tus entradas?</h3>
            <p className="text-center text-sm text-gray-500 mb-6">Coloque el correo del usuario al que desea transferirle</p>

            <div className="mb-4">
              <label className="block text-sm text-gray-700 mb-2">Correo Electrónico</label>
              <input
                type="email"
                className="w-full border rounded px-3 py-2 text-sm"
                placeholder="ej: example@mail.com"
                value={transferEmail}
                onChange={(e) => { setTransferEmail(e.target.value); setEmailError(''); }}
                aria-invalid={!!emailError}
              />
              {emailError && <p className="text-xs text-red-600 mt-1">{emailError}</p>}
            </div>

            <div className="flex justify-center">
              <button
                type="button"
                className={`px-6 py-2 rounded-md font-semibold text-white ${validateEmail(transferEmail) ? 'bg-[#00C49A] hover:bg-[#00b07e]' : 'bg-gray-300 cursor-not-allowed'}`}
                onClick={handleTransfer}
                disabled={!validateEmail(transferEmail)}
              >
                Transferir
              </button>
            </div>
          </div>
        </div>
      )}

      {showSuccessModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onMouseDown={(e) => { if (e.target === e.currentTarget) setShowSuccessModal(false); }}
          aria-modal="true"
          role="dialog"
        >
          <div className="bg-white rounded-xl max-w-md w-full shadow-lg p-6 relative text-center">
            <button
              aria-label="Cerrar"
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl"
              onClick={() => setShowSuccessModal(false)}
            >
              ×
            </button>

            <div className="flex items-center justify-center mb-6">
              <div style={{ width: 96, height: 96, borderRadius: 9999, background: '#38E86B', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 6L9 17l-5-5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>

            <h3 className="text-xl font-semibold mb-2">Transferencia Exitosa</h3>
            <p className="text-sm text-gray-600 mb-4 px-4">
              ¡Listo! Tu entrada ha sido enviada a <span className="font-medium">{transferEmail}</span>.
              Le notificaremos para que revise su correo y pueda obtenerla.
            </p>

            <div className="flex justify-center">
              <button
                type="button"
                className="px-6 py-2 rounded-md font-semibold text-white bg-[#00C49A] hover:bg-[#00b07e]"
                onClick={() => setShowSuccessModal(false)}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}