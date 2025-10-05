using EventodromoRest.Modelos;
using EventodromoRest.Modelos.Utiles;

namespace EventodromoRest.Mappers
{
    public class PaisMapper(Globales.Globales globales, DBManager.DBManager DB)
    {
        public List<Pais> ListarPais()
        {
            List<Pais> listaPais = new List<Pais>();
            lock (DB)
            {
                string query = "SELECT * FROM Pais";
                DB.Select(query, null);
                while (DB.Read())
                {
                    Pais pais = new()
                    {
                        id = DB.GetInt("ID"),
                        nombre = DB.GetString("NOMBRE"),
                    };
                    listaPais.Add(pais);
                }
                return listaPais;
            }
        }
        public int InsertarPais(Pais pais)
        {
            lock (DB)
            {
                string query = "INSERT INTO Pais (NOMBRE) " +
                               "VALUES (@NOMBRE); SELECT LAST_INSERT_ID();";
                var parametros = new ParameterList();
                parametros.Add("@NOMBRE", pais.nombre);
                object result = DB.ExecuteScalar(query, parametros);
                int newId = Convert.ToInt32(result);
                return newId;
            }
        }
        public Pais ObtenerPaisPorId(int id)
        {
            lock (DB)
            {
                string query = "SELECT * FROM Pais WHERE ID = @ID";
                var parametros = new ParameterList();
                parametros.Add("@ID", id);
                DB.Select(query, parametros);
                if (DB.Read())
                {
                    Pais pais = new()
                    {
                        id = DB.GetInt("ID"),
                        nombre = DB.GetString("NOMBRE"),
                    };
                    return pais;
                }
                else
                {
                    return null;
                }
            }
        }

        public int EliminarPais(int id)
        {
            lock (DB)
            {
                string query = "DELETE FROM Pais WHERE ID = @ID";
                var parametros = new ParameterList();
                parametros.Add("@ID", id);
                int rowsAffected = DB.ExecuteNonQuery(query, parametros);
                return rowsAffected;
            }
        }

        public int ModificarPais(Pais pais)
        {
            lock (DB)
            {
                string query = "UPDATE Pais SET NOMBRE = @NOMBRE WHERE ID = @ID";
                var parametros = new ParameterList();
                parametros.Add("@NOMBRE", pais.nombre);
                parametros.Add("@ID", pais.id);
                int rowsAffected = DB.ExecuteNonQuery(query, parametros);
                return rowsAffected;
            }
        }

    }
}
