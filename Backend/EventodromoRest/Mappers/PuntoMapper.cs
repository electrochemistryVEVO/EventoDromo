using EventodromoRest.Modelos;
using EventodromoRest.Modelos.Utiles;

namespace EventodromoRest.Mappers
{
    public class PuntoMapper(Globales.Globales globales, DBManager.DBManager DB)
    {
        public List<Punto> ListarPuntos()
        {
            List<Punto> listaPuntos = new List<Punto>();
            lock (DB)
            {
                string query = "SELECT * FROM Punto";
                DB.Select(query, null);
                while (DB.Read())
                {
                    Punto punto = new()
                    {
                        id = DB.GetInt("id"),
                        cantidad = DB.GetInt("cantidad"),
                        fechahoraregistro = DB.GetDateTime("fechaHoraRegistro"),
                        idcliente = DB.GetInt("idCliente"),
                        fechaexpiracion = DB.GetDateTime("fechaExpiracion"),
                        cliente = ObtenerClientePorId(DB.GetInt("idCliente"))
                    };
                    listaPuntos.Add(punto);
                }
                return listaPuntos;
            }
        }

        public int InsertarPunto(Punto punto)
        {
            lock (DB)
            {
                string query = "INSERT INTO Punto (cantidad, fechaHoraRegistro, idCliente, fechaExpiracion) VALUES (@cantidad, @fechaHoraRegistro, @idCliente, @fechaExpiracion); SELECT LAST_INSERT_ID();";
                var parametros = new ParameterList();
                parametros.Add("@cantidad", punto.cantidad);
                parametros.Add("@fechaHoraRegistro", punto.fechahoraregistro);
                parametros.Add("@idCliente", punto.idcliente);
                parametros.Add("@fechaExpiracion", punto.fechaexpiracion);
                object result = DB.ExecuteScalar(query, parametros);
                int newId = Convert.ToInt32(result);
                return newId;
            }
        }

        public Punto ObtenerPuntoPorId(int id)
        {
            lock (DB)
            {
                string query = "SELECT * FROM Punto WHERE id = @id";
                var parametros = new ParameterList();
                parametros.Add("@id", id);
                DB.Select(query, parametros);
                if (DB.Read())
                {
                    Punto punto = new()
                    {
                        id = DB.GetInt("id"),
                        cantidad = DB.GetInt("cantidad"),
                        fechahoraregistro = DB.GetDateTime("fechaHoraRegistro"),
                        idcliente = DB.GetInt("idCliente"),
                        fechaexpiracion = DB.GetDateTime("fechaExpiracion"),
                        cliente = ObtenerClientePorId(DB.GetInt("idCliente"))
                    };
                    return punto;
                }
                else
                {
                    return null;
                }
            }
        }

        public int EliminarPuntoPorId(int id)
        {
            lock (DB)
            {
                string query = "DELETE FROM Punto WHERE id = @id";
                var parametros = new ParameterList();
                parametros.Add("@id", id);
                int rowsAffected = DB.ExecuteNonQuery(query, parametros);
                return rowsAffected;
            }
        }

        public int ModificarPunto(Punto punto)
        {
            lock (DB)
            {
                string query = "UPDATE Punto SET cantidad = @cantidad, fechaHoraRegistro = @fechaHoraRegistro, idCliente = @idCliente, fechaExpiracion = @fechaExpiracion WHERE id = @id";
                var parametros = new ParameterList();
                parametros.Add("@cantidad", punto.cantidad);
                parametros.Add("@fechaHoraRegistro", punto.fechahoraregistro);
                parametros.Add("@idCliente", punto.idcliente);
                parametros.Add("@fechaExpiracion", punto.fechaexpiracion);
                parametros.Add("@id", punto.id);
                int rowsAffected = DB.ExecuteNonQuery(query, parametros);
                return rowsAffected;
            }
        }

        private Cliente ObtenerClientePorId(int id)
        {
            var clienteMapper = new ClienteMapper(globales, DB);
            return clienteMapper.ObtenerClientePorId(id);
        }
    }
}