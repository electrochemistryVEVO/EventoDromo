using EventodromoRest.Servicios;
using System.IdentityModel.Tokens.Jwt;


using EventodromoRest.Modelos;
using EventodromoRest.Modelos.Utiles;
using EventodromoRest.Negocio;
using EventodromoRest.Servicios;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using System.Text.Json;

namespace EventodromoRest.Controllers
{
    [ApiController]
    [Route("/api/[controller]")]
    public class CiudadController(Globales.Globales globales, DBManager.DBManager BD, TokenService tokenService) : BaseController
    {
        //private readonly DBManager.DBManager BD = BD;
        //private readonly Globales.Globales globales = globales;
        private readonly TokenService tokenService = tokenService;

        [HttpGet]
        [Route("/api/[controller]/[action]")]
        public GenericResponse<List<Ciudad>> CiudadListarCiudades()
        {
            try
            {
                var response = new GenericResponse<List<Ciudad>>
                {
                    Success = true,
                    Message = "Todo bien soy CiudadController",
                    Error = null,
                    Data = new CiudadBO(globales, BD).ListarCiudad()
                };
                return response;
            }
            catch (Exception e)
            {
                var response = new GenericResponse<List<Ciudad>>
                {
                    Success = false,
                    Message = null,
                    Error = e.Message,
                    Data = null
                };
                AgregarEntradaBitacora(e, "CiudadListarCiudades", JsonSerializer.Serialize(response));
                return response;
            }
        }

    }
}