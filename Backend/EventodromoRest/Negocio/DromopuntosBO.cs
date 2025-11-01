using EventodromoRest.Mappers;
using EventodromoRest.Modelos;
using EventodromoRest.Modelos.Utiles;

namespace EventodromoRest.Negocio
{
    public class DromopuntosBO(Globales.Globales globales, DBManager.DBManager DB)
    {
        // Campos privados para almacenar las dependencias inyectadas por el constructor.
        private readonly Globales.Globales _globales = globales;
        private readonly DBManager.DBManager _DB = DB;

        public GenericResponse<ResumenDromopuntosDTO> ObtenerResumenCompleto(int idCliente)
        {
            // 1. Validación de Entrada
            if (idCliente <= 0)
            {
                throw new ArgumentException("El ID del cliente no es válido.");
            }

            // 2. Placeholder de Seguridad (MUY IMPORTANTE A FUTURO)
            // Aquí deberías verificar que el 'idCliente' solicitado coincide con el
            // ID del usuario autenticado (que vendría de un token, por ejemplo).
            // int idClienteAutenticado = ... obtener desde el token ...;
            // if (idCliente != idClienteAutenticado)
            // {
            //     throw new UnauthorizedAccessException("No tienes permiso para ver esta información.");
            // }

            // Usamos los campos privados de la clase para instanciar el mapper.
            var dromopuntosMapper = new DromopuntosMapper(_globales, _DB);

            // Obtener los puntos por vencer
            List<PuntoPorVencerDTO> puntosPorVencer = dromopuntosMapper.ListarPuntosPorVencer(idCliente) ?? new List<PuntoPorVencerDTO>();

            // Calcular el total de puntos a partir de la lista de puntos por vencer.
            int totalPuntos = puntosPorVencer.Sum(p => p.Cantidad);

            // Obtener el historial de movimientos
            List<MovimientoDromopuntoDTO> movimientos = dromopuntosMapper.ListarMovimientosDromopuntos(idCliente) ?? new List<MovimientoDromopuntoDTO>();

            // 3. Lógica de Negocio Centralizada
            // Calculamos los días restantes aquí, en el backend.
            var ahora = DateTime.Now;
            foreach (var punto in puntosPorVencer)
            {
                punto.DiasRestantes = (int)Math.Ceiling((punto.FechaExpiracion - ahora).TotalDays);
            }

            // Construir la respuesta completa
            var resumen = new ResumenDromopuntosDTO
            {
                Total = totalPuntos,
                PorVencer = puntosPorVencer,
                // Ordenamos los movimientos aquí para que el frontend no tenga que hacerlo.
                Movimientos = movimientos.OrderByDescending(m => m.FechaMovimiento).ToList()
            };

            return new GenericResponse<ResumenDromopuntosDTO>
            {
                Success = true,
                Message = "Resumen de DromoPuntos obtenido correctamente.",
                Data = resumen,
                Error = null
            };
        }
    }
}
