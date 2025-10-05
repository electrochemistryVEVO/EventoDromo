using EventodromoRest.Modelos;
using EventodromoRest.Modelos.Utiles;


namespace EventodromoRest.Mappers
{
    public class CiudadMapper(Globales.Globales globales, DBManager.DBManager DB)
    {
        public List<Ciudad> ListarCiudad()
        {
            List<Ciudad> listaCiudad = new List<Ciudad>();
            lock (DB)
            {
                string query = "SELECT * FROM Ciudad";
                DB.Select(query, null);
                while (DB.Read())
                {
                    Ciudad ciudad = new()
                    {
                        id = DB.GetInt("ID"),
                        nombre = DB.GetString("NOMBRE"),
                        idPais = DB.GetInt("IDPAIS"),
                        pais = ObtenerPaisPorId(DB.GetInt("IDPAIS")),
                    };
                    listaCiudad.Add(ciudad);
                }
                return listaCiudad;
            }
        }

        public int InsertarCiudad(Ciudad ciudad)
        {
            lock (DB)
            {
                string query = "INSERT INTO Ciudad (NOMBRE, IDPAIS) VALUES (@NOMBRE, @IDPAIS); SELECT LAST_INSERT_ID();";
                var parametros = new ParameterList();
                parametros.Add("@NOMBRE", ciudad.nombre);
                parametros.Add("@IDPAIS", ciudad.idPais);
                object result = DB.ExecuteScalar(query, parametros);
                int newId = Convert.ToInt32(result);
                return newId;
            }
        }

        public Ciudad ObtenerCiudadPorId(int id)
        {
            lock (DB)
            {
                string query = "SELECT * FROM Ciudad WHERE ID = @ID";
                var parametros = new ParameterList();
                parametros.Add("@ID", id);
                DB.Select(query, parametros);
                if (DB.Read())
                {
                    Ciudad ciudad = new()
                    {
                        id = DB.GetInt("ID"),
                        nombre = DB.GetString("NOMBRE"),
                        idPais = DB.GetInt("IDPAIS"),
                        pais = ObtenerPaisPorId(DB.GetInt("IDPAIS")),
                    };
                    return ciudad;
                }
                else
                {
                    return null;
                }
            }
        }

        public int EliminarCiudadPorId(int id)
        {
            lock (DB)
            {
                string query = "DELETE FROM Ciudad WHERE ID = @ID";
                var parametros = new ParameterList();
                parametros.Add("@ID", id);
                int rowsAffected = DB.ExecuteNonQuery(query, parametros);
                return rowsAffected;
            }
        }

        public int ModificarCiudad(Ciudad ciudad)
        {
            lock (DB)
            {
                string query = "UPDATE Ciudad SET NOMBRE = @NOMBRE, IDPAIS = @IDPAIS WHERE ID = @ID";
                var parametros = new ParameterList();
                parametros.Add("@NOMBRE", ciudad.nombre);
                parametros.Add("@IDPAIS", ciudad.idPais);
                parametros.Add("@ID", ciudad.id);
                int rowsAffected = DB.ExecuteNonQuery(query, parametros);
                return rowsAffected;
            }
        }

        private Pais ObtenerPaisPorId(int v)
        {
            var paisMapper = new PaisMapper(globales, DB);
            return paisMapper.ObtenerPaisPorId(v);
        }
    }
}
