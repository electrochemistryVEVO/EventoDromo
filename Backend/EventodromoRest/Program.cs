//con esto se hace el token (JWT)
using EventodromoRest.DBManager;
using EventodromoRest.Globales;
using EventodromoRest.Servicios;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

//PARA EL TOKEN: 
// 🔐 Configuración de autenticación con JWT
var key = Encoding.ASCII.GetBytes("ClaveSuperSecretaDeEventodromoConLaQueSeFirmanTokens123!"); // 🔑 Usa algo más largo y seguro

//Le dice a ASP.NET Core:
//“Cuando alguien acceda a una ruta que requiera autenticación (`[Authorize]`), usa el esquema de autenticación **JWT Bearer**.”
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false; // Solo para desarrollo, en producción debe ser true
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters //Le explica al backend **cómo validar un token recibido**:
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ValidateIssuer = false,
        ValidateAudience = false
    };
});


// AGREGAR CORS - Esto es lo que necesitas
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    // Ignorar tipos de AWS SDK que causan problemas con Swagger
    options.IgnoreObsoleteActions();
    options.IgnoreObsoleteProperties();
    
    // Configurar el generador de esquemas para evitar conflictos
    options.CustomSchemaIds(type => 
    {
        try 
        {
            return type.FullName?.Replace("+", ".") ?? type.Name;
        }
        catch 
        {
            return type.Name;
        }
    });
    
    // Soporte para IFormFile y file uploads
    options.MapType<IFormFile>(() => new Microsoft.OpenApi.Models.OpenApiSchema
    {
        Type = "string",
        Format = "binary"
    });
    
    // Filtrar tipos de AWS SDK
    options.SchemaFilter<SwaggerExcludeFilter>();
    
    // Agregar un filtro para documentos que capture excepciones
    options.DocumentFilter<SwaggerErrorDocumentFilter>();
});

// Inyectar servicios propios
builder.Services.AddDbContext<DBManager>(options =>
{
    var cs = builder.Configuration.GetConnectionString("DefaultConnection");

    // SQL
    //options.UseSqlServer(cs);

    //MySQL
    options.UseMySql(builder.Configuration.GetConnectionString("DefaultConnection"), ServerVersion.AutoDetect(cs));
});

Globales globales = new Globales();
builder.Services.AddSingleton(globales);

// Registrar TokenService para inyección de dependencias
builder.Services.AddSingleton<TokenService>(
    new TokenService("ClaveSuperSecretaDeEventodromoConLaQueSeFirmanTokens123!")
);

// Registrar S3Service
builder.Services.AddSingleton<IS3Service, S3Service>();

// Registrar EmailService
builder.Services.AddScoped<EmailService>();

var app = builder.Build();



using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<DBManager>();
    if (!dbContext.Database.CanConnect())
    {
        throw new NotImplementedException("No se pudo conectar a la BD.");
    }
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    // Agregar middleware para capturar errores de Swagger
    app.Use(async (context, next) =>
    {
        try
        {
            await next();
        }
        catch (Exception ex)
        {
            if (context.Request.Path.StartsWithSegments("/swagger"))
            {
                Console.WriteLine($"[SWAGGER ERROR] {ex.GetType().Name}: {ex.Message}");
                Console.WriteLine($"[SWAGGER ERROR] Inner: {ex.InnerException?.Message}");
                Console.WriteLine($"[SWAGGER ERROR] Stack: {ex.StackTrace}");
            }
            throw;
        }
    });
    
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseRouting();
// AGREGAR USO DE CORS - Esto también es necesario
app.UseCors("AllowAll");

//app.UseHttpsRedirection();

//PARA EL TOKEN
app.UseAuthentication();


app.UseAuthorization();


app.MapControllers();

app.Run();