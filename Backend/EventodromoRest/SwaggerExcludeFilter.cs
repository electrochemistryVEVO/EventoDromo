using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;

public class SwaggerExcludeFilter : ISchemaFilter
{
    public void Apply(OpenApiSchema schema, SchemaFilterContext context)
    {
        // Excluir tipos de AWS SDK y otros que causan problemas
        var typeFullName = context.Type.FullName ?? "";
        
        if (typeFullName.StartsWith("Amazon.") || 
            typeFullName.StartsWith("AWSSDK."))
        {
            // Marcar como obsoleto para que Swagger lo ignore
            schema.Deprecated = true;
        }
    }
}
