//para token
using EventodromoRest.Mappers;
using EventodromoRest.Modelos;
using EventodromoRest.Modelos.Utiles;
using EventodromoRest.Negocio;
using EventodromoRest.Servicios;
using EventodromoRest.Servicios;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens.Jwt;
using System.IdentityModel.Tokens.Jwt;
using System.Text.Json;

namespace EventodromoRest.Controllers
{
    [ApiController]
    [Route("/api/[controller]")]
    public class ClienteController (Globales.Globales globales, DBManager.DBManager BD, TokenService tokenService, EmailService emailService, IConfiguration configuration) : BaseController
    {
        private readonly DBManager.DBManager BD = BD;
        private readonly Globales.Globales globales = globales;
        private readonly TokenService tokenService = tokenService;
        private readonly EmailService _emailService = emailService;
        private readonly IConfiguration _configuration = configuration;


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

                var token = tokenService.GenerarToken(loginResponse.idCliente);
                loginResponse.token = token;

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
        public GenericResponse<InformacionPersonal> InformacionPersonal()
        {
            try
            {
                // 1. Obtenemos el ID del token de forma segura
                int idCliente = _ObtenerIdClienteDesdeToken();

                // 2. Llama al BO con el ID del token
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
                // ... (tu 'catch' sigue funcionando igual) ...
                GenericResponse<InformacionPersonal> response = new GenericResponse<InformacionPersonal>()
                {
                    Success = false,
                    Message = null,
                    Data = null,
                    Error = ex.Message,
                };
                var requestLog = JsonSerializer.Serialize(new { AuthToken = "Bearer ..." });
                AgregarEntradaBitacora(ex, requestLog, JsonSerializer.Serialize(response));
                return response;
            }
        }


        [HttpGet]
        [Route("/api/[controller]/[action]/{email}")]
        public GenericResponse<Cliente> ObtenerPorEmail(string email)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(email))
                {
                    throw new Exception("El email es requerido");
                }

                var clienteMapper = new ClienteMapper(globales, BD);
                var cliente = clienteMapper.ObtenerClientePorEmail(email);

                if (cliente == null)
                {
                    return new GenericResponse<Cliente>
                    {
                        Success = false,
                        Message = "Cliente no encontrado",
                        Error = "No existe un cliente con ese correo electrónico",
                        Data = null
                    };
                }

                return new GenericResponse<Cliente>
                {
                    Success = true,
                    Message = "Cliente encontrado",
                    Error = null,
                    Data = cliente
                };
            }
            catch (Exception ex)
            {
                var response = new GenericResponse<Cliente>
                {
                    Success = false,
                    Message = null,
                    Error = ex.Message,
                    Data = null
                };
                AgregarEntradaBitacora(ex, JsonSerializer.Serialize(new { email }), JsonSerializer.Serialize(response));
                return response;
            }
        }

        [HttpPut]
        [Route("/api/[controller]/[action]")]
        public GenericResponse<bool> ActualizarInformacionPersonal([FromBody] DatosCliente datosCliente)
        {
            try
            {
                int idCliente = _ObtenerIdClienteDesdeToken();

                if (datosCliente == null)
                {
                    throw new ArgumentNullException(nameof(datosCliente), "El cuerpo de la solicitud no puede estar vacío.");
                }

                bool actualizacionExitosa = new ClienteBO(globales, BD).ActualizarInformacionPersonal(idCliente, datosCliente);

                if (!actualizacionExitosa)
                {
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

                var requestLog = JsonSerializer.Serialize(new { Body = datosCliente });
                AgregarEntradaBitacora(ex, requestLog, JsonSerializer.Serialize(response));

                return response;
            }
        }

        [HttpPost]
        [Route("/api/[controller]/[action]")]
        public GenericResponse<VerificarContrasenaRecuperarResponse> VerificarContrasenaRecuperar([FromBody] RequestVerificarContrasenaRecuperar request)
        {
            try
            {
                // 1️⃣ Validar el body
                ValidarBody(request);

                // 2️⃣ Obtener el token del encabezado Authorization
                var authHeader = Request.Headers["Authorization"].ToString();
                if (string.IsNullOrEmpty(authHeader) || !authHeader.StartsWith("Bearer "))
                {
                    return new GenericResponse<VerificarContrasenaRecuperarResponse>
                    {
                        Success = false,
                        Message = "Token no proporcionado o inválido.",
                        Error = null,
                        Data = null
                    };
                }

                var token = authHeader.Substring("Bearer ".Length);

                // 3️⃣ Validar el token y obtener el ID del cliente
                int? idCliente = tokenService.ObtenerIdDesdeToken(token);
                if (idCliente == null)
                {
                    return new GenericResponse<VerificarContrasenaRecuperarResponse>
                    {
                        Success = false,
                        Message = "Token inválido o expirado.",
                        Error = null,
                        Data = null
                    };
                }

                // 4️⃣ Lógica de negocio: verificar contraseña
                var verificarResponse = new ClienteBO(globales, BD)
                    .VerificarContrasenaRecuperar(idCliente.Value, request.currentPassword);

                // 5️⃣ Responder según el resultado
                if (verificarResponse.status != "success")
                {
                    return new GenericResponse<VerificarContrasenaRecuperarResponse>
                    {
                        Success = false,
                        Message = verificarResponse.message, // "La contraseña actual es incorrecta. Intente de nuevo."
                        Error = null,
                        Data = verificarResponse
                    };
                }

                // 6️⃣ Éxito
                return new GenericResponse<VerificarContrasenaRecuperarResponse>
                {
                    Success = true,
                    Message = verificarResponse.message, // "Contraseña verificada correctamente."
                    Error = null,
                    Data = verificarResponse
                };
            }
            catch (Exception e)
            {
                var response = new GenericResponse<VerificarContrasenaRecuperarResponse>
                {
                    Success = false,
                    Message = "Error en el servidor.",
                    Error = e.Message,
                    Data = null
                };
                AgregarEntradaBitacora(e, JsonSerializer.Serialize(request), JsonSerializer.Serialize(response));
                return response;
            }
        }

        [HttpPost]
        [Route("/api/[controller]/[action]")]
        public GenericResponse<ActualizarContrasenaResponse> ActualizarContrasena([FromBody] RequestActualizarContrasena request)
        {
            try
            {
                // 1️⃣ Validar body
                ValidarBody(request);

                // 2️⃣ Obtener token del encabezado
                var authHeader = Request.Headers["Authorization"].ToString();
                if (string.IsNullOrEmpty(authHeader) || !authHeader.StartsWith("Bearer "))
                {
                    return new GenericResponse<ActualizarContrasenaResponse>
                    {
                        Success = false,
                        Message = "Token no proporcionado o inválido.",
                        Error = null,
                        Data = null
                    };
                }

                var token = authHeader.Substring("Bearer ".Length);

                // 3️⃣ Obtener idCliente desde token
                int? idCliente = tokenService.ObtenerIdDesdeToken(token);
                if (idCliente == null)
                {
                    return new GenericResponse<ActualizarContrasenaResponse>
                    {
                        Success = false,
                        Message = "Token inválido o expirado.",
                        Error = null,
                        Data = null
                    };
                }

                // 4️⃣ Lógica de negocio
                var response = new ClienteBO(globales, BD)
                    .ActualizarContrasena(idCliente.Value, request.newPassword);

                // 5️⃣ Si falla
                if (response.status!="success")
                {
                    return new GenericResponse<ActualizarContrasenaResponse>
                    {
                        Success = false,
                        Message = response.message,
                        Error = null,
                        Data = response
                    };
                }

                // 6️⃣ Éxito
                return new GenericResponse<ActualizarContrasenaResponse>
                {
                    Success = true,
                    Message = response.message,
                    Error = null,
                    Data = response
                };
            }
            catch (Exception e)
            {
                var response = new GenericResponse<ActualizarContrasenaResponse>
                {
                    Success = false,
                    Message = "Error en el servidor.",
                    Error = e.Message,
                    Data = null
                };

                AgregarEntradaBitacora(e, JsonSerializer.Serialize(request), JsonSerializer.Serialize(response));
                return response;
            }
        }

        [HttpGet]
        [Route("/api/[controller]/fetchUserData")]
        public GenericResponse<FetchUserDataResponse> FetchUserData()
        {
            try
            {
                // 1️⃣ Leer el token de la cabecera
                var authHeader = Request.Headers["Authorization"].ToString();

                if (string.IsNullOrEmpty(authHeader) || !authHeader.StartsWith("Bearer "))
                {
                    return new GenericResponse<FetchUserDataResponse>
                    {
                        Success = false,
                        Message = "Token no proporcionado o inválido.",
                        Error = null,
                        Data = new FetchUserDataResponse
                        {
                            status = "error",
                            message = "Token no proporcionado o inválido."
                        }
                    };
                }

                // 2️⃣ Extraer el token y obtener el ID del cliente
                var token = authHeader.Substring("Bearer ".Length);
                int? idCliente = tokenService.ObtenerIdDesdeToken(token);

                if (idCliente == null)
                {
                    return new GenericResponse<FetchUserDataResponse>
                    {
                        Success = false,
                        Message = "Token inválido o expirado.",
                        Error = null,
                        Data = new FetchUserDataResponse
                        {
                            status = "error",
                            message = "Token inválido o expirado."
                        }
                    };
                }

                // 3️⃣ Consultar el nombre del cliente
                var response = new ClienteBO(globales, BD).ObtenerNombrePorId(idCliente.Value);

                if (response.status!="success")
                {
                    return new GenericResponse<FetchUserDataResponse>
                    {
                        Success = false,
                        Message = "No se pudo obtener la información del usuario.",
                        Error = null,
                        Data = response
                    };
                }

                // 4️⃣ Éxito
                return new GenericResponse<FetchUserDataResponse>
                {
                    Success = true,
                    Message = "Usuario encontrado.",
                    Error = null,
                    Data = response
                };
            }
            catch (Exception e)
            {
                var response = new GenericResponse<FetchUserDataResponse>
                {
                    Success = false,
                    Message = "Error en el servidor.",
                    Error = e.Message,
                    Data = null
                };

                AgregarEntradaBitacora(e, "SinBody", JsonSerializer.Serialize(response));
                return response;
            }
        }


        [HttpGet]
        [Route("/api/[controller]/[action]")]
        public GenericResponse<DatosPersonalesDTO> GetMisDatosPersonales()
        {
            try
            {
                // 1. Leer el token de la cabecera (tu patrón existente)
                var authHeader = Request.Headers["Authorization"].ToString();
                if (string.IsNullOrEmpty(authHeader) || !authHeader.StartsWith("Bearer "))
                {
                    return new GenericResponse<DatosPersonalesDTO>
                    {
                        Success = false,
                        Message = "Token no proporcionado o inválido.",
                        Error = "Unauthorized"
                    };
                }

                // 2. Extraer el token y obtener el ID del cliente
                var token = authHeader.Substring("Bearer ".Length);
                int? idCliente = tokenService.ObtenerIdDesdeToken(token);

                if (idCliente == null)
                {
                    return new GenericResponse<DatosPersonalesDTO>
                    {
                        Success = false,
                        Message = "Token inválido o expirado.",
                        Error = "Unauthorized"
                    };
                }

                // 3. Llamar a la Capa de Negocio (BO)
                var clienteBO = new ClienteBO(globales, BD);
                DatosPersonalesDTO datos = clienteBO.ObtenerDatosPersonales(idCliente.Value);

                if (datos == null)
                {
                    return new GenericResponse<DatosPersonalesDTO>
                    {
                        Success = false,
                        Message = "No se encontró información para el cliente.",
                        Error = "Not Found"
                    };
                }

                // 4. Éxito
                return new GenericResponse<DatosPersonalesDTO>
                {
                    Success = true,
                    Message = "Datos personales obtenidos correctamente.",
                    Data = datos
                };
            }
            catch (Exception e)
            {
                var response = new GenericResponse<DatosPersonalesDTO>
                {
                    Success = false,
                    Message = "Error en el servidor.",
                    Error = e.Message
                };
                // "GetMisDatosPersonales (Token)" indica que la solicitud no tiene body, solo token
                AgregarEntradaBitacora(e, "GetMisDatosPersonales (Token)", JsonSerializer.Serialize(response));
                return response;
            }
        }

        /// <summary>
        /// Método auxiliar para leer el Header, validar el token
        /// y devolver el ID del cliente.
        /// Si el token es inválido, lanza una excepción.
        /// </summary>
        /// <returns>El ID (int) del cliente autenticado.</returns>
        private int _ObtenerIdClienteDesdeToken()
        {
            var authHeader = Request.Headers["Authorization"].ToString();
            if (string.IsNullOrEmpty(authHeader) || !authHeader.StartsWith("Bearer "))
            {
                // El 'catch' del endpoint principal manejará esta excepción
                throw new Exception("Token no proporcionado o inválido.");
            }

            var token = authHeader.Substring("Bearer ".Length);
            int? idCliente = tokenService.ObtenerIdDesdeToken(token);

            if (idCliente == null)
            {
                throw new Exception("Token inválido o expirado.");
            }

            // Devuelve el valor, no el 'int?'
            return idCliente.Value;
        }

        [HttpPost]
        [Route("/api/[controller]/[action]")]
        public GenericResponse<RecuperarContrasenaResponse> RecuperarContrasena([FromBody] RequestRecuperarContrasena request)
        {
            try
            {
                // 1. Validar request
                if (request == null || string.IsNullOrWhiteSpace(request.email))
                {
                    return new GenericResponse<RecuperarContrasenaResponse>
                    {
                        Success = false,
                        Message = "Solicitud inválida",
                        Data = null,
                        Error = "Debe proporcionar un email válido"
                    };
                }



                // 3. Buscar al usuario en BD
                var clienteBO = new ClienteBO(globales, BD);
                Cliente cliente = clienteBO.EncontrarClientePorEmail(request.email);

                if (cliente == null || cliente.id==null)
                {
                    return new GenericResponse<RecuperarContrasenaResponse>
                    {
                        Success = false,
                        Message = "El correo no está registrado",
                        Data = null,
                        Error = "No existe un usuario con este correo"
                    };
                }

                // 4. Generar token GUID único
                string tokenRecuperacion = Guid.NewGuid().ToString("N");

                // Obtener minutos de expiración desde configuración
                var dromopuntosMapper = new DromopuntosMapper(globales, BD);
                int minutosExpiracion = dromopuntosMapper.ObtenerMinutosExpiracionRecovery();

                // Determinar expiración según configuración
                DateTime fechaExpiracion = DateTime.Now.AddMinutes(minutosExpiracion);

                // 5. Registrar el token en BD
                var registro = new RecuperacionContrasenaPendiente
                {
                    ClienteId = cliente.id ?? 0,
                    Token = tokenRecuperacion,
                    FechaSolicitud = DateTime.Now,
                    FechaExpiracion = fechaExpiracion,
                    Usado = false
                };
                if (clienteBO.RegistrarRecuperarContrasenaPendiente(registro) == -1) //se guarda en la tabla RecuperarContrasenaPendiente el registro
                {
                    return new GenericResponse<RecuperarContrasenaResponse>
                    {
                        Success = false,
                        Message = "Error al RegistrarRecuperarContrasenaPendiente ",
                        Data = null,
                        Error = "NO se pudo RegistrarRecuperarContrasenaPendiente"
                    };
                }
                ;//se guarda en la tabla RecuperarContrasenaPendiente el registro

                // 6. Obtener URL base (frontend)
                string urlBase = _configuration["AppSettings:FrontendUrl"] ?? "http://localhost:3000";
                string urlFinal = $"{urlBase}/auth/recuperarContrasena?token={tokenRecuperacion}";

                // 7. Enviar email de forma asíncrona SIN bloquear la respuesta
                _ = Task.Run(async () =>
                {
                    try
                    {
                        // Formatear tiempo de expiración de forma amigable
                        string tiempoExpiracion;
                        if (minutosExpiracion >= 60)
                        {
                            int horas = minutosExpiracion / 60;
                            int minutosRestantes = minutosExpiracion % 60;
                            if (minutosRestantes == 0)
                            {
                                tiempoExpiracion = horas == 1 ? "1 hora" : $"{horas} horas";
                            }
                            else
                            {
                                tiempoExpiracion = $"{horas} hora{(horas > 1 ? "s" : "")} y {minutosRestantes} minuto{(minutosRestantes > 1 ? "s" : "")}";
                            }
                        }
                        else
                        {
                            tiempoExpiracion = minutosExpiracion == 1 ? "1 minuto" : $"{minutosExpiracion} minutos";
                        }

                        // HTML que quieres mostrar dentro del template (puede ser simple)
                        string cuerpoHtml = $@"
            <h3>Recuperación de contraseña</h3>
            <p>Haz clic en el enlace para continuar:</p>
            <a href='{urlFinal}'>{urlFinal}</a>
            <p>El enlace expirará en {tiempoExpiracion}.</p>
        ";

                        // Construimos el template usando las propiedades existentes en EmailTemplateData
                        var templateData = new EmailTemplateData
                        {
                            Titulo = "Recuperación de contraseña",
                            Emoji = "🔑",
                            MensajePrincipal = cuerpoHtml,
                            AlertaTipo = "info",
                            AlertaIcono = "⏰",
                            AlertaMensaje = $"El enlace expirará en {tiempoExpiracion}."
                        };

                        // Llamada correcta según la firma de tu EmailService
                        await _emailService.EnviarEmailGenericoAsync(
                            destinatario: request.email,
                            asunto: "🔑 Recuperación de contraseña - Eventodromo",
                            nombreDestinatario: $"{cliente?.nombres} {cliente?.apellidos}".Trim(),
                            templateData: templateData
                        );
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"⚠️ Error enviando email de recuperación: {ex.Message}");
                    }
                });




                // 8. Respuesta inmediata
                return new GenericResponse<RecuperarContrasenaResponse>
                {
                    Success = true,
                    Message = "Se ha enviado un correo con instrucciones.",
                    Data = new RecuperarContrasenaResponse
                    {
                        success = true
                    }
                };
            }
            catch (Exception e)
            {
                var response = new GenericResponse<RecuperarContrasenaResponse>
                {
                    Success = false,
                    Message = "Error en el servidor.",
                    Error = e.Message,
                    Data = null
                };

                AgregarEntradaBitacora(e, JsonSerializer.Serialize(request), JsonSerializer.Serialize(response));
                return response;
            }
        }

        [HttpPost]
        [Route("/api/[controller]/[action]")]
        public GenericResponse<RestablecerContrasenaResponse> RestablecerContrasena([FromBody] RequestRestablecerContrasena request)
        {
            try
            {
                // 1. Validar request
                if (request == null ||
                    string.IsNullOrWhiteSpace(request.token) ||
                    string.IsNullOrWhiteSpace(request.newPassword))
                {
                    return new GenericResponse<RestablecerContrasenaResponse>
                    {
                        Success = false,
                        Message = "Solicitud inválida",
                        Error = "Debe proporcionar token y nueva contraseña"
                    };
                }

                var clienteBO = new ClienteBO(globales, BD);

                // 2. Buscar el token en BD
                var registro = clienteBO.ObtenerRecuperarContrasenaPendientePorToken(request.token);

                if (registro == null)
                {
                    return new GenericResponse<RestablecerContrasenaResponse>
                    {
                        Success = false,
                        Message = "El enlace es inválido o ha expirado.",
                        Error = "Token no encontrado"
                    };
                }

                // 3. Validar expiración o si ya se usó
                if (registro.Usado == true || registro.FechaExpiracion < DateTime.Now)
                {
                    return new GenericResponse<RestablecerContrasenaResponse>
                    {
                        Success = false,
                        Message = "El enlace es inválido o ha expirado.",
                        Error = "Token usado o expirado"
                    };
                }

                // 4. Buscar usuario asociado
                var cliente = clienteBO.ReestablecerContrasenaEncontrarClientePorId(registro.ClienteId);
                if (cliente == null)
                {
                    return new GenericResponse<RestablecerContrasenaResponse>
                    {
                        Success = false,
                        Message = "No se encontró el usuario.",
                        Error = "ClienteId inválido en el token"
                    };
                }

                // 5. Hashear la nueva contraseña ESTO TODAVÍA NO SE VE, NO LO DESCOMENTEN NADIE LO HA PROBADO
                //string passwordHash = BCrypt.Net.BCrypt.HashPassword(request.newPassword);
                string passwordHash = request.newPassword; //Temporal mientras no se prueba el hash


                // 6. Actualizar contraseña
                if (!clienteBO.ReestablecerContrasenaActualizarContrasena(cliente.id.Value, passwordHash))
                {
                    return new GenericResponse<RestablecerContrasenaResponse>
                    {
                        Success = false,
                        Message = "No se pudo actualizar la contraseña.",
                        Error = "Error al guardar nueva contraseña"
                    };
                }

                // 7. Marcar token como usado
                clienteBO.ReestablecerContrasenaMarcarRecuperacionComoUsada(registro.Id);

                // 8. Respuesta final
                return new GenericResponse<RestablecerContrasenaResponse>
                {
                    Success = true,
                    Message = "Contraseña actualizada correctamente.",
                    Data = new RestablecerContrasenaResponse
                    {
                        success = true
                    }
                };
            }
            catch (Exception e)
            {
                var response = new GenericResponse<RestablecerContrasenaResponse>
                {
                    Success = false,
                    Message = "Error en el servidor.",
                    Error = e.Message
                };

                AgregarEntradaBitacora(e, JsonSerializer.Serialize(request), JsonSerializer.Serialize(response));
                return response;
            }
        }



    }
}
