using EventodromoRest.Mappers;
using EventodromoRest.Modelos;

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
                idCliente = 0//dps de token
            };
            if (cliente != null)
            {
                loginResponse.success = true;
                loginResponse.rol = tipoUsuario;
                loginResponse.idCliente = idCliente;
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
                passwordhash = request.password,
                fechanacimiento = request.fechaNacimiento,

                idsexo = request.idsexo,
                idtipodocumento = request.idtipoDocumento,

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
            InformacionPersonal response = null;

            //obtengo los datos Cliente
            Cliente cliente = new ClienteMapper(globales, DB).ObtenerClientePorId(idCliente);
            //Por aqui valido tokens y demas...

            if (cliente == null)
            {
                // El controlador atrapará esta excepción
                throw new Exception("Cliente no encontrado con ID: " + idCliente);
            }
            
            //Obtengo los paises, ciudades y sexos
            List<Pais> paises = new PaisMapper(globales, DB).ListarPais();
            List<Ciudad> ciudades = new CiudadMapper(globales, DB).ListarCiudad();
            List<Sexo> sexos = new SexoMapper(globales, DB).ListarSexos();

            response = new InformacionPersonal()
            {
                ciudades = ciudades.Select(c => new CiudadDTO
                {
                    id = c.id,
                    nombre = c.nombre,
                    idPais = c.idPais
                }).ToList(),
                paises = paises,
                sexos = sexos,
                datosCliente = new DatosCliente()
                {
                    id = cliente.id,
                    nombres = cliente.nombres,
                    apellidos = cliente.apellidos,
                    email = cliente.email,
                    idciudad = cliente.idciudad,
                    idsexo = cliente.idsexo,
                    telefono = cliente.telefono,
                    fechanacimiento = cliente.fechanacimiento?.ToString("yyyy-MM-dd"),
                }
            };
            

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

            //obtengo los datos Cliente
            Cliente cliente = new ClienteMapper(globales, DB).ObtenerClientePorId(idCliente);
            if (cliente == null)
            {
                // El controlador atrapará esta excepción
                throw new Exception("Cliente no encontrado con ID: " + idCliente);
            }

            cliente.idciudad = datosCliente.idciudad;
            cliente.apellidos = datosCliente.apellidos;
            cliente.fechanacimiento = DateTime.Parse(datosCliente.fechanacimiento);
            cliente.idsexo = datosCliente.idsexo;
            cliente.nombres = datosCliente.nombres;
            cliente.telefono = datosCliente.telefono;
            cliente.fechaultimaedicion = DateTime.Now;

            int fueModificado = new ClienteMapper(globales, DB).ModificarCliente(cliente);

            if (fueModificado <= 0)
            {
                // El controlador atrapará esta excepción
                throw new Exception("No se modifico al cliente con ID: " + idCliente);
            } 

            return true;
        }

        public DatosSignUp ObtenerDatosSignUp()
        {
            var paisMapper = new PaisMapper(globales, DB);
            var ciudadMapper = new CiudadMapper(globales, DB);
            var sexoMapper = new SexoMapper(globales, DB);
            var tipoDocumentoMapper = new TipoDocumentoMapper(globales, DB);

            // Obtener listas desde la base de datos
            List<Pais> paises = paisMapper.ListarPais();
            List<Ciudad> ciudades = ciudadMapper.ListarCiudad();
            List<Sexo> sexos = sexoMapper.ListarSexos();
            List<TipoDocumento> tiposDocumento = tipoDocumentoMapper.ListarTipoDocumento();

            // Construir el objeto de salida
            DatosSignUp datos = new DatosSignUp
            {
                paises = paises,
                ciudades = ciudades,
                sexos = sexos,
                tiposDocumento = tiposDocumento
            };

            return datos;
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

    }
}