using Azure.Core;
using EventodromoRest.Modelos;
using EventodromoRest.Modelos.Utiles;
using EventodromoRest.Negocio;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.IdentityModel.Tokens;

namespace EventodromoRest.Mappers
{
    public class CarritoMapper(Globales.Globales globales, DBManager.DBManager DB)
    {
        public List<Carrito> ListarCarrito()
        {
            List<Carrito> listaCarrito = new List<Carrito>();
            var parametros = new ParameterList();
            lock (DB)
            {
                string query = "SELECT * FROM Carrito";
                DB.Select(query, parametros);
                try
                {
                    while (DB.Read())
                    {
                        Carrito carrito = new()
                        {
                            id = DB.GetInt("id"),
                            idCliente = DB.GetInt("idCliente"),
                            fechaExpiracion = DB.GetDateTime("fechaExpiracion"),
                            fechaCreacion = DB.GetDateTime("fechaCreacion")
                        };
                        // Importante: no consultar otros mappers aquí con el reader abierto
                        listaCarrito.Add(carrito);
                    }
                }
                finally
                {
                    DB.CloseReader();
                }

                // Ahora que el reader está cerrado, se puede consultar otros mappers con seguridad
                foreach (var c in listaCarrito)
                {
                    c.cliente = ObtenerClientePorId(c.idCliente);
                }

                return listaCarrito;
            }
        }

        private Cliente ObtenerClientePorId(int v)
        {
            var clienteMapper = new ClienteMapper(globales, DB);
            return clienteMapper.ObtenerClientePorId(v);
        }

        public int InsertarCarrito(Carrito carrito)
        {
            lock (DB)
            {
                string query = "INSERT INTO Carrito (idCliente, fechaExpiracion, fechaCreacion) VALUES (@idCliente, @fechaExpiracion, @fechaCreacion); SELECT LAST_INSERT_ID();";
                var parametros = new ParameterList();
                parametros.Add("@idCliente", carrito.idCliente);
                parametros.Add("@fechaExpiracion", carrito.fechaExpiracion);
                parametros.Add("@fechaCreacion", carrito.fechaCreacion);
                object result = DB.ExecuteScalar(query, parametros);
                int newId = Convert.ToInt32(result);
                return newId;
            }
        }

        public Carrito ObtenerCarritoPorId(int id)
        {
            lock (DB)
            {
                string query = "SELECT * FROM Carrito WHERE id = @id";
                var parametros = new ParameterList();
                parametros.Add("@id", id);

                Carrito carrito = null;

                DB.Select(query, parametros);
                try
                {
                    if (DB.Read())
                    {
                        carrito = new()
                        {
                            id = DB.GetInt("id"),
                            idCliente = DB.GetInt("idCliente"),
                            fechaExpiracion = DB.GetDateTime("fechaExpiracion"),
                            fechaCreacion = DB.GetDateTime("fechaCreacion")
                        };
                    }
                }
                finally
                {
                    DB.CloseReader();
                }

                if (carrito != null)
                {
                    // Cargar cliente luego de cerrar el reader
                    carrito.cliente = ObtenerClientePorId(carrito.idCliente);
                }

                return carrito;
            }
        }

        public List<ObtenerCarritoDTO> ObtenerCarrito(int idCliente)
        {
            List<ObtenerCarritoDTO> listaCarrito = new List<ObtenerCarritoDTO>();
            lock (DB)
            {
                string query =
                    "select " +
                    "c.id as idCarrito, " +
                    "ev.id as idEvento, " +
                    "ev.nombre as nombreEvento, " +
                    "ev.imagenURL as imagenURL, " +
                    "l.nombre as nombreLocal, " +
                    "cd.nombre as nombreCiudad, " +
                    "f.id as idFuncion, " +
                    "f.fechaHora as fecha, " +
                    "e.id AS idEntrada, " +
                    "t.id as idTipoEntrada, " +
                    "t.nombre as nombreTipoEntrada, " +
                    "t.precio as precioEntrada, " +
                    "c.fechaExpiracion " +
                    "from " +
                    "Entrada e " +
                    "join Carrito c on e.idCarrito = c.id " +
                    "join TipoEntrada t on t.id = e.idTipoEntrada " +
                    "join FechaEvento f on f.id = t.idFechaEvento " +
                    "join Evento ev on ev.id = f.idEvento " +
                    "join Local l on l.id = ev.idLocal " +
                    "join Ciudad cd on cd.id = l.idCiudad " +
                    "where " +
                    "c.idCliente = @idCliente " +
                    "and c.fechaCreacion < now() " +
                    "and now() < c.fechaExpiracion;";

                var parametros = new ParameterList();
                parametros.Add("@idCliente", idCliente);

                DB.Select(query, parametros);
                try
                {
                    while (DB.Read())
                    {
                        ObtenerCarritoDTO registro = new()
                        {
                            idCarrito = DB.GetInt("idCarrito"),
                            eventoInfo = new EventoCarritoDTO
                            {
                                idEvento = DB.GetInt("idEvento"),
                                nombreEvento = DB.GetString("nombreEvento"),
                                imagenURL = DB.GetString("imagenURL")
                            },
                            localInfo = new LocalDTO
                            {
                                nombre = DB.GetString("nombreLocal"),
                                ciudad = DB.GetString("nombreCiudad")
                            },
                            funcionInfo = new FuncionDTO
                            {
                                id = DB.GetInt("idFuncion"),
                                fechaHora = DB.GetDateTime("fecha")
                            },
                            entrada = new EntradaDTO
                            {
                                idEntrada = DB.GetInt("idEntrada"),
                                idTipoEntrada = DB.GetInt("idTipoEntrada"),
                                nombreTipoEntrada = DB.GetString("nombreTipoEntrada"),
                                precio = DB.GetDecimal("precioEntrada")
                            },
                            fechaExpiracion = DB.GetDateTime("fechaExpiracion")
                        };
                        listaCarrito.Add(registro);
                    }
                }
                finally
                {
                    DB.CloseReader();
                }
            }

            if (listaCarrito.Count == 0)
            {
                return null;
            }
            else
            {
                return listaCarrito;
            }
        }

        public List<ObtenerCarritoDTO> AgregarItemAlCarrito(int idCliente, RequestAgregarItemAlCarrito request)
        {
            lock (DB)
            {
                var carritoExistente = ObtenerCarrito(idCliente);
                int idCarrito;
                if (carritoExistente.IsNullOrEmpty())
                {
                    Carrito nuevoCarrito = new()
                    {
                        idCliente = idCliente,
                        fechaCreacion = DateTime.Now,
                        fechaExpiracion = request.fechaExpiracion
                    };
                    idCarrito = InsertarCarrito(nuevoCarrito);
                }
                else
                {
                    idCarrito = carritoExistente[0].idCarrito;
                }

                var entradaMapper = new EntradaMapper(globales, DB);
                foreach (var entrada in request.entradas)
                {
                    for (int i = 0; i < entrada.cantidad; i++)
                    {
                        Entrada nuevaEntrada = new()
                        {
                            idCarrito = idCarrito,
                            idTipoEntrada = entrada.idTipoEntrada
                        };
                        entradaMapper.InsertarEntrada(nuevaEntrada);
                    }
                }

                return ObtenerCarrito(idCliente);
            }
        }

        public List<ObtenerCarritoDTO> EliminarItemDelCarrito(int idCliente, int idEntrada) 
        {
            lock (DB)
            {
                string query = "DELETE FROM Entrada WHERE id = @idEntrada;";
                var parametros = new ParameterList();
                parametros.Add("@idEntrada", idEntrada);
                DB.ExecuteNonQuery(query, parametros);
                return ObtenerCarrito(idCliente);
            }
        }
    }
}
        