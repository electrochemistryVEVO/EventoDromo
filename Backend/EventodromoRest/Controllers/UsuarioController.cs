using EventodromoRest.DBManager;
using EventodromoRest.Dominio;
using EventodromoRest.Globales;
using EventodromoRest.Negocio;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;

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
        public ResponseAutenticacion AutenticarUsuario([FromBody] RequestUsuario request)
        {
            try
            {
                ValidarBody(request);
                return new UsuarioBO(globales, BD).AutenticarUsuario(request);
            }
            catch (Exception e)
            {
                var response = new ResponseAutenticacion
                {
                    Codigo = -1,
                    Mensaje = e.Message,
                    UsuarioValido = false
                };
                return response;
            }
        }
    }
}
