//para token
using EventodromoRest.Servicios;
using System.IdentityModel.Tokens.Jwt;


using EventodromoRest.Modelos;
using EventodromoRest.Modelos.Utiles;
using EventodromoRest.Negocio;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace EventodromoRest.Controllers
{
    [ApiController]
    [Route("/api/[controller]")]
    public class ClienteController (Globales.Globales globales, DBManager.DBManager BD, TokenService tokenService) : BaseController
    {
        private readonly DBManager.DBManager BD = BD;
        private readonly Globales.Globales globales = globales;
        private readonly TokenService tokenService = tokenService;

        [HttpPost]
        [Route("/api/[controller]/[action]")]
        public GenericResponse<LoginResponse> AutenticarLoginCliente([FromBody] RequestAutenticarCliente request)
        {
            try
            {
                ValidarBody(request);
                var loginResponse = new ClienteBO(globales, BD)
                    .AutenticarCliente(request.Correo, request.Password);

                if (!loginResponse.success)
                {
                    return new GenericResponse<LoginResponse>
                    {
                        Success = false,
                        Message = "Credenciales inválidas",
                        Error = null,
                        Data = null
                    };
                }

                // 🔐 Generar token JWT con el idCliente
                var token = tokenService.GenerarToken(loginResponse.idCliente);
                loginResponse.token = token; // Guarda el token en el response

                var response = new GenericResponse<LoginResponse>
                {
                    Success = true,
                    Message = "Autenticación exitosa",
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

        /* sin el token
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
        */
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

        [HttpGet]
        [Route("/api/[controller]/[action]")]
        public GenericResponse<DatosSignUp> ObtenerDatosSignUp()
        {
            try
            {
                var datos = new ClienteBO(globales, BD).ObtenerDatosSignUp();

                return new GenericResponse<DatosSignUp>
                {
                    Success = true,
                    Message = "Datos obtenidos correctamente",
                    Error = null,
                    Data = datos
                };
            }
            catch (Exception ex)
            {
                var response = new GenericResponse<DatosSignUp>
                {
                    Success = false,
                    Message = null,
                    Error = ex.Message,
                    Data = null
                };

                AgregarEntradaBitacora(ex, "{}", JsonSerializer.Serialize(response));
                return response;
            }
        }

        [HttpGet]
        [Route("/api/[controller]/[action]")]
        public GenericResponse<VerificarCorreoResponse> VerificarCorreoCliente(string email)
        {
            try
            {
                var rpta = new ClienteBO(globales, BD).verificarCorreoCliente(email);

                return new GenericResponse<VerificarCorreoResponse>
                {
                    Success = true,
                    Message = "Correo existe",
                    Error = null,
                    Data = rpta
                };
            }
            catch (Exception ex)
            {
                var response = new GenericResponse<VerificarCorreoResponse>
                {
                    Success = false,
                    Message = null,
                    Error = ex.Message,
                    Data = null
                };

                AgregarEntradaBitacora(ex, "{}", JsonSerializer.Serialize(response));
                return response;
            }
        }

        [HttpGet]
        [Route("/api/[controller]/[action]/{idCliente}")]
        public GenericResponse<InformacionPersonal> InformacionPersonal([FromRoute] int idCliente)
        {
            try
            {
                InformacionPersonal informacionPersonal = new ClienteBO(globales, BD).GetInformacionPersonal(idCliente);

                if (informacionPersonal == null)
                {
                    throw new Exception("No se encontró información para el cliente solicitado.");
                }

                GenericResponse<InformacionPersonal> response = new GenericResponse<InformacionPersonal>()
                {
                    Success = true,
                    Message = "Informacion personal cargada correctamente",
                    Data = informacionPersonal,
                    Error = null,
                };

                return response;
            }
            catch (Exception ex)
            {
                GenericResponse<InformacionPersonal> response = new GenericResponse<InformacionPersonal>()
                {
                    Success = false,
                    Message = null,
                    Data = null,
                    Error = ex.Message,
                };
                var requestLog = JsonSerializer.Serialize(new { IdCliente = idCliente });
                AgregarEntradaBitacora(ex, requestLog, JsonSerializer.Serialize(response));

                return response;
            }
        }

        [HttpPut]
        [Route("/api/[controller]/[action]/{idCliente}")]
        public GenericResponse<bool> ActualizarInformacionPersonal([FromRoute] int idCliente, [FromBody] DatosCliente datosCliente)
        {
            try
            {
                if (datosCliente == null)
                {
                    throw new ArgumentNullException(nameof(datosCliente), "El cuerpo de la solicitud no puede estar vacío.");
                }
                // TODO: Validar que el idCliente del token (cuando lo tengas) 
                // coincida con el idCliente de la ruta.

                bool actualizacionExitosa = new ClienteBO(globales, BD).ActualizarInformacionPersonal(idCliente, datosCliente);

                if (!actualizacionExitosa)
                {
                    // Esto es un error de lógica de negocio, no una excepción
                    return new GenericResponse<bool>
                    {
                        Success = false,
                        Message = "No se pudo actualizar la información. Verifique los datos.",
                        Error = null,
                        Data = actualizacionExitosa
                    };
                }

                GenericResponse<bool> response = new GenericResponse<bool>
                {
                    Success = true,
                    Message = "Usuario actualizado correctamente",
                    Error = null,
                    Data = actualizacionExitosa 
                };

                return response;
            }
            catch (Exception ex)
            {
                var response = new GenericResponse<bool>
                {
                    Success = false,
                    Message = "Error inesperado en el servidor.",
                    Error = ex.Message,
                    Data = false
                };

                var requestLog = JsonSerializer.Serialize(new { IdCliente = idCliente, Body = datosCliente });
                AgregarEntradaBitacora(ex, requestLog, JsonSerializer.Serialize(response));

                return response;
            }
        }
    }
}
