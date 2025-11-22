using Amazon;
using Amazon.S3;
using Amazon.S3.Model;
using Amazon.Runtime;

namespace EventodromoRest.Servicios
{
    public interface IS3Service
    {
        Task<string> SubirImagenAsync(IFormFile archivo, string carpeta = "uploads");
        Task<bool> EliminarImagenAsync(string rutaArchivo);
        string ObtenerUrlPublica(string rutaArchivo);
    }

    public class S3Service : IS3Service
    {
        private readonly IAmazonS3 _s3Client;
        private readonly string _bucketName;
        private readonly ILogger<S3Service> _logger;

        public S3Service(IConfiguration configuration, ILogger<S3Service> logger)
        {
            _logger = logger;
            _bucketName = configuration["AWS:BucketName"] 
                ?? throw new ArgumentNullException("AWS:BucketName no configurado");

            var region = configuration["AWS:Region"] ?? "us-east-1";
            var accessKey = configuration["AWS:AccessKey"];
            var secretKey = configuration["AWS:SecretKey"];
            var sessionToken = configuration["AWS:SessionToken"];

            // Si hay credenciales explícitas, usarlas
            if (!string.IsNullOrEmpty(accessKey) && !string.IsNullOrEmpty(secretKey))
            {
                AWSCredentials credentials;
                
                if (!string.IsNullOrEmpty(sessionToken))
                {
                    // Credenciales temporales (con token de sesión)
                    credentials = new SessionAWSCredentials(accessKey, secretKey, sessionToken);
                }
                else
                {
                    // Credenciales permanentes
                    credentials = new BasicAWSCredentials(accessKey, secretKey);
                }

                _s3Client = new AmazonS3Client(credentials, RegionEndpoint.GetBySystemName(region));
            }
            else
            {
                // Usar credenciales del entorno (IAM role, variables de entorno, etc.)
                _s3Client = new AmazonS3Client(RegionEndpoint.GetBySystemName(region));
            }
        }

        /// <summary>
        /// Sube un archivo a S3 y retorna la ruta del archivo (sin la URL completa)
        /// </summary>
        public async Task<string> SubirImagenAsync(IFormFile archivo, string carpeta = "uploads")
        {
            if (archivo == null || archivo.Length == 0)
                throw new ArgumentException("El archivo está vacío");

            // Validar que sea una imagen
            var extensionesPermitidas = new[] { ".jpg", ".jpeg", ".png", ".gif", ".webp" };
            var extension = Path.GetExtension(archivo.FileName).ToLower();

            if (!extensionesPermitidas.Contains(extension))
                throw new ArgumentException($"Tipo de archivo no permitido. Solo se aceptan: {string.Join(", ", extensionesPermitidas)}");

            // Validar tamaño (máximo 5MB)
            const long maxSize = 5 * 1024 * 1024; // 5MB
            if (archivo.Length > maxSize)
                throw new ArgumentException("El archivo excede el tamaño máximo de 5MB");

            try
            {
                // Generar nombre único para evitar sobrescrituras
                var nombreUnico = $"{Guid.NewGuid()}{extension}";
                var rutaEnS3 = $"{carpeta}/{nombreUnico}";

                // Determinar Content-Type
                var contentType = archivo.ContentType;
                if (string.IsNullOrEmpty(contentType))
                {
                    contentType = extension switch
                    {
                        ".jpg" or ".jpeg" => "image/jpeg",
                        ".png" => "image/png",
                        ".gif" => "image/gif",
                        ".webp" => "image/webp",
                        _ => "application/octet-stream"
                    };
                }

                // Subir a S3
                using var stream = archivo.OpenReadStream();
                var putRequest = new PutObjectRequest
                {
                    BucketName = _bucketName,
                    Key = rutaEnS3,
                    InputStream = stream,
                    ContentType = contentType
                    // No usar CannedACL porque el bucket tiene ACLs deshabilitadas
                    // La accesibilidad pública se maneja mediante Bucket Policy
                };

                var response = await _s3Client.PutObjectAsync(putRequest);

                if (response.HttpStatusCode == System.Net.HttpStatusCode.OK)
                {
                    _logger.LogInformation($"Imagen subida exitosamente: {rutaEnS3}");
                    return rutaEnS3; // Retornar solo la ruta, no la URL completa
                }

                throw new Exception($"Error al subir imagen. Status: {response.HttpStatusCode}");
            }
            catch (AmazonS3Exception ex)
            {
                _logger.LogError(ex, "Error de S3 al subir imagen");
                throw new Exception($"Error de AWS S3: {ex.Message}");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error inesperado al subir imagen");
                throw;
            }
        }

        /// <summary>
        /// Elimina un archivo de S3
        /// </summary>
        public async Task<bool> EliminarImagenAsync(string rutaArchivo)
        {
            if (string.IsNullOrEmpty(rutaArchivo))
                return false;

            try
            {
                var deleteRequest = new DeleteObjectRequest
                {
                    BucketName = _bucketName,
                    Key = rutaArchivo
                };

                var response = await _s3Client.DeleteObjectAsync(deleteRequest);
                _logger.LogInformation($"Imagen eliminada: {rutaArchivo}");
                return response.HttpStatusCode == System.Net.HttpStatusCode.NoContent;
            }
            catch (AmazonS3Exception ex)
            {
                _logger.LogError(ex, $"Error al eliminar imagen: {rutaArchivo}");
                return false;
            }
        }

        /// <summary>
        /// Obtiene la URL pública de un archivo
        /// </summary>
        public string ObtenerUrlPublica(string rutaArchivo)
        {
            if (string.IsNullOrEmpty(rutaArchivo))
                return string.Empty;

            return $"https://{_bucketName}.s3.amazonaws.com/{rutaArchivo}";
        }
    }
}
