using EventodromoRest.Mappers;
using EventodromoRest.Modelos;
using EventodromoRest.Modelos.Utiles;

namespace EventodromoRest.Negocio
{
    public class ClienteBO(Globales.Globales globales, DBManager.DBManager DB)
    {
        public GenericResponse<Cliente> AutenticarCliente(RequestAutenticarCliente cliente)
        {
            var clienteMapper = new ClienteMapper(globales, DB);
            Cliente clienteResponse = clienteMapper.AutenticarCliente(cliente);

            if (clienteResponse != null)
            {
                return new GenericResponse<Cliente>
                {
                    Success = true,
                    Message = "Credenciales validas",
                    Error = null,
                    Data = clienteResponse
                };
            }
            else
            {
                return new GenericResponse<Cliente>
                {
                    Success = false,
                    Message = "Credenciales inválidas",
                    Error = null,
                    Data = clienteResponse
                };
            }
        }
    }
}
