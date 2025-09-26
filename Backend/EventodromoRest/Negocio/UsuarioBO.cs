using EventodromoRest.DAO;
using EventodromoRest.Dominio;

namespace EventodromoRest.Negocio
{
    public class UsuarioBO(Globales.Globales globales, DBManager.DBManager DB)
    {
        public ResponseAutenticarUsuario AutenticarUsuario(RequestAutenticarUsuario usuario)
        {
            var usuarioDAO = new UsuarioDAO(globales, DB);
            bool esValido = usuarioDAO.AutenticarUsuario(usuario);
            return new ResponseAutenticarUsuario
            {
                Codigo = 0,
                NombreUsuario = usuario.Correo,
                UsuarioValido = esValido
            };
        }

        public ResponseBool InsertarUsuario(RequestInsertarUsuario request)
        {
            var usuarioDAO = new UsuarioDAO(globales, DB);
            bool resultado = usuarioDAO.InsertarUsuario(request);
            return new ResponseBool
            {
                Codigo = 0,
                Mensaje = "Usuario insertado correctamente.",
                Resultado = resultado
            };
        }
    }
}
