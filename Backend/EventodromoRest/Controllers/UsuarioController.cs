using EventodromoRest.Modelos;
using EventodromoRest.Negocio;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace EventodromoRest.Controllers
{
    [ApiController]
    [Route("/api/[controller]")]
    public class UsuarioController(Globales.Globales globales, DBManager.DBManager BD) : BaseController
    {
        private readonly DBManager.DBManager BD = BD;
        private readonly Globales.Globales globales = globales;

        [HttpPost]
        [Route("/api/[controller]/[action]")]
        public ResponseAutenticarUsuario AutenticarUsuario([FromBody] RequestAutenticarUsuario request)
        {
            try
            {
                ValidarBody(request);
                return new UsuarioBO(globales, BD).AutenticarUsuario(request);
            }
            catch (Exception e)
            {
                var response = new ResponseAutenticarUsuario
                {
                    Codigo = -1,
                    Mensaje = e.Message,
                    UsuarioValido = false
                };
                AgregarEntradaBitacora(e, JsonSerializer.Serialize(request), JsonSerializer.Serialize(response));
                return response;
            }
        }

        [HttpPost]
        [Route("/api/[controller]/[action]")]
        public ResponseBool InsertarUsuario([FromBody] RequestInsertarUsuario request)
        {
            try
            {
                ValidarBody(request);
                return new UsuarioBO(globales, BD).InsertarUsuario(request);
            }
            catch (Exception e)
            {
                var response = new ResponseBool
                {
                    Codigo = -1,
                    Mensaje = e.Message,
                    Resultado = false
                };
                AgregarEntradaBitacora(e, JsonSerializer.Serialize(request), JsonSerializer.Serialize(response));
                return response;
            }
        }
    }
}
