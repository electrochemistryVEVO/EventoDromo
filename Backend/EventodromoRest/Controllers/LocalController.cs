using EventodromoRest.Modelos;
using EventodromoRest.Modelos.Utiles;
using EventodromoRest.Negocio;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using System.Diagnostics;

namespace EventodromoRest.Controllers
{
    [ApiController]
    [Route("/api/[controller]")]
    public class LocalController (Globales.Globales globales, DBManager.DBManager BD) : BaseController
    {
        //private readonly DBManager.DBManager BD = BD;
        //private readonly Globales.Globales globales = globales; 

        [HttpGet]
        [Route("/api/[controller]/[action]")]
        public GenericResponse<IEnumerable<LocalCiudadImagenDTO>> ListarLocales()
        {
            try
            {
                return new LocalBO(globales, BD).ListarLocales();
            }
            catch (Exception e)
            {
                var response = new GenericResponse<IEnumerable<LocalCiudadImagenDTO>>
                {
                    Success = false,
                    Message = null,
                    Error = e.Message,
                    Data = null
                };
                AgregarEntradaBitacora(e, "", JsonSerializer.Serialize(response));
                return response;
            }
        }

        
    }
}
