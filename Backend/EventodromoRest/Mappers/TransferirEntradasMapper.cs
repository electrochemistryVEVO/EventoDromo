using EventodromoRest.Modelos;
using EventodromoRest.Modelos.Utiles;

namespace EventodromoRest.Mappers
{
    public class TransferirEntradasMapper(Globales.Globales globales, DBManager.DBManager DB)
    {
        private readonly DBManager.DBManager DB = DB;

        /// <summary>
        /// Obtiene los tipos de entrada disponibles para una transacción, evento y fecha específicos.
        /// Consulta optimizada con JOIN y GROUP BY para máxima velocidad.
        /// </summary>
        public List<TipoEntradaDisponibleDTO> ObtenerTiposEntradaDisponibles(
            string numeroTransaccion, 
            string tituloEvento, 
            string fechaEvento)
        {
            var resultado = new List<TipoEntradaDisponibleDTO>();

            // Consulta optimizada: 1 sola query con JOINs y GROUP BY
            string sql = @"
                SELECT 
                    TE.id AS idTipoEntrada,
                    TE.nombre AS nombreTipo,
                    COUNT(DISTINCT E.id) AS cantidadDisponible
                FROM LineaTransaccion LT
                INNER JOIN Transaccion T ON LT.idTransaccion = T.id
                INNER JOIN Entrada E ON LT.idEntrada = E.id
                INNER JOIN TipoEntrada TE ON E.idTipoEntrada = TE.id
                INNER JOIN FechaEvento FE ON TE.idFechaEvento = FE.id
                INNER JOIN Evento EV ON FE.idEvento = EV.id
                WHERE T.numeroTransaccion = @numeroTransaccion
                  AND EV.nombre = @tituloEvento
                  AND DATE(FE.fechaHora) = @fechaEvento
                  AND COALESCE(E.estadoTransferencia, 'disponible') = 'disponible'
                GROUP BY TE.id, TE.nombre
                ORDER BY TE.nombre;
            ";

            var parametros = new ParameterList();
            parametros.Add("@numeroTransaccion", numeroTransaccion);
            parametros.Add("@tituloEvento", tituloEvento);
            parametros.Add("@fechaEvento", fechaEvento);

            lock (DB)
            {
                DB.Select(sql, parametros);

                while (DB.Read())
                {
                    resultado.Add(new TipoEntradaDisponibleDTO
                    {
                        idTipoEntrada = DB.GetInt("idTipoEntrada"),
                        nombreTipo = DB.GetString("nombreTipo"),
                        cantidadDisponible = DB.GetInt("cantidadDisponible")
                    });
                }

                DB.CloseReader();
            }

            return resultado;
        }

        /// <summary>
        /// Valida que las entradas existan y estén disponibles para transferir.
        /// Retorna true si todas las validaciones pasan.
        /// </summary>
        public bool ValidarEntradasDisponibles(List<EntradaATransferirDTO> entradas)
        {
            foreach (var entrada in entradas)
            {
                string sql = @"
                    SELECT COUNT(*) as total
                    FROM LineaTransaccion LT
                    INNER JOIN Transaccion T ON LT.idTransaccion = T.id
                    INNER JOIN Entrada E ON LT.idEntrada = E.id
                    WHERE T.numeroTransaccion = @numeroTransaccion
                      AND E.idTipoEntrada = @idTipoEntrada
                      AND E.estadoTransferencia = 'disponible'
                      AND E.vecesTransferida = 0
                    LIMIT @cantidad;
                ";

                var parametros = new ParameterList();
                parametros.Add("@numeroTransaccion", entrada.numeroTransaccion);
                parametros.Add("@idTipoEntrada", entrada.idTipoEntrada);
                parametros.Add("@cantidad", entrada.cantidad);

                lock (DB)
                {
                    int totalDisponibles = Convert.ToInt32(DB.ExecuteScalar(sql, parametros));
                    
                    if (totalDisponibles < entrada.cantidad)
                    {
                        return false; // No hay suficientes entradas disponibles
                    }
                }
            }

            return true;
        }

        /// <summary>
        /// Marca las entradas como pendientes y retorna los IDs de las entradas afectadas.
        /// </summary>
        public List<int> MarcarEntradasComoPendientes(List<EntradaATransferirDTO> entradas, string emailDestino)
        {
            List<int> idsEntradasAfectadas = new List<int>();
            
            foreach (var entrada in entradas)
            {
                // Obtener los IDs de las entradas que vamos a marcar como pendientes
                string sqlSelect = @"
                    SELECT E2.id
                    FROM Entrada E2
                    INNER JOIN LineaTransaccion LT ON E2.id = LT.idEntrada
                    INNER JOIN Transaccion T ON LT.idTransaccion = T.id
                    WHERE T.numeroTransaccion = @numeroTransaccion
                      AND E2.idTipoEntrada = @idTipoEntrada
                      AND COALESCE(E2.estadoTransferencia, 'disponible') = 'disponible'
                      AND E2.vecesTransferida = 0
                    LIMIT @cantidad;
                ";

                var parametrosSelect = new ParameterList();
                parametrosSelect.Add("@numeroTransaccion", entrada.numeroTransaccion);
                parametrosSelect.Add("@idTipoEntrada", entrada.idTipoEntrada);
                parametrosSelect.Add("@cantidad", entrada.cantidad);

                lock (DB)
                {
                    DB.Select(sqlSelect, parametrosSelect);
                    
                    List<int> idsTemp = new List<int>();
                    while (DB.Read())
                    {
                        int idEntrada = DB.GetInt("id");
                        idsTemp.Add(idEntrada);
                        idsEntradasAfectadas.Add(idEntrada);
                    }
                    DB.CloseReader();

                    // Ahora actualizar esas entradas específicas
                    if (idsTemp.Count > 0)
                    {
                        string idsString = string.Join(",", idsTemp);
                        string sqlUpdate = $@"
                            UPDATE Entrada 
                            SET estadoTransferencia = 'pendiente'
                            WHERE id IN ({idsString});
                        ";
                        
                        DB.ExecuteNonQuery(sqlUpdate, new ParameterList());
                    }
                }
            }

            return idsEntradasAfectadas;
        }

        /// <summary>
        /// Confirma la transferencia (cuando el destinatario acepta).
        /// Actualiza estadoTransferencia a 'disponible' (para el nuevo dueño), 
        /// incrementa vecesTransferida y cambia idClienteActual al nuevo dueño.
        /// </summary>
        public bool ConfirmarTransferencia(List<int> idsEntradas, int? idClienteNuevo = null)
        {
            if (idsEntradas == null || idsEntradas.Count == 0)
                return false;

            string idsString = string.Join(",", idsEntradas);
            
            // Si se proporciona idClienteNuevo, actualizarlo también
            string updateClienteActual = idClienteNuevo.HasValue 
                ? $", idClienteActual = {idClienteNuevo.Value}" 
                : "";
            
            string sql = $@"
                UPDATE Entrada 
                SET estadoTransferencia = 'disponible',
                    vecesTransferida = vecesTransferida + 1
                    {updateClienteActual}
                WHERE id IN ({idsString})
                  AND estadoTransferencia = 'pendiente';
            ";

            lock (DB)
            {
                int rowsAffected = DB.ExecuteNonQuery(sql, new ParameterList());
                return rowsAffected > 0;
            }
        }

        /// <summary>
        /// Cancela la transferencia (cuando el destinatario rechaza o expira).
        /// Regresa las entradas al estado 'disponible'.
        /// </summary>
        public bool CancelarTransferencia(List<int> idsEntradas)
        {
            if (idsEntradas == null || idsEntradas.Count == 0)
                return false;

            string idsString = string.Join(",", idsEntradas);
            string sql = $@"
                UPDATE Entrada 
                SET estadoTransferencia = 'disponible'
                WHERE id IN ({idsString})
                  AND estadoTransferencia = 'pendiente';
            ";

            lock (DB)
            {
                int rowsAffected = DB.ExecuteNonQuery(sql, new ParameterList());
                return rowsAffected > 0;
            }
        }

        /// <summary>
        /// Registra una nueva transferencia pendiente en la base de datos.
        /// </summary>
        public bool RegistrarTransferenciaPendiente(TransferenciaPendiente transferencia)
        {
            string sql = @"
                INSERT INTO TransferenciaPendiente 
                (token, numeroTransaccion, emailRemitente, emailDestino, cantidadEntradas, detalleEntradas, estado, fechaCreacion, fechaExpiracion)
                VALUES 
                (@token, @numeroTransaccion, @emailRemitente, @emailDestino, @cantidadEntradas, @detalleEntradas, @estado, @fechaCreacion, @fechaExpiracion);
            ";

            var parametros = new ParameterList();
            parametros.Add("@token", transferencia.Token);
            parametros.Add("@numeroTransaccion", transferencia.NumeroTransaccion);
            parametros.Add("@emailRemitente", transferencia.EmailRemitente);
            parametros.Add("@emailDestino", transferencia.EmailDestino);
            parametros.Add("@cantidadEntradas", transferencia.CantidadEntradas);
            parametros.Add("@detalleEntradas", transferencia.DetalleEntradas);
            parametros.Add("@estado", transferencia.Estado);
            parametros.Add("@fechaCreacion", transferencia.FechaCreacion);
            parametros.Add("@fechaExpiracion", transferencia.FechaExpiracion);

            lock (DB)
            {
                try
                {
                    int rowsAffected = DB.ExecuteNonQuery(sql, parametros);
                    return rowsAffected > 0;
                }
                catch
                {
                    return false;
                }
            }
        }

        /// <summary>
        /// Obtiene una transferencia pendiente por su token.
        /// </summary>
        public TransferenciaPendiente? ObtenerTransferenciaPorToken(string token)
        {
            string sql = @"
                SELECT id, token, numeroTransaccion, emailRemitente, emailDestino, 
                       cantidadEntradas, detalleEntradas, estado, fechaCreacion, fechaExpiracion, fechaRespuesta
                FROM TransferenciaPendiente
                WHERE token = @token;
            ";

            var parametros = new ParameterList();
            parametros.Add("@token", token);

            lock (DB)
            {
                DB.Select(sql, parametros);

                if (DB.Read())
                {
                    var transferencia = new TransferenciaPendiente
                    {
                        Id = DB.GetInt("id"),
                        Token = DB.GetString("token"),
                        NumeroTransaccion = DB.GetString("numeroTransaccion"),
                        EmailRemitente = DB.GetString("emailRemitente"),
                        EmailDestino = DB.GetString("emailDestino"),
                        CantidadEntradas = DB.GetInt("cantidadEntradas"),
                        DetalleEntradas = DB.GetString("detalleEntradas"),
                        Estado = DB.GetString("estado"),
                        FechaCreacion = DB.GetDateTime("fechaCreacion"),
                        FechaExpiracion = DB.GetDateTime("fechaExpiracion"),
                        FechaRespuesta = DB.GetNullableDateTime("fechaRespuesta")
                    };

                    DB.CloseReader();
                    return transferencia;
                }

                DB.CloseReader();
                return null;
            }
        }

        /// <summary>
        /// Actualiza el estado de una transferencia pendiente.
        /// </summary>
        public bool ActualizarEstadoTransferencia(string token, string nuevoEstado)
        {
            string sql = @"
                UPDATE TransferenciaPendiente
                SET estado = @estado, fechaRespuesta = @fechaRespuesta
                WHERE token = @token;
            ";

            var parametros = new ParameterList();
            parametros.Add("@token", token);
            parametros.Add("@estado", nuevoEstado);
            parametros.Add("@fechaRespuesta", DateTime.Now);

            lock (DB)
            {
                int rowsAffected = DB.ExecuteNonQuery(sql, parametros);
                return rowsAffected > 0;
            }
        }

        /// <summary>
        /// Obtiene el ID del cliente remitente a partir del número de transacción.
        /// </summary>
        public int? ObtenerIdClientePorTransaccion(string? numeroTransaccion)
        {
            if (string.IsNullOrWhiteSpace(numeroTransaccion))
                return null;

            string sql = @"
                SELECT idCliente
                FROM Transaccion
                WHERE numeroTransaccion = @numeroTransaccion;
            ";

            var parametros = new ParameterList();
            parametros.Add("@numeroTransaccion", numeroTransaccion);

            lock (DB)
            {
                DB.Select(sql, parametros);

                if (DB.Read())
                {
                    int? idCliente = DB.GetInt("idCliente");
                    DB.CloseReader();
                    return idCliente;
                }

                DB.CloseReader();
                return null;
            }
        }

        /// <summary>
        /// Obtiene el nombre del evento asociado a una transacción.
        /// </summary>
        public string ObtenerNombreEventoPorTransaccion(string numeroTransaccion)
        {
            string sql = @"
                SELECT EV.nombre
                FROM Transaccion T
                INNER JOIN LineaTransaccion LT ON T.id = LT.idTransaccion
                INNER JOIN Entrada E ON LT.idEntrada = E.id
                INNER JOIN TipoEntrada TE ON E.idTipoEntrada = TE.id
                INNER JOIN FechaEvento FE ON TE.idFechaEvento = FE.id
                INNER JOIN Evento EV ON FE.idEvento = EV.id
                WHERE T.numeroTransaccion = @numeroTransaccion
                LIMIT 1;
            ";

            var parametros = new ParameterList();
            parametros.Add("@numeroTransaccion", numeroTransaccion);

            lock (DB)
            {
                DB.Select(sql, parametros);

                if (DB.Read())
                {
                    string? nombre = DB.GetString("nombre");
                    DB.CloseReader();
                    return nombre ?? "evento";
                }

                DB.CloseReader();
                return "evento";
            }
        }

        /// <summary>
        /// Obtiene el ID del cliente destinatario a partir de su email.
        /// </summary>
        public int? ObtenerIdClientePorEmail(string? email)
        {
            if (string.IsNullOrWhiteSpace(email))
                return null;

            string sql = @"
                SELECT id
                FROM Cliente
                WHERE email = @email
                LIMIT 1;
            ";

            var parametros = new ParameterList();
            parametros.Add("@email", email);

            lock (DB)
            {
                DB.Select(sql, parametros);

                if (DB.Read())
                {
                    int? idCliente = DB.GetInt("id");
                    DB.CloseReader();
                    return idCliente;
                }

                DB.CloseReader();
                return null;
            }
        }

        /// <summary>
        /// Obtiene el conteo de entradas por estado para una transacción específica.
        /// </summary>
        public Dictionary<string, int> ObtenerEstadoEntradas(string numeroTransaccion)
        {
            var resultado = new Dictionary<string, int>
            {
                { "disponibles", 0 },
                { "transferidas", 0 },
                { "pendientes", 0 },
                { "total", 0 }
            };

            string sql = @"
                SELECT 
                    COALESCE(E.estadoTransferencia, 'disponible') as estadoTransferencia,
                    COUNT(DISTINCT E.id) as cantidad
                FROM Entrada E
                INNER JOIN LineaTransaccion LT ON E.id = LT.idEntrada
                INNER JOIN Transaccion T ON LT.idTransaccion = T.id
                WHERE T.numeroTransaccion = @numeroTransaccion
                GROUP BY COALESCE(E.estadoTransferencia, 'disponible');
            ";

            var parametros = new ParameterList();
            parametros.Add("@numeroTransaccion", numeroTransaccion);

            lock (DB)
            {
                DB.Select(sql, parametros);

                while (DB.Read())
                {
                    string? estado = DB.GetString("estadoTransferencia");
                    int cantidad = DB.GetInt("cantidad");
                    
                    if (!string.IsNullOrEmpty(estado))
                    {
                        resultado[estado + "s"] = cantidad;
                        resultado["total"] += cantidad;
                    }
                }

                DB.CloseReader();
            }

            return resultado;
        }

        /// <summary>
        /// Obtiene el nombre de un tipo de entrada por su ID.
        /// </summary>
        public string ObtenerNombreTipoEntrada(int idTipoEntrada)
        {
            string sql = @"
                SELECT nombre 
                FROM TipoEntrada 
                WHERE id = @idTipoEntrada;
            ";

            var parametros = new ParameterList();
            parametros.Add("@idTipoEntrada", idTipoEntrada);

            lock (DB)
            {
                var nombre = DB.ExecuteScalar(sql, parametros);
                return nombre?.ToString() ?? $"Tipo {idTipoEntrada}";
            }
        }
    }
}
