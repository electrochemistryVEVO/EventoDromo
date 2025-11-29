using EventodromoRest.Mappers;
using EventodromoRest.Modelos;
using System;

namespace EventodromoRest.Negocio
{
    public class ClienteBO(Globales.Globales globales, DBManager.DBManager DB)
    {
        public LoginResponse AutenticarCliente(string email, string password)
        {
            var mapper = new ClienteMapper(globales, DB);
            char tipoUsuario;
            int idCliente;
            Cliente cliente = mapper.ObtenerClientePorEmailPassword(email, password, out tipoUsuario,out idCliente);
            LoginResponse loginResponse = new LoginResponse
            {
                success = false,
                rol = ' ',
                idCliente = 0,//dps de token
                totalPuntos = 0
            };
            if (cliente != null)
            {
                var puntoMapper = new PuntoMapper(globales, DB);
                int totalPuntos = 0;

                if (tipoUsuario == 'C')
                {
                    totalPuntos = puntoMapper.ObtenerPuntosTotales(idCliente);
                }

                loginResponse.success = true;
                loginResponse.rol = tipoUsuario;
                loginResponse.idCliente = idCliente;
                loginResponse.totalPuntos = totalPuntos;

                // ✅ REGISTRAR LOGIN EN AUDITORÍA
                try
                {
                    // Actualizar fecha de última sesión
                    mapper.ActualizarUltimaSesion(idCliente);

                    // Registrar auditoría de login solo para clientes (no admins)
                    if (tipoUsuario == 'C')
                    {
                        var auditoriaMapper = new AuditoriaMapper(globales, DB);
                        var auditoria = new Auditoria
                        {
                            idcliente = idCliente,
                            idtipoauditoria = 5, // ID 5 = Inicio Sesión
                            descripcion = $"Inicio de sesión exitoso desde {email}",
                            fechahora = DateTime.Now,
                            monto = 0
                        };
                        auditoriaMapper.InsertarAuditoria(auditoria);
                    }
                }
                catch (Exception ex)
                {
                    // No fallar el login si la auditoría falla
                    Console.WriteLine($"⚠️ Error al registrar auditoría de login: {ex.Message}");
                }
            }
            return loginResponse;

        }

        //agreggar antes de insertar hashear el password para que se envíe hasheado
        public SignUpResponse InsertarCliente(RequestSignUpCliente request)
        {
            var mapper = new ClienteMapper(globales, DB);

            if (mapper.ExisteClienteConEmail(request.email))
            {
                throw new Exception("El correo electrónico ya está registrado.");
            }



            if (mapper.ExisteClienteConEmail(request.email))
            {
                throw new Exception("El correo electrónico ya está registrado.");
            }


            Cliente nuevoCliente = new Cliente
            {
                nombres = request.nombres,
                apellidos = request.apellidos,
                email = request.email,
                passwordhash = request.password,
                fechanacimiento = request.fechaNacimiento,

                idsexo = request.idsexo,
                idtipodocumento = request.idtipoDocumento,

                numerodocumento = request.numeroDocumento,
                telefono = request.telefono,
                idciudad = request.idciudad,
                politicadeprivacidad = request.politicaDePrivacidad,
                enviodepublicidad = request.envioDePublicidad
                /*El procedure ya incluye esto
                idciudad = request.idciudad,
                politicadeprivacidad = request.politicaDePrivacidad,
                enviodepublicidad = request.envioDePublicidad
                /*El procedure ya incluye esto
                fechacreacion = DateTime.Now,
                fechaultimaedicion = DateTime.Now,
                fechaultimasession = null*/
            };
            
            int newId = mapper.InsertarCliente(nuevoCliente);
            
            SignUpResponse signUpResponse = new SignUpResponse
            {
                success = newId > 0
            };
            if (!signUpResponse.success)
            {
                throw new Exception("La inserción del cliente falló en la base de datos.");
            }
            
            return signUpResponse;
        }

        public InformacionPersonal GetInformacionPersonal(int idCliente)
        {
            // 1. Instancia el nuevo Mapper optimizado
            var mapper = new PerfilMapper(globales, DB);

            // 2. Llama al método que trae todo en un solo 'lock'
            InformacionPersonal response = mapper.GetInformacionPersonalCompleta(idCliente);

            // 3. Maneja el caso de "no encontrado"
            if (response == null)
            {
                // El controlador atrapará esta excepción
                throw new Exception("Cliente no encontrado con ID: " + idCliente);
            }

            return response;
        }

        public bool ActualizarInformacionPersonal(int idCliente, DatosCliente datosCliente)
        {
            if (string.IsNullOrWhiteSpace(datosCliente.nombres))
            {
                throw new Exception("El campo 'nombres' no puede estar vacío.");
            }
            if (string.IsNullOrWhiteSpace(datosCliente.apellidos))
            {
                throw new Exception("El campo 'apellidos' no puede estar vacío.");
            }

            var mapper = new ClienteMapper(globales, DB);
            int fueModificado = mapper.ModificarInformacionPersonal(idCliente, datosCliente); // <-- NUEVO MÉTODO

            if (fueModificado <= 0)
            {
                // Esto puede pasar si el ID del cliente no existe
                throw new Exception("No se modificó al cliente. El ID puede ser incorrecto: " + idCliente);
            }

            return true;
        }

        public DatosSignUp ObtenerDatosSignUp()
        {
            var mapper = new DatosSignUpMapper(globales, DB);

            return mapper.ObtenerDatosCompletos();
        }

        public VerificarCorreoResponse verificarCorreoCliente(string email)
        {
            var mapper = new ClienteMapper(globales, DB);
            bool existe = mapper.ExisteClienteConEmail(email);
            VerificarCorreoResponse response = new VerificarCorreoResponse
            {
                exists = existe
            };
            return response;
        }

        public VerificarContrasenaRecuperarResponse VerificarContrasenaRecuperar(int idCliente, string currentPassword)
        {
            var mapper = new ClienteMapper(globales, DB);
            bool isMatch = mapper.VerificarContrasenaPorIdContrasena(idCliente, currentPassword);
            VerificarContrasenaRecuperarResponse response = new VerificarContrasenaRecuperarResponse
            {
                status = isMatch ? "success" : "error",
                message = isMatch ? "Contraseña verificada correctamente." : "La contraseña actual es incorrecta. Intente de nuevo."
            };
            return response;
        }

        public ActualizarContrasenaResponse ActualizarContrasena(int idCliente, string newPassword)
        {
            var mapper = new ClienteMapper(globales, DB);
            bool updated = mapper.ModificarClienteContrasenaPorId(idCliente, newPassword);
            ActualizarContrasenaResponse response = new ActualizarContrasenaResponse
            {
                status = updated ? "success" : "error",
                message = updated ? "Tu contraseña ha sido cambiada exitosamente." : "No se pudo actualizar la contraseña. Por favor, inténtelo más tarde."
            };
            return response;
        }

        public FetchUserDataResponse ObtenerNombrePorId(int idCliente)
        {
            var mapper = new ClienteMapper(globales, DB);
            Cliente cliente = mapper.ObtenerClientePorId(idCliente);
            if(cliente!=null)
            {
                return new FetchUserDataResponse
                {
                    status = "success",
                    message = "Usuario encontrado.",
                    name = $"{cliente.nombres} {cliente.apellidos}"
                };
            }
            else
            {
                return new FetchUserDataResponse
                {
                    status = "error",
                    message = "Usuario no encontrado.",
                    name = null
                };
            }
            
        }


        public DatosPersonalesDTO ObtenerDatosPersonales(int idCliente)
        {
            // 1. Instanciamos el Mapper, tal como lo haces en tus otros métodos
            var mapper = new ClienteMapper(globales, DB);

            // 2. Llamamos al método del mapper que hará la consulta
            DatosPersonalesDTO datos = mapper.ObtenerDatosPersonalesPorId(idCliente);

            // 3. (Opcional) Lógica de negocio si es necesaria
            // En este caso, si el mapper no encuentra nada (devuelve null),
            // simplemente pasamos ese 'null' al Controller,
            // que es el encargado de traducirlo a una respuesta "Not Found".
            // Esto es más limpio que lanzar una excepción aquí.

            return datos;
        }

        public Cliente EncontrarClientePorEmail(string email)
        {
            var mapper = new ClienteMapper(globales, DB);
            return mapper.ObtenerClienteAuxPorEmail(email);
        }

        public int RegistrarRecuperarContrasenaPendiente(RecuperacionContrasenaPendiente registro)
        {
            var mapper = new ClienteMapper(globales, DB);
            return mapper.InsertarRecuperacionContrasenaPendiente(registro);
        }

        public RecuperacionContrasenaPendiente ObtenerRecuperarContrasenaPendientePorToken(string token)
        {
            var mapper = new ClienteMapper(globales, DB);
            return mapper.ObtenerRecuperacionContrasenaPendientePorToken(token);
        }

        public Cliente ReestablecerContrasenaEncontrarClientePorId(int idCliente)
        {
            var mapper = new ClienteMapper(globales, DB);
            return mapper.ObtenerClienteAuxPorId(idCliente);
        }

        public bool ReestablecerContrasenaActualizarContrasena(int id, string passwordNueva)
        {
            var mapper = new ClienteMapper(globales, DB);
            return mapper.ModificarClienteContrasenaPorId(id, passwordNueva);
        }

        public int ReestablecerContrasenaMarcarRecuperacionComoUsada(int idRecuperacion)
        {
            var mapper = new ClienteMapper(globales, DB);
            return mapper.ModificarRecuperacionContrasenaPendienteComoUsadaPorId(idRecuperacion);
        }
    }
}