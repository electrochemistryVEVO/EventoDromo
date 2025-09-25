using EventodromoRest.Entidades.Utiles;
using Microsoft.AspNetCore.Mvc;

namespace EventodromoRest.Controllers
{
    public class BaseController : ControllerBase
    {
        protected void ValidarBody(object body)
        {
            if (body == null)
            {
                throw new Exception("El cuerpo de la solicitud es inválido o no tiene el formato correcto.");
            }
        }

        protected void AgregarEntradaBitacora(Exception e, string request, string response)
        {
            try
            {
                string nombreCarpeta = string.Concat(Path.GetDirectoryName(typeof(BaseController).Assembly.Location), @$"\Bitacoras\", DateTime.Now.ToString("yyyyMM"));
                string archivoBitacora = string.Concat(nombreCarpeta, @"\Bitacora-", DateTime.Now.ToString("yyyyMMdd"), ".txt");
                Bitacora bitacora = new(ref archivoBitacora);
                string error = $"Request: {request}{Environment.NewLine}Response: {response}{Environment.NewLine}Mensaje: {BitacoraDepuracion.GestionExcepcion(e)}";
                bitacora.AgregarEntradaBitacora(error, true);
            }
            catch { }
            finally
            {
                BitacoraDepuracion.AgregarEntradaBitacoraYVisor(e);
            }
        }
    }
}
