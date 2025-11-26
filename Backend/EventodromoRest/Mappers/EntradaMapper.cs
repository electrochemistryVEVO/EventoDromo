using EventodromoRest.Modelos;
using EventodromoRest.Modelos.Utiles;
using EventodromoRest.Negocio;

namespace EventodromoRest.Mappers
{
    public class EntradaMapper(Globales.Globales globales, DBManager.DBManager DB)
    {
        public List<Entrada> ListarEntrada()
        {
            List<Entrada> listaEntrada = new List<Entrada>();
            var parametros = new ParameterList();
            lock (DB)
            {
                string query = "SELECT * FROM Entrada";
                DB.Select(query, parametros);
                while (DB.Read())
                {
                    Entrada entrada = new()
                    {
                        id = DB.GetInt("id"),
                        idCarrito = DB.GetInt("idCarrito"),
                        idTipoEntrada = DB.GetInt("idTipoEntrada")
                    };
                    entrada.carrito = ObtenerCarritoPorId(DB.GetInt("idCarrito"));
                    entrada.tipoEntrada = ObtenerTipoEntradaPorId(entrada.idTipoEntrada);
                    listaEntrada.Add(entrada);
                }
                return listaEntrada;
            }
        }

        private TipoEntrada ObtenerTipoEntradaPorId(int v)
        {
            var tipoEntradaMapper = new TipoEntradaMapper(globales, DB);
            return tipoEntradaMapper.ObtenerTipoEntradaPorId(v);
        }

        private Carrito ObtenerCarritoPorId(int v)
        {
            var carritoMapper = new CarritoMapper(globales, DB);
            return carritoMapper.ObtenerCarritoPorId(v);
        }

        public int InsertarEntrada(Entrada entrada)
        {
            lock (DB)
            {
                string query = "INSERT INTO Entrada (idCarrito, idTipoEntrada) VALUES (@idCarrito, @idTipoEntrada); SELECT LAST_INSERT_ID();";
                var parametros = new ParameterList();
                parametros.Add("@idCarrito", entrada.idCarrito);
                parametros.Add("@idTipoEntrada", entrada.idTipoEntrada);
                object result = DB.ExecuteScalar(query, parametros);
                int newId = Convert.ToInt32(result);
                return newId;
            }
        }

        public Entrada ObtenerEntradaPorId(int id)
        {
            lock (DB)
            {
                string query = "SELECT * FROM Entrada WHERE id = @id";
                var parametros = new ParameterList();
                parametros.Add("@id", id);
                DB.Select(query, parametros);
                if (DB.Read())
                {
                    Entrada entrada = new()
                    {
                        id = DB.GetInt("id"),
                        idCarrito = DB.GetInt("idCarrito"),
                        idTipoEntrada = DB.GetInt("idTipoEntrada")
                    };
                    entrada.carrito = ObtenerCarritoPorId(DB.GetInt("idCarrito"));
                    entrada.tipoEntrada = ObtenerTipoEntradaPorId(entrada.idTipoEntrada);
                    return entrada;
                }
                else
                {
                    return null;
                }
            }
        }

        public int EliminarEntradaPorId(int id)
        {
            lock (DB)
            {
                string query = "DELETE FROM Entrada WHERE id = @id";
                var parametros = new ParameterList();
                parametros.Add("@id", id);
                int rowsAffected = DB.ExecuteNonQuery(query, parametros);
                return rowsAffected;
            }
        }

        public int ModificarEntrada(Entrada entrada)
        {
            lock (DB)
            {
                string query = "UPDATE Entrada SET idCarrito = @idCarrito, idTipoEntrada = @idTipoEntrada WHERE id = @id";
                var parametros = new ParameterList();
                parametros.Add("@idCarrito", entrada.idCarrito);
                parametros.Add("@idTipoEntrada", entrada.idTipoEntrada);
                int rowsAffected = DB.ExecuteNonQuery(query, parametros);
                return rowsAffected;
            }
        }

        public List<Entrada> ObtenerEntradasPorIdCarrito(int idCarrito)
        {
            List<Entrada> listaEntrada = new List<Entrada>();
            lock (DB)
            {
                string query = "SELECT * FROM Entrada WHERE idCarrito = @idCarrito";
                var parametros = new ParameterList();
                parametros.Add("@idCarrito", idCarrito);
                DB.Select(query, parametros);
                while (DB.Read())
                {
                    Entrada entrada = new()
                    {
                        id = DB.GetInt("id"),
                        idCarrito = DB.GetInt("idCarrito"),
                        idTipoEntrada = DB.GetInt("idTipoEntrada")
                    };
                    entrada.carrito = ObtenerCarritoPorId(DB.GetInt("idCarrito"));
                    entrada.tipoEntrada = ObtenerTipoEntradaPorId(entrada.idTipoEntrada);
                    listaEntrada.Add(entrada);
                }
                return listaEntrada;
            }
        }
        public List<TicketInfo> ObtenerTipoEntradasPorTransaccion(int idCliente,string numeroTransaccion)
        {
            List<TicketInfo> listaEntrada = new List<TicketInfo>();
            lock (DB)
            {
                // Solo retorna entradas que el cliente actualmente posee
                // Usa LineaTransaccion para vincular correctamente entradas transferidas
                string query = @"SELECT TE.nombre,TE.precio,T.nombresCliente,T.apellidosCliente,C.numeroDocumento 
                FROM Transaccion T 
                JOIN Cliente C ON C.id=T.idCliente 
                JOIN LineaTransaccion LT ON LT.idTransaccion=T.id
                JOIN Entrada E ON E.id=LT.idEntrada 
                JOIN TipoEntrada TE ON TE.id=E.idTipoEntrada 
                WHERE T.numeroTransaccion=@numeroTransaccion 
                AND (
                    (E.idClienteActual IS NULL AND T.idCliente = @idCliente) 
                    OR E.idClienteActual = @idCliente
                );";
                var parametros = new ParameterList();
                parametros.Add("@numeroTransaccion", numeroTransaccion);
                parametros.Add("@idCliente", idCliente);
                DB.Select(query, parametros);
                while (DB.Read())
                {
                    TicketInfo entrada = new();
                    entrada.nombre = DB.GetString("nombre");
                    entrada.precio = (double)DB.GetDecimal("precio");
                    entrada.dniCliente = DB.GetString("numeroDocumento");
                    entrada.nombreCliente = DB.GetString("nombresCliente");
                    if (entrada.nombreCliente != null)
                    {
                        entrada.nombreCliente = entrada.nombreCliente + " ";
                        entrada.nombreCliente = entrada.nombreCliente + DB.GetString("apellidosCliente");
                    }
                    
                    listaEntrada.Add(entrada);
                }
                return listaEntrada;
            }
        }
    }
}
