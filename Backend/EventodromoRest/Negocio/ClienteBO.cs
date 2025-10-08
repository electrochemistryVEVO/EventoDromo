using EventodromoRest.Mappers;
using EventodromoRest.Modelos;

namespace EventodromoRest.Negocio
{
    public class ClienteBO (Globales.Globales globales, DBManager.DBManager DB)
    {
        public ClienteLogin AutenticarCliente(Cliente clienteEnviado)
        {
            
            Cliente clienteObtenido = clienteMapper.ObtenerClienteLoginPorEmailContrasenhaa(clienteEnviado.email,clienteEnviado.passwordhash);
            if (clienteObtenido != null)
            {
                ClienteLogin clienteObtenido.cliente = clienteObtenido;
                clienteObtenido
            }
     
            return clienteEnviar;

        }

        public int TipoUsuario(int idCliente)
        {
            return 2;
        }
    }
}
