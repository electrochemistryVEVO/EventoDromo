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
                var parametros = new ParameterList();

                DB.Select(query, parametros);
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
                // Añadimos 'cantidadRestante' al INSERT
                string query = "INSERT INTO Punto (cantidad, cantidadRestante, fechaHoraRegistro, idCliente, fechaExpiracion) " +
                               "VALUES (@cantidad, @cantidadRestante, @fechaHoraRegistro, @idCliente, @fechaExpiracion); SELECT LAST_INSERT_ID();";

                var parametros = new ParameterList();
                parametros.Add("@cantidad", punto.cantidad);

                // El saldo inicial es siempre igual a la cantidad ganada
                parametros.Add("@cantidadRestante", punto.cantidad);

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
                // Añadimos 'cantidadRestante' al UPDATE
                string query = "UPDATE Punto SET cantidad = @cantidad, cantidadRestante = @cantidadRestante, " +
                               "fechaHoraRegistro = @fechaHoraRegistro, idCliente = @idCliente, fechaExpiracion = @fechaExpiracion WHERE id = @id";

                var parametros = new ParameterList();
                parametros.Add("@cantidad", punto.cantidad);

                // Asumimos que el objeto 'punto' trae el saldo correcto
                parametros.Add("@cantidadRestante", punto.cantidadRestante);

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

        /// <summary>
        /// Calcula el total de puntos disponibles y vigentes de un cliente.
        /// </summary>
        public int ObtenerPuntosTotales(int idCliente)
        {
            // Usamos 'lock' para seguir el patrón de tu clase
            lock (DB)
            {
                // Suma el 'saldo' (cantidadRestante) de todos los lotes que no han expirado
                string query = "SELECT SUM(cantidadRestante) FROM Punto " +
                               "WHERE idCliente = @idCliente AND fechaExpiracion > UTC_TIMESTAMP()";

                var parametros = new ParameterList();
                parametros.Add("@idCliente", idCliente);

                object result = DB.ExecuteScalar(query, parametros);

                // Si el usuario no tiene puntos (o SUM devuelve NULL), retornamos 0
                if (result == null || result == DBNull.Value)
                {
                    return 0;
                }

                // Devolvemos el total
                return Convert.ToInt32(result);
            }
        }
    }
}