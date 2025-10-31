using EventodromoRest.Modelos;
using EventodromoRest.Modelos.Utiles;
using EventodromoRest.Negocio;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace EventodromoRest.Controllers
{
    public class TransaccionControllercs(Globales.Globales globales, DBManager.DBManager BD) : BaseController
    {
        private readonly DBManager.DBManager BD = BD;
        private readonly Globales.Globales globales = globales;

        [HttpGet]
        [Route("/api/[controller]/[action]")]
        public GenericResponse<List<Transaccion>> ListarTransacciones()
        {
            try
            {
                return new TransaccionBO(globales, BD).ListarTransacciones();
            }
            catch (Exception e)
            {
                var response = new GenericResponse<List<Modelos.Transaccion>>
                {
                    Success = false,
                    Message = "Error interno del servidor.",
                    Data = null,
                    Error = e.Message
                };

                AgregarEntradaBitacora(e, "ListarTransacciones GET", JsonSerializer.Serialize(response));

                return response;
            }
        }

        [HttpGet]
        [Route("/api/[controller]/[action]/{idTransaccion}")]
        public GenericResponse<List<Entrada>> ListarEntradasPorTransaccion(int idTransaccion)
        {
            try
            {
                return new TransaccionBO(globales, BD).ListarEntradasPorTransaccion(idTransaccion);
            }
            catch (Exception e)
            {
                var response = new GenericResponse<List<Entrada>>
                {
                    Success = false,
                    Message = "Error interno del servidor.",
                    Data = null,
                    Error = e.Message
                };

                AgregarEntradaBitacora(e, $"ListarEntradasPorTransaccion GET id:{idTransaccion}", JsonSerializer.Serialize(response));

                return response;
            }
        }
    }
}
