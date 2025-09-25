using EventodromoRest.Entidades.Utiles;
using System;
using System.Diagnostics;
using System.IO;
using System.Reflection;
using System.Text;

namespace EventodromoRest.Entidades.Utiles
{
    public static class BitacoraDepuracion
    {
        /// <summary>
        /// Devuelve un texto detallado (multi-línea) con tipo, mensaje y stacktrace de la excepción (incluye inners).
        /// </summary>
        public static string GestionExcepcion(Exception ex, string? contexto = null)
        {
            var sb = new StringBuilder();

            if (!string.IsNullOrWhiteSpace(contexto))
                sb.AppendLine($"[Contexto] {contexto}");

            int nivel = 0;
            for (var e = ex; e != null; e = e.InnerException, nivel++)
            {
                sb.AppendLine($"[Excepción {(nivel == 0 ? "principal" : $"inner {nivel}")}] {e.GetType().FullName}");
                sb.AppendLine($"[Mensaje] {e.Message}");
                if (e.Data != null && e.Data.Count > 0)
                {
                    sb.AppendLine("[Data]");
                    foreach (var key in e.Data.Keys)
                        sb.AppendLine($"  {key}: {e.Data[key]}");
                }
                if (!string.IsNullOrWhiteSpace(e.StackTrace))
                {
                    sb.AppendLine("[StackTrace]");
                    sb.AppendLine(e.StackTrace);
                }
                sb.AppendLine();
            }

            return sb.ToString().TrimEnd();
        }

        /// <summary>
        /// Registra la excepción en una bitácora general y la envía al "visor" (Debug/Trace/Console).
        /// No lanza excepciones si falla el log.
        /// </summary>
        public static void AgregarEntradaBitacoraYVisor(Exception ex, string? contexto = null)
        {
            var detalle = GestionExcepcion(ex, contexto);

            // 1) Escribir a una bitácora general (p. ej., Bitacoras\General\YYYYMM\Bitacora-YYYYMMDD.txt)
            try
            {
                var baseDir = Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location) ?? AppContext.BaseDirectory;
                var carpeta = Path.Combine(baseDir, "Bitacoras", "General", DateTime.Now.ToString("yyyyMM"));
                Directory.CreateDirectory(carpeta);
                var archivo = Path.Combine(carpeta, $"Bitacora-{DateTime.Now:yyyyMMdd}.txt");

                var refArchivo = archivo;
                var bitacora = new Bitacora(ref refArchivo);
                bitacora.AgregarEntradaBitacora(detalle, true);
            }
            catch
            {
                // swallow: la depuración no debe romper el flujo principal
            }

            // 2) "Visor": útil en desarrollo y para logs en contenedores (stdout/stderr)
            try { Debug.WriteLine(detalle); } catch { }
            try { Trace.WriteLine(detalle); } catch { }
            try { Console.Error.WriteLine(detalle); } catch { }
        }
    }
}
