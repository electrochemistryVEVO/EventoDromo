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
                response.localInfo = carrito[0].localInfo;
                response.eventoInfo = carrito[0].eventoInfo;
                response.funcionInfo = carrito[0].funcionInfo;
                response.fechaExpiracion = carrito[0].fechaExpiracion;
                response.entradas = new List<EntradaDTO>();

                foreach (var item in carrito)
                {
                    var entrada = item.entrada;
                    var existente = response.entradas.FirstOrDefault(x => x.idTipoEntrada == entrada.idTipoEntrada);
                    if (existente != null)
                    {
                        existente.cantidad += 1;
                    }
                    else
                    {
                        response.entradas.Add(new EntradaDTO
                        {
                            idTipoEntrada = entrada.idTipoEntrada,
                            nombreTipoEntrada = entrada.nombreTipoEntrada,
                            precio = entrada.precio,
                            cantidad = 1
                        });
                    }

                    response.totalCarrito += entrada.precio;
                }
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