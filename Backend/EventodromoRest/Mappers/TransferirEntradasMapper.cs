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
        /// Marca las entradas como transferidas (cambia su estado).
        /// Actualiza el estado en la BD y retorna el total de entradas transferidas.
        /// </summary>
        public int MarcarEntradasComoTransferidas(List<EntradaATransferirDTO> entradas, string emailDestino)
        {
            // TODO en Fase 2: Sistema de notificaciones por correo
            // Operaciones pendientes:
            // 1. Crear registro en tabla de historial de transferencias
            // 2. Enviar correo electrónico al destinatario
            // 3. Enviar correo de confirmación al remitente
            
            int totalTransferidas = 0;
            
            foreach (var entrada in entradas)
            {
                // Actualizar estado de las entradas en la tabla Entrada
                // Usamos subquery para evitar el error "Incorrect usage of UPDATE and LIMIT"
                string sql = @"
                    UPDATE Entrada 
                    SET estadoTransferencia = 'transferida'
                    WHERE id IN (
                        SELECT E.id
                        FROM (
                            SELECT E2.id
                            FROM Entrada E2
                            INNER JOIN LineaTransaccion LT ON E2.id = LT.idEntrada
                            INNER JOIN Transaccion T ON LT.idTransaccion = T.id
                            WHERE T.numeroTransaccion = @numeroTransaccion
                              AND E2.idTipoEntrada = @idTipoEntrada
                              AND COALESCE(E2.estadoTransferencia, 'disponible') = 'disponible'
                            LIMIT @cantidad
                        ) AS E
                    );
                ";

                var parametros = new ParameterList();
                parametros.Add("@numeroTransaccion", entrada.numeroTransaccion);
                parametros.Add("@idTipoEntrada", entrada.idTipoEntrada);
                parametros.Add("@cantidad", entrada.cantidad);

                lock (DB)
                {
                    DB.ExecuteNonQuery(sql, parametros);
                }
                
                totalTransferidas += entrada.cantidad;
            }

            return totalTransferidas;
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
    }
}
