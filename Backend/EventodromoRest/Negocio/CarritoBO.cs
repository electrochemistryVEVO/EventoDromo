using EventodromoRest.Mappers;
using EventodromoRest.Modelos;
using EventodromoRest.Modelos.Utiles;

namespace EventodromoRest.Negocio
{
    public class CarritoBO (Globales.Globales globales, DBManager.DBManager DB)
    {
        public GenericResponse<ResponseObtenerCarritoPorIdCliente> ObtenerCarritoPorIdCliente(RequestObtenerCarritoPorIdCliente request)
        {
            List<EntradaxCarritoDTO> listaEntradas = new List<EntradaxCarritoDTO>();

            var carritoMapper = new CarritoMapper(globales, DB);
            var entradaMapper = new EntradaMapper(globales, DB);
            var tipoEntradaMapper = new TipoEntradaMapper(globales, DB);
            var fechaEventoMapper = new FechaEventoMapper(globales, DB);
            var eventoMapper = new EventoMapper(globales, DB);
            var localMapper = new LocalMapper(globales, DB);

            var carrito = carritoMapper.ObtenerCarritoPorIdCliente(request.idCliente);
            List<Entrada> entradas = entradaMapper.ObtenerEntradasPorIdCarrito(carrito.id);
            foreach (Entrada e in entradas)
            {
                var entradaExistente = listaEntradas.FirstOrDefault(x => x.idEntrada == e.id);
                if (entradaExistente != null)
                {
                    entradaExistente.cantidad++;
                }
                else
                {
                    var nuevaEntrada = new EntradaxCarritoDTO();
                    var tipoEntrada = tipoEntradaMapper.ObtenerTipoEntradaPorId(e.idTipoEntrada);
                    nuevaEntrada.idEntrada = e.id;
                    nuevaEntrada.cantidad = 1;
                    nuevaEntrada.precio = tipoEntrada.precio;
                    var fechaEvento = fechaEventoMapper.ObtenerFechaEventoPorId(tipoEntrada.idFechaEvento);
                    var evento = eventoMapper.ObtenerEventoPorId(fechaEvento.idEvento);
                    nuevaEntrada.nombreEvento = evento.nombre;
                    nuevaEntrada.imagenURL = evento.imagenURL;
                    var local = localMapper.ObtenerLocalPorId(evento.idLocal);
                    nuevaEntrada.nombreLocal = local.nombre;
                    listaEntradas.Add(nuevaEntrada);
                }
            }

            var repsonse = new ResponseObtenerCarritoPorIdCliente
            {
                idCarrito = carrito.id,
                fechaCreacion = carrito.fechaCreacion,
                fechaExpiracion = carrito.fechaExpiracion,
                entradas = listaEntradas
            };

            var genericResponse = new GenericResponse<ResponseObtenerCarritoPorIdCliente>
            {
                Success = true,
                Message = "Carrito obtenido correctamente",
                Error = null,
                Data = repsonse
            };

            return genericResponse;
        }
    }
}
