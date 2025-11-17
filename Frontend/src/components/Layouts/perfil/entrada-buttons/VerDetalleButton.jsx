import React, { useEffect, useState } from "react";
import "./VerDetalleButton.css";
// --- CAMBIO 1: Importar AMBAS funciones del servicio ---
import { 
  fetchDetalleById, 
  fetchDetalleByIdPost 
} from "../../../../services/EntradaDetalle.service.js";

// --- Funciones de Formato (con parseo DD/MM/YYYY) ---
function formatDateLong(dateStr) { // ej: "14/11/2025"
  if (!dateStr) return "-";
  try {
    const parts = dateStr.split('/');
    if (parts.length !== 3) throw new Error("Formato no válido");
    const d = new Date(parts[2], parts[1] - 1, parts[0]);
    if (isNaN(d)) throw new Error("Fecha inválida");
    return d.toLocaleDateString("es-PE", { day: "2-digit", month: "long", year: "numeric" });
  } catch {
    return dateStr; 
  }
}
function formatTime(dateStrOrTime) {
  if (!dateStrOrTime) return "-";
  try {
    const d = new Date(dateStrOrTime);
    if (!isNaN(d)) return d.toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" });
  } catch {}
  return dateStrOrTime;
}
function formatMoney(val) {
  if (val == null || val === "") return "-";
  const num = Number(val);
  if (isNaN(num)) return String(val);
  return num.toLocaleString("es-PE", { style: "currency", currency: "PEN", minimumFractionDigits: 2 });
}

export default function VerDetalleButton({ entrada = {}, onDownload, onTransfer }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [detalle, setDetalle] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const close = () => {
    setOpen(false);
    setCopied(false);
    setDetalle(null);
    setLoading(false);
    setError(null);
  };

  // --- useEffect con CONSOLE.LOGS ---
  useEffect(() => {
    if (!open) return;
    
    console.log("--- Modal abierto. Iniciando 'useEffect'... ---");
    
    let mounted = true;
    
    // Este 'idOrTx' ES el idEntrada que se enviará al backend
    const idOrTx = entrada?.id ?? entrada?.transaccion;
    
    console.log(`Buscando datos para idEntrada: ${idOrTx}`);
    
    setLoading(true);
    setError(null);
    setDetalle(null);

    (async () => {
      let d = null;
      try {
        // --- PASO 1: Intenta llamar al BACKEND REAL ---
        console.log("PASO 1: Intentando llamar al BACKEND (fetchDetalleByIdPost)...");
        d = await fetchDetalleByIdPost(idOrTx);
        console.log("%cÉXITO (Backend): Datos recibidos:", "color: green; font-weight: bold;", d);
        
      } catch (backendError) {
        
        console.error("FALLO (Backend): No se pudo conectar. Error:", backendError.message);
        
        try {
          // --- PASO 2: Como el backend falló, llama al JSON local ---
          console.log("PASO 2: Intentando cargar JSON local (fetchDetalleById)...");
          d = await fetchDetalleById(idOrTx);
          console.log("%cÉXITO (JSON): Datos locales cargados:", "color: blue; font-weight: bold;", d);

        } catch (jsonError) {
          
          console.error("FALLO (JSON): No se pudo cargar el JSON. Error:", jsonError.message);
          if (!mounted) return;
          setError(jsonError);
          setDetalle(entrada); // fallback final
        }
      }
      
      // Si llegamos aquí, 'd' tiene los datos (del backend o del JSON)
      if (!mounted) return;
      if (d) {
        setDetalle(d);
      } else {
        setDetalle(entrada); // fallback
      }
      setLoading(false);
    })();

    return () => {
      mounted = false;
    };
  }, [open, entrada]);


  // --- Funciones de Handlers (con CONSOLE.LOGS) ---
  const handleCopy = async (text) => {
    console.log(`Intentando copiar al portapapeles: ${text}`);
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
      console.log("Copiado exitoso.");
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
      console.log("Copiado exitoso (fallback).");
    }
  };
  const handleDownload = () => {
    if (onDownload) return onDownload(detalle ?? entrada);
    if ((detalle ?? entrada)?.pdfUrl) window.open((detalle ?? entrada).pdfUrl, "_blank");
    else window.alert("No hay archivo para descargar.");
  };
  const handleTransfer = () => {
    if (onTransfer) return onTransfer(detalle ?? entrada);
    window.alert("Iniciar transferencia (placeholder).");
  };

  // --- Lógica de Datos Adaptada (sin cambios) ---
  const d = detalle ?? entrada ?? {};
  const finalImagen = d.imagenEventoURL ?? d.imagen;
  const finalTitulo = d.nombreEvento ?? d.titulo;
  const finalFecha = d.fechaEvento ?? d.fecha;
  const finalHora = d.horaEvento ?? d.hora;
  const finalDireccion = d.ubicacion ?? d.direccion;
  const finalTransaccion = d.numeroTransaccion ?? d.transaccion;
  const finalClienteNombre = d.nombreCliente ?? d.cliente?.nombre ?? d.cliente?.fullName;
  const finalClienteEmail = d.correoCliente ?? d.cliente?.email ?? d.cliente?.correo;
  const finalClienteDocTipo = d.tipoDocumento ?? d.cliente?.tipoDocumento ?? d.cliente?.docType;
  const finalClienteDocNum = d.numeroDocumento ?? d.cliente?.numeroDocumento ?? d.cliente?.docNumber;
  const finalItemsList = d.entradas ?? d.items ?? [];
  const finalMetodoPago = d.metodoPago ?? d.pago?.metodo ?? d.pago?.method;
  const finalTarjeta = d.numeroTarjeta ?? d.pago?.tarjetaMasked ?? d.pago?.cardMasked;
  const finalTotal = d.total ?? d.pago?.total ?? entrada.total ?? entrada.precio;
  const itemsRenderList = (finalItemsList.length > 0) 
    ? finalItemsList 
    : [{ 
        tipo: finalTitulo ?? "Entrada",
        cantidad: entrada.cantidad ?? 1, 
        precio: finalTotal 
      }];

  // --- Render (con CONSOLE.LOG en el botón) ---
  return (
    <>
      <button 
        type="button" 
        className="mei-btn mei-btn--ver" 
        onClick={() => {
          console.log("--- ¡Botón 'Ver detalle' PRESIONADO! ---");
          setOpen(true);
        }}
      >
        Ver detalle
      </button>

      {open && (
        <>
          <div className="vdb-backdrop" onClick={close} />
          <aside
            className="vdb-wrap"
            role="dialog"
            aria-modal="true"
            aria-label="Detalle de la entrada"
          >
            <header className="vdb-header">
              <button aria-label="Cerrar" className="vdb-close" onClick={close}>✕</button>
            </header>
            <div className="vdb-body">
              {loading ? (
                <div style={{ textAlign: "center", padding: 20 }}>
                  <div className="spinner-border text-primary" role="status" />
                  <div className="mt-2">Cargando detalle...</div>
                </div>
              ) : error ? (
                <div className="alert alert-danger" role="alert">
                  Error cargando detalle: {String(error?.message ?? error)}
                </div>
              ) : (
                <>
                  {/* --- SECCIÓN SUPERIOR (EVENTO) --- */}
                  <div className="vdb-top">
                    <div className="vdb-thumb">
                      {finalImagen ? (
                        <img src={finalImagen} alt={finalTitulo} onError={(e) => (e.currentTarget.src = "/images/cards-04.png")} />
                      ) : (
                        <div className="vdb-thumb-placeholder">LOGO</div>
                      )}
                    </div>
                    <div className="vdb-top-info">
                      <h3 className="vdb-title">{finalTitulo ?? "Evento"}</h3>
                      <div className="vdb-subtitle">Fecha y hora del evento</div>
                      <div className="vdb-datetime">{formatDateLong(finalFecha)} • {formatTime(finalHora)}</div>
                      <div className="vdb-location-label">Ubicación</div>
                      <div className="vdb-location">{finalDireccion ?? "-"}</div>
                    </div>
                  </div>

                  {/* --- SECCIÓN TRANSACCIÓN --- */}
                  <h4 className="vdb-section">Datos de transacción</h4>
                  <div className="vdb-row-grid">
                    <div>
                      <div className="vdb-label">Fecha de compra</div>
                      <div className="vdb-strong">{formatDateLong(d.fechaCompra ?? finalFecha)}</div>
                    </div>
                    <div>
                      {/* Corregido el typo 'vab-label' */}
                      <div className="vdb-label">Hora de compra</div> 
                      <div className="vdb-strong">{formatTime(d.horaCompra ?? finalHora)}</div>
                    </div>
                  </div>
                  <div className="vdb-transaction">
                    <div className="vdb-label">N° Transacción</div>
                    <div className="vdb-transaction-row">
                      <code className="vdb-code">{finalTransaccion ?? "-"}</code>
                      <div className="vdb-transaction-actions">
                        <button className="vdb-btn vdb-btn--outline" onClick={() => handleCopy(finalTransaccion ?? "")}>Copiar</button>
                        <button className="vdb-btn vdb-btn--primary" onClick={handleDownload}>Descargar</button>
                      </div>
                    </div>
                    {copied && <div className="vdb-copied">Código copiado</div>}
                  </div>

                  <hr className="vdb-hr" />

                  {/* --- SECCIÓN CLIENTE --- */}
                  <h4 className="vdb-section">Datos del cliente</h4>
                  <div className="vdb-row-grid">
                    <div>
                      <div className="vdb-label">Nombre</div>
                      <div className="vdb-strong">{finalClienteNombre ?? "-"}</div>
                    </div>
                    <div>
                      <div className="vdb-label">Correo</div>
                      <div className="vdb-strong">{finalClienteEmail ?? "-"}</div>
                    </div>
                  </div>
                  <div className="vdb-small-grid">
                    <div>
                      <div className="vdb-label">Tipo de documento</div>
                      <div className="vdb-strong">{finalClienteDocTipo ?? "-"}</div>
                    </div>
                    <div>
                      <div className="vdb-label">N° de documento</div>
                      <div className="vdb-strong">{finalClienteDocNum ?? "-"}</div>
                    </div>
                  </div>

                  <hr className="vdb-hr" />

                  {/* --- SECCIÓN COMPRA --- */}
                  <h4 className="vdb-section">Datos de la compra</h4>
                  <div className="vdb-items">
                    {itemsRenderList.map((it, i) => (
                      <div key={i} className="vdb-item-row">
                        <div className="vdb-item-left"><strong>x{it.cantidad ?? 1}</strong> <span>{it.tipo ?? it.nombre}</span></div>
                        <div className="vdb-item-right">{formatMoney(it.precio ?? 0)}</div>
                      </div>
                    ))}
                  </div>

                  <hr className="vdb-hr" />

                  {/* --- SECCIÓN PAGO --- */}
                  <h4 className="vdb-section">Datos del pago</h4>
                  <div className="vdb-payment">
                    <div className="vdb-payment-row">
                      <div className="vdb-label">Método de pago</div>
                      <div className="vdb-strong">{finalMetodoPago ?? "—"}</div>
                    </div>
                    <div className="vdb-payment-row">
                      <div className="vdb-label">Número de Tarjeta</div>
                      <div className="vdb-strong">{finalTarjeta ?? "—"}</div>
                    </div>
                    <div className="vdb-payment-total">
                      <div className="vdb-total-label">Total</div>
                      <div className="vdb-total-amount">{formatMoney(finalTotal)}</div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* --- FOOTER (sin cambios) --- */}
            <footer className="vdb-footer">
              <button className="vdb-btn" onClick={close}>Cerrar</button>
            </footer>
          </aside>
        </>
      )}
    </>
  );
}