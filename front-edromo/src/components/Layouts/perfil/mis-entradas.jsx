import "@/css/mis-entradas.css";
import "@/css/mis-entrada-item.css"; // Aseguramos que los estilos del item también se carguen
import MisEntradaItem from "./mis-entrada-item.jsx"; // nuevo componente

export default function MisEntradas({
  entries = [],
  loading = false,
  error = null,
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  pageSize = 10,
  onPageChange = () => {},
  onPrev = () => {},
  onNext = () => {},
  onStartDateChange = () => {},
  onEndDateChange = () => {},
  startDate = null,
  endDate = null,
  statusFilter = { vigente: true, vencido: false },
  onStateFilter = () => {},
}) {
  if (loading) {
    return (
      <div className="mi-centro p-4">
        <div className="spinner-border text-primary" role="status" />
        <span className="ms-2">Cargando entradas...</span>
      </div>
    );
  }

  if (error) {
    const message = error?.message || String(error);
    return (
      <div className="alert alert-danger" role="alert">
        <strong>Error:</strong> {message}
      </div>
    );
  }

  const ENTRY_HEIGHT_PX = 120;
  const maxHeight = Math.min(ENTRY_HEIGHT_PX * pageSize, ENTRY_HEIGHT_PX * 10);

  return (
    <div style={{ overflowX: "hidden" }}>
      <h1>Mis compras de entradas</h1>
      {/* Top row: filtros en una sola linea */}
      <div className="mef-filters-row">
        <div className="mef-left">
          <span className="mef-label">Mostrar compras:</span>
          <div className="mef-chip-group">
            <label className="mef-checkbox-label">
              <input
                type="checkbox"
                checked={statusFilter.vigente}
                onChange={(e) => onStateFilter("vigente", e.target.checked)}
              />
              Vigentes
            </label>
            <label className="mef-checkbox-label">
              <input
                type="checkbox"
                checked={statusFilter.vencido}
                onChange={(e) => onStateFilter("vencido", e.target.checked)}
              />
              Vencidos
            </label>
          </div>
        </div>

        <div className="mef-right">
          <label className="mef-date-label">Fecha:</label>
          <input
            type="date"
            className="mef-date"
            value={startDate ?? ""}
            onChange={(e) => onStartDateChange(e.target.value)}
          />
          <span className="mef-to">→</span>
          <input
            type="date"
            className="mef-date"
            value={endDate ?? ""}
            onChange={(e) => onEndDateChange(e.target.value)}
          />
        </div>
      </div>

      <hr className="my-3" />

      {/* Scrollable list */}
      <div
        id="mis-entradas-scrollable"
        className="mef-list"
        style={{ maxHeight: `${maxHeight}px` }}
      >
        {entries.length === 0 ? (
          <div className="text-center p-4 text-muted">
            No hay compras en este rango de fechas / estado.
          </div>
        ) : (
          entries.map((entrada, index) => (
            <MisEntradaItem
              // --- ¡AQUÍ ESTÁ LA CORRECCIÓN! ---
              // Creamos una key única combinando la transacción y la fecha/hora.
              key={`${entrada.transaccion}-${entrada.fecha}-${entrada.hora}`}
              entrada={entrada}
              index={index}
            />
          ))
        )}
      </div>

      {/* Paginación (fuera del scroll) */}
      <div className="mef-footer">
        <div className="mef-summary small text-muted">
          Mostrando {entries.length} de {totalItems} compras — Página{" "}
          {currentPage} / {totalPages} — {pageSize} por página
        </div>

        <nav aria-label="Paginación">
          <ul className="pagination mb-0">
            <li className={`page-item ${currentPage <= 1 ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={onPrev}
                aria-disabled={currentPage <= 1}
              >
                Anterior
              </button>
            </li>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <li
                key={p}
                className={`page-item ${p === currentPage ? "active" : ""}`}
              >
                <button className="page-link" onClick={() => onPageChange(p)}>
                  {p}
                </button>
              </li>
            ))}

            <li
              className={`page-item ${
                currentPage >= totalPages ? "disabled" : ""
              }`}
            >
              <button
                className="page-link"
                onClick={onNext}
                aria-disabled={currentPage >= totalPages}
              >
                Siguiente
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}