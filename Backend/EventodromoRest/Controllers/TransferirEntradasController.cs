using EventodromoRest.Modelos;
using EventodromoRest.Modelos.Utiles;
using EventodromoRest.Negocio;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using System.Collections.Generic;

namespace EventodromoRest.Controllers
{
    [ApiController]
    [Route("/api/[controller]")]
    public class TransferirEntradasController (Globales.Globales globales, DBManager.DBManager BD) : BaseController
    {
        private readonly DBManager.DBManager BD = BD;
        private readonly Globales.Globales globales = globales;

        public class TransferRequestDto
        {
            public List<int>? EntradaIds { get; set; } // si null => transferir todas las entradas del cliente origen
        }

        [HttpPut]
        [Route("/api/[controller]/[action]/{idCliente}")]
        //ActualizarInformacionPersonal
        public GenericResponse<bool> TransferirEntradas([FromRoute] int idClienteOrigen, [FromRoute] int idClienteDestino, [FromBody] DatosCliente datosCliente)
        {
            try
            {
                if (datosCliente == null)
                {
                    throw new ArgumentNullException(nameof(datosCliente), "El cuerpo de la solicitud no puede estar vacío.");
                }
                // TODO: Validar que el idCliente del token (cuando lo tengas) 
                // coincida con el idCliente de la ruta.

                bool actualizacionExitosa = new ClienteBO(globales, BD).ActualizarInformacionPersonal(idClienteOrigen, datosCliente);

                if (!actualizacionExitosa)
                {
                    // Esto es un error de lógica de negocio, no una excepción
                    return new GenericResponse<bool>
                    {
                        Success = false,
                        Message = "No se pudo actualizar la información. Verifique los datos.",
                        Error = null,
                        Data = actualizacionExitosa
                    };
                }

                GenericResponse<bool> response = new GenericResponse<bool>
                {
                    Success = true,
                    Message = "Usuario actualizado correctamente",
                    Error = null,
                    Data = actualizacionExitosa 
                };

                return response;
            }
            catch (Exception ex)
            {
                var response = new GenericResponse<bool>
                {
                    Success = false,
                    Message = "Error inesperado en el servidor.",
                    Error = ex.Message,
                    Data = false
                };

                var requestLog = JsonSerializer.Serialize(new { IdCliente = idClienteOrigen, Body = datosCliente });
                AgregarEntradaBitacora(ex, requestLog, JsonSerializer.Serialize(response));

                return response;
            }
        }

        /// <summary>
        /// Reasigna las entradas del cliente origen al cliente destino.
        /// Si se envía EntradaIds solo se transfieren esas entradas; si no, se transfieren todas las entradas del cliente origen.
        /// </summary>
        //[HttpPost]
        //[Route("transferir/{idClienteOrigen}/{idClienteDestino}")]
        /*public GenericResponse<int> TransferirEntradas([FromRoute] int idClienteOrigen, [FromRoute] int idClienteDestino, [FromBody] TransferRequestDto? request)
        {
            try
            {
                if (idClienteOrigen <= 0 || idClienteDestino <= 0)
                    return new GenericResponse<int> { Success = false, Message = "IDs de cliente inválidos.", Data = 0 };

                if (idClienteOrigen == idClienteDestino)
                    return new GenericResponse<int> { Success = false, Message = "El cliente origen y destino deben ser diferentes.", Data = 0 };

                // usar capa de negocio (adaptar nombres de BO si difieren)
                var entradaBO = new EntradaBO(globales, BD);
                var carritoBO = new CarritoBO(globales, BD);

                List<Entrada> entradasToTransfer;

                if (request?.EntradaIds != null && request.EntradaIds.Any())
                {
                    entradasToTransfer = entradaBO.ObtenerPorIds(request.EntradaIds);
                }
                else
                {
                    // obtener todas las entradas que pertenecen a carritos del cliente origen
                    entradasToTransfer = entradaBO.ObtenerPorClienteOrigen(idClienteOrigen);
                }

                if (entradasToTransfer == null || !entradasToTransfer.Any())
                    return new GenericResponse<int> { Success = true, Message = "No hay entradas para transferir.", Data = 0 };

                int transferredCount = 0;

                foreach (var entrada in entradasToTransfer)
                {
                    // si la entrada tiene carrito y ese carrito pertenece al cliente origen, reasignamos el carrito
                    if (entrada.carrito != null && entrada.carrito.idCliente == idClienteOrigen)
                    {
                        entrada.carrito.idCliente = idClienteDestino;
                        carritoBO.Actualizar(entrada.carrito);
                        transferredCount++;
                        continue;
                    }

                    // si no queremos cambiar el carrito original (porque puede contener otras entradas), creamos uno nuevo para el destino
                    var nuevoCarrito = new Carrito
                    {
                        idCliente = idClienteDestino,
                        fechaCreacion = DateTime.UtcNow,
                        fechaExpiracion = DateTime.UtcNow.AddHours(2) // ajustar según reglas
                    };

                    var creado = carritoBO.Crear(nuevoCarrito);
                    if (creado == null)
                        continue;

                    entrada.idCarrito = creado.id;
                    entrada.carrito = creado;

                    entradaBO.Actualizar(entrada);
                    transferredCount++;
                }

                return new GenericResponse<int>
                {
                    Success = true,
                    Message = "Transferencia completada.",
                    Data = transferredCount
                };
            }
            catch (Exception ex)
            {
                var response = new GenericResponse<int>
                {
                    Success = false,
                    Message = "Error al transferir entradas.",
                    Error = ex.Message,
                    Data = 0
                };

                var requestLog = JsonSerializer.Serialize(new { idClienteOrigen, idClienteDestino, Request = request });
                AgregarEntradaBitacora(ex, requestLog, JsonSerializer.Serialize(response));

                return response;
            }
        }*/
    }
}
