using EventodromoRest.Modelos;
using EventodromoRest.Mappers;

namespace EventodromoRest.Negocio
{
    public class UsuarioBO(Globales.Globales globales, DBManager.DBManager DB)
    {
        public ResponseAutenticarUsuario AutenticarUsuario(RequestAutenticarUsuario usuario)
        {
            var usuarioMapper = new UsuarioMapper(globales, DB);
            bool esValido = usuarioMapper.AutenticarUsuario(usuario);
            return new ResponseAutenticarUsuario
            {
                Codigo = 0,
                NombreUsuario = usuario.Correo,
                UsuarioValido = esValido
            };
        }

        public ResponseBool InsertarUsuario(RequestInsertarUsuario request)
        {
            var usuarioMapper = new UsuarioMapper(globales, DB);
            bool resultado = usuarioMapper.InsertarUsuario(request);
            return new ResponseBool
            {
                Codigo = 0,
                Mensaje = "Usuario insertado correctamente.",
                Resultado = resultado
            };
        }
    }
}
