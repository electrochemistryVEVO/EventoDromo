using EventodromoRest.Mappers;
using EventodromoRest.Modelos;
using EventodromoRest.Modelos.Utiles;
using Microsoft.IdentityModel.Tokens;
using System.Collections.Generic;
using System.Linq;

namespace EventodromoRest.Negocio
{
    public class CarritoBO(Globales.Globales globales, DBManager.DBManager DB)
    {
        public GenericResponse<ResponseObtenerCarrito> ObtenerCarrito(int idCliente)
        {
            var carritoMapper = new CarritoMapper(globales, DB);
            var carrito = carritoMapper.ObtenerCarrito(idCliente);
            var response = TransformarCarrito(carrito);

            return new GenericResponse<ResponseObtenerCarrito>
            {
                Success = true,
                Message = "Carrito obtenido correctamente",
                Error = null,
                Data = response
            };
        }

        public GenericResponse<ResponseObtenerCarrito> AgregarItemAlCarrito(int idCliente, RequestAgregarItemAlCarrito request)
        {
            var carritoMapper = new CarritoMapper(globales, DB);
            var carrito = carritoMapper.AgregarItemAlCarrito(idCliente, request);
            var response = TransformarCarrito(carrito);

            return new GenericResponse<ResponseObtenerCarrito>
            {
                Success = true,
                Message = "Item agregado correctamente",
                Error = null,
                Data = response
            };
        }

        private ResponseObtenerCarrito TransformarCarrito(List<ObtenerCarritoDTO> carrito)
        {
            // Si la lista de la base de datos es nula o vacía, devolvemos null.
            if (carrito.IsNullOrEmpty())
            {
                return null;
            }

            var response = new ResponseObtenerCarrito
            {
                idCarrito = carrito[0].idCarrito,
                fechaExpiracion = carrito[0].fechaExpiracion,
                eventos = new List<EventoCarritoDTO>() // Inicializamos la lista de eventos
            };

            // Agrupamos todas las entradas por el ID del evento
            var gruposPorEvento = carrito.GroupBy(item => item.eventoInfo.idEvento);

            foreach (var grupo in gruposPorEvento)
            {
                var primerItemDelGrupo = grupo.First();

                // Creamos el DTO para el evento
                var eventoDto = new EventoCarritoDTO
                {
                    idEvento = primerItemDelGrupo.eventoInfo.idEvento,
                    nombreEvento = primerItemDelGrupo.eventoInfo.nombreEvento,
                    imagenURL = primerItemDelGrupo.eventoInfo.imagenURL,
                    localInfo = primerItemDelGrupo.localInfo,
                    funcionInfo = primerItemDelGrupo.funcionInfo,
                    entradas = new List<EntradaDTO>() // Inicializamos la lista de entradas para este evento
                };

                // Iteramos sobre cada entrada dentro del grupo del evento
                foreach (var item in grupo)
                {
                    var entrada = item.entrada;
                    var nuevaEntrada = new EntradaDTO
                    {
                        idEntrada = entrada.idEntrada,
                        idTipoEntrada = entrada.idTipoEntrada,
                        nombreTipoEntrada = entrada.nombreTipoEntrada,
                        precio = entrada.precio,
                        limiteCompra = entrada.limiteCompra,
                        puntos = entrada.puntos
                    };

                    eventoDto.entradas.Add(nuevaEntrada);
                    eventoDto.totalEvento += nuevaEntrada.precio; // Sumamos al total del evento
                    response.totalCarrito += nuevaEntrada.precio; // Sumamos al total general del carrito
                }
                response.eventos.Add(eventoDto);
            }

            return response;
        }

        public GenericResponse<ResponseObtenerCarrito> EliminarItemDelCarrito(int idCliente, int idEntrada)
        {
            var carritoMapper = new CarritoMapper(globales, DB);
            var carrito = carritoMapper.EliminarItemDelCarrito(idCliente, idEntrada);
            var response = TransformarCarrito(carrito);

            return new GenericResponse<ResponseObtenerCarrito>
            {
                Success = true,
                Message = "Item eliminado correctamente.",
                Error = null,
                Data = response
            };
        }


        /// <summary>
        /// Sincroniza el carrito de un invitado con la base de datos, validando el stock.
        /// </summary>
        public GenericResponse<ResponseSincronizarCarrito> SincronizarCarrito(int idCliente, RequestSincronizarCarrito request)
        {
            var carritoMapper = new CarritoMapper(globales, DB);

            // 1. Llamamos al nuevo método del mapper, que devuelve el carrito y los items rechazados
            var (carritoData, rechazadosData) = carritoMapper.SincronizarCarrito(idCliente, request);

            // 2. Reutilizamos tu lógica existente para dar formato a la respuesta del carrito
            var carritoTransformado = TransformarCarrito(carritoData);

            // 3. Creamos el objeto de respuesta final que incluye ambas partes
            var responseData = new ResponseSincronizarCarrito
            {
                carrito = carritoTransformado,
                rechazados = rechazadosData
            };

            return new GenericResponse<ResponseSincronizarCarrito>
            {
                Success = true,
                Message = "Carrito sincronizado correctamente.",
                Data = responseData
            };
        }

        /// <summary>
        /// Limpia completamente el carrito de un usuario y libera el stock reservado.
        /// </summary>
        public GenericResponse<object> LimpiarCarrito(int idCliente)
        {
            var carritoMapper = new CarritoMapper(globales, DB);
            carritoMapper.LimpiarCarrito(idCliente);

            // Para esta operación, no necesitamos devolver datos, solo la confirmación.
            return new GenericResponse<object>
            {
                Success = true,
                Message = "Carrito limpiado correctamente.",
                Data = null
            };
        }


        public GenericResponse<ResponseObtenerCarrito> EliminarTipoEntradaDelCarrito(int idCliente, RequestEliminarTipoEntrada request)
        {
            if (request.TipoEntradaId <= 0)
            {
                throw new Exception("El ID del tipo de entrada es inválido");
            }

            var carritoMapper = new CarritoMapper(globales, DB);

            var carritoData = carritoMapper.EliminarTipoEntradaDelCarrito(idCliente, request.TipoEntradaId);

            var response = TransformarCarrito(carritoData);

            return new GenericResponse<ResponseObtenerCarrito>
            {
                Success = true,
                Message = "Grupo de entradas eliminado correctamente.",
                Error = null,
                Data = response
            };
        }
    }
}