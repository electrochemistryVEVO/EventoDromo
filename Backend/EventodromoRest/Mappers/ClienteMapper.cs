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
                string query = "SELECT ID, NOMBRE, CORREO, CONTRASENA FROM dbo.Cliente WHERE CORREO = @CORREO";
                var parametros = new ParameterList();
                parametros.Add("@CORREO", request.Correo);

                DB.Select(query, parametros);
                while (DB.Read())
                {
                    Cliente cliente = new()
                    {
                        ID = DB.GetInt("ID"),
                        Correo = DB.GetString("CORREO"),
                        Contrasena = DB.GetString("CONTRASENA"),
                        Nombre = DB.GetString("NOMBRE")
                    };
                    listaClientes.Add(cliente);
                }
                Cliente? response = listaClientes.FirstOrDefault();
                return response;
            }
        }
    }
}
