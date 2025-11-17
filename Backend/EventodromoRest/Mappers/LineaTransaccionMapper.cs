using EventodromoRest.Modelos;
using EventodromoRest.Modelos.Utiles;


namespace EventodromoRest.Mappers
{
    public class LineaTransaccionMapper(Globales.Globales globales, DBManager.DBManager DB)
    {
        public List<LineaTransaccion> ListarLineaTransaccion()
        {
            List<LineaTransaccion> listaLineaTransaccion = new List<LineaTransaccion>();
            var parametros = new ParameterList();
            lock (DB)
            {
                string query = "SELECT * FROM LineaTransaccion";

                DB.Select(query, parametros);
                while (DB.Read())
                {
                    LineaTransaccion lineaTransaccion = new()
                    {
                        id = DB.GetInt("ID"),
                        idTransaccion = DB.GetInt("IDTRANSACCION"),
                        //transaccion = ObtenerTransaccionPorId(DB.GetInt("IDTRANSACCION")),
                        idEntrada = DB.GetInt("IDENTRADA"),
                        //entrada = ObtenerEntradaPorId(DB.GetInt("IDENTRADA")),
                        precio = DB.GetDecimal("PRECIO"),
                        puntosGanados = DB.GetInt("PUNTOSGANADOS"),
                    };
                    lineaTransaccion.transaccion = ObtenerTransaccionPorId(lineaTransaccion.idTransaccion??0);
                    lineaTransaccion.entrada = ObtenerEntradaPorId(lineaTransaccion.idEntrada ?? 0);

                    listaLineaTransaccion.Add(lineaTransaccion);
                }
                return listaLineaTransaccion;
            }
        }

        public int InsertarLineaTransaccion(LineaTransaccion lineaTransaccion)
        {
            lock (DB)
            {
                string query = "INSERT INTO LineaTransaccion (IDTRANSACCION, IDENTRADA, PRECIO, PUNTOSGANADOS) VALUES (@IDTRANSACCION, @IDENTRADA, @PRECIO, @PUNTOSGANADOS); SELECT LAST_INSERT_ID();";
                var parametros = new ParameterList();
                parametros.Add("@IDTRANSACCION", lineaTransaccion.idTransaccion);
                parametros.Add("@IDENTRADA", lineaTransaccion.idEntrada);
                parametros.Add("@PRECIO", lineaTransaccion.precio);
                parametros.Add("@PUNTOSGANADOS", lineaTransaccion.puntosGanados);
                object result = DB.ExecuteScalar(query, parametros);
                int newId = Convert.ToInt32(result);
                return newId;
            }
        }

       public LineaTransaccion ObtenerLineaTransaccionPorId(int id)
        {
            lock (DB)
            {
                string query = "SELECT * FROM LineaTransaccion WHERE ID = @ID";
                var parametros = new ParameterList();
                parametros.Add("@ID", id);
                DB.Select(query, parametros);
                if (DB.Read())
                {
                    LineaTransaccion lineaTransaccion = new()
                    {
                        id = DB.GetInt("ID"),
                        idTransaccion = DB.GetInt("IDTRANSACCION"),
                        //transaccion = ObtenerTransaccionPorId(DB.GetInt("IDTRANSACCION")),
                        idEntrada = DB.GetInt("IDENTRADA"),
                        //entrada = ObtenerEntradaPorId(DB.GetInt("IDENTRADA")),
                        precio = DB.GetDecimal("PRECIO"),
                        puntosGanados = DB.GetInt("PUNTOSGANADOS"),
                    };
                    lineaTransaccion.transaccion = ObtenerTransaccionPorId(lineaTransaccion.idTransaccion??0);
                    lineaTransaccion.entrada = ObtenerEntradaPorId(lineaTransaccion.idEntrada??0);
                    return lineaTransaccion;
                }
                else
                {
                    return null;
                }
            }
        }

        public int EliminarLineaTransaccionPorId(int id)
        {
            lock (DB)
            {
                string query = "DELETE FROM LineaTransaccion WHERE ID = @ID";
                var parametros = new ParameterList();
                parametros.Add("@ID", id);
                int rowsAffected = DB.ExecuteNonQuery(query, parametros);
                return rowsAffected;
            }
        }

        public int ModificarLineaTransaccion(LineaTransaccion lineaTransaccion)
        {
            lock (DB)
            {
                string query = "UPDATE LineaTransaccion SET IDTRANSACCION = @IDTRANSACCION, IDENTRADA = @IDENTRADA, PRECIO = @PRECIO, PUNTOSGANADOS = @PUNTOSGANADOS WHERE ID = @ID";
                var parametros = new ParameterList();
                parametros.Add("@IDTRANSACCION", lineaTransaccion.idTransaccion);
                parametros.Add("@IDENTRADA", lineaTransaccion.idEntrada);
                parametros.Add("@PRECIO", lineaTransaccion.precio);
                parametros.Add("@PUNTOSGANADOS", lineaTransaccion.puntosGanados);
                parametros.Add("@ID", lineaTransaccion.id);
                int rowsAffected = DB.ExecuteNonQuery(query, parametros);
                return rowsAffected;
            }
        }

        private Entrada? ObtenerEntradaPorId(int v)
        {
            var entradaMapper = new EntradaMapper(globales, DB);
            return entradaMapper.ObtenerEntradaPorId(v);
        }

        private Transaccion? ObtenerTransaccionPorId(int v)
        {
            var transaccionMapper = new TransaccionMapper(globales, DB);
            return transaccionMapper.ObtenerTransaccionPorId(v);
        }

        public List<EntradaDetalle> ObtenerDetallesCompraAgrupados(int idTransaccion)
        {
            // Esta es la lista que vamos a devolver
            var listaDetalle = new List<EntradaDetalle>();

            lock (DB) // Usamos el lock, igual que en tus otros métodos
            {

                string query =
                    "SELECT " +
                    "  te.nombre AS Tipo, " +
                    "  COUNT(e.id) AS Cantidad, " +
                    "  SUM(lt.precio) AS PrecioTotal " +
                    "FROM LineaTransaccion lt " +
                    "JOIN Entrada e ON lt.idEntrada = e.id " +
                    "JOIN TipoEntrada te ON e.idTipoEntrada = te.id " +
                    "WHERE lt.idTransaccion = @ID_TRANSACCION " +
                    "GROUP BY te.id, te.nombre"; // Agrupamos por tipo de entrada

                // Creamos la lista de parámetros
                var parametros = new ParameterList();
                parametros.Add("@ID_TRANSACCION", idTransaccion);

                // Ejecutamos la consulta
                DB.Select(query, parametros);

                // Leemos los resultados
                while (DB.Read())
                {
                    // Creamos un objeto 'EntradaDetalle' por cada fila que devuelve el GROUP BY
                    EntradaDetalle detalle = new EntradaDetalle
                    {
                        // Mapeamos las columnas del SELECT a las propiedades de la clase
                        Tipo = DB.GetString("Tipo"),
                        Cantidad = DB.GetInt("Cantidad"),
                        Precio = DB.GetDecimal("PrecioTotal")
                    };
                    listaDetalle.Add(detalle);
                }
            }

            // Devolvemos la lista (estará vacía si no se encontraron resultados)
            return listaDetalle;
        }
    }
}
