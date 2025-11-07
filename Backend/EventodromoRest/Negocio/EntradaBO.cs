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
    }
}