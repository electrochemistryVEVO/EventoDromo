using EventodromoRest.Modelos;
using EventodromoRest.Modelos.Utiles;


namespace EventodromoRest.Mappers
{
    public class AdministradorMapper(Globales.Globales globales, DBManager.DBManager DB)
    {
        public List<Administrador> ListarAdministrador()
        {
            List<Administrador> listaAdministrador = new List<Administrador>();
            lock (DB)
            {
                string query = "SELECT * FROM Administrador";
                DB.Select(query, null);
                while (DB.Read())
                {
                    Administrador administrador = new()
                    {
                        id = DB.GetInt("ID"),
                        nombres = DB.GetString("NOMBRES"),
                        apellidos = DB.GetString("APELLIDOS"),
                        email = DB.GetString("EMAIL"),
                        passwordHash = DB.GetString("PASSWORDHASH"),
                        fechaCreacion = DB.GetDateTime("FECHACREACION"),
                    };
                    listaAdministrador.Add(administrador);
                }
                return listaAdministrador;
            }
        }

        public int InsertarAdministrador(Administrador administrador)
        {
            lock (DB)
            {
                string query = "INSERT INTO Administrador (NOMBRES, APELLIDOS, EMAIL, PASSWORDHASH, FECHACREACION) VALUES (@NOMBRES, @APELLIDOS, @EMAIL, @PASSWORDHASH, @FECHACREACION); SELECT LAST_INSERT_ID();";
                var parametros = new ParameterList();
                parametros.Add("@NOMBRES", administrador.nombres);
                parametros.Add("@APELLIDOS", administrador.apellidos);
                parametros.Add("@EMAIL", administrador.email);
                parametros.Add("@PASSWORDHASH", administrador.passwordHash);
                parametros.Add("@FECHACREACION", administrador.fechaCreacion);
                object result = DB.ExecuteScalar(query, parametros);
                int newId = Convert.ToInt32(result);
                return newId;
            }
        }

        public Administrador ObtenerAdministradorPorId(int id)
        {
            lock (DB)
            {
                string query = "SELECT * FROM Administrador WHERE ID = @ID";
                var parametros = new ParameterList();
                parametros.Add("@ID", id);
                DB.Select(query, parametros);
                if (DB.Read())
                {
                    Administrador administrador = new()
                    {
                        id = DB.GetInt("ID"),
                        nombres = DB.GetString("NOMBRES"),
                        apellidos = DB.GetString("APELLIDOS"),
                        email = DB.GetString("EMAIL"),
                        passwordHash = DB.GetString("PASSWORDHASH"),
                        fechaCreacion = DB.GetDateTime("FECHACREACION"),
                    };
                    return administrador;
                }
                else
                {
                    return null;
                }
            }
        }

        public int EliminarAdministradorPorId(int id)
        {
            lock (DB)
            {
                string query = "DELETE FROM Administrador WHERE ID = @ID";
                var parametros = new ParameterList();
                parametros.Add("@ID", id);
                int rowsAffected = DB.ExecuteNonQuery(query, parametros);
                return rowsAffected;
            }
        }
        public int ModificarAdministrador(Administrador administrador)
        {
            lock (DB)
            {
                string query = "UPDATE Administrador SET NOMBRES = @NOMBRES, APELLIDOS = @APELLIDOS, EMAIL = @EMAIL, PASSWORDHASH = @PASSWORDHASH, FECHACREACION = @FECHACREACION WHERE ID = @ID";
                var parametros = new ParameterList();
                parametros.Add("@NOMBRES", administrador.nombres);
                parametros.Add("@APELLIDOS", administrador.apellidos);
                parametros.Add("@EMAIL", administrador.email);
                parametros.Add("@PASSWORDHASH", administrador.passwordHash);
                parametros.Add("@FECHACREACION", administrador.fechaCreacion);
                parametros.Add("@ID", administrador.id);
                int rowsAffected = DB.ExecuteNonQuery(query, parametros);
                return rowsAffected;
            }
        }
    }
}
