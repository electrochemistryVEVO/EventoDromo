using EventodromoRest.Modelos;
using EventodromoRest.Modelos.Utiles;
using EventodromoRest.Negocio;
using static System.Runtime.InteropServices.JavaScript.JSType;


namespace EventodromoRest.Mappers
{
    public class LocalMapper(Globales.Globales globales, DBManager.DBManager DB)
    {
        public List<LocalCiudadImagenDTO> ListarLocales()
        {
            List<LocalCiudadImagenDTO> listaLocal = new List<LocalCiudadImagenDTO>();
            lock (DB)
            {
                string query = @"SELECT
                                    L.ID,
                                    L.NOMBRE,
                                    L.IMAGENURL,
                                    C.NOMBRE AS CIUDADNOMBRE
                                FROM
                                    Local AS L
                                JOIN
                                    Ciudad AS C ON L.idCiudad = C.ID
                                WHERE
                                    L.isDeleted = 0;"; // Asumiendo que 0 es 'no borrado'

                DB.Select(query, null);
                while (DB.Read())
                {
                    LocalCiudadImagenDTO local = new()
                    {
                        idLocal = DB.GetInt("ID"),
                        nombreLocal = DB.GetString("NOMBRE"),
                        nombreCiudad = DB.GetString("CIUDADNOMBRE"),
                        imagenURL = DB.GetString("IMAGENURL")
                    };
                    listaLocal.Add(local);
                }

                return listaLocal;
            }
        }

        public List<LocalCiudadImagenDTO> ListarLocalesDestacados()
        {
            lock (DB)
            {
                string query = @"
            SELECT DISTINCT
                l.id,
                l.nombre,
                c.nombre as ciudad,
                COALESCE(l.imagenURL, e.imagenURL) as imagen
            FROM Local l
            INNER JOIN Ciudad c ON l.idCiudad = c.id
            LEFT JOIN Evento e ON l.id = e.idLocal AND e.isDeleted = 0
            WHERE l.isDeleted = 0
            ORDER BY l.id
            LIMIT 4;";

                DB.Select(query, new ParameterList());

                var resultados = new List<LocalCiudadImagenDTO>();
                while (DB.Read())
                {
                    var dto = new LocalCiudadImagenDTO
                    {
                        idLocal = DB.GetInt("id"),
                        nombreLocal = DB.GetString("nombre"),
                        nombreCiudad = DB.GetString("ciudad"),
                        imagenURL = DB.GetString("imagen")
                    };
                    resultados.Add(dto);
                }
                return resultados;
            }
        }

        public List<Local> ListarLocales2()
        {
            List<Local> listaLocal = new();
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
                        direccion = DB.GetString("DIRECCION"),
                        capacidad = DB.GetInt("CAPACIDAD"),
                        isDeleted = DB.GetBoolean("ISDELETED"),
                        idAdministrador = DB.GetInt("CREADOPOR"),
                    };
                    listaLocal.Add(local);
                }
            }

            // Cerrar DataReader antes de nuevas consultas
            foreach (var local in listaLocal)
            {
                local.ciudad = ObtenerCiudadPorId(local.idCiudad);
                local.administrador = ObtenerAdministradorPorId(local.idAdministrador);
            }

            return listaLocal;
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
                    Local local = new Local();
                    local.id = DB.GetInt("ID");
                    local.nombre = DB.GetString("NOMBRE");
                    local.idCiudad = DB.GetInt("IDCIUDAD");
                    local.direccion = DB.GetString("DIRECCION");
                    local.capacidad = DB.GetInt("CAPACIDAD");
                    local.isDeleted = DB.GetBoolean("ISDELETED");
                    local.idAdministrador = DB.GetInt("CREADOPOR");
                    local.ciudad = ObtenerCiudadPorId(local.idCiudad);
                    local.administrador = ObtenerAdministradorPorId(local.idAdministrador);
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

        public ResponseLocal ObtenerLocalPorIdEvento(int eventoId)
        {
            CiudadMapper ciudadMapper = new CiudadMapper(globales, DB);
            lock (DB)
            {
                string query = @"SELECT
                                    L.id AS ID,
                                    L.nombre AS NOMBRE,
                                    L.direccion AS DIRECCION,
                                    L.idCiudad AS IDCIUDAD
                                FROM
                                    Local AS L
                                JOIN
                                    Evento AS E ON L.id = E.idLocal
                                WHERE
                                    E.id = @IdEvento;";

                var parametros = new ParameterList();
                parametros.Add("@IdEvento", eventoId);
                DB.Select(query, parametros);
                if (DB.Read())
                {
                    ResponseLocal local = new ResponseLocal();
                    local.id = DB.GetInt("ID");
                    local.nombre = DB.GetString("NOMBRE");
                    local.direccion = DB.GetString("DIRECCION");
                    local.ciudad = new Ciudad()
                    {
                        id = DB.GetInt("IDCIUDAD")
                    };
                    local.googleMapsEmbed = "<iframe src=\"https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3901.9705727105875!2d-77.037574524449!3d-12.045545688191202!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9105c8ca3c54dd11%3A0x40b0447dcf24a5c8!2sTeatro%20Municipal%20de%20Lima!5e0!3m2!1ses!2spe!4v1760080206514!5m2!1ses!2spe\" width=\"600\" height=\"450\" style=\"border:0;\" allowfullscreen=\"\" loading=\"lazy\" referrerpolicy=\"no-referrer-when-downgrade\"></iframe>";

                    local.ciudad = ciudadMapper.ObtenerCiudadPorId((int)local.ciudad.id);
                    return local;
                }
                else
                {
                    return null;
                }
            }
        }

        public List<Local> ListarLocalesAdmin()
        {
            List<Local> listaLocal = new List<Local>();
            lock (DB)
            {
                string query = "SELECT Local.*,COUNT(E.id) AS EVENTOS,C.nombre AS NOMBRECIUDAD"
                               + " FROM Local LEFT JOIN Evento AS E ON Local.id = E.idLocal"
                               + " LEFT JOIN Ciudad AS C ON Local.idCiudad = C.id"
                               + " GROUP BY Local.id;";
                DB.Select(query, null);
                while (DB.Read())
                {
                    Local local = new()
                    {
                        id = DB.GetInt("ID"),
                        nombre = DB.GetString("NOMBRE"),
                        idCiudad = DB.GetInt("IDCIUDAD"),
                        nombreCiudad = DB.GetString("NOMBRECIUDAD"),
                        eventos = DB.GetInt("EVENTOS"),
                        direccion = DB.GetString("DIRECCION"),
                        capacidad = DB.GetInt("CAPACIDAD"),
                        imagenURL = DB.GetString("IMAGENURL"),
                        isDeleted = DB.GetBoolean("ISDELETED")
                    };
                    listaLocal.Add(local);
                }
                return listaLocal;
            }
        }
    }
}
