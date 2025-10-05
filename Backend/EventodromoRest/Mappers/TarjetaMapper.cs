using EventodromoRest.Modelos;
using EventodromoRest.Modelos.Utiles;


namespace EventodromoRest.Mappers
{
    public class TarjetaMapper(Globales.Globales globales, DBManager.DBManager DB)
    {
        public List<Tarjeta> ListarTarjeta()
        {
            List<Tarjeta> listaTarjeta = new List<Tarjeta>();
            lock (DB)
            {
                string query = "SELECT * FROM Tarjeta";
                DB.Select(query, null);
                while (DB.Read())
                {
                    Tarjeta tarjeta = new()
                    {
                        id = DB.GetInt("ID"),
                        numero = DB.GetString("NUMERO"),
                    };
                    listaTarjeta.Add(tarjeta);
                }
                return listaTarjeta;
            }
        }

        public int InsertarTarjeta(Tarjeta tarjeta)
        {
            lock (DB)
            {
                string query = "INSERT INTO Tarjeta (NUMERO) VALUES (@NUMERO); SELECT LAST_INSERT_ID();";
                var parametros = new ParameterList();
                parametros.Add("@NUMERO", tarjeta.numero);
                object result = DB.ExecuteScalar(query, parametros);
                int newId = Convert.ToInt32(result);
                return newId;
            }
        }

        public Tarjeta ObtenerTarjetaPorId(int id)
        {
            lock (DB)
            {
                string query = "SELECT * FROM Tarjeta WHERE ID = @ID";
                var parametros = new ParameterList();
                parametros.Add("@ID", id);
                DB.Select(query, parametros);
                if (DB.Read())
                {
                    Tarjeta tarjeta = new()
                    {
                        id = DB.GetInt("ID"),
                        numero = DB.GetString("NUMERO"),
                    };
                    return tarjeta;
                }
                else
                {
                    return null;
                }
            }
        }

        public int EliminarTarjetaPorId(int id)
        {
            lock (DB)
            {
                string query = "DELETE FROM Tarjeta WHERE ID = @ID";
                var parametros = new ParameterList();
                parametros.Add("@ID", id);
                int rowsAffected = DB.ExecuteNonQuery(query, parametros);
                return rowsAffected;
            }
        }

        public int ModificarTarjeta(Tarjeta tarjeta)
        {
            lock (DB)
            {
                string query = "UPDATE Tarjeta SET NUMERO = @NUMERO WHERE ID = @ID";
                var parametros = new ParameterList();
                parametros.Add("@NUMERO", tarjeta.numero);
                parametros.Add("@ID", tarjeta.id);
                int rowsAffected = DB.ExecuteNonQuery(query, parametros);
                return rowsAffected;
            }
        }
    }
}
