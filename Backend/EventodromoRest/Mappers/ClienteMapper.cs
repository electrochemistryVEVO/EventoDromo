using EventodromoRest.Modelos;
using EventodromoRest.Modelos.Utiles;

namespace EventodromoRest.Mappers
{
    public class ClienteMapper (Globales.Globales globales, DBManager.DBManager DB)
    {
        public Cliente AutenticarCliente(RequestAutenticarCliente request)
        {
            List<Cliente> listaClientes = new List<Cliente>();
            lock (DB)
            {
                string query = "SELECT ID, NOMBRES, APELLIDOS, EMAIL FROM cliente WHERE EMAIL = @EMAIL AND PASSWORDHASH = @PASSWORDHASH ";

                var parametros = new ParameterList();
                parametros.Add("@EMAIL", request.Correo);
                parametros.Add("@PASSWORDHASH", request.Password);

                DB.Select(query, parametros);
                while (DB.Read())
                {
                    Cliente cliente = new()
                    {
                        ID = DB.GetInt("ID"),
                        Nombres = DB.GetString("NOMBRES"),
                        Apellidos = DB.GetString("APELLIDOS"),
                        Email = DB.GetString("EMAIL")
                    };
                    listaClientes.Add(cliente);
                }
                Cliente? response = listaClientes.FirstOrDefault();
                return response;
            }
        }
    }
}
