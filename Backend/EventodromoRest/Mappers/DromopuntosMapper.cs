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
                    P.cantidad, 
                    P.fechaExpiracion,
                    NULL AS tipoMovimiento,
                    NULL AS nombreEventoAsociado,
                    NULL AS fechaMovimiento
                FROM Punto P
                WHERE P.idCliente = @idCliente AND P.cantidad > 0 AND P.fechaExpiracion > NOW()

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
                    -T.montoTotal AS cantidad, 
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
                GROUP BY T.id 

                UNION ALL

                SELECT 
                    'movimiento' AS tipoResultado,
                    P.id,
                    -P.cantidad AS cantidad,
                    NULL AS fechaExpiracion,
                    'expiracion' AS tipoMovimiento,
                    'Puntos expirados' AS nombreEventoAsociado,
                    P.fechaExpiracion AS fechaMovimiento
                FROM Punto P
                WHERE P.idCliente = @idCliente AND P.cantidad > 0 AND P.fechaExpiracion <= NOW();
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

    }
}