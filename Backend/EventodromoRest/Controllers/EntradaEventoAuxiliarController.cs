using EventodromoRest.Modelos;
using EventodromoRest.Modelos.Utiles;
using EventodromoRest.Negocio;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace EventodromoRest.Controllers
{
    public class EntradaEventoAuxiliarController(Globales.Globales globales, DBManager.DBManager BD) : BaseController
    {
        private readonly DBManager.DBManager BD = BD;
        private readonly Globales.Globales globales = globales;

        [HttpGet]
        [Route("/api/[controller]/[action]")]
        public GenericResponse<List<EntradaEventoAuxiliar>> ListarTodasLasEntradas()
        {
            try
            {
                var entradaBO = new EntradaBO(globales, BD);
                return entradaBO.ListarTodasLasEntradasEventoAuxiliar();
            }
            catch (Exception e)
            {
                var response = new GenericResponse<List<EntradaEventoAuxiliar>>
                {
                    Success = false,
                    Message = null,
                    Data = null,
                    Error = e.Message
                };
                AgregarEntradaBitacora(e, "Listar todas las entradas request", JsonSerializer.Serialize(response));
                return response;
            }
        }
    }
}