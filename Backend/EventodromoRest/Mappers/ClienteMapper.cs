using EventodromoRest.Modelos;
using EventodromoRest.Modelos.Utiles;
using EventodromoRest.Negocio;

namespace EventodromoRest.Mappers
{
    public class ClienteMapper(Globales.Globales globales, DBManager.DBManager DB)
    {

        public Cliente ObtenerClientePorEmailPassword(string email, string password, out char tipoUsuario)
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

                        tipoUsuario = 'A'; // Administrador
                        return admin;
                    }
                    else
                    {
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
                string query = "INSERT INTO Cliente (nombres, apellidos, email, passwordHash, fechaNacimiento, idSexo, idTipoDocumento, numeroDocumento, telefono, idCiudad, politicaDePrivacidad, envioDePublicidad, fechaCreacion, fechaUltimaEdicion, fechaUltimaSesion) VALUES (@nombres, @apellidos, @email, @passwordHash, @fechaNacimiento, @idSexo, @idTipoDocumento, @numeroDocumento, @telefono, @idCiudad, @politicaDePrivacidad, @envioDePublicidad, @fechaCreacion, @fechaUltimaEdicion, @fechaUltimaSesion); SELECT LAST_INSERT_ID();";
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
                parametros.Add("@fechaCreacion", cliente.fechacreacion);
                parametros.Add("@fechaUltimaEdicion", cliente.fechaultimaedicion);
                parametros.Add("@fechaUltimaSesion", cliente.fechaultimasession);
                object result = DB.ExecuteScalar(query, parametros);
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
                if (DB.Read())
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
                        fechaultimaedicion = DB.IsDBNull("fechaUltimaEdicion") ? (DateTime?)null : DB.GetDateTime("fecha_ultima_edicion"),
                        fechaultimasession = DB.GetDateTime("fechaUltimaSesion"),
                        // sexo = ObtenerSexoPorId(DB.GetInt("idSexo")),
                        //tipodocumento = ObtenerTipoDocumentoPorId(DB.GetInt("idTipoDocumento")),
                        //ciudad = ObtenerCiudadPorId(DB.GetInt("idCiudad"))
                    };
                    cliente.sexo = ObtenerSexoPorId(cliente.idsexo ?? 0);
                    cliente.tipodocumento = ObtenerTipoDocumentoPorId(cliente.idtipodocumento ?? 0);
                    cliente.ciudad = ObtenerCiudadPorId(cliente.idciudad ?? 0);
                    return cliente;
                }
                else
                {
                    return null;
                }
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
    }
}