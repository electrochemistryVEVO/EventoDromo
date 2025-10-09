using EventodromoRest.Modelos;
using EventodromoRest.Modelos.Utiles;
using EventodromoRest.Negocio;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace EventodromoRest.Controllers
{
    [ApiController]
    [Route("/api/[controller]")]
    public class ClienteController (Globales.Globales globales, DBManager.DBManager BD) : BaseController
    {
        private readonly DBManager.DBManager BD = BD;
        private readonly Globales.Globales globales = globales;

        [HttpPost]
        [Route("/api/[controller]/[action]")]
        public GenericResponse<LoginResponse> AutenticarLoginCliente([FromBody] RequestAutenticarCliente request)
        {
            try
            {
                ValidarBody(request);
                var loginResponse = new ClienteBO(globales, BD)
                    .AutenticarCliente(request.Correo, request.Password);

                var response = new GenericResponse<LoginResponse>
                {
                    Success = loginResponse.success,
                    Message = loginResponse.success ? "Autenticación exitosa" : "Credenciales inválidas",
                    Error = null,
                    Data = loginResponse
                };

                return response;
            }
            catch (Exception e)
            {
                var response = new GenericResponse<LoginResponse>
                {
                    Success = false,
                    Message = null,
                    Error = e.Message,
                    Data = null
                };
                AgregarEntradaBitacora(e, JsonSerializer.Serialize(request), JsonSerializer.Serialize(response));
                return response;
            }
        }
        //sin esto no funciona el nuevo servicio
        [HttpPost]
        [Route("/api/[controller]/[action]")]
        public GenericResponse<SignUpResponse> InsertarClienteSignUp([FromBody] RequestSignUpCliente request)
        {
            try
            {
                ValidarBody(request);
                var signUpResponse = new ClienteBO(globales, BD)
                    .InsertarCliente(request);

                var response = new GenericResponse<SignUpResponse>
                {
                    Success = signUpResponse.success,
                    Message = signUpResponse.success ? "Insertar exitoso" : "Insertar inválido",
                    Error = null,
                    Data = signUpResponse
                };

                return response;
            }
            catch (Exception e)
            {
                var response = new GenericResponse<SignUpResponse>
                {
                    Success = false,
                    Message = null,
                    Error = e.Message,
                    Data = null
                };
                AgregarEntradaBitacora(e, JsonSerializer.Serialize(request), JsonSerializer.Serialize(response));
                return response;
            }
        }
        
    }
}
