export default function MisEntradas({ entries = [], loading = false, error = null }) {
  if (loading) {
    return <div className="p-6">Cargando entradas...</div>;
  }

  if (error) {
    const message = error?.message || String(error);
    return <div className="p-6 text-red-600">Error: {message}</div>;
  }

  if (!entries || entries.length === 0) {
    return <div className="p-6">No tienes entradas.</div>;
  }

  return (
    <div className="space-y-4">
      {entries.map((e) => (
        <article key={e.id} className="flex gap-4 p-4 bg-white rounded-lg shadow-sm items-center">
          <img
            src={e.imagen}
            alt={e.titulo}
            className="w-24 h-24 object-cover rounded"
          />

          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold truncate">{e.titulo}</h3>
            <p className="text-sm text-gray-600">
              Fecha: <span className="font-medium">{e.fecha}</span> · Hora: <span className="font-medium">{e.hora}</span>
            </p>
            <p className="text-sm text-gray-600 truncate">{e.ubicacion}</p>
          </div>

          <div className="w-48 text-right flex flex-col items-end gap-2">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium">S/ {e.precio}</span>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={
                  "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium " +
                  (e.estado === "vigente" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-700")
                }
              >
                {e.estado}
              </span>
            </div>

            <div className="flex gap-2 mt-2">
              <button className="px-3 py-1 text-sm bg-blue-50 text-blue-700 rounded hover:bg-blue-100">Descargar</button>
              <button className="px-3 py-1 text-sm bg-amber-50 text-amber-700 rounded hover:bg-amber-100">Transferir</button>
              <button className="px-3 py-1 text-sm bg-emerald-500 text-white rounded hover:opacity-95">Ver detalle</button>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}