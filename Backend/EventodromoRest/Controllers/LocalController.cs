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
        
        [HttpGet]
        [Route("/api/[controller]/[action]")]
        public GenericResponse<Local> ObtenerLocalPorId([FromQuery] int id)
        {
            try
            {
                return new LocalBO(globales, BD).ObtenerLocalPorId(id);
            }
            catch (Exception e)
            {
                var response = new GenericResponse<Local>
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
        
        [HttpDelete]
        [Route("/api/[controller]/[action]")]
        public GenericResponse<int> EliminarLocal([FromQuery] int id)
        {
            try
            {
                return new LocalBO(globales, BD).EliminarLocal(id);
            }
            catch (Exception e)
            {
                var response = new GenericResponse<int>
                {
                    Success = false,
                    Message = null,
                    Error = e.Message,
                    Data = 0
                };
                AgregarEntradaBitacora(e, "", JsonSerializer.Serialize(response));
                return response;
            }
        }
        
        [HttpPut]
        [Route("/api/[controller]/[action]")]
        public GenericResponse<int> ModificarLocal([FromBody] Local local)
        {
            try
            {
                return new LocalBO(globales, BD).ModificarLocal(local);
            }
            catch (Exception e)
            {
                var response = new GenericResponse<int>
                {
                    Success = false,
                    Message = null,
                    Error = e.Message,
                    Data = 0
                };
                AgregarEntradaBitacora(e, "", JsonSerializer.Serialize(response));
                return response;
            }
        }
        
        [HttpPost]
        [Route("/api/[controller]/[action]")]
        public GenericResponse<int> InsertarLocal([FromBody] Local local)
        {
            try
            {
                return new LocalBO(globales, BD).InsertarLocal(local);
            }
            catch (Exception e)
            {
                var response = new GenericResponse<int>
                {
                    Success = false,
                    Message = null,
                    Error = e.Message,
                    Data = 0
                };
                AgregarEntradaBitacora(e, "", JsonSerializer.Serialize(response));
                return response;
            }
        }

        [HttpGet]
        [Route("/api/[controller]/[action]")]
        public GenericResponse<IEnumerable<Local>> ListarLocalesAdmin()
        {
            try
            {
                return new LocalBO(globales, BD).ListarLocalesAdmin();
            }
            catch (Exception e)
            {
                var response = new GenericResponse<IEnumerable<Local>>
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
