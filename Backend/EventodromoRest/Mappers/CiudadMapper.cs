using EventodromoRest.Modelos;
using EventodromoRest.Modelos.Utiles;


namespace EventodromoRest.Mappers
{
    public class CiudadMapper(Globales.Globales globales, DBManager.DBManager DB)
    {
        public List<Ciudad> ListarCiudad()
        {
            List<Ciudad> listaCiudad = new List<Ciudad>();
            HashSet<int> idsPais = new HashSet<int>();

            lock (DB)
            {
                // 1) Obtener ciudades de Perú (idPais = 1)
                string query = "SELECT * FROM Ciudad WHERE IDPAIS = 1";
                DB.Select(query, null);

                while (DB.Read())
                {
                    var ciudad = new Ciudad
                    {
                        id = DB.GetInt("ID"),
                        nombre = DB.GetString("NOMBRE"),
                        idPais = DB.GetInt("IDPAIS"),
                    };

                    listaCiudad.Add(ciudad);
                    idsPais.Add(ciudad.idPais);
                }

                DB.CloseReader();

                if (listaCiudad.Count == 0)
                    return listaCiudad;

                // 2) Obtener países en una sola consulta
                string paisQuery = $"SELECT * FROM Pais WHERE ID IN ({string.Join(",", idsPais)})";
                DB.Select(paisQuery, null);

                Dictionary<int, Pais> mapaPaises = new Dictionary<int, Pais>();

                while (DB.Read())
                {
                    var pais = new Pais
                    {
                        id = DB.GetInt("ID"),
                        nombre = DB.GetString("NOMBRE"),
                        // agrega más campos si existen en tu tabla
                    };

                    mapaPaises[pais.id.Value] = pais;

                }

                DB.CloseReader();

                // 3) Asignar país a cada ciudad
                foreach (var ciudad in listaCiudad)
                {
                    if (mapaPaises.TryGetValue(ciudad.idPais, out var pais))
                    {
                        ciudad.pais = pais;
                    }
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

                Ciudad ciudad = null;
                int? idPais = null;
                if (DB.Read())
                {
                    ciudad = new()
                    {
                        id = DB.GetInt("ID"),
                        nombre = DB.GetString("NOMBRE"),
                        idPais = DB.GetInt("IDPAIS"),
                    };
                    idPais = ciudad.idPais;
                }

                DB.CloseReader();

                if (ciudad != null)
                {
                    ciudad.pais = ObtenerPaisPorId(idPais ?? 0);
                }

                return ciudad;
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

        public List<Ciudad> ListarCiudadSinPais()
        {
            List<Ciudad> listaCiudad = new List<Ciudad>();
            List<int?> idsPais = new List<int?>();
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
                    };
                    listaCiudad.Add(ciudad);
                    idsPais.Add(ciudad.idPais);
                }
                DB.CloseReader();
                /*
                foreach (var ciudad in listaCiudad)
                {
                    ciudad.pais = ObtenerPaisPorId(ciudad.idPais);
                }
                */
                return listaCiudad;
            }
        }

    }

}
