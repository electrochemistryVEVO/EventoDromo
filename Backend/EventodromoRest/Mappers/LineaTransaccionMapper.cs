using EventodromoRest.Modelos;
using EventodromoRest.Modelos.Utiles;


namespace EventodromoRest.Mappers
{
    public class LineaTransaccionMapper(Globales.Globales globales, DBManager.DBManager DB)
    {
        public List<LineaTransaccion> ListarLineaTransaccion()
        {
            List<LineaTransaccion> listaLineaTransaccion = new List<LineaTransaccion>();
            lock (DB)
            {
                string query = "SELECT * FROM LineaTransaccion";
                DB.Select(query, null);
                while (DB.Read())
                {
                    LineaTransaccion lineaTransaccion = new()
                    {
                        id = DB.GetInt("ID"),
                        idTransaccion = DB.GetInt("IDTRANSACCION"),
                        transaccion = ObtenerTransaccionPorId(DB.GetInt("IDTRANSACCION")),
                        idEntrada = DB.GetInt("IDENTRADA"),
                        entrada = ObtenerEntradaPorId(DB.GetInt("IDENTRADA")),
                        precio = DB.GetDecimal("PRECIO"),
                        puntosGanados = DB.GetInt("PUNTOSGANADOS"),
                    };
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
                        transaccion = ObtenerTransaccionPorId(DB.GetInt("IDTRANSACCION")),
                        idEntrada = DB.GetInt("IDENTRADA"),
                        entrada = ObtenerEntradaPorId(DB.GetInt("IDENTRADA")),
                        precio = DB.GetDecimal("PRECIO"),
                        puntosGanados = DB.GetInt("PUNTOSGANADOS"),
                    };
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
    }
}
