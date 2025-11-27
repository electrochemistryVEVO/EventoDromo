using EventodromoRest.Modelos;
using EventodromoRest.Modelos.Utiles;
using System.Collections.Generic;
using System.Linq;

namespace EventodromoRest.Mappers
{
    public class DromopuntosMapper(Globales.Globales globales, DBManager.DBManager DB)
    {
        private readonly DBManager.DBManager DB = DB;

        /// <summary>
        /// Obtiene Puntos por Vencer Y Movimientos en una sola consulta optimizada.
        /// </summary>
        public ResumenDromopuntosDTO ObtenerResumenCompletoSQL(int idCliente)
        {
            var resumen = new ResumenDromopuntosDTO
            {
                PorVencer = new List<PuntoPorVencerDTO>(),
                Movimientos = new List<MovimientoDromopuntoDTO>()
            };

            lock (DB)
            {
                // Esta consulta combina 3 fuentes de datos en una sola llamada
                string query = @"
                SELECT 
                    'porVencer' AS tipoResultado,
                    P.id, 
                    P.cantidadRestante AS cantidad, 
                    P.fechaExpiracion,
                    NULL AS tipoMovimiento,
                    NULL AS nombreEventoAsociado,
                    NULL AS fechaMovimiento
                FROM Punto P
                WHERE P.idCliente = @idCliente AND P.cantidadRestante > 0 AND P.fechaExpiracion > NOW()

                UNION ALL

                SELECT 
                    'movimiento' AS tipoResultado,
                    LT.id,
                    LT.puntosGanados AS cantidad,
                    NULL AS fechaExpiracion,
                    'ingreso' AS tipoMovimiento,
                    E.nombre AS nombreEventoAsociado,
                    T.fechaHoraCompra AS fechaMovimiento
                FROM Transaccion T
                JOIN LineaTransaccion LT ON T.id = LT.idTransaccion
                JOIN Entrada EN ON LT.idEntrada = EN.id
                JOIN TipoEntrada TE ON EN.idTipoEntrada = TE.id
                JOIN FechaEvento FE ON TE.idFechaEvento = FE.id
                JOIN Evento E ON FE.idEvento = E.id
                WHERE T.idCliente = @idCliente AND LT.puntosGanados > 0

                UNION ALL

                SELECT 
                    'movimiento' AS tipoResultado,
                    TP.id,
                    -TP.puntosGastados AS cantidad,
                    NULL AS fechaExpiracion,
                    'salida' AS tipoMovimiento,
                    E.nombre AS nombreEventoAsociado,
                    T.fechaHoraCompra AS fechaMovimiento
                FROM Transaccion T
                JOIN TransaccionPuntos TP ON T.id = TP.idTransaccion
                JOIN LineaTransaccion LT ON T.id = LT.idTransaccion 
                JOIN Entrada EN ON LT.idEntrada = EN.id
                JOIN TipoEntrada TE ON EN.idTipoEntrada = TE.id
                JOIN FechaEvento FE ON TE.idFechaEvento = FE.id
                JOIN Evento E ON FE.idEvento = E.id
                WHERE T.idCliente = @idCliente
                GROUP BY TP.id 

                UNION ALL

                SELECT 
                    'movimiento' AS tipoResultado,
                    P.id,
                    -P.cantidadRestante AS cantidad,
                    NULL AS fechaExpiracion,
                    'expiracion' AS tipoMovimiento,
                    'Puntos expirados' AS nombreEventoAsociado,
                    P.fechaExpiracion AS fechaMovimiento
                FROM Punto P
                WHERE P.idCliente = @idCliente AND P.cantidadRestante > 0 AND P.fechaExpiracion <= NOW();
                ";
                // NOTA: No agregamos ORDER BY aquí para optimizar, el BO lo hará en memoria.

                var parametros = new ParameterList();
                parametros.Add("@idCliente", idCliente);

                DB.Select(query, parametros);

                while (DB.Read())
                {
                    string tipoResultado = DB.GetString("tipoResultado");

                    if (tipoResultado == "porVencer")
                    {
                        resumen.PorVencer.Add(new PuntoPorVencerDTO
                        {
                            Id = DB.GetInt("id"),
                            Cantidad = DB.GetInt("cantidad"),
                            FechaExpiracion = DB.GetDateTime("fechaExpiracion")
                        });
                    }
                    else if (tipoResultado == "movimiento")
                    {
                        resumen.Movimientos.Add(new MovimientoDromopuntoDTO
                        {
                            Id = DB.GetInt("id"),
                            TipoMovimiento = DB.GetString("tipoMovimiento"),
                            NombreEventoAsociado = DB.GetString("nombreEventoAsociado"),
                            FechaMovimiento = DB.GetDateTime("fechaMovimiento"),
                            Cantidad = DB.GetInt("cantidad")
                        });
                    }
                }
                DB.CloseReader();
            }
            return resumen;
        }

        public decimal? ObtenerValorActual()
        {
            decimal? valor = null;

            lock (DB)
            {
                string query = "SELECT puntos_por_sol FROM configuracion WHERE id = 1";
                DB.Select(query, new ParameterList());

                if (DB.Read())
                {
                    valor = DB.GetDecimal("puntos_por_sol");
                }

                DB.CloseReader();
            }

            return valor;
        }

        public int ActualizarValorDromoPuntos(decimal nuevoValor)
        {
            lock (DB)
            {
                string query = "UPDATE configuracion SET puntos_por_sol = @nuevoValor where id = 1";
                var parametros = new ParameterList();
                parametros.Add("@nuevoValor", nuevoValor);
                return DB.ExecuteNonQuery(query, parametros);
            }
        }

        public decimal ObtenerPuntosPorSol()
        {
            lock (DB)
            {
                string query = "SELECT puntos_por_sol FROM configuracion WHERE id = 1";
                object result = DB.ExecuteScalar(query, new ParameterList());

                if (result != null && result != DBNull.Value)
                {
                    return Convert.ToDecimal(result);
                }
                return 10.0m; // Fallback
            }
        }

        /// <summary>
        /// Obtiene los meses de vigencia de los puntos desde la configuración.
        /// </summary>
        public int ObtenerMesesVigenciaPuntos()
        {
            lock (DB)
            {
                string query = "SELECT meses_vigencia_puntos FROM configuracion WHERE id = 1";
                object result = DB.ExecuteScalar(query, new ParameterList());

                if (result != null && result != DBNull.Value)
                {
                    return Convert.ToInt32(result);
                }
                return 6; // Fallback: 6 meses
            }
        }

        /// <summary>
        /// Obtiene los minutos de vigencia del carrito desde la configuración.
        /// </summary>
        public int ObtenerMinutosVigenciaCarrito()
        {
            lock (DB)
            {
                string query = "SELECT minutos_vigencia_carrito FROM configuracion WHERE id = 1";
                object result = DB.ExecuteScalar(query, new ParameterList());

                if (result != null && result != DBNull.Value)
                {
                    return Convert.ToInt32(result);
                }
                return 30; // Fallback: 30 minutos
            }
        }

        /// <summary>
        /// Obtiene las horas de expiración de transferencias desde la configuración.
        /// </summary>
        public int ObtenerHorasExpiracionTransferencia()
        {
            lock (DB)
            {
                string query = "SELECT horas_expiracion_transferencia FROM configuracion WHERE id = 1";
                object result = DB.ExecuteScalar(query, new ParameterList());

                if (result != null && result != DBNull.Value)
                {
                    return Convert.ToInt32(result);
                }
                return 24; // Fallback: 24 horas
            }
        }

        /// <summary>
        /// Obtiene todas las configuraciones del sistema.
        /// </summary>
        public Modelos.Utiles.ConfiguracionDTO ObtenerConfiguracionCompleta()
        {
            lock (DB)
            {
                string query = "SELECT puntos_por_sol, meses_vigencia_puntos, minutos_vigencia_carrito, horas_expiracion_transferencia FROM configuracion WHERE id = 1";
                DB.Select(query, new ParameterList());
                
                try
                {
                    if (DB.Read())
                    {
                        return new Modelos.Utiles.ConfiguracionDTO
                        {
                            PuntosPorSol = DB.GetDecimal("puntos_por_sol"),
                            MesesVigenciaPuntos = DB.GetInt("meses_vigencia_puntos"),
                            MinutosVigenciaCarrito = DB.GetInt("minutos_vigencia_carrito"),
                            HorasExpiracionTransferencia = DB.GetInt("horas_expiracion_transferencia")
                        };
                    }
                }
                finally
                {
                    DB.CloseReader();
                }

                // Fallback si no existe configuración
                return new Modelos.Utiles.ConfiguracionDTO
                {
                    PuntosPorSol = 10.0m,
                    MesesVigenciaPuntos = 6,
                    MinutosVigenciaCarrito = 30,
                    HorasExpiracionTransferencia = 24
                };
            }
        }

        /// <summary>
        /// Actualiza las configuraciones del sistema (solo los campos que no sean null).
        /// </summary>
        public int ActualizarConfiguracion(Modelos.Utiles.ActualizarConfiguracionDTO configuracion)
        {
            lock (DB)
            {
                var updates = new List<string>();
                var parametros = new ParameterList();

                if (configuracion.PuntosPorSol.HasValue)
                {
                    updates.Add("puntos_por_sol = @puntosPorSol");
                    parametros.Add("@puntosPorSol", configuracion.PuntosPorSol.Value);
                }

                if (configuracion.MesesVigenciaPuntos.HasValue)
                {
                    updates.Add("meses_vigencia_puntos = @mesesVigencia");
                    parametros.Add("@mesesVigencia", configuracion.MesesVigenciaPuntos.Value);
                }

                if (configuracion.MinutosVigenciaCarrito.HasValue)
                {
                    updates.Add("minutos_vigencia_carrito = @minutosCarrito");
                    parametros.Add("@minutosCarrito", configuracion.MinutosVigenciaCarrito.Value);
                }

                if (configuracion.HorasExpiracionTransferencia.HasValue)
                {
                    updates.Add("horas_expiracion_transferencia = @horasTransferencia");
                    parametros.Add("@horasTransferencia", configuracion.HorasExpiracionTransferencia.Value);
                }

                if (updates.Count == 0)
                {
                    return 0; // No hay nada que actualizar
                }

                string query = $"UPDATE configuracion SET {string.Join(", ", updates)} WHERE id = 1";
                return DB.ExecuteNonQuery(query, parametros);
            }
        }
    }
}