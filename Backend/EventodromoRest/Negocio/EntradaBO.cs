using EventodromoRest.Mappers;
using EventodromoRest.Modelos;
using EventodromoRest.Modelos.Utiles;

namespace EventodromoRest.Negocio
{
    public class EntradaBO(Globales.Globales globales, DBManager.DBManager DB)
    {
        public GenericResponse<PaginacionResponse<EntradaEventoAuxiliar>> ListarMisEntradasPaginado(int idCliente, FiltroEntradasRequest filtros)
        {
            try
            {
                // 1. Llama al nuevo mapper optimizado
                var mapper = new MisEntradasMapper(globales, DB);
                PaginacionResponse<EntradaEventoAuxiliar> paginacion = mapper.ListarMisEntradasPaginado(idCliente, filtros);

                return new GenericResponse<PaginacionResponse<EntradaEventoAuxiliar>>
                {
                    Success = true,
                    Message = $"Se listaron {paginacion.items.Count} entradas.",
                    Data = paginacion,
                    Error = null
                };
            }
            catch (Exception ex)
            {
                return new GenericResponse<PaginacionResponse<EntradaEventoAuxiliar>>
                {
                    Success = false,
                    Message = "Error al obtener las entradas.",
                    Data = null,
                    Error = ex.Message
                };
            }
        }

        public GenericResponse<IEnumerable<TicketInfo>> ListarTipoEntradasPorTransaccion(int idCliente,string numeroTransaccion)
        {
            try
            {
                // 1. Llama al nuevo mapper optimizado
                var mapper = new EntradaMapper(globales, DB);
                //PaginacionResponse<EntradaEventoAuxiliar> paginacion = mapper.ListarMisEntradasPaginado(idCliente, filtros);
                List<TicketInfo> lista = mapper.ObtenerTipoEntradasPorTransaccion(idCliente,numeroTransaccion);
                return new GenericResponse<IEnumerable<TicketInfo>>
                {
                    Success = true,
                    Message = $"Se listaron {lista.Count} entradas.",
                    Data = lista,
                    Error = null
                };
            }
            catch (Exception ex)
            {
                return new GenericResponse<IEnumerable<TicketInfo>>
                {
                    Success = false,
                    Message = "Error al obtener las entradas.",
                    Data = null,
                    Error = ex.Message
                };
            }
        }
        // --- 2. ESTE MÉTODO ES EL ANTIGUO (LENTO) ---
        // Lo dejamos aquí por si lo usas en otro lado, pero ya no lo usaremos para "Mis Entradas"
        public GenericResponse<List<EntradaEventoAuxiliar>> ListarTodasLasEntradasEventoAuxiliar()
        {
            try
            {
                var listaAuxiliar = new List<EntradaEventoAuxiliar>();

                // 1. Obtener TODAS las líneas de transacción
                var lineaTransaccionMapper = new LineaTransaccionMapper(globales, DB);
                List<LineaTransaccion> todasLasLineasTransaccion = lineaTransaccionMapper.ListarLineaTransaccion();

                // 2. Obtener todas las transacciones para los números
                var transaccionMapper = new TransaccionMapper(globales, DB);
                var todasLasTransacciones = transaccionMapper.ListarTransaccion();
                var transaccionesPorId = todasLasTransacciones.ToDictionary(t => t.id, t => t);

                // 3. Obtener todas las entradas con relaciones completas
                var entradaMapper = new EntradaMapper(globales, DB);
                var todasLasEntradas = entradaMapper.ListarEntrada();
                var entradasPorId = todasLasEntradas.ToDictionary(e => e.id, e => e);

                // 4. Procesar CADA línea de transacción individualmente
                foreach (var linea in todasLasLineasTransaccion)
                {
                    // Obtener transacción
                    if (!transaccionesPorId.TryGetValue(linea.idTransaccion ?? 0, out var transaccion))
                        continue;

                    // Obtener entrada
                    if (!entradasPorId.TryGetValue(linea.idEntrada ?? 0, out var entrada))
                        continue;

                    // Verificar relaciones completas de la entrada
                    if (entrada.tipoEntrada?.FechaEvento?.Evento?.Local?.ciudad?.pais == null)
                        continue;

                    var tipoEntrada = entrada.tipoEntrada;
                    var fechaEvento = tipoEntrada.FechaEvento.fechaHora;
                    var evento = tipoEntrada.FechaEvento.Evento;
                    var local = evento.Local;
                    var ciudad = local.ciudad;
                    var pais = ciudad.pais;

                    if (!fechaEvento.HasValue)
                        continue;

                    DateTime fecha = fechaEvento.Value;

                    // Crear registro auxiliar para CADA línea de transacción
                    var auxiliar = new EntradaEventoAuxiliar
                    {
                        id = linea.id, // ID único de la línea de transacción
                        titulo = evento.nombre,
                        fecha = fecha.ToString("yyyy-MM-dd"),
                        hora = fecha.ToString("HH:mm"),
                        direccion = $"{local.direccion}, {ciudad.nombre}, {pais.nombre}",
                        cantidad = 1, // Cada línea representa 1 entrada
                        precio = linea.precio, // Precio específico de esta línea
                        imagen = evento.imagenURL,
                        estado = fecha > DateTime.Now ? "vigente" : "Expirada",
                        transaccion = transaccion.numeroTransaccion
                    };

                    listaAuxiliar.Add(auxiliar);
                }

                // Ordenar por fecha (más reciente primero) y luego por transacción
                var resultado = listaAuxiliar
                    .OrderByDescending(x => x.fecha)
                    .ThenBy(x => x.transaccion)
                    .ToList();

                return new GenericResponse<List<EntradaEventoAuxiliar>>
                {
                    Success = true,
                    Message = $"Se listaron {listaAuxiliar.Count} líneas de transacción.",
                    Data = resultado,
                    Error = null
                };
            }
            catch (Exception ex)
            {
                return new GenericResponse<List<EntradaEventoAuxiliar>>
                {
                    Success = false,
                    Message = "Error al obtener las líneas de transacción.",
                    Data = null,
                    Error = ex.Message
                };
            }
        }

        public GenericResponse<VerDetalleEntrada> ObtenerDetalleEntrada(int idEntrada)
        {
            try
            {
                // --- 1. Instanciar los Mappers necesarios ---
                var lineaTransaccionMapper = new LineaTransaccionMapper(globales, DB);
                var transaccionMapper = new TransaccionMapper(globales, DB);
                var tipoDocumentoMapper = new TipoDocumentoMapper(globales, DB);
                var entradaMapper = new EntradaMapper(globales, DB);
                var tipoEntradaMapper = new TipoEntradaMapper(globales, DB);
                var fechaEventoMapper = new FechaEventoMapper(globales, DB);
                var eventoMapper = new EventoMapper(globales, DB);
                var TarjetaMapper = new TarjetaMapper(globales, DB);
                // --- 2. Obtener la línea de transacción por idEntrada ---
                LineaTransaccion linea = lineaTransaccionMapper.ObtenerLineaTransaccionPorId(idEntrada);
                if (linea == null)
                {
                    return new GenericResponse<VerDetalleEntrada>
                    {
                        Success = false,
                        Message = "No se encontró la línea de transacción para la entrada indicada.",
                        Data = null
                    };
                }

                if (!linea.idTransaccion.HasValue)
                {
                    return new GenericResponse<VerDetalleEntrada>
                    {
                        Success = false,
                        Message = "La línea de transacción no tiene asociada una transacción.",
                        Data = null
                    };
                }

                int idTransaccion = linea.idTransaccion.Value;

                // --- 3. Obtener la Transacción principal ---
                Transaccion transaccion = transaccionMapper.ObtenerTransaccionPorId(idTransaccion);
                if (transaccion == null)
                {
                    return new GenericResponse<VerDetalleEntrada>
                    {
                        Success = false,
                        Message = "No se encontró la transacción principal.",
                        Data = null
                    };
                }

                // --- 4. Crear el DTO y empezar a llenarlo ---
                var detalle = new VerDetalleEntrada();

                // --- 5. Llenar Datos de Transacción y Cliente ---
                detalle.NumeroTransaccion = transaccion.numeroTransaccion ?? string.Empty;
                detalle.FechaCompra = transaccion.fechaHoraCompra.ToString("dd/MM/yyyy");
                detalle.HoraCompra = transaccion.fechaHoraCompra.ToString("hh:mm tt");
                detalle.Total = transaccion.montoTotal;
                detalle.NombreCliente = $"{transaccion.nombresCliente} {transaccion.apellidosCliente}".Trim();
                detalle.CorreoCliente = transaccion.emailCliente;
                detalle.NumeroDocumento = transaccion.numeroDocumentoCliente;

                TipoDocumento doc = tipoDocumentoMapper.ObtenerTipoDocumentoPorId(transaccion.idTipoDocumento);
                detalle.TipoDocumento = doc?.nombre ?? "N/A";

                // --- 6. Llenar Datos del Evento ---
                Entrada entrada = entradaMapper.ObtenerEntradaPorId(idEntrada);
                if (entrada != null)
                {
                    TipoEntrada tipoEntrada = tipoEntradaMapper.ObtenerTipoEntradaPorId(entrada.idTipoEntrada);
                    if (tipoEntrada != null)
                    {
                        FechaEvento fechaEvento = fechaEventoMapper.ObtenerFechaEventoPorId(tipoEntrada.idFechaEvento);
                        if (fechaEvento != null)
                        {
                            Evento evento = eventoMapper.ObtenerEventoPorId(fechaEvento.idEvento);
                            if (evento != null)
                            {
                                detalle.ImagenEventoURL = evento.imagenURL;
                                detalle.NombreEvento = evento.nombre;
                                if (fechaEvento.fechaHora.HasValue)
                                {
                                    detalle.FechaEvento = fechaEvento.fechaHora.Value.ToString("dd/MM/yyyy");
                                    detalle.HoraEvento = fechaEvento.fechaHora.Value.ToString("hh:mm tt");
                                }
                                detalle.Ubicacion = evento.Local?.nombre ?? evento.Local?.direccion ?? "Ubicación no disponible";
                            }
                        }
                    }
                }

                // --- 7. Llenar Datos de la Compra (Agrupados) ---
                // Usamos el método GROUP BY del mapper de lineas
                detalle.Entradas = lineaTransaccionMapper.ObtenerDetallesCompraAgrupados(idTransaccion) ?? new List<EntradaDetalle>();

                // --- 8. Llenar Datos del Pago (consulta directa, fallback sencillo) ---
                TarjetaMapper.ObtenerYAsignarDetallesPago(idTransaccion, detalle);

                // --- 9. Retornar éxito ---
                return new GenericResponse<VerDetalleEntrada>
                {
                    Success = true,
                    Message = "Detalle de entrada obtenido correctamente.",
                    Data = detalle
                };
            }
            catch (Exception ex)
            {
                return new GenericResponse<VerDetalleEntrada>
                {
                    Success = false,
                    Message = "Error interno al procesar la solicitud de detalle.",
                    Error = ex.Message,
                    Data = null
                };
            }
        }
    }
}