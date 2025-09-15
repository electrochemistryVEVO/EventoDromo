using EventodromoRest.DAO;
using EventodromoRest.Dominio;

namespace EventodromoRest.Negocio
{
    public class UsuarioBO(Globales.Globales globales, DBManager.DBManager DB)
    {
        public ResponseAutenticacion AutenticarUsuario(RequestUsuario usuario)
        {
            var usuarioDAO = new UsuarioDAO(globales, DB);
            try
            {
                bool esValido = usuarioDAO.AutenticarUsuario(usuario);
                return new ResponseAutenticacion
                {
                    Codigo = 0,
                    NombreUsuario = usuario.Correo,
                    UsuarioValido = esValido
                };
            }
            catch (Exception ex)
            {
                throw new Exception("Error al autenticar usuario: " + ex.Message);
            }
        }
    }
}
