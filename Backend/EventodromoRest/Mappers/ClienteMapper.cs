using EventodromoRest.Modelos;
using EventodromoRest.Modelos.Utiles;
using EventodromoRest.Negocio;

namespace EventodromoRest.Mappers
{
    public class ClienteMapper(Globales.Globales globales, DBManager.DBManager DB)
    {
        public bool ExisteClienteConEmail(string email)
        {
            lock (DB)
            {
                string query = "SELECT COUNT(*) FROM Cliente WHERE email = @email";
                var parametros = new ParameterList();
                parametros.Add("@email", email);
                object result = DB.ExecuteScalar(query, parametros);
                int count = Convert.ToInt32(result);
                return count > 0;
            }
        }

        public Cliente ObtenerClientePorEmailPassword(string email, string password, out char tipoUsuario, out int idCliente)
        {
            lock (DB)
            {
                string query = "SELECT * FROM Cliente WHERE email = @email AND passwordHash = @passwordHash";
                var parametros = new ParameterList();
                parametros.Add("@email", email);
                parametros.Add("@passwordHash", password);

                DB.Select(query, parametros);

                // 👇 DB.Read() devuelve true si hay una fila disponible
                if (DB.Read())
                {
                    Cliente cliente = new()
                    {
                        id = DB.GetInt("id"),
                        nombres = DB.GetString("nombres"),
                        //apellidos = DB.GetString("apellidos"),
                        //email = DB.GetString("email"),
                        //passwordhash = DB.GetString("passwordHash"),
                        ////fechanacimiento = DB.GetDateTime("fechaNacimiento"),
                        //idsexo = DB.GetInt("idSexo"),
                        //idtipodocumento = DB.GetInt("idTipoDocumento"),
                        //numerodocumento = DB.GetString("numeroDocumento"),
                        //telefono = DB.GetString("telefono"),
                        //idciudad = DB.GetInt("idCiudad"),
                        //politicadeprivacidad = DB.GetBoolean("politicaDePrivacidad"),
                        //enviodepublicidad = DB.GetBoolean("envioDePublicidad"),
                        ////fechacreacion = DB.GetDateTime("fechaCreacion"),
                        ////fechaultimaedicion = DB.GetDateTime("fechaUltimaEdicion"),
                        ////fechaultimasession = DB.GetDateTime("fechaUltimaSesion"),
                        //sexo = ObtenerSexoPorId(DB.GetInt("idSexo")),
                        //tipodocumento = ObtenerTipoDocumentoPorId(DB.GetInt("idTipoDocumento")),
                        //ciudad = ObtenerCiudadPorId(DB.GetInt("idCiudad"))
                    };
                    idCliente= cliente.id ?? 0;
                    tipoUsuario = 'C'; // Cliente
                    return cliente;
                }
                else
                {
                    // Si no está en Cliente, probamos con Administrador
                    query = "SELECT * FROM Administrador WHERE email = @email AND passwordHash = @passwordHash";
                    DB.Select(query, parametros);

                    if (DB.Read())
                    {
                        Cliente admin = new()
                        {
                            id = DB.GetInt("id"),
                            nombres = DB.GetString("nombres"),
                            apellidos = DB.GetString("apellidos"),
                            email = DB.GetString("email"),
                            passwordhash = DB.GetString("passwordHash"),
                            fechacreacion = DB.GetDateTime("fechaCreacion")
                        };
                        idCliente = admin.id ?? 0;
                        tipoUsuario = 'A'; // Administrador
                        return admin;
                    }
                    else
                    {
                        idCliente = 0;
                        tipoUsuario = ' '; // Ninguno
                        return null;
                    }
                }
            }
        }



        public List<Cliente> ListarClientes()
        {
            List<Cliente> listaClientes = new List<Cliente>();
            lock (DB)
            {
                string query = "SELECT * FROM Cliente";
                DB.Select(query, null);
                while (DB.Read())
                {
                    Cliente cliente = new()
                    {
                        id = DB.GetInt("id"),
                        nombres = DB.GetString("nombres"),
                        apellidos = DB.GetString("apellidos"),
                        email = DB.GetString("email"),
                        passwordhash = DB.GetString("passwordHash"),
                        fechanacimiento = DB.GetDateTime("fechaNacimiento"),
                        idsexo = DB.GetInt("idSexo"),
                        idtipodocumento = DB.GetInt("idTipoDocumento"),
                        numerodocumento = DB.GetString("numeroDocumento"),
                        telefono = DB.GetString("telefono"),
                        idciudad = DB.GetInt("idCiudad"),
                        politicadeprivacidad = DB.GetBoolean("politicaDePrivacidad"),
                        enviodepublicidad = DB.GetBoolean("envioDePublicidad"),
                        fechacreacion = DB.GetDateTime("fechaCreacion"),
                        fechaultimaedicion = DB.GetDateTime("fechaUltimaEdicion"),
                        fechaultimasession = DB.GetDateTime("fechaUltimaSesion"),
                        sexo = ObtenerSexoPorId(DB.GetInt("idSexo")),
                        tipodocumento = ObtenerTipoDocumentoPorId(DB.GetInt("idTipoDocumento")),
                        ciudad = ObtenerCiudadPorId(DB.GetInt("idCiudad"))
                    };
                    listaClientes.Add(cliente);
                }
                return listaClientes;
            }
        }

        public int InsertarCliente(Cliente cliente)
        {
            lock (DB)
            {
                // La consulta utiliza el comando CALL de MySQL para ejecutar el SP.
                // Se añade 'SELECT LAST_INSERT_ID()' en la misma cadena para que ExecuteScalar
                // pueda devolver el nuevo ID, ya que el SP lo selecciona como resultado.
                string query = "CALL sp_InsertarCliente(@p_nombres, @p_apellidos, @p_email, @p_passwordHash, @p_fechaNacimiento, @p_idSexo, @p_idTipoDocumento, @p_numeroDocumento, @p_telefono, @p_idCiudad, @p_politicaDePrivacidad, @p_envioDePublicidad); SELECT LAST_INSERT_ID();";

                var parametros = new ParameterList();

                // Los nombres de los parámetros deben coincidir con los de tu stored procedure (p_prefijo)
                parametros.Add("@p_nombres", cliente.nombres);
                parametros.Add("@p_apellidos", cliente.apellidos);
                parametros.Add("@p_email", cliente.email);
                parametros.Add("@p_passwordHash", cliente.passwordhash);

                // Los parámetros de la BD para la inserción (ya mapeados en el BO)
                parametros.Add("@p_fechaNacimiento", cliente.fechanacimiento);
                parametros.Add("@p_idSexo", cliente.idsexo);
                parametros.Add("@p_idTipoDocumento", cliente.idtipodocumento);
                parametros.Add("@p_numeroDocumento", cliente.numerodocumento);
                parametros.Add("@p_telefono", cliente.telefono);
                parametros.Add("@p_idCiudad", cliente.idciudad);
                parametros.Add("@p_politicaDePrivacidad", cliente.politicadeprivacidad);
                parametros.Add("@p_envioDePublicidad", cliente.enviodepublicidad);

                // Ejecución: DB.ExecuteScalar toma la primera columna del primer conjunto de resultados.
                // En este caso, el resultado de SELECT LAST_INSERT_ID().
                object result = DB.ExecuteScalar(query, parametros);

                // Conversión a entero
                int newId = Convert.ToInt32(result);
                return newId;
            }
        }

        public Cliente ObtenerClientePorId(int id)
        {
            lock (DB)
            {
                string query = "SELECT * FROM Cliente WHERE id = @id";
                var parametros = new ParameterList();
                parametros.Add("@id", id);
                DB.Select(query, parametros);
                Cliente cliente = null;

                if (DB.Read())
                {
                    cliente = MapearClienteDesdeReader(); // Usamos método auxiliar
                }

                DB.CloseReader();

                if (cliente != null)
                {
                    cliente.sexo = ObtenerSexoPorId(cliente.idsexo ?? 0);
                    cliente.tipodocumento = ObtenerTipoDocumentoPorId(cliente.idtipodocumento ?? 0);
                    cliente.ciudad = ObtenerCiudadPorId(cliente.idciudad ?? 0);
                }

                return cliente;
            }
        }

        public int EliminarClientePorId(int id)
        {
            lock (DB)
            {
                string query = "DELETE FROM Cliente WHERE id = @id";
                var parametros = new ParameterList();
                parametros.Add("@id", id);
                int rowsAffected = DB.ExecuteNonQuery(query, parametros);
                return rowsAffected;
            }
        }

        public int ModificarCliente(Cliente cliente)
        {
            lock (DB)
            {
                string query = "UPDATE Cliente SET nombres = @nombres, apellidos = @apellidos, email = @email, passwordHash = @passwordHash, fechaNacimiento = @fechaNacimiento, idSexo = @idSexo, idTipoDocumento = @idTipoDocumento, numeroDocumento = @numeroDocumento, telefono = @telefono, idCiudad = @idCiudad, politicaDePrivacidad = @politicaDePrivacidad, envioDePublicidad = @envioDePublicidad, fechaUltimaEdicion = @fechaUltimaEdicion, fechaUltimaSesion = @fechaUltimaSesion WHERE id = @id";
                var parametros = new ParameterList();
                parametros.Add("@nombres", cliente.nombres);
                parametros.Add("@apellidos", cliente.apellidos);
                parametros.Add("@email", cliente.email);
                parametros.Add("@passwordHash", cliente.passwordhash);
                parametros.Add("@fechaNacimiento", cliente.fechanacimiento);
                parametros.Add("@idSexo", cliente.idsexo);
                parametros.Add("@idTipoDocumento", cliente.idtipodocumento);
                parametros.Add("@numeroDocumento", cliente.numerodocumento);
                parametros.Add("@telefono", cliente.telefono);
                parametros.Add("@idCiudad", cliente.idciudad);
                parametros.Add("@politicaDePrivacidad", cliente.politicadeprivacidad);
                parametros.Add("@envioDePublicidad", cliente.enviodepublicidad);
                parametros.Add("@fechaUltimaEdicion", cliente.fechaultimaedicion);
                parametros.Add("@fechaUltimaSesion", cliente.fechaultimasession);
                parametros.Add("@id", cliente.id);
                int rowsAffected = DB.ExecuteNonQuery(query, parametros);
                return rowsAffected;
            }
        }

        public bool ModificarClienteContrasenaPorId(int id, string nuevaContrasena)
        {
            lock (DB)
            {
                string query = "UPDATE Cliente SET passwordHash = @passwordHash WHERE id = @id";
                var parametros = new ParameterList();
                parametros.Add("@passwordHash", nuevaContrasena);
                parametros.Add("@id", id);
                int rowsAffected = DB.ExecuteNonQuery(query, parametros);
                return rowsAffected > 0;
            }
        }

        private Sexo ObtenerSexoPorId(int id)
        {
            var sexoMapper = new SexoMapper(globales, DB);
            return sexoMapper.ObtenerSexoPorId(id);
        }

        private TipoDocumento ObtenerTipoDocumentoPorId(int id)
        {
            var tipoDocumentoMapper = new TipoDocumentoMapper(globales, DB);
            return tipoDocumentoMapper.ObtenerTipoDocumentoPorId(id);
        }

        private Ciudad ObtenerCiudadPorId(int id)
        {
            var ciudadMapper = new CiudadMapper(globales, DB);
            return ciudadMapper.ObtenerCiudadPorId(id);
        }

        private Cliente MapearClienteDesdeReader()
        {
            return new()
            {
                id = DB.GetInt("id"),
                nombres = DB.GetString("nombres"),
                apellidos = DB.GetString("apellidos"),
                email = DB.GetString("email"),
                passwordhash = DB.GetString("passwordHash"),
                // Usa DB.GetDateTimeNull si tu DBManager lo tiene, o IsDBNull
                fechanacimiento = DB.IsDBNull("fechaNacimiento") ? (DateTime?)null : DB.GetDateTime("fechaNacimiento"),
                idsexo = DB.IsDBNull("idSexo") ? (int?)null : DB.GetInt("idSexo"),
                idtipodocumento = DB.IsDBNull("idTipoDocumento") ? (int?)null : DB.GetInt("idTipoDocumento"),
                numerodocumento = DB.GetString("numeroDocumento"),
                telefono = DB.GetString("telefono"),
                idciudad = DB.IsDBNull("idCiudad") ? (int?)null : DB.GetInt("idCiudad"),
                politicadeprivacidad = DB.GetBoolean("politicaDePrivacidad"),
                enviodepublicidad = DB.IsDBNull("envioDePublicidad") ? (bool?)null : DB.GetBoolean("envioDePublicidad"),
                fechacreacion = DB.GetDateTime("fechaCreacion"),
                fechaultimaedicion = DB.IsDBNull("fechaUltimaEdicion") ? (DateTime?)null : DB.GetDateTime("fechaUltimaEdicion"),
                fechaultimasession = DB.IsDBNull("fechaUltimaSesion") ? (DateTime?)null : DB.GetDateTime("fechaUltimaSesion"),
            };
        }

        public bool VerificarContrasenaPorIdContrasena(int id, string password)
        {
            lock (DB)
            {
                string query = "SELECT COUNT(*) FROM Cliente WHERE id = @id AND passwordHash = @passwordHash";
                var parametros = new ParameterList();
                parametros.Add("@id", id);
                parametros.Add("@passwordHash", password);//recuerda que de antes en BO se hacen los hasheos.
                object result = DB.ExecuteScalar(query, parametros);
                int count = Convert.ToInt32(result);
                return count > 0;
            }
        }
    }
}