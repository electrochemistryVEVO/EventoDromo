using EventodromoRest.Mappers;
using EventodromoRest.Modelos;

namespace EventodromoRest.Negocio
{
    public class ClienteBO (Globales.Globales globales, DBManager.DBManager DB)
    {
        public LoginResponse AutenticarCliente(string email, string password)
        {
            var mapper = new ClienteMapper(globales, DB);
            char tipoUsuario;
            Cliente cliente = mapper.ObtenerClientePorEmailPassword(email, password,out tipoUsuario);
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



    }
}
