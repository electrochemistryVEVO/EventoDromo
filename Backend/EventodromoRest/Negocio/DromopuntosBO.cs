using EventodromoRest.Mappers;
using EventodromoRest.Modelos;
using EventodromoRest.Modelos.Utiles;
using System.Linq; // <-- ASEGÚRATE DE AÑADIR ESTO

namespace EventodromoRest.Negocio
{
    public class DromopuntosBO(Globales.Globales globales, DBManager.DBManager DB)
    {
        private readonly Globales.Globales _globales = globales;
        private readonly DBManager.DBManager _DB = DB;

        public GenericResponse<ResumenDromopuntosDTO> ObtenerResumenCompleto(int idCliente)
        {
            if (idCliente <= 0)
            {
                throw new ArgumentException("El ID del cliente no es válido.");
            }

            // 1. Instanciar el mapper
            var dromopuntosMapper = new DromopuntosMapper(_globales, _DB);

            // 2. Llamar al ÚNICO método optimizado
            ResumenDromopuntosDTO resumen = dromopuntosMapper.ObtenerResumenCompletoSQL(idCliente);

            // 3. Procesar los resultados en C# (súper rápido)

            // Calcular el total
            resumen.Total = resumen.PorVencer.Sum(p => p.Cantidad);

            // Calcular días restantes
            var ahora = DateTime.Now;
            foreach (var punto in resumen.PorVencer)
            {
                punto.DiasRestantes = (int)Math.Ceiling((punto.FechaExpiracion - ahora).TotalDays);
            }

            // Ordenar las listas
            resumen.PorVencer = resumen.PorVencer.OrderBy(p => p.FechaExpiracion).ToList();
            resumen.Movimientos = resumen.Movimientos.OrderByDescending(m => m.FechaMovimiento).ToList();

            // 4. Devolver la respuesta
            return new GenericResponse<ResumenDromopuntosDTO>
            {
                Success = true,
                Message = "Resumen de DromoPuntos obtenido correctamente.",
                Data = resumen,
                Error = null
            };
        }

        public decimal? ObtenerValorActual()
        {
            var dromopuntosMapper = new DromopuntosMapper(_globales, _DB);
            return dromopuntosMapper.ObtenerValorActual();
        }

        public GenericResponse<object> ActualizarValorDromoPuntos(decimal nuevoValor)
        {
            var dromopuntosMapper = new DromopuntosMapper(_globales, _DB);
            int filasAfectadas = dromopuntosMapper.ActualizarValorDromoPuntos(nuevoValor);
            decimal valorActualizado = 0;
            if (filasAfectadas > 0)
            {
                valorActualizado = nuevoValor;
            }
            else
            {
                valorActualizado = -1;
            }
            return new GenericResponse<object>
            {
                Success = true,
                Message = "Configuración de DromoPuntos actualizada exitosamente.",
                Data = new { valorEnSoles = valorActualizado },
                Error = null
            };
        }

    }
}