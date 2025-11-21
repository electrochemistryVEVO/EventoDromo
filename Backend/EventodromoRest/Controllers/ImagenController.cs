using EventodromoRest.Servicios;
using Microsoft.AspNetCore.Mvc;

namespace EventodromoRest.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ImagenController : ControllerBase
    {
        private readonly IS3Service _s3Service;
        private readonly ILogger<ImagenController> _logger;

        public ImagenController(IS3Service s3Service, ILogger<ImagenController> logger)
        {
            _s3Service = s3Service;
            _logger = logger;
        }

        /// <summary>
        /// Sube una imagen a S3 y retorna la URL completa
        /// </summary>
        /// <param name="archivo">Archivo de imagen (IFormFile)</param>
        /// <param name="carpeta">Carpeta dentro del bucket (opcional, default: "uploads")</param>
        [HttpPost("subir")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> SubirImagen(IFormFile archivo, string carpeta = "uploads")
        {
            try
            {
                if (archivo == null || archivo.Length == 0)
                    return BadRequest(new { mensaje = "No se recibió ningún archivo" });

                // Subir a S3
                var rutaArchivo = await _s3Service.SubirImagenAsync(archivo, carpeta);
                var urlPublica = _s3Service.ObtenerUrlPublica(rutaArchivo);

                return Ok(new
                {
                    mensaje = "Imagen subida exitosamente",
                    ruta = rutaArchivo,        // Para guardar en BD
                    url = urlPublica           // Para mostrar en frontend
                });
            }
            catch (ArgumentException ex)
            {
                _logger.LogWarning(ex, "Validación fallida al subir imagen");
                return BadRequest(new { mensaje = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al subir imagen");
                return StatusCode(500, new { mensaje = "Error interno al subir la imagen", detalle = ex.Message });
            }
        }

        /// <summary>
        /// Elimina una imagen de S3
        /// </summary>
        /// <param name="rutaArchivo">Ruta del archivo en S3 (ej: "uploads/abc123.jpg")</param>
        [HttpDelete("eliminar")]
        public async Task<IActionResult> EliminarImagen([FromQuery] string rutaArchivo)
        {
            try
            {
                if (string.IsNullOrEmpty(rutaArchivo))
                    return BadRequest(new { mensaje = "La ruta del archivo es requerida" });

                var eliminado = await _s3Service.EliminarImagenAsync(rutaArchivo);

                if (eliminado)
                    return Ok(new { mensaje = "Imagen eliminada exitosamente" });
                
                return NotFound(new { mensaje = "No se pudo eliminar la imagen" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al eliminar imagen");
                return StatusCode(500, new { mensaje = "Error interno al eliminar la imagen" });
            }
        }

        /// <summary>
        /// Obtiene la URL pública de una imagen
        /// </summary>
        [HttpGet("url")]
        public IActionResult ObtenerUrl([FromQuery] string rutaArchivo)
        {
            if (string.IsNullOrEmpty(rutaArchivo))
                return BadRequest(new { mensaje = "La ruta del archivo es requerida" });

            var url = _s3Service.ObtenerUrlPublica(rutaArchivo);
            return Ok(new { url });
        }
    }
}
