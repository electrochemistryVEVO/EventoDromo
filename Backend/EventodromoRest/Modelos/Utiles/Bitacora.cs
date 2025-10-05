using System;
using System.IO;
using System.Text;

namespace EventodromoRest.Modelos.Utiles
{
    public class Bitacora
    {
        private readonly string _archivoBitacora;
        private static readonly object _locker = new();

        /// <summary>
        /// Crea una bitácora sobre el archivo indicado. Crea la carpeta si no existe.
        /// </summary>
        /// <param name="archivoBitacora">Ruta completa del archivo de bitácora.</param>
        public Bitacora(ref string archivoBitacora)
        {
            if (string.IsNullOrWhiteSpace(archivoBitacora))
                throw new ArgumentException("La ruta del archivo de bitácora es inválida.", nameof(archivoBitacora));

            var carpeta = Path.GetDirectoryName(archivoBitacora);
            if (!string.IsNullOrWhiteSpace(carpeta))
                Directory.CreateDirectory(carpeta);

            _archivoBitacora = archivoBitacora;
        }

        /// <summary>
        /// Agrega una línea a la bitácora. Si incluirFechaHora es true, antepone la marca temporal.
        /// </summary>
        public void AgregarEntradaBitacora(string mensaje, bool incluirFechaHora = true)
        {
            if (mensaje == null) mensaje = string.Empty;

            var sb = new StringBuilder();
            if (incluirFechaHora)
                sb.Append($"{DateTime.Now:yyyy-MM-dd HH:mm:ss.fff} | ");

            sb.AppendLine(mensaje);
            sb.AppendLine(new string('-', 80));

            lock (_locker)
            {
                File.AppendAllText(_archivoBitacora, sb.ToString(), Encoding.UTF8);
            }
        }

        /// <summary>
        /// Atajo para registrar una excepción usando el formateo estándar de BitacoraDepuracion.
        /// </summary>
        public void AgregarEntradaBitacora(Exception ex, string? contexto = null)
        {
            var detalle = BitacoraDepuracion.GestionExcepcion(ex, contexto);
            AgregarEntradaBitacora(detalle, true);
        }
    }
}
