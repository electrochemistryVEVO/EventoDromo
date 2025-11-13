using EventodromoRest.Mappers;
using EventodromoRest.Modelos;
using EventodromoRest.Modelos.Utiles;
using EventodromoRest.Negocio;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace EventodromoRest.Controllers
{
    [ApiController]
    [Route("/api/[controller]")]
    [Authorize]
    public class CarritoController(Globales.Globales globales, DBManager.DBManager BD) : BaseController
    {
        private readonly DBManager.DBManager BD = BD;
        private readonly Globales.Globales globales = globales;

        [HttpGet]
        [Route("/api/[controller]/[action]")]
        public GenericResponse<ResponseObtenerCarrito> ObtenerCarrito()
        {
            try
            {
                var userIdString = User.FindFirst("idCliente")?.Value;
                if (string.IsNullOrEmpty(userIdString) || !int.TryParse(userIdString, out int idCliente))
                {
                    throw new Exception("ID de cliente inválido en el token.");
                }
                return new CarritoBO(globales, BD).ObtenerCarrito(idCliente);
            }
            catch (Exception e)
            {
                var response = new GenericResponse<ResponseObtenerCarrito>
                {
                    Success = false,
                    Message = null,
                    Error = e.Message,
                    Data = null
                };
                AgregarEntradaBitacora(e, null, JsonSerializer.Serialize(response));
                return response;
            }
        }

        [HttpPost]
        [Route("/api/[controller]/[action]")]
        public GenericResponse<ResponseObtenerCarrito> AgregarItemAlCarrito([FromBody] RequestAgregarItemAlCarrito request)
        {
            try
            {
                ValidarBody(request);
                var userIdString = User.FindFirst("idCliente")?.Value;
                if (string.IsNullOrEmpty(userIdString) || !int.TryParse(userIdString, out int idCliente))
                {
                    throw new Exception("ID de cliente inválido en el token.");
                }
                return new CarritoBO(globales, BD).AgregarItemAlCarrito(idCliente, request);
            }
            catch (Exception e)
            {
                var response = new GenericResponse<ResponseObtenerCarrito>
                {
                    Success = false,
                    Message = null,
                    Error = e.Message,
                    Data = null
                };
                AgregarEntradaBitacora(e, JsonSerializer.Serialize(request), JsonSerializer.Serialize(response));
                return response;
            }
        }

        [HttpDelete]
        [Route("/api/[controller]/[action]/{idEntrada:int}")]
        public GenericResponse<ResponseObtenerCarrito> EliminarItemDelCarrito([FromRoute] int idEntrada)
        {
            try
            {
                var userIdString = User.FindFirst("idCliente")?.Value;
                if (string.IsNullOrEmpty(userIdString) || !int.TryParse(userIdString, out int idCliente))
                {
                    throw new Exception("ID de cliente inválido en el token.");
                }
                return new CarritoBO(globales, BD).EliminarItemDelCarrito(idCliente, idEntrada);
            }
            catch (Exception e)
            {
                var response = new GenericResponse<ResponseObtenerCarrito>
                {
                    Success = false,
                    Message = null,
                    Error = e.Message,
                    Data = null
                };
                AgregarEntradaBitacora(e, JsonSerializer.Serialize(idEntrada), JsonSerializer.Serialize(response));
                return response;
            }
        }


        /// <summary>
        /// Sincroniza el carrito de un invitado después de iniciar sesión.
        /// Valida el stock y devuelve el carrito final y los items rechazados.
        /// </summary>
        [HttpPost]
        [Route("/api/[controller]/[action]")] // Coincide con la ruta del frontend
        public GenericResponse<ResponseSincronizarCarrito> SincronizarCarrito([FromBody] RequestSincronizarCarrito request)
        {
            try
            {
                ValidarBody(request);
                var userIdString = User.FindFirst("idCliente")?.Value;
                if (string.IsNullOrEmpty(userIdString) || !int.TryParse(userIdString, out int idCliente))
                {
                    throw new Exception("ID de cliente inválido en el token.");
                }
                // Llama al nuevo método en la capa de negocio
                return new CarritoBO(globales, BD).SincronizarCarrito(idCliente, request);
            }
            catch (Exception e)
            {
                var response = new GenericResponse<ResponseSincronizarCarrito> { Success = false, Error = e.Message };
                AgregarEntradaBitacora(e, JsonSerializer.Serialize(request), JsonSerializer.Serialize(response));
                return response;
            }
        }

        /// <summary>
        /// Elimina todas las entradas del carrito del usuario actual y libera el stock.
        /// </summary>
        [HttpDelete]
        [Route("/api/[controller]/[action]")] // Coincide con la ruta del frontend
        public GenericResponse<object> LimpiarCarrito()
        {
            try
            {
                var userIdString = User.FindFirst("idCliente")?.Value;
                if (string.IsNullOrEmpty(userIdString) || !int.TryParse(userIdString, out int idCliente))
                {
                    throw new Exception("ID de cliente inválido en el token.");
                }
                // Llama al nuevo método en la capa de negocio
                return new CarritoBO(globales, BD).LimpiarCarrito(idCliente);
            }
            catch (Exception e)
            {
                var response = new GenericResponse<object> { Success = false, Error = e.Message };
                AgregarEntradaBitacora(e, null, JsonSerializer.Serialize(response));
                return response;
            }
        }

        // Archivo: Controllers/CarritoController.cs

        // ... (añade esto al final de la clase, antes del último '}')

        [HttpGet("TestInsertConTransaccion")]
        [AllowAnonymous] // Para que sea fácil de llamar sin token
        public IActionResult TestInsertConTransaccion()
        {
            try
            {
                Console.WriteLine("--- INICIANDO TEST DE INSERCIÓN CON TRANSACCIÓN ---");

                BD.BeginTransaction();
                Console.WriteLine("Transacción iniciada.");

                var carritoMapper = new CarritoMapper(globales, BD);
                var carritoDePrueba = new Carrito
                {
                    idCliente = 20, // Un ID de prueba que no exista
                    fechaCreacion = DateTime.Now,
                    fechaExpiracion = DateTime.Now.AddMinutes(1)
                };

                Console.WriteLine("Llamando a InsertarCarrito...");
                int nuevoId = carritoMapper.InsertarCarrito(carritoDePrueba);
                Console.WriteLine($"InsertarCarrito funcionó. Nuevo ID: {nuevoId}");

                BD.Rollback(); // ¡MUY IMPORTANTE! Deshacemos para no ensuciar la BD.
                Console.WriteLine("Rollback completado. Test exitoso.");

                return Ok($"Test exitoso. Se insertó y se hizo rollback del carrito con ID temporal: {nuevoId}");
            }
            catch (Exception e)
            {
                Console.WriteLine($"--- TEST FALLÓ: {e.Message} ---");
                // Si hay una transacción activa, asegúrate de hacer rollback
                try { BD.Rollback(); } catch { }
                return StatusCode(500, $"El test falló: {e.Message}\n{e.StackTrace}");
            }
        }

        [HttpDelete]
        [Route("/api/[controller]/[action]")]
        public GenericResponse<ResponseObtenerCarrito> EliminarTipoEntradaDelCarrito([FromBody] RequestEliminarTipoEntrada request)
        {
            try
            {
                ValidarBody(request);
                var userIdString = User.FindFirst("idCliente")?.Value;
                if (string.IsNullOrEmpty(userIdString) || !int.TryParse(userIdString, out int idCliente))
                {
                    throw new Exception("ID de cliente inválido en el token.");
                }
                return new CarritoBO(globales, BD).EliminarTipoEntradaDelCarrito(idCliente, request);
            }
            catch (Exception e)
            {
                var response = new GenericResponse<ResponseObtenerCarrito>
                {
                    Success = false,
                    Message = null,
                    Error = e.Message,
                    Data = null
                };
                AgregarEntradaBitacora(e, JsonSerializer.Serialize(request), JsonSerializer.Serialize(response));
                return response;
            }
        }
    }
}
