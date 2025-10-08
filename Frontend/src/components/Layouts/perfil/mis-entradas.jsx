export default function MisEntradas({ entries = [], loading = false, error = null }) {
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center p-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <span className="ms-3">Cargando entradas...</span>
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

  if (!entries || entries.length === 0) {
    return (
      <div className="text-center p-5">
        <div className="text-muted">
          <i className="bi bi-ticket-perforated display-4"></i>
          <h4 className="mt-3">No tienes entradas</h4>
          <p>Cuando compres entradas, aparecerán aquí.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header con filtros */}
      <div className="mb-4">
        <h1 className="h3 mb-3">Mis Entradas</h1>
        
        <div className="row align-items-center">
          {/* Filtros por estado - Lado izquierdo */}
          <div className="col-md-6">
            <div className="d-flex align-items-center">
              <span className="fw-medium me-3">Mostrar entradas:</span>
              <div className="d-flex gap-2">
                <button className="btn btn-outline-primary btn-sm rounded-pill px-3 active">Vigentes</button>
                <button className="btn btn-outline-secondary btn-sm rounded-pill px-3">Vencido</button>
              </div>
            </div>
          </div>

          {/* Selector de fechas - Lado derecho */}
          <div className="col-md-6">
            <div className="d-flex align-items-center justify-content-end">
              <span className="fw-medium me-3">Filtrar por fecha:</span>
              <div className="d-flex gap-2 align-items-center">
                <div>
                  <input 
                    type="date" 
                    className="form-control form-control-sm"
                    placeholder="Desde"
                  />
                </div>
                <span className="text-muted">a</span>
                <div>
                  <input 
                    type="date" 
                    className="form-control form-control-sm"
                    placeholder="Hasta"
                  />
                </div>
                <button className="btn btn-outline-primary btn-sm rounded-pill px-3">
                  Aplicar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <hr className="my-4" />

      {/* Lista de entradas */}
      <div>
        {entries.map((entrada, index) => {
          return (
            <div key={entrada.id} className="mb-5">
              <div className="row align-items-start">
                {/* Columna IZQUIERDA - Imagen e información del evento */}
                <div className="col-md-8">
                  <div className="d-flex">
                    {/* Espacio para la imagen */}
                    <div className="flex-shrink-0 me-4">
                      <div className="bg-light rounded d-flex align-items-center justify-content-center border" 
                          style={{ width: '120px', height: '120px' }}>
                        {entrada.imagen ? (
                          <img 
                            src={'@/assets/logos/Overpass.svg'} 
                            alt={entrada.titulo}
                            style={{ 
                              width: '100%', 
                              height: '100%', 
                              objectFit: 'contain',
                              padding: '8px'
                            }}
                          />
                        ) : (
                          <span className="text-muted fw-bold">LOGO</span>
                        )}
                      </div>
                    </div>
                    
                    {/* Información del evento */}
                    <div className="flex-grow-1">
                      <h3 className="h4 fw-bold mb-3">{entrada.titulo}</h3>
                      
                      <div className="mb-2">
                        <p className="mb-1"><strong>Fecha:</strong> {entrada.fecha}</p>
                        <p className="mb-1"><strong>Horario:</strong> {entrada.hora}</p>
                        <p className="mb-0"><strong>Ubicación:</strong> {entrada.ubicacion}</p>
                        <p className="mb-0"><strong>Transaccion:</strong> {entrada.transaccion}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Columna DERECHA - Detalles de la compra */}
                <div className="col-md-4">
                  <div className="border-start ps-4">
                    {/* Estado */}
                    <div className="mb-3">
                      <div className="d-flex align-items-center">
                        <strong className="me-2">Estado:</strong>
                        <span className="badge bg-success">Vigente</span>
                      </div>
                    </div>

                    {/* Detalles de la compra - Con números a la derecha */}
                    <div className="mb-3">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <strong>Número de entradas:</strong>
                        <span className="fw-bold">{entrada.numeroEntradas || 1}</span>
                      </div>
                      <div className="d-flex justify-content-between align-items-center">
                        <strong>Costo total:</strong>
                        <span className="h5 fw-bold mb-0">S/. {entrada.precio}</span>
                      </div>
                    </div>

                    {/* Botones de acción - Ovalados y alineados */}
                    <div className="d-flex flex-wrap gap-2 mt-3">
                      <button className="btn btn-primary rounded-pill px-4">
                        Descargar
                      </button>
                      <button className="btn btn-success rounded-pill px-4">
                        Transferir
                      </button>
                      <button className="btn btn-outline-secondary rounded-pill px-4">
                        Ver detalle
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Separador entre entradas */}
              {index < entries.length - 1 && (
                <hr className="my-4" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}