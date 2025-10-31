using EventodromoRest.Modelos;
using EventodromoRest.Modelos.Utiles;

namespace EventodromoRest.Mappers
{
    public class DromopuntosMapper(Globales.Globales globales, DBManager.DBManager DB)
    {
        /// <summary>
        /// Obtiene una lista de los lotes de puntos que aún no han expirado.
        /// </summary>
        /// <param name="idCliente">El ID del cliente.</param>
        /// <returns>Una lista de objetos PuntoPorVencerDTO.</returns>
        public List<PuntoPorVencerDTO> ListarPuntosPorVencer(int idCliente)
        {
            var listaPuntos = new List<PuntoPorVencerDTO>();
            lock (DB)
            {
                // TODO: Escribe aquí tu consulta SQL para obtener los lotes de puntos activos.
                string query = "SELECT id, cantidad, fechaExpiracion FROM Punto WHERE idCliente = @idCliente AND fechaExpiracion > NOW() ORDER BY fechaExpiracion ASC";
                var parametros = new ParameterList();
                parametros.Add("@idCliente", idCliente);

                DB.Select(query, parametros);
                while (DB.Read())
                {
                    // TODO: Asegúrate de que los nombres de las columnas ("id", "cantidad", "fechaExpiracion") coincidan con tu base de datos.
                    var punto = new PuntoPorVencerDTO
                    {
                        Id = DB.GetInt("id"),
                        Cantidad = DB.GetInt("cantidad"),
                        FechaExpiracion = DB.GetDateTime("fechaExpiracion")
                    };
                    listaPuntos.Add(punto);
                }
                return listaPuntos;
            }
        }

        /// <summary>
        /// Obtiene el historial completo de movimientos de DromoPuntos para un cliente.
        /// </summary>
        /// <param name="idCliente">El ID del cliente.</param>
        /// <returns>Una lista de objetos MovimientoDromopuntoDTO.</returns>
        public List<MovimientoDromopuntoDTO> ListarMovimientosDromopuntos(int idCliente)
        {
            var listaMovimientos = new List<MovimientoDromopuntoDTO>();

            lock (DB)
            {
                // TODO: Reemplazar esta consulta con la lógica real de tu base de datos.
                // Esta consulta es un ejemplo que une tres tipos de movimientos.
                string query = @"
            SET @row_number := 0;
            SELECT
                (@row_number := @row_number + 1) AS id,
                'ingreso' AS tipoMovimiento,
                e.nombre AS nombreEventoAsociado,
                t.fechaHoraCompra AS fechaMovimiento,
                SUM(lt.puntosGanados) AS cantidad
            FROM Cliente c
            JOIN Transaccion t ON c.id = t.idCliente
            JOIN LineaTransaccion lt ON lt.idTransaccion = t.id
            JOIN Entrada en ON en.id = lt.idEntrada
            JOIN TipoEntrada te ON en.idTipoEntrada = te.id
            JOIN FechaEvento fe ON te.idFechaEvento = fe.id
            JOIN Evento e ON e.id = fe.idEvento
            WHERE c.id = @idCliente
            GROUP BY 
                t.id, e.nombre, t.fechaHoraCompra
            ORDER BY 
                t.id;
        ";

                var parametros = new ParameterList();
                parametros.Add("@idCliente", idCliente);

                DB.Select(query, parametros);

                while (DB.Read())
                {
                    var movimiento = new MovimientoDromopuntoDTO
                    {
                        Id = DB.GetInt("id"), // El ID debe ser único en el resultado de la consulta
                        TipoMovimiento = DB.GetString("tipoMovimiento"),
                        NombreEventoAsociado = DB.GetString("nombreEventoAsociado"),
                        FechaMovimiento = DB.GetDateTime("fechaMovimiento"),
                        Cantidad = DB.GetInt("cantidad")
                    };
                    listaMovimientos.Add(movimiento);
                }
            }

            return listaMovimientos;
        }

    }
}
