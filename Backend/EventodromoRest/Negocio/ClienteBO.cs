namespace EventodromoRest.Negocio
{
    public class ClienteBO (Globales.Globales globales, DBManager.DBManager DB)
    {
        public object AutenticarCliente(string email, string password)
        {
            var mapper = new ClienteMapper(globales, DB);
            char tipoUsuario;
            Cliente cliente = mapper.ObtenerClientePorEmailPassword(email, password,out tipoUsuario);

            if (cliente == null)
            {
                return new { success = false, message = "Credenciales inválidas" };
            }

            // Aquí devuelves un objeto anónimo que incluye al Cliente y el rol
            return new
            {
                success = true,
                cliente,
                rol = tipoUsuario
            };
        }



    }
}
