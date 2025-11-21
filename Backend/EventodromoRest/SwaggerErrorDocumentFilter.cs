using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;

public class SwaggerErrorDocumentFilter : IDocumentFilter
{
    public void Apply(OpenApiDocument swaggerDoc, DocumentFilterContext context)
    {
        // Este filtro ayuda a identificar errores en la generación de Swagger
        // Si hay problemas, Swagger intentará continuar en lugar de fallar completamente
        
        try
        {
            // Intenta validar el documento
            var schemas = swaggerDoc.Components?.Schemas;
            if (schemas != null)
            {
                Console.WriteLine($"[Swagger] Generando documentación con {schemas.Count} esquemas");
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[Swagger ERROR] {ex.Message}");
            Console.WriteLine($"[Swagger ERROR] StackTrace: {ex.StackTrace}");
        }
    }
}
