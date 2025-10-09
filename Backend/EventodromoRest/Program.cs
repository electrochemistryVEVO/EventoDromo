using EventodromoRest.DBManager;
using EventodromoRest.Globales;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

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
builder.Services.AddSwaggerGen();

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
    app.UseSwagger();
    app.UseSwaggerUI();
}

<<<<<<< HEAD
// AGREGAR USO DE CORS - Esto también es necesario
=======
// AGREGAR USO DE CORS - Esto tambiÃ©n es necesario
>>>>>>> 4257796 (todo funciona el login con docker)
app.UseCors("AllowAll");

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();