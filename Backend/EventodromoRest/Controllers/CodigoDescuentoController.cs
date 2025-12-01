using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using EventodromoRest.Modelos;
using EventodromoRest.Modelos.Utiles;
using EventodromoRest.Negocio;

namespace EventodromoRest.Controllers
{
    [ApiController]
    [Route("/api/[controller]")]
    public class CodigoDescuentoController(Globales.Globales globales, DBManager.DBManager DB) : BaseController
    {
        private readonly DBManager.DBManager DB = DB;
        private readonly Globales.Globales globales = globales;
        /// <summary>
        /// Valida un código de descuento sin aplicarlo
        /// GET /CodigoDescuento/Validar?codigo=CYBER50&idCarrito=123
        /// </summary>
        [HttpGet("Validar")]
        public IActionResult ValidarCodigoDescuento([FromQuery] string codigo, [FromQuery] int? idCarrito)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(codigo))
                {
                    return BadRequest(new GenericResponse<object>
                    {
                        Success = false,
                        Message = "El código es requerido"
                    });
                }

                var promocionBO = new PromocionBO(globales, DB);
                var resultado = promocionBO.ValidarCodigo(codigo.Trim(), idCarrito);

                if (resultado.valido)
                {
                    return Ok(new GenericResponse<ResponseValidarPromocion>
                    {
                        Success = true,
                        Message = resultado.mensaje,
                        Data = resultado
                    });
                }
                else
                {
                    return Ok(new GenericResponse<ResponseValidarPromocion>
                    {
                        Success = false,
                        Message = resultado.mensaje,
                        Data = resultado
                    });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new GenericResponse<object>
                {
                    Success = false,
                    Message = "Error al validar el código",
                    Error = ex.Message
                });
            }
        }

        /// <summary>
        /// Aplica un código de descuento a un carrito
        /// POST /CodigoDescuento/Aplicar
        /// Body: { "codigo": "CYBER50", "idCarrito": 123 }
        /// </summary>
        [HttpPost("Aplicar")]
        [Authorize]
        public IActionResult AplicarCodigoDescuento([FromBody] AplicarCodigoRequest request)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(request.codigo))
                {
                    return BadRequest(new GenericResponse<object>
                    {
                        Success = false,
                        Message = "El código es requerido"
                    });
                }

                if (request.idCarrito <= 0)
                {
                    return BadRequest(new GenericResponse<object>
                    {
                        Success = false,
                        Message = "ID de carrito inválido"
                    });
                }

                // Obtener ID del cliente del token JWT
                var clienteIdClaim = User.FindFirst("idCliente")?.Value;
                if (string.IsNullOrEmpty(clienteIdClaim))
                {
                    return Unauthorized(new GenericResponse<object>
                    {
                        Success = false,
                        Message = "Usuario no autenticado"
                    });
                }

                var promocionBO = new PromocionBO(globales, DB);
                var resultado = promocionBO.AplicarCodigo(request.codigo.Trim(), request.idCarrito);

                if (resultado.exito)
                {
                    return Ok(new GenericResponse<ResponseAplicarPromocion>
                    {
                        Success = true,
                        Message = resultado.mensaje,
                        Data = resultado
                    });
                }
                else
                {
                    return Ok(new GenericResponse<ResponseAplicarPromocion>
                    {
                        Success = false,
                        Message = resultado.mensaje,
                        Data = resultado
                    });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new GenericResponse<object>
                {
                    Success = false,
                    Message = "Error al aplicar el código",
                    Error = ex.Message
                });
            }
        }

        /// <summary>
        /// Remueve el código de descuento de un carrito
        /// DELETE /CodigoDescuento/Remover/123
        /// </summary>
        [HttpDelete("Remover/{idCarrito}")]
        [Authorize]
        public IActionResult RemoverCodigoDescuento(int idCarrito)
        {
            try
            {
                if (idCarrito <= 0)
                {
                    return BadRequest(new GenericResponse<object>
                    {
                        Success = false,
                        Message = "ID de carrito inválido"
                    });
                }

                // Obtener ID del cliente del token JWT
                var clienteIdClaim = User.FindFirst("idCliente")?.Value;
                if (string.IsNullOrEmpty(clienteIdClaim))
                {
                    return Unauthorized(new GenericResponse<object>
                    {
                        Success = false,
                        Message = "Usuario no autenticado"
                    });
                }

                var promocionBO = new PromocionBO(globales, DB);
                var resultado = promocionBO.RemoverCodigo(idCarrito);

                return Ok(resultado);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new GenericResponse<object>
                {
                    Success = false,
                    Message = "Error al remover el código",
                    Error = ex.Message
                });
            }
        }
    }
}
