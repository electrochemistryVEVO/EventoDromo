using EventodromoRest.Modelos;
using EventodromoRest.Modelos.Utiles;
using EventodromoRest.Negocio;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Text.Json;
 using Microsoft.AspNetCore.Authorization; 

namespace EventodromoRest.Controllers
{
    [ApiController]
    [Route("/api/[controller]")]
    
    public class CiudadController(Globales.Globales globales, DBManager.DBManager BD) : BaseController
    {

        [HttpGet]
        [Route("/api/[controller]/[action]")]
        public GenericResponse<List<ObtenerCiudadDTO>> CiudadObtenerLista()
        {
            try
            {
                var bo = new CiudadBO(globales, BD);
                var response = bo.ObtenerCiudades();
                return response;
            }
            catch (Exception e)
            {
                var response = new GenericResponse<List<ObtenerCiudadDTO>>
                {
                    Success = false,
                    Message = "Error fatal en el controlador de Ciudad.",
                    Error = e.Message
                };
                // (Tu método de log de BaseController)
                AgregarEntradaBitacora(e, "GET /api/Ciudad/Listar", JsonSerializer.Serialize(response));
                return response;
            }
        }
    }
}