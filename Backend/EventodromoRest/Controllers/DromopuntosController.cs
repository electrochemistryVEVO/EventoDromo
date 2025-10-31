using EventodromoRest.Modelos;
using EventodromoRest.Modelos.Utiles;
using EventodromoRest.Negocio;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims; // Necesario para ClaimTypes
using System.Text.Json;

namespace EventodromoRest.Controllers
{
    [ApiController]
    [Route("/api/[controller]")]
    //[Authorize]
    public class DromopuntosController(Globales.Globales globales, DBManager.DBManager BD) : BaseController
    {
        private readonly DBManager.DBManager BD = BD;
        private readonly Globales.Globales globales = globales;

        [HttpGet]
        [Route("/api/[controller]/ObtenerResumen")] // La ruta ya no espera {idCliente} como parámetro
        public GenericResponse<ResumenDromopuntosDTO> ObtenerResumen() // El método ya no recibe idCliente como parámetro
        {
            int idClienteFromToken = 0; // Inicializamos a un valor inválido por defecto
            string? userIdString = null; // Para capturar el valor string del ID del token para el log

            try
            {
                // 1. Extraer el ID del cliente del token de autenticación.
                // El atributo [Authorize] ya ha validado el token y poblado el objeto User.
                // Asumimos que el claim que contiene el ID del cliente se llama "idCliente".
                // Si usas un claim estándar como ClaimTypes.NameIdentifier, cámbialo aquí.
                
                userIdString = User.FindFirst("idCliente")?.Value;

                if (string.IsNullOrEmpty(userIdString) || !int.TryParse(userIdString, out idClienteFromToken))
                {
                    // Si el ID no se encuentra o no es un entero válido en el token,
                    // esto indica un problema con la configuración del token o la autenticación.
                    throw new UnauthorizedAccessException("ID de cliente no encontrado o inválido en el token de autenticación.");
                }
                
                // 2. Instanciamos el Business Object (BO) que contiene la lógica de negocio.
                var dromopuntosBO = new DromopuntosBO(globales, BD);
                // 3. Llamamos al método del BO para obtener el resumen completo, usando el ID extraído del token.
                return dromopuntosBO.ObtenerResumenCompleto(idClienteFromToken);
                //return dromopuntosBO.ObtenerResumenCompleto(3);
            }
            catch (Exception e)
            {
                // 3. Si algo falla, creamos una respuesta de error estandarizada.
                var response = new GenericResponse<ResumenDromopuntosDTO>
                {
                    Success = false,
                    Message = "Error al obtener el resumen de DromoPuntos.",
                    Data = null,
                    Error = e.Message
                };

                // 4. Registramos el error en la bitácora para futura revisión, usando el ID del token si se obtuvo.
                // Si idClienteFromToken es 0, significa que no se pudo parsear, usamos el userIdString original o "N/A".
                var requestLog = JsonSerializer.Serialize(new { IdCliente = idClienteFromToken != 0 ? idClienteFromToken.ToString() : (userIdString ?? "N/A") });
                AgregarEntradaBitacora(e, requestLog, JsonSerializer.Serialize(response));

                return response;
            }
        }
    }
}