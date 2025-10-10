using EventodromoRest.Modelos;
using EventodromoRest.Modelos.Utiles;
using EventodromoRest.Negocio;

namespace EventodromoRest.Mappers
{
    public class CarritoMapper(Globales.Globales globales, DBManager.DBManager DB)
    {
        public List<Carrito> ListarCarrito()
        {
            List<Carrito> listaCarrito = new List<Carrito>();
            var parametros = new ParameterList();
            lock (DB)
            {
                string query = "SELECT * FROM Carrito";
                DB.Select(query, parametros);
                while (DB.Read())
                {
                    Carrito carrito = new()
                    {
                        id = DB.GetInt("id"),
                        idCliente = DB.GetInt("idCliente"),
                        //cliente = ObtenerClientePorId(DB.GetInt("idCliente")),
                        fechaExpiracion = DB.GetDateTime("fechaExpiracion"),
                        fechaCreacion = DB.GetDateTime("fechaCreacion")

                    };
                    carrito.cliente = ObtenerClientePorId(carrito.idCliente);
                    listaCarrito.Add(carrito);
                }
                return listaCarrito;
            }
        }

        private Cliente ObtenerClientePorId(int v)
        {
            var clienteMapper = new ClienteMapper(globales, DB);
            return clienteMapper.ObtenerClientePorId(v);
        }

        public int InsertarCarrito(Carrito carrito)
        {
            lock (DB)
            {
                string query = "INSERT INTO Carrito (idCliente, fechaExpiracion, fechaCreacion) VALUES (@idCliente, @fechaExpiracion, @fechaCreacion); SELECT LAST_INSERT_ID();";
                var parametros = new ParameterList();
                parametros.Add("@idCliente", carrito.idCliente);
                parametros.Add("@fechaExpiracion", carrito.fechaExpiracion);
                parametros.Add("@fechaCreacion", carrito.fechaCreacion);
                object result = DB.ExecuteScalar(query, parametros);
                int newId = Convert.ToInt32(result);
                return newId;
            }
        }

        public Carrito ObtenerCarritoPorId(int id)
        {
            lock (DB)
            {
                string query = "SELECT * FROM Carrito WHERE id = @id";
                var parametros = new ParameterList();
                parametros.Add("@id", id);
                DB.Select(query, parametros);
                if (DB.Read())
                {
                    Carrito carrito = new()
                    {
                        id = DB.GetInt("id"),
                        idCliente = DB.GetInt("idCliente"),
<<<<<<< HEAD
                        //cliente = ObtenerClientePorId(DB.GetInt("idCliente")),
=======
>>>>>>> origin/grupo1
                        fechaExpiracion = DB.GetDateTime("fechaExpiracion"),
                        fechaCreacion = DB.GetDateTime("fechaCreacion")
                    };
                    carrito.cliente = ObtenerClientePorId(carrito.idCliente);
                    return carrito;
                }
                else
                {
                    return null;
                }
            }
        }

        public int EliminarCarritoPorId(int id)
        {
            lock (DB)
            {
                string query = "DELETE FROM Carrito WHERE id = @id";
                var parametros = new ParameterList();
                parametros.Add("@id", id);
                int rowsAffected = DB.ExecuteNonQuery(query, parametros);
                return rowsAffected;
            }
        }

        public int ModificarCarrito(Carrito carrito)
        {
            lock (DB)
            {
                string query = "UPDATE Carrito SET idCliente = @idCliente, idTransaccion = @idTransacion, fechaExpiracion = @fechaExpiracion, fechaCreacion = @fechaCreacion WHERE id = @id";
                var parametros = new ParameterList();
                parametros.Add("@idCliente", carrito.idCliente);
                parametros.Add("@fechaExpiracion", carrito.fechaExpiracion);
                parametros.Add("@fechaCreacion", carrito.fechaCreacion);
                int rowsAffected = DB.ExecuteNonQuery(query, parametros);
                return rowsAffected;
            }
        }

        public Carrito ObtenerCarritoPorIdCliente(int idCliente)
        {
            lock (DB)
            {
                string query = "SELECT * FROM Carrito WHERE idCliente = @idCliente " +
                    "AND fechaCreacion < @fechaActual " +
                    "AND fechaExpiracion > @fechaActual";
                var parametros = new ParameterList();
                parametros.Add("@idCliente", idCliente);
                //parametros.Add("@fechaActual", DateTime.Now);
                parametros.Add("@fechaActual", "2025-09-29 11:35:00");
                DB.Select(query, parametros);
                if (DB.Read())
                {
                    Carrito carrito = new()
                    {
                        id = DB.GetInt("id"),
                        idCliente = DB.GetInt("idCliente"),
                        fechaExpiracion = DB.GetDateTime("fechaExpiracion"),
                        fechaCreacion = DB.GetDateTime("fechaCreacion")
                    };
                    carrito.cliente = ObtenerClientePorId(carrito.idCliente);
                    return carrito;
                }
                else
                {
                    return null;
                }
            }
        }
    }
}
