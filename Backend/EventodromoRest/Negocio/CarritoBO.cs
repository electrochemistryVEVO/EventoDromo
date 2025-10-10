using EventodromoRest.Mappers;
using EventodromoRest.Modelos;
using EventodromoRest.Modelos.Utiles;

namespace EventodromoRest.Negocio
{
    public class CarritoBO (Globales.Globales globales, DBManager.DBManager DB)
    {
        public GenericResponse<ResponseObtenerCarritoEventos> ObtenerCarritoEventos(RequestObtenerCarrito request)
        {
            List<EventoxCarritoDTO> listaEventos = new List<EventoxCarritoDTO>();

            var carritoMapper = new CarritoMapper(globales, DB);
            var entradaMapper = new EntradaMapper(globales, DB);
            var tipoEntradaMapper = new TipoEntradaMapper(globales, DB);
            var fechaEventoMapper = new FechaEventoMapper(globales, DB);
            var eventoMapper = new EventoMapper(globales, DB);
            var localMapper = new LocalMapper(globales, DB);

            var carrito = carritoMapper.ObtenerCarritoPorIdCliente(request.idCliente);

            if (carrito != null)
            {
                List<Entrada> entradas = entradaMapper.ObtenerEntradasPorIdCarrito(carrito.id);
                foreach (Entrada e in entradas)
                {
                    var tipoEntrada = tipoEntradaMapper.ObtenerTipoEntradaPorId(e.idTipoEntrada);
                    var fechaEvento = fechaEventoMapper.ObtenerFechaEventoPorId(tipoEntrada.idFechaEvento);
                    var evento = eventoMapper.ObtenerEventoPorId(fechaEvento.idEvento);

                    var eventoExistente = listaEventos.FirstOrDefault(x => x.idEvento == evento.id);
                    if (eventoExistente != null)
                    {
                        eventoExistente.cantidadTotal++;
                        eventoExistente.precioTotal += tipoEntrada.precio;
                    }
                    else
                    {
                        var nuevoEvento = new EventoxCarritoDTO();
                        nuevoEvento.idEvento = evento.id;
                        nuevoEvento.nombreEvento = evento.nombre;
                        nuevoEvento.cantidadTotal = 1;
                        nuevoEvento.precioTotal = tipoEntrada.precio;
                        var local = localMapper.ObtenerLocalPorId(evento.idLocal);
                        nuevoEvento.nombreLocal = local.nombre;
                        nuevoEvento.imagenURL = evento.imagenURL;
                        listaEventos.Add(nuevoEvento);
                    }
                }

                var repsonse = new ResponseObtenerCarritoEventos
                {
                    idCarrito = carrito.id,
                    idCliente = request.idCliente,
                    fechaCreacion = carrito.fechaCreacion,
                    fechaExpiracion = carrito.fechaExpiracion,
                    eventos = listaEventos
                };

                var genericResponse = new GenericResponse<ResponseObtenerCarritoEventos>
                {
                    Success = true,
                    Message = "Carrito obtenido correctamente",
                    Error = null,
                    Data = repsonse
                };

                return genericResponse;
            }
            else
            {
                var genericResponse = new GenericResponse<ResponseObtenerCarritoEventos>
                {
                    Success = true,
                    Message = "No hay carrito activo.",
                    Error = null,
                    Data = null
                };
                return genericResponse;
            }



        }

        public GenericResponse<ResponseObtenerCarritoEntradas> ObtenerCarritoEntradas(RequestObtenerCarrito request)
        {
            List<EntradaxCarritoDTO> listaEntradas = new List<EntradaxCarritoDTO>();

            var carritoMapper = new CarritoMapper(globales, DB);
            var entradaMapper = new EntradaMapper(globales, DB);
            var tipoEntradaMapper = new TipoEntradaMapper(globales, DB);
            var fechaEventoMapper = new FechaEventoMapper(globales, DB);
            var eventoMapper = new EventoMapper(globales, DB);
            var localMapper = new LocalMapper(globales, DB);

            var carrito = carritoMapper.ObtenerCarritoPorIdCliente(request.idCliente);

            if (carrito != null)
            {
                List<Entrada> entradas = entradaMapper.ObtenerEntradasPorIdCarrito(carrito.id);
                foreach (Entrada e in entradas)
                {
                    var tipoEntrada = tipoEntradaMapper.ObtenerTipoEntradaPorId(e.idTipoEntrada);
                    var entradaExistente = listaEntradas.FirstOrDefault(x => x.idTipoEntrada == tipoEntrada.id);

                    if (entradaExistente != null)
                    {
                        entradaExistente.cantidad++;
                    }
                    else
                    {
                        var nuevaEntrada = new EntradaxCarritoDTO();
                        nuevaEntrada.idTipoEntrada = tipoEntrada.id;
                        nuevaEntrada.nombreTipoEntrada = tipoEntrada.nombre;
                        nuevaEntrada.cantidad = 1;
                        nuevaEntrada.precio = tipoEntrada.precio;
                        var fechaEvento = fechaEventoMapper.ObtenerFechaEventoPorId(tipoEntrada.idFechaEvento);
                        var evento = eventoMapper.ObtenerEventoPorId(fechaEvento.idEvento);
                        nuevaEntrada.nombreEvento = evento.nombre;
                        nuevaEntrada.imagenURL = evento.imagenURL;
                        listaEntradas.Add(nuevaEntrada);
                    }
                }

                var response = new ResponseObtenerCarritoEntradas
                {
                    entradas = listaEntradas
                };

                var genericResponse = new GenericResponse<ResponseObtenerCarritoEntradas>
                {
                    Success = true,
                    Message = "Carrito obtenido correctamente",
                    Error = null,
                    Data = response
                };

                return genericResponse;
            }
            else
            {
                var genericResponse = new GenericResponse<ResponseObtenerCarritoEntradas>
                {
                    Success = true,
                    Message = "No hay carrito activo.",
                    Error = null,
                    Data = null
                };
                return genericResponse;
            }
        }
    }
}
