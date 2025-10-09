using EventodromoRest.Modelos;
using EventodromoRest.Modelos.Utiles;
using EventodromoRest.Negocio;

namespace EventodromoRest.Mappers
{
    public class TransaccionMapper(Globales.Globales globales, DBManager.DBManager DB)
    {
        public List<Transaccion> ListarTransaccion()
        {
            List<Transaccion> listaTransaccion = new List<Transaccion>();
            lock (DB)
            {
                string query = "SELECT * FROM Transaccion";
                var parametros = new ParameterList();

                DB.Select(query, parametros);
                while (DB.Read())
                {
                    Transaccion transaccion = new()
                    {
                        id = DB.GetInt("id"),
                        idCarrito = DB.GetInt("idCarrito"),
                        //carrito = ObtenerCarritoPorId(DB.GetInt("idCarrito")),
                        fechaHoraCompra = DB.GetDateTime("fechaHoraCompra"),
                        numeroTransaccion = DB.GetString("numeroTransaccion"),
                        nombresCliente = DB.GetString("nombresCliente"),
                        apellidosCliente = DB.GetString("apellidosCliente"),
                        emailCliente = DB.GetString("emailCliente"),
                        numeroDocumentoCliente = DB.GetString("numeroDocumentoCliente"),
                        idTipoDocumento = DB.GetInt("idTipoDocumento"),
                        //tipoDocumento = ObtenerTipoDocumentoPorId(DB.GetInt("idTipoDocumento")),
                        montoTotal = DB.GetDecimal("montoTotal")
                        //MontoTotal = double.Parse(DB.GetDecimal("montoTotal").ToString())
                    };
                    transaccion.carrito = ObtenerCarritoPorId(transaccion.idCarrito);
                    transaccion.tipoDocumento = ObtenerTipoDocumentoPorId(transaccion.idTipoDocumento);
                    listaTransaccion.Add(transaccion);
                }
                return listaTransaccion;
            }
        }

        private TipoDocumento ObtenerTipoDocumentoPorId(int v)
        {
            var tipoDocumentoMapper = new TipoDocumentoMapper(globales, DB);
            return tipoDocumentoMapper.ObtenerTipoDocumentoPorId(v);
        }

        private Carrito ObtenerCarritoPorId(int v)
        {
            var carritoMapper = new CarritoMapper(globales, DB);
            return carritoMapper.ObtenerCarritoPorId(v);
        }

        public int InsertarTransaccion(Transaccion transaccion)
        {
            lock (DB)
            {
                string query = "INSERT INTO Transaccion (idCarrito, fechaHoraCompra, numeroTransaccion, nombresCliente, apellidosCliente, emailCliente, numeroDocumentoCliente, idTipoDocumento, montoTotal) VALUES (@idCarrito, @fechaHoraCompra, @numeroTransaccion, @nombresCliente, @apellidosCliente, @emailCliente, @numeroDocumentoCliente, @idTipoDocumento, @montoTotal); SELECT LAST_INSERT_ID();";
                var parametros = new ParameterList();
                parametros.Add("@idCarrito", transaccion.idCarrito);
                parametros.Add("@fechaHoraCompra", transaccion.fechaHoraCompra);
                parametros.Add("@numeroTransaccion", transaccion.numeroTransaccion);
                parametros.Add("@nombresCliente", transaccion.nombresCliente);
                parametros.Add("@apellidosCliente", transaccion.apellidosCliente);
                parametros.Add("@emailCliente", transaccion.emailCliente);
                parametros.Add("@numeroDocumentoCliente", transaccion.numeroDocumentoCliente);
                parametros.Add("@idTipoDocumento", transaccion.idTipoDocumento);
                parametros.Add("@montoTotal", transaccion.montoTotal);
                object result = DB.ExecuteScalar(query, parametros);
                int newId = Convert.ToInt32(result);
                return newId;
            }
        }

        public Transaccion ObtenerTransaccionPorId(int id)
        {
            lock (DB)
            {
                string query = "SELECT * FROM Transaccion WHERE id = @id";
                var parametros = new ParameterList();
                parametros.Add("@id", id);
                DB.Select(query, parametros);
                if (DB.Read())
                {
                    Transaccion transaccion = new()
                    {
                        id = DB.GetInt("id"),
                        idCarrito = DB.GetInt("idCarrito"),
                        //carrito = ObtenerCarritoPorId(DB.GetInt("idCarrito")),
                        fechaHoraCompra = DB.GetDateTime("fechaHoraCompra"),
                        numeroTransaccion = DB.GetString("numeroTransaccion"),
                        nombresCliente = DB.GetString("nombresCliente"),
                        apellidosCliente = DB.GetString("apellidosCliente"),
                        emailCliente = DB.GetString("emailCliente"),
                        numeroDocumentoCliente = DB.GetString("numeroDocumentoCliente"),
                        idTipoDocumento = DB.GetInt("idTipoDocumento"),
                        //tipoDocumento = ObtenerTipoDocumentoPorId(DB.GetInt("idTipoDocumento")),
                        montoTotal = DB.GetDecimal("montoTotal"),
                    };
                    transaccion.carrito = ObtenerCarritoPorId(transaccion.idCarrito);
                    transaccion.tipoDocumento = ObtenerTipoDocumentoPorId(transaccion.idTipoDocumento);
                    return transaccion;
                }
                else
                {
                    return null;
                }
            }
        }

        public int EliminarTransaccionPorId(int id)
        {
            lock (DB)
            {
                string query = "DELETE FROM Transaccion WHERE id = @id";
                var parametros = new ParameterList();
                parametros.Add("@id", id);
                int rowsAffected = DB.ExecuteNonQuery(query, parametros);
                return rowsAffected;
            }
        }

        public int ModificarTransaccion(Transaccion transaccion)
        {
            lock (DB)
            {
                string query = "UPDATE TransaccionTarjeta SET idCarrito = @idCarrito, fechaHoraCompra = @fechaHoraCompra, numeroTransacion = @numeroTransacion, nombresCliente = @nombresCliente, apellidosCliente = @apellidosCliente, emailCliente = @emailCliente, numeroDocumentoCliente = @numeroDocumentoCliente, idTipoDocumento = @idTipoDocumento, montoTotal = @montoTotal WHERE id = @id";
                var parametros = new ParameterList();
                parametros.Add("@idCarrito", transaccion.idCarrito);
                parametros.Add("@fechaHoraCompra", transaccion.fechaHoraCompra);
                parametros.Add("@numeroTransaccion", transaccion.numeroTransaccion);
                parametros.Add("@nombresCliente", transaccion.nombresCliente);
                parametros.Add("@apellidosCliente", transaccion.apellidosCliente);
                parametros.Add("@emailCliente", transaccion.emailCliente);
                parametros.Add("@numeroDocumentoCliente", transaccion.numeroDocumentoCliente);
                parametros.Add("@idTipoDocumento", transaccion.idTipoDocumento);
                parametros.Add("@montoTotal", transaccion.montoTotal);
                int rowsAffected = DB.ExecuteNonQuery(query, parametros);
                return rowsAffected;
            }
        }
    }
}
