using EventodromoRest.Modelos;
using EventodromoRest.Modelos.Utiles;
using EventodromoRest.Negocio;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace EventodromoRest.Controllers
{
    [ApiController]
    [Route("/api/[controller]")]
    public class ClienteController (Globales.Globales globales, DBManager.DBManager BD) : BaseController
    {
        //private readonly DBManager.DBManager BD = BD;
        //private readonly Globales.Globales globales = globales;

        //[HttpPost]
        //[Route("/api/[controller]/[action]")]
        //public GenericResponse<Cliente> AutenticarCliente([FromBody] RequestAutenticarCliente request)
        //{
        //    try
        //    {
        //        ValidarBody(request);
        //        return new ClienteBO(globales, BD).AutenticarCliente(request);
        //    }
        //    catch (Exception e)
        //    {
        //        var response = new GenericResponse<Cliente>
        //        {
        //            Success = false,
        //            Message = null,
        //            Error = e.Message,
        //            Data = null
        //        };
        //        AgregarEntradaBitacora(e, JsonSerializer.Serialize(request), JsonSerializer.Serialize(response));
        //        return response;
        //    }
        //}

        
    }
}
