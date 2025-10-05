using EventodromoRest.Modelos;
using EventodromoRest.Modelos.Utiles;

namespace EventodromoRest.Mappers
{
    public class TransaccionPuntosMapper (Globales.Globales globales, DBManager.DBManager DB)
    {
        public List<TransaccionPuntos> ListarTransaccionPuntos()
        {
            List<TransaccionPuntos> listaTransaccionPuntos = new List<TransaccionPuntos>();
            lock (DB)
            {
                string query = "SELECT * FROM TransaccionPuntos";
                DB.Select(query, null);
                while (DB.Read())
                {
                    TransaccionPuntos transaccionPuntos = new()
                    {
                        id = DB.GetInt("id"),
                        idTransaccion = DB.GetInt("idTransaccion"),
                        transaccion = ObtenerTransaccionPorId(DB.GetInt("idTransaccion")),
                        idCliente = DB.GetInt("idCliente"), 
                        cliente = ObtenerClientePorId(DB.GetInt("idCliente"))

                    };
                    listaTransaccionPuntos.Add(transaccionPuntos);
                }
                return listaTransaccionPuntos;
            }
        }

        private Transaccion ObtenerTransaccionPorId(int v)
        {
            var transaccionMapper = new TransaccionMapper(globales, DB);
            return transaccionMapper.ObtenerTransaccionPorId(v);
        }

        private Cliente ObtenerClientePorId(int v)
        {
            var clienteMapper = new ClienteMapper(globales, DB);
            return clienteMapper.ObtenerClientePorId(v);
        }

        public int InsertarTransaccionPuntos(TransaccionPuntos transaccionPuntos)
        {
            lock (DB)
            {
                string query = "INSERT INTO TransaccionPuntos (idTransaccion, idCliente) VALUES (@idTransaccion, @idCliente); SELECT LAST_INSERT_ID();";
                var parametros = new ParameterList();
                parametros.Add("@idTransaccion", transaccionPuntos.idTransaccion);
                parametros.Add("@idCliente", transaccionPuntos.idCliente);
                object result = DB.ExecuteScalar(query, parametros);
                int newId = Convert.ToInt32(result);
                return newId;
            }
        }

        public TransaccionPuntos ObtenerTransaccionPuntosPorId(int id)
        {
            lock (DB)
            {
                string query = "SELECT * FROM TransaccionPuntos WHERE id = @id";
                var parametros = new ParameterList();
                parametros.Add("@id", id);
                DB.Select(query, parametros);
                if (DB.Read())
                {
                    TransaccionPuntos transaccionPuntos = new()
                    {
                        id = DB.GetInt("id"),
                        idTransaccion = DB.GetInt("idTransaccion"),
                        transaccion = ObtenerTransaccionPorId(DB.GetInt("idTransaccion")),
                        idCliente = DB.GetInt("idCliente"),
                        cliente = ObtenerClientePorId(DB.GetInt("idCliente"))
                    };
                    return transaccionPuntos;
                }
                else
                {
                    return null;
                }
            }
        }

        public int EliminarTransaccionPuntosPorId(int id)
        {
            lock (DB)
            {
                string query = "DELETE FROM TransaccionPuntos WHERE id = @id";
                var parametros = new ParameterList();
                parametros.Add("@id", id);
                int rowsAffected = DB.ExecuteNonQuery(query, parametros);
                return rowsAffected;
            }
        }

        public int ModificarTransaccionPuntos(TransaccionPuntos transaccionPuntos)
        {
            lock (DB)
            {
                string query = "UPDATE TransaccionPuntos SET idTransaccion = @idTransacion, idCliente = @idCliente WHERE id = @id";
                var parametros = new ParameterList();
                parametros.Add("@idTransacion", transaccionPuntos.idTransaccion);
                parametros.Add("@idCliente", transaccionPuntos.idCliente);
                int rowsAffected = DB.ExecuteNonQuery(query, parametros);
                return rowsAffected;
            }
        }
    }
}
