using Azure;
using Azure.Core;
using EventodromoRest.Mappers;
using EventodromoRest.Modelos;
using EventodromoRest.Modelos.Utiles;
using Microsoft.IdentityModel.Tokens;

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
                Message = "Carrito obtenido correctamente",
                Error = null,
                Data = response
            };
        }

        private ResponseObtenerCarrito TransformarCarrito(List<ObtenerCarritoDTO> carrito)
        {
            var response = new ResponseObtenerCarrito();

            if (!carrito.IsNullOrEmpty())
            {
                response.idCarrito = carrito[0].idCarrito;
                response.fechaExpiracion = carrito[0].fechaExpiracion;

                var listaEventos = new List<EventoCarritoDTO>();
                foreach (var item in carrito)
                {
                    var entrada = item.entrada;
                    var eventoExistente = listaEventos.FirstOrDefault(x => x.idEvento == entrada.idTipoEntrada);
                    if (eventoExistente == null)
                    {
                        eventoExistente = new EventoCarritoDTO
                        {
                            idEvento = item.eventoInfo.idEvento,
                            nombreEvento = item.eventoInfo.nombreEvento,
                            imagenURL = item.eventoInfo.imagenURL,
                            localInfo = item.localInfo,
                            funcionInfo = item.funcionInfo,
                            entradas = new List<EntradaDTO>()
                        };

                        var nuevaEntrada = new EntradaDTO
                        {
                            idEntrada = entrada.idEntrada,
                            idTipoEntrada = entrada.idTipoEntrada,
                            nombreTipoEntrada = entrada.nombreTipoEntrada,
                            precio = entrada.precio
                        };

                        eventoExistente.totalEvento += nuevaEntrada.precio;
                        eventoExistente.entradas.Add(nuevaEntrada);
                        listaEventos.Add(eventoExistente);
                    }
                    else
                    {
                        var nuevaEntrada = new EntradaDTO
                        {
                            idTipoEntrada = entrada.idTipoEntrada,
                            nombreTipoEntrada = entrada.nombreTipoEntrada,
                            precio = entrada.precio
                        };

                        eventoExistente.totalEvento += nuevaEntrada.precio;
                        eventoExistente.entradas.Add(nuevaEntrada);
                    }

                    response.totalCarrito += entrada.precio;
                }
                response.eventos = listaEventos;
            }
            else
            {
                response = null;
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
    }
}