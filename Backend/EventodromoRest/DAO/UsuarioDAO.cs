using Azure.Core;
using EventodromoRest.Dominio;
using EventodromoRest.Globales;
using Microsoft.Data.SqlClient;
using static EventodromoRest.Globales.Constantes;

namespace EventodromoRest.DAO
{
    public class UsuarioDAO(Globales.Globales globales, DBManager.DBManager DB)
    {
        public bool AutenticarUsuario(RequestUsuario request)
        {
            lock (DB)
            {
                using (DB)
                {                 
                    string query = "SELECT CORREO, CONTRASENA, ESTADO FROM DEMO.USUARIO WHERE CORREO = @CORREO;";
                    var parametros = new List<SqlParameter>
                    {
                        new SqlParameter("@CORREO", request.Correo)
                    };
                    List<Usuario> resultado = DB.Query(query, r => new Usuario
                    {
                        Correo = r.GetString(r.GetOrdinal("CORREO")),
                        Contrasena = r.GetString(r.GetOrdinal("CONTRASENA")),
                        Estado = r.GetString(r.GetOrdinal("ESTADO"))
                    }, parametros.ToArray());
                    if (resultado.Count == 0)
                    {
                        throw new Exception("Usuario no encontrado.");
                    }
                    var usuarioBD = resultado.First();
                    if (!(usuarioBD.Estado == ((int)Estado.Activo).ToString()))
                        throw new Exception("Usuario inactivo.");
                    if (usuarioBD.Contrasena != request.Contrasena)
                        throw new Exception("Contraseña incorrecta.");
                    return true;
                }
            }
        }
    }
}
