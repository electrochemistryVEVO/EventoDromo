using EventodromoRest.Mappers;
using EventodromoRest.Modelos;

namespace EventodromoRest.Negocio
{
    public class ClienteBO (Globales.Globales globales, DBManager.DBManager DB)
    {
        public Cliente AutenticarCliente(RequestAutenticarCliente cliente)
        {
            var clienteMapper = new ClienteMapper(globales, DB);
            Cliente clienteResponse = clienteMapper.AutenticarCliente(cliente);

            if (clienteResponse != null && clienteResponse.Contrasena == cliente.Contrasena)
            {
                return clienteResponse;
            }
            else 
            {
                return null;
            }
        }
    }
}
