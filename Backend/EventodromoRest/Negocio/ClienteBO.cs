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
            Cliente cliente = mapper.ObtenerClientePorEmailPassword(email, password, out tipoUsuario);
            LoginResponse loginResponse = new LoginResponse
            {
                success = false,
                rol = ' '
            };
            if (cliente != null)
            {
                loginResponse.success = true;
                loginResponse.rol = tipoUsuario;
            }
            return loginResponse;

        }

        public SignUpResponse InsertarCliente(RequestSignUpCliente request)
        {
            var mapper = new ClienteMapper(globales, DB);
            /* algo así hacer
            Cliente nuevoCliente = new Cliente
            {
                nombres = request.nombres,
                apellidos = request.apellidos,
                email = request.email,
                passwordhash = globales.HashPassword(request.password),
                fechanacimiento = request.fechaNacimiento,
                idsexo = mapper.ObtenerIdSexoPorNombre(request.sexo),
                idtipodocumento = mapper.ObtenerIdTipoDocumentoPorNombre(request.tipoDocumento),
                numerodocumento = request.numeroDocumento,
                telefono = request.telefono,
                idciudad = mapper.ObtenerIdCiudadPorNombreYPais(request.ciudad, request.pais),
                politicadeprivacidad = request.politicadeprivacidad,
                enviodepublicidad = request.enviodepublicidad,
                fechacreacion = DateTime.Now,
                fechaultimaedicion = DateTime.Now,
                fechaultimasession = null
            };
            
            int newId = mapper.InsertarCliente(nuevoCliente);
            */
            SignUpResponse signUpResponse = new SignUpResponse
            {
                //success = newId > 0
                success = true // temporal mientras no se implemente todo
            };
            return signUpResponse;
        }


    }
}