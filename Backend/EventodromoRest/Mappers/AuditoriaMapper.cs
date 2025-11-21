using EventodromoRest.Modelos;
using EventodromoRest.Modelos.Utiles;
using System.Globalization;

namespace EventodromoRest.Mappers
{
    public class AuditoriaMapper(Globales.Globales globales, DBManager.DBManager DB)
    {
        /// <summary>
        /// Obtiene la lista de clientes paginada con información de auditoría
        /// </summary>
        /// <param name="page">Número de página (1-indexed)</param>
        /// <param name="pageSize">Cantidad de registros por página</param>
        /// <param name="search">Término de búsqueda opcional</param>
        /// <returns>Tupla con la lista de clientes y el total de registros</returns>
        public (List<ClienteAuditoriaDTO>, int totalClientes) ObtenerClientesPaginados(int page, int pageSize, string? search)
        {
            List<ClienteAuditoriaDTO> listaClientes = new List<ClienteAuditoriaDTO>();
            int totalClientes = 0;

            lock (DB)
            {
                // Calcular offset para la paginación
                int offset = (page - 1) * pageSize;

                // Construir condición de búsqueda
                string searchCondition = "";
                var parametros = new ParameterList();

                if (!string.IsNullOrWhiteSpace(search))
                {
                    searchCondition = @"
                        WHERE (CONCAT(c.nombres, ' ', c.apellidos) LIKE @search 
                        OR c.email LIKE @search 
                        OR c.telefono LIKE @search)";
                    parametros.Add("@search", $"%{search}%");
                }

                // 1. Primero obtener el total de clientes (para la paginación)
                string queryCount = $@"
                    SELECT COUNT(*) 
                    FROM Cliente c
                    {searchCondition}";

                object resultCount = DB.ExecuteScalar(queryCount, parametros);
                totalClientes = Convert.ToInt32(resultCount);

                // 2. Obtener clientes paginados con información agregada
                string queryClientes = $@"
                    SELECT 
                        c.id,
                        CONCAT(c.nombres, ' ', c.apellidos) as nombreCompleto,
                        c.email,
                        c.telefono,
                        c.fechaCreacion,
                        c.fechaUltimaEdicion,
                        c.fechaUltimaSesion,
                        (SELECT COUNT(*) FROM Transaccion t WHERE t.idCliente = c.id) as totalCompras,
                        (SELECT COALESCE(SUM(t.montoTotal), 0) FROM Transaccion t WHERE t.idCliente = c.id) as gastoTotal,
                        (SELECT COALESCE(SUM(CAST(a.monto AS DECIMAL(10,2))), 0) 
                         FROM Auditoria a 
                         WHERE a.idCliente = c.id AND a.idTipoAuditoria = 4) as puntosUsados,
                        (SELECT COUNT(*) FROM Auditoria a 
                         WHERE a.idCliente = c.id AND a.idTipoAuditoria = 2) as transferenciasEnviadas,
                        (SELECT COUNT(*) FROM Auditoria a 
                         WHERE a.idCliente = c.id AND a.idTipoAuditoria = 6) as transferenciasRecibidas
                    FROM Cliente c
                    {searchCondition}
                    ORDER BY c.fechaUltimaEdicion DESC
                    LIMIT @pageSize OFFSET @offset";

                parametros.Add("@pageSize", pageSize);
                parametros.Add("@offset", offset);

                DB.Select(queryClientes, parametros);

                while (DB.Read())
                {
                    // Procesar fechas - verificar NULL antes de intentar obtener DateTime
                    DateTime? fechaCreacion = null;
                    DateTime? fechaEdicion = null;
                    DateTime? fechaSesion = null;

                    try
                    {
                        fechaCreacion = DB.GetDateTime("fechaCreacion");
                    }
                    catch { }

                    try
                    {
                        fechaEdicion = DB.GetDateTime("fechaUltimaEdicion");
                    }
                    catch { }

                    try
                    {
                        fechaSesion = DB.GetDateTime("fechaUltimaSesion");
                    }
                    catch { }

                    // Extraer información de la última sesión (manejar NULL)
                    string fechaSesionStr = fechaSesion.HasValue ? fechaSesion.Value.ToString("dd-MM-yyyy") : "N/A";
                    string horaSesionStr = fechaSesion.HasValue ? fechaSesion.Value.ToString("hh:mm tt", CultureInfo.InvariantCulture).ToLower() : "N/A";

                    // Calcular información de actividad
                    int? totalComprasNullable = DB.GetInt("totalCompras");
                    int totalCompras = totalComprasNullable ?? 0;
                    
                    decimal? gastoTotalNullable = DB.GetDecimal("gastoTotal");
                    decimal gastoTotal = gastoTotalNullable ?? 0;
                    
                    int? puntosUsadosNullable = DB.GetInt("puntosUsados");
                    int puntosUsados = puntosUsadosNullable ?? 0;
                    
                    int? transferenciasEnviadasNullable = DB.GetInt("transferenciasEnviadas");
                    int transferenciasEnviadas = transferenciasEnviadasNullable ?? 0;
                    
                    int? transferenciasRecibidasNullable = DB.GetInt("transferenciasRecibidas");
                    int transferenciasRecibidas = transferenciasRecibidasNullable ?? 0;

                    int? idClienteNullable = DB.GetInt("id");
                    
                    ClienteAuditoriaDTO cliente = new ClienteAuditoriaDTO
                    {
                        Id = idClienteNullable ?? 0,
                        Nombre = DB.GetString("nombreCompleto") ?? "",
                        Email = DB.GetString("email") ?? "",
                        Telefono = DB.GetString("telefono") ?? "N/A",
                        FechaCreacion = fechaCreacion?.ToString("dd-MM-yyyy") ?? "N/A",
                        UltimaEdicion = fechaEdicion?.ToString("dd-MM-yyyy") ?? "N/A",
                        UltimaSesion = new UltimaSesionDTO
                        {
                            Fecha = fechaSesionStr,
                            Hora = horaSesionStr
                        },
                        Actividad = new ActividadDTO
                        {
                            Compras = totalCompras,
                            Total = $"S/{gastoTotal:0}",
                            PuntosUsados = $"{Math.Abs(puntosUsados)} puntos usados"
                        },
                        Transferencias = new TransferenciasDTO
                        {
                            Enviadas = transferenciasEnviadas,
                            Recibidas = transferenciasRecibidas
                        }
                    };

                    listaClientes.Add(cliente);
                }

                return (listaClientes, totalClientes);
            }
        }

        /// <summary>
        /// Obtiene el detalle completo de un cliente para auditoría
        /// </summary>
        public ClienteDetalleDTO? ObtenerDetalleClientePorId(int clienteId, int pageHistorial = 1, int pageSizeHistorial = 5)
        {
            lock (DB)
            {
                string query = @"
                    SELECT 
                        c.id,
                        c.nombres,
                        c.apellidos,
                        c.email,
                        td.nombre as tipoDocumento,
                        c.numeroDocumento,
                        c.telefono,
                        (SELECT COALESCE(SUM(p.cantidadRestante), 0) 
                         FROM Punto p WHERE p.idCliente = c.id) as puntosActuales,
                        (SELECT COUNT(*) FROM Transaccion t WHERE t.idCliente = c.id) as comprasTotales,
                        (SELECT COALESCE(SUM(t.montoTotal), 0) 
                         FROM Transaccion t WHERE t.idCliente = c.id) as gastoTotal,
                        (SELECT COUNT(*) FROM Auditoria a 
                         WHERE a.idCliente = c.id AND a.idTipoAuditoria = 2) as transferencias,
                        (SELECT COALESCE(SUM(CAST(a.monto AS DECIMAL(10,2))), 0) 
                         FROM Auditoria a 
                         WHERE a.idCliente = c.id AND a.idTipoAuditoria = 4) as puntosUsados
                    FROM Cliente c
                    LEFT JOIN TipoDocumento td ON c.idTipoDocumento = td.id
                    WHERE c.id = @clienteId";

                var parametros = new ParameterList();
                parametros.Add("@clienteId", clienteId);

                DB.Select(query, parametros);

                if (!DB.Read())
                {
                    return null;
                }

                // Obtener valores nullable primero
                int? idDetalleNullable = DB.GetInt("id");
                int? puntosActualesNullable = DB.GetInt("puntosActuales");
                int? comprasTotalesNullable = DB.GetInt("comprasTotales");
                decimal? gastoTotalDetalleNullable = DB.GetDecimal("gastoTotal");
                int? transferenciasNullable = DB.GetInt("transferencias");
                int? puntosUsadosDetalleNullable = DB.GetInt("puntosUsados");
                
                // Guardar los datos del cliente en variables locales
                int idCliente = idDetalleNullable ?? 0;
                string nombre = DB.GetString("nombres") ?? "";
                string apellido = DB.GetString("apellidos") ?? "";
                string email = DB.GetString("email") ?? "";
                string tipoDocumento = DB.GetString("tipoDocumento") ?? "";
                string numeroDocumento = DB.GetString("numeroDocumento") ?? "";
                string telefono = DB.GetString("telefono") ?? "";
                int puntos = puntosActualesNullable ?? 0;
                int comprasTotales = comprasTotalesNullable ?? 0;
                decimal gastoTotal = gastoTotalDetalleNullable ?? 0;
                int transferencias = transferenciasNullable ?? 0;
                int puntosUsados = puntosUsadosDetalleNullable ?? 0;

                // IMPORTANTE: Cerrar el cursor del primer query antes de hacer otra consulta
                DB.CloseReader();

                // Obtener el historial de actividades paginado (sin lock porque ya estamos dentro de uno)
                var (actividades, totalActividades) = ObtenerHistorialActividadesPaginadoInterno(clienteId, pageHistorial, pageSizeHistorial);

                // Construir el DTO con los datos guardados
                ClienteDetalleDTO detalle = new ClienteDetalleDTO
                {
                    Id = idCliente,
                    Nombre = nombre,
                    Apellido = apellido,
                    Email = email,
                    TipoDocumento = tipoDocumento,
                    NumeroDocumento = numeroDocumento,
                    Telefono = telefono,
                    Puntos = puntos,
                    Resumen = new ResumenClienteDTO
                    {
                        ComprasTotales = comprasTotales,
                        GastoTotal = $"S/{gastoTotal:0}",
                        Transferencias = transferencias,
                        PuntosUsados = puntosUsados
                    },
                    HistorialActividades = new List<ActividadHistorialDTO>()
                };

                detalle.HistorialActividades = actividades;
                
                // Calcular total de páginas para el historial
                detalle.TotalPaginasHistorial = totalActividades > 0 ? (int)Math.Ceiling((double)totalActividades / pageSizeHistorial) : 1;
                detalle.PaginaActualHistorial = pageHistorial;
                detalle.TotalActividades = totalActividades;

                return detalle;
            }
        }

        /// <summary>
        /// Obtiene el historial de actividades de un cliente desde la tabla Auditoria (sin paginación - mantener por compatibilidad)
        /// </summary>
        public List<ActividadHistorialDTO> ObtenerHistorialActividades(int clienteId)
        {
            lock (DB)
            {
                var (actividades, _) = ObtenerHistorialActividadesPaginadoInterno(clienteId, 1, int.MaxValue);
                return actividades;
            }
        }

        /// <summary>
        /// Obtiene el historial de actividades de un cliente con paginación (público con lock)
        /// </summary>
        public (List<ActividadHistorialDTO>, int totalActividades) ObtenerHistorialActividadesPaginado(int clienteId, int page, int pageSize)
        {
            lock (DB)
            {
                return ObtenerHistorialActividadesPaginadoInterno(clienteId, page, pageSize);
            }
        }

        /// <summary>
        /// Método interno sin lock para obtener el historial de actividades con paginación
        /// IMPORTANTE: Este método debe ser llamado solo desde dentro de un bloque lock(DB)
        /// </summary>
        private (List<ActividadHistorialDTO>, int totalActividades) ObtenerHistorialActividadesPaginadoInterno(int clienteId, int page, int pageSize)
        {
            List<ActividadHistorialDTO> historial = new List<ActividadHistorialDTO>();
            int totalActividades = 0;

            // NO usar lock aquí - el método que llama ya debe tener el lock
            // Primero obtener el total de actividades
            string queryCount = @"SELECT COUNT(*) FROM Auditoria WHERE idCliente = @clienteId";
            var parametrosCount = new ParameterList();
            parametrosCount.Add("@clienteId", clienteId);
            object resultCount = DB.ExecuteScalar(queryCount, parametrosCount);
            totalActividades = Convert.ToInt32(resultCount);

            // Calcular offset
            int offset = (page - 1) * pageSize;

            // Query con paginación
            string query = @"
                SELECT 
                    a.id,
                    a.idTipoAuditoria,
                    ta.nombre as etiqueta,
                    ta.iconoURL as icono,
                    a.descripcion,
                    a.fechaHora,
                    a.monto
                FROM Auditoria a
                INNER JOIN TipoAuditoria ta ON a.idTipoAuditoria = ta.id
                WHERE a.idCliente = @clienteId
                ORDER BY a.fechaHora DESC
                LIMIT @pageSize OFFSET @offset";

            var parametros = new ParameterList();
            parametros.Add("@clienteId", clienteId);
            parametros.Add("@pageSize", pageSize);
            parametros.Add("@offset", offset);

            DB.Select(query, parametros);

            while (DB.Read())
            {
                int? idTipoAuditoriaNullable = DB.GetInt("idTipoAuditoria");
                int idTipoAuditoria = idTipoAuditoriaNullable ?? 0;
                
                // Manejar monto que puede ser NULL
                decimal? monto = null;
                try
                {
                    monto = DB.GetDecimal("monto");
                }
                catch { }
                
                // Manejar fechaHora que puede ser NULL
                DateTime? fechaHora = null;
                try
                {
                    fechaHora = DB.GetDateTime("fechaHora");
                }
                catch { }

                // Mapear el tipo de auditoría al tipo esperado por el frontend
                string tipo = MapearTipoAuditoria(idTipoAuditoria);

                int? idActividadNullable = DB.GetInt("id");
                
                ActividadHistorialDTO actividad = new ActividadHistorialDTO
                {
                    Id = idActividadNullable ?? 0,
                    Tipo = tipo,
                    Icono = tipo, // El frontend usa el tipo como referencia del icono
                    Etiqueta = DB.GetString("etiqueta") ?? "",
                    Descripcion = DB.GetString("descripcion") ?? "",
                    Fecha = fechaHora?.ToString("yyyy-MM-dd") ?? "N/A",
                    Hora = fechaHora?.ToString("HH:mm:ss") ?? "N/A"
                };

                // Agregar monto si aplica (tipo 1: Compra)
                if (idTipoAuditoria == 1 && monto.HasValue)
                {
                    actividad.Monto = $"S/ {monto.Value:0}";
                }

                // Agregar puntos usados si aplica (tipo 4: Uso de Puntos)
                if (idTipoAuditoria == 4 && monto.HasValue)
                {
                    actividad.PuntosUsados = $"{monto.Value:0} DP";
                }

                historial.Add(actividad);
            }

            return (historial, totalActividades);
        }

        /// <summary>
        /// Mapea el ID del tipo de auditoría al string esperado por el frontend
        /// </summary>
        private string MapearTipoAuditoria(int idTipoAuditoria)
        {
            return idTipoAuditoria switch
            {
                1 => "compra",
                2 => "transferencia_enviada",
                3 => "actualizacion_perfil",
                4 => "uso_puntos",
                5 => "inicio_sesion",
                6 => "transferencia_recibida",
                _ => "desconocido"
            };
        }

        // ===== MÉTODOS ORIGINALES (mantenerlos para no romper otras funcionalidades) =====

        public List<Auditoria> ListarAuditorias()
        {
            List<Auditoria> listaAuditorias = new List<Auditoria>();
            lock (DB)
            {
                string query = "SELECT * FROM Auditoria";
                DB.Select(query, null);
                while (DB.Read())
                {
                    Auditoria auditoria = new()
                    {
                        id = DB.GetInt("id"),
                        idcliente = DB.GetInt("idCliente"),
                        idtipoauditoria = DB.GetInt("idTipoAuditoria"),
                        descripcion = DB.GetString("descripcion"),
                        fechahora = DB.GetDateTime("fechaHora"),
                        monto = DB.GetDecimal("monto"),
                        cliente = ObtenerClientePorId(DB.GetInt("idCliente")),
                        tipoauditoria = ObtenerTipoAuditoriaPorId(DB.GetInt("idTipoAuditoria"))
                    };
                    listaAuditorias.Add(auditoria);
                }
                return listaAuditorias;
            }
        }

        public int InsertarAuditoria(Auditoria auditoria)
        {
            lock (DB)
            {
                string query = "INSERT INTO Auditoria (idCliente, idTipoAuditoria, descripcion, fechaHora, monto) VALUES (@idCliente, @idTipoAuditoria, @descripcion, @fechaHora, @monto); SELECT LAST_INSERT_ID();";
                var parametros = new ParameterList();
                parametros.Add("@idCliente", auditoria.idcliente);
                parametros.Add("@idTipoAuditoria", auditoria.idtipoauditoria);
                parametros.Add("@descripcion", auditoria.descripcion);
                parametros.Add("@fechaHora", auditoria.fechahora);
                parametros.Add("@monto", auditoria.monto);
                object result = DB.ExecuteScalar(query, parametros);
                int newId = Convert.ToInt32(result);
                return newId;
            }
        }

        public Auditoria ObtenerAuditoriaPorId(int id)
        {
            lock (DB)
            {
                string query = "SELECT * FROM Auditoria WHERE id = @id";
                var parametros = new ParameterList();
                parametros.Add("@id", id);
                DB.Select(query, parametros);
                if (DB.Read())
                {
                    Auditoria auditoria = new()
                    {
                        id = DB.GetInt("id"),
                        idcliente = DB.GetInt("idCliente"),
                        idtipoauditoria = DB.GetInt("idTipoAuditoria"),
                        descripcion = DB.GetString("descripcion"),
                        fechahora = DB.GetDateTime("fechaHora"),
                        monto = DB.GetDecimal("monto"),
                        cliente = ObtenerClientePorId(DB.GetInt("idCliente")),
                        tipoauditoria = ObtenerTipoAuditoriaPorId(DB.GetInt("idTipoAuditoria"))
                    };
                    return auditoria;
                }
                else
                {
                    return null;
                }
            }
        }

        public int EliminarAuditoriaPorId(int id)
        {
            lock (DB)
            {
                string query = "DELETE FROM Auditoria WHERE id = @id";
                var parametros = new ParameterList();
                parametros.Add("@id", id);
                int rowsAffected = DB.ExecuteNonQuery(query, parametros);
                return rowsAffected;
            }
        }

        public int ModificarAuditoria(Auditoria auditoria)
        {
            lock (DB)
            {
                string query = "UPDATE Auditoria SET idCliente = @idCliente, idTipoAuditoria = @idTipoAuditoria, descripcion = @descripcion, fechaHora = @fechaHora, monto = @monto WHERE id = @id";
                var parametros = new ParameterList();
                parametros.Add("@idCliente", auditoria.idcliente);
                parametros.Add("@idTipoAuditoria", auditoria.idtipoauditoria);
                parametros.Add("@descripcion", auditoria.descripcion);
                parametros.Add("@fechaHora", auditoria.fechahora);
                parametros.Add("@monto", auditoria.monto);
                parametros.Add("@id", auditoria.id);
                int rowsAffected = DB.ExecuteNonQuery(query, parametros);
                return rowsAffected;
            }
        }

        private Cliente ObtenerClientePorId(int id)
        {
            var clienteMapper = new ClienteMapper(globales, DB);
            return clienteMapper.ObtenerClientePorId(id);
        }

        private TipoAuditoria ObtenerTipoAuditoriaPorId(int id)
        {
            var tipoAuditoriaMapper = new TipoAuditoriaMapper(globales, DB);
            return tipoAuditoriaMapper.ObtenerTipoAuditoriaPorId(id);
        }
    }
}