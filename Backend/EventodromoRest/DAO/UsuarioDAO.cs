using Azure.Core;
using EventodromoRest.Dominio;
using EventodromoRest.Entidades.Utiles;
using EventodromoRest.Globales;
using System.Diagnostics;
using Microsoft.Data.SqlClient;
using static EventodromoRest.Globales.Constantes;

namespace EventodromoRest.DAO
{
    public class UsuarioDAO(Globales.Globales globales, DBManager.DBManager DB)
    {
        public bool AutenticarUsuario(RequestAutenticarUsuario request)
        {
            List<Usuario> listaUsuarios = new List<Usuario>();
            lock (DB)
            {
                string query = "SELECT CORREO, CONTRASENA, ESTADO FROM DEMO.USUARIO WHERE CORREO = @CORREO;";
                var parametros = new ParameterList();
                parametros.Add("@CORREO", request.Correo);

                DB.Select(query, parametros);
                while (DB.Read())
                {
                    Usuario usuario = new ()
                    {
                        Correo = DB.GetString("CORREO"),
                        Contrasena = DB.GetString("CONTRASENA"),
                        Estado = DB.GetString("ESTADO")
                    };
                    listaUsuarios.Add(usuario);
                }
                Usuario? response = listaUsuarios.FirstOrDefault();
                return true;
            }
        }

        public bool InsertarUsuario(RequestInsertarUsuario request)
        {
            lock (DB)
            {
                string query = $"INSERT INTO DEMO.USUARIO (CORREO, CONTRASENA, ROL, NOMBRES, APELLIDOS, DNI, TELEFONO, ESTADO, FECHA_ULT_MODIF, USUARIO_ULT_MODIF) " +
                               "VALUES (@CORREO, @CONTRASENA, @ROL, @NOMBRE, @APELLIDO, @DNI, @TELEFONO, '1', @FECHA, 'admin');";
                var parametros = new ParameterList();
                parametros.Add("@CORREO", request.Correo);
                parametros.Add("@CONTRASENA", request.Contrasena);
                parametros.Add("@ROL", ConstantesUsuario.Rol.Usuario);
                parametros.Add("@NOMBRE", request.Nombre);
                parametros.Add("@APELLIDO", request.Apellido);
                parametros.Add("@DNI", request.DNI);
                parametros.Add("@TELEFONO", request.Telefono);
                parametros.Add("@FECHA", DateTime.Now);

                if (DB.ExecuteNonQuery(query, parametros) == 1)
                {
                    return true;
                }
                else
                {
                    return false;
                }
            }
        }
    }
}
