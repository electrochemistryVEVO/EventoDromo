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
        public bool AutenticarUsuario(RequestUsuario request)
        {
            Usuario? usuarioBD = null;
            lock (DB)
            {
                string query = "SELECT CORREO, CONTRASENA, ESTADO FROM DEMO.USUARIO WHERE CORREO = @CORREO;";
                    var parametros = new ParameterList();
                    parametros.Add("@CORREO", request.Correo);

                    DB.Select(query, parametros);
                    while (DB.Read())
                    {
                        usuarioBD = new Usuario
                        {
                            Correo = DB.GetString("CORREO"),
                            Contrasena = DB.GetString("CONTRASENA"),
                            Estado = DB.GetString("ESTADO")
                        };
                    }
                    var usuarioBD = resultado.First();
                    Console.WriteLine(usuarioBD.Contrasena);
                    Console.WriteLine(request.Contrasena);
                    if (!(usuarioBD != null && usuarioBD.Estado == ((int)Estado.Activo).ToString()))
                        throw new Exception("Usuario inactivo.");
                    if (usuarioBD.Contrasena != request.Contrasena)
                        throw new Exception("Contraseña incorrecta.");
                    return true;
            }
        }
    }
}
