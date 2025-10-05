using EventodromoRest.Modelos;
using EventodromoRest.Modelos.Utiles;


namespace EventodromoRest.Mappers
{
    public class LocalMapper(Globales.Globales globales, DBManager.DBManager DB)
    {
        public List<Local> ListarLocal()
        {
            List<Local> listaLocal = new List<Local>();
            lock (DB)
            {
                string query = "SELECT * FROM Local";
                DB.Select(query, null);
                while (DB.Read())
                {
                    Local local = new()
                    {
                        id = DB.GetInt("ID"),
                        nombre = DB.GetString("NOMBRE"),
                        idCiudad = DB.GetInt("IDCIUDAD"),
                        ciudad = ObtenerCiudadPorId(DB.GetInt("IDCIUDAD")),
                        direccion = DB.GetString("DIRECCION"),
                        capacidad = DB.GetInt("CAPACIDAD"),
                        isDeleted = DB.GetBoolean("ISDELETED"),
                        idAdministrador = DB.GetInt("CREADOPOR"),
                        administrador = ObtenerAdministradorPorId(DB.GetInt("CREADOPOR")),
                    };
                    listaLocal.Add(local);
                }
                return listaLocal;
            }
        }

        public int InsertarLocal(Local local)
        {
            lock (DB)
            {
                string query = "INSERT INTO Local (NOMBRE, IDCIUDAD, DIRECCION, CAPACIDAD, ISDELETED, CREADOPOR) VALUES (@NOMBRE, @IDCIUDAD, @DIRECCION, @CAPACIDAD, @ISDELETED, @CREADOPOR); SELECT LAST_INSERT_ID();";
                var parametros = new ParameterList();
                parametros.Add("@NOMBRE", local.nombre);
                parametros.Add("@IDCIUDAD", local.idCiudad);
                parametros.Add("@DIRECCION", local.direccion);
                parametros.Add("@CAPACIDAD", local.capacidad);
                parametros.Add("@ISDELETED", local.isDeleted);
                parametros.Add("@CREADOPOR", local.idAdministrador);
                object result = DB.ExecuteScalar(query, parametros);
                int newId = Convert.ToInt32(result);
                return newId;
            }
        }

       public Local ObtenerLocalPorId(int id)
        {
            lock (DB)
            {
                string query = "SELECT * FROM Local WHERE ID = @ID";
                var parametros = new ParameterList();
                parametros.Add("@ID", id);
                DB.Select(query, parametros);
                if (DB.Read())
                {
                    Local local = new()
                    {
                        id = DB.GetInt("ID"),
                        nombre = DB.GetString("NOMBRE"),
                        idCiudad = DB.GetInt("IDCIUDAD"),
                        ciudad = ObtenerCiudadPorId(DB.GetInt("IDCIUDAD")),
                        direccion = DB.GetString("DIRECCION"),
                        capacidad = DB.GetInt("CAPACIDAD"),
                        isDeleted = DB.GetBoolean("ISDELETED"),
                        idAdministrador = DB.GetInt("CREADOPOR"),
                        administrador = ObtenerAdministradorPorId(DB.GetInt("CREADOPOR")),
                    };
                    return local;
                }
                else
                {
                    return null;
                }
            }
        }

        public int EliminarLocalPorId(int id)
        {
            lock (DB)
            {
                string query = "DELETE FROM Local WHERE ID = @ID";
                var parametros = new ParameterList();
                parametros.Add("@ID", id);
                int rowsAffected = DB.ExecuteNonQuery(query, parametros);
                return rowsAffected;
            }
        }

        public int ModificarLocal(Local local)
        {
            lock (DB)
            {
                string query = "UPDATE Local SET NOMBRE = @NOMBRE, IDCIUDAD = @IDCIUDAD, DIRECCION = @DIRECCION, CAPACIDAD = @CAPACIDAD, ISDELETED = @ISDELETED, CREADOPOR = @CREADOPOR WHERE ID = @ID";
                var parametros = new ParameterList();
                parametros.Add("@NOMBRE", local.nombre);
                parametros.Add("@IDCIUDAD", local.idCiudad);
                parametros.Add("@DIRECCION", local.direccion);
                parametros.Add("@CAPACIDAD", local.capacidad);
                parametros.Add("@ISDELETED", local.isDeleted);
                parametros.Add("@CREADOPOR", local.idAdministrador);
                parametros.Add("@ID", local.id);
                int rowsAffected = DB.ExecuteNonQuery(query, parametros);
                return rowsAffected;
            }
        }

        private Ciudad ObtenerCiudadPorId(int v)
        {
            var ciudadMapper = new CiudadMapper(globales, DB);
            return ciudadMapper.ObtenerCiudadPorId(v);
        }

        private Administrador ObtenerAdministradorPorId(int v)
        {
            var administradorMapper = new AdministradorMapper(globales, DB);
            return administradorMapper.ObtenerAdministradorPorId(v);
        }
    }
}
