using EventodromoRest.Modelos;
using EventodromoRest.Modelos.Utiles;

namespace EventodromoRest.Mappers
{
    public class TransaccionTarjetaMapper(Globales.Globales globales, DBManager.DBManager DB)
    {
        public List<TransaccionTarjeta> ListarTransaccionTarjeta()
        {
            List<TransaccionTarjeta> listaTransaccionTarjeta = new List<TransaccionTarjeta>();
            lock (DB)
            {
                string query = "SELECT * FROM TransaccionTarjeta";
                DB.Select(query, null);
                while (DB.Read())
                {
                    TransaccionTarjeta transaccionTarjeta = new()
                    {
                        id = DB.GetInt("id"),
                        idTransaccion = DB.GetInt("idTransaccion"),
                        transaccion = ObtenerTransaccionPorId(DB.GetInt("idTransaccion")),
                        idTarjeta = DB.GetInt("idTarjeta"),
                        tarjeta = ObtenerTarjetaPorId(DB.GetInt("idTarjeta"))
                    };
                    listaTransaccionTarjeta.Add(transaccionTarjeta);
                }
                return listaTransaccionTarjeta;
            }
        }

        private Tarjeta ObtenerTarjetaPorId(int v)
        {
            var tarjetaMapper = new TarjetaMapper(globales, DB);
            return tarjetaMapper.ObtenerTarjetaPorId(v);
        }

        private Transaccion ObtenerTransaccionPorId(int v)
        {
            var transaccionMapper = new TransaccionMapper(globales, DB);
            return transaccionMapper.ObtenerTransaccionPorId(v);
        }

        public int InsertarTransaccionTarjeta(TransaccionTarjeta transaccionTarjeta)
        {
            lock (DB)
            {
                string query = "INSERT INTO TransaccionTarjeta (idTransaccion, idTarjeta) VALUES (@idTransaccion, @idTarjeta); SELECT LAST_INSERT_ID();";
                var parametros = new ParameterList();
                parametros.Add("@idTransaccion", transaccionTarjeta.idTransaccion);
                parametros.Add("@idTarjeta", transaccionTarjeta.idTarjeta);
                object result = DB.ExecuteScalar(query, parametros);
                int newId = Convert.ToInt32(result);
                return newId;
            }
        }

        public TransaccionTarjeta ObtenerTransaccionTarjetaPorId(int id)
        {
            lock (DB)
            {
                string query = "SELECT * FROM TransaccionTarjeta WHERE id = @id";
                var parametros = new ParameterList();
                parametros.Add("@id", id);
                DB.Select(query, parametros);
                if (DB.Read())
                {
                    TransaccionTarjeta transaccionTarjeta = new()
                    {
                        id = DB.GetInt("id"),
                        idTransaccion = DB.GetInt("idTransaccion"),
                        transaccion = ObtenerTransaccionPorId(DB.GetInt("idTransaccion")),
                        idTarjeta = DB.GetInt("idTarjeta"),
                        tarjeta = ObtenerTarjetaPorId(DB.GetInt("idTarjeta"))
                    };
                    return transaccionTarjeta;
                }
                else
                {
                    return null;
                }
            }
        }

        public int EliminarTransaccionTarjetaPorId(int id)
        {
            lock (DB)
            {
                string query = "DELETE FROM TransaccionTarjeta WHERE id = @id";
                var parametros = new ParameterList();
                parametros.Add("@id", id);
                int rowsAffected = DB.ExecuteNonQuery(query, parametros);
                return rowsAffected;
            }
        }

        public int ModificarTransaccionTarjeta(TransaccionTarjeta transaccionTarjeta)
        {
            lock (DB)
            {
                string query = "UPDATE TransaccionTarjeta SET idTransaccion = @idTransaccion, idTarjeta = @idTarjeta WHERE id = @id";
                var parametros = new ParameterList();
                parametros.Add("@idTransaccion", transaccionTarjeta.idTransaccion);
                parametros.Add("@idTarjeta", transaccionTarjeta.idTarjeta);
                int rowsAffected = DB.ExecuteNonQuery(query, parametros);
                return rowsAffected;
            }
        }
    }
}
