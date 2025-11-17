// Archivo: Mappers/CarritoMapper.cs
using EventodromoRest.Modelos;
using EventodromoRest.Modelos.Utiles;
using EventodromoRest.Negocio;
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
            string query = "INSERT INTO Carrito (idCliente, fechaExpiracion, fechaCreacion) VALUES (@idCliente, @fechaExpiracion, @fechaCreacion); SELECT LAST_INSERT_ID();";
            var parametros = new ParameterList();
            parametros.Add("@idCliente", carrito.idCliente);
            parametros.Add("@fechaExpiracion", carrito.fechaExpiracion);
            parametros.Add("@fechaCreacion", carrito.fechaCreacion);

            object result = DB.ExecuteScalar(query, parametros);
            return Convert.ToInt32(result);
        }

        public Carrito ObtenerCarritoPorId(int id)
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
                // Cargar la entidad relacionada después de que el reader se ha cerrado
                carrito.cliente = ObtenerClientePorId(carrito.idCliente);
            }

            return carrito;
        }

        public List<ObtenerCarritoDTO> ObtenerCarrito(int idCliente)
        {
            var listaCarrito = new List<ObtenerCarritoDTO>();
            string query =
                "select " +
                "c.id as idCarrito, ev.id as idEvento, ev.nombre as nombreEvento, ev.imagenURL as imagenURL, " +
                "l.nombre as nombreLocal, cd.nombre as nombreCiudad, f.id as idFuncion, f.fechaHora as fecha, " +
                "e.id AS idEntrada, t.id as idTipoEntrada, t.nombre as nombreTipoEntrada, t.precio as precioEntrada, t.limiteCompra as limiteCompra, t.puntos as puntos," +
                "c.fechaExpiracion " +
                "from Entrada e " +
                "join Carrito c on e.idCarrito = c.id " +
                "join TipoEntrada t on t.id = e.idTipoEntrada " +
                "join FechaEvento f on f.id = t.idFechaEvento " +
                "join Evento ev on ev.id = f.idEvento " +
                "join Local l on l.id = ev.idLocal " +
                "join Ciudad cd on cd.id = l.idCiudad " +
                "where c.idCliente = @idCliente and UTC_TIMESTAMP() < c.fechaExpiracion;";

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
                        eventoInfo = new EventoCarritoDTO { idEvento = DB.GetInt("idEvento"), nombreEvento = DB.GetString("nombreEvento"), imagenURL = DB.GetString("imagenURL") },
                        localInfo = new LocalDTO { nombre = DB.GetString("nombreLocal"), ciudad = DB.GetString("nombreCiudad") },
                        funcionInfo = new FuncionDTO { id = DB.GetInt("idFuncion"), fechaHora = DB.GetDateTime("fecha") },
                        entrada = new EntradaDTO { idEntrada = DB.GetInt("idEntrada"), idTipoEntrada = DB.GetInt("idTipoEntrada"), nombreTipoEntrada = DB.GetString("nombreTipoEntrada"), precio = DB.GetDecimal("precioEntrada"), limiteCompra = DB.GetInt("limiteCompra"), puntos = DB.GetInt("puntos") },
                        fechaExpiracion = DB.GetDateTime("fechaExpiracion")
                    };
                    listaCarrito.Add(registro);
                }
            }
            finally
            {
                DB.CloseReader();
            }

            return listaCarrito;
        }

        public List<ObtenerCarritoDTO> AgregarItemAlCarrito(int idCliente, RequestAgregarItemAlCarrito request)
        {
            DB.BeginTransaction();
            try
            {
                var carritoExistente = ObtenerCarrito(idCliente);
                int idCarrito;
                if (carritoExistente.IsNullOrEmpty())
                {
                    Carrito nuevoCarrito = new() 
                    { 
                        idCliente = idCliente, 
                        fechaCreacion = DateTime.UtcNow, 
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
                        Entrada nuevaEntrada = new() { idCarrito = idCarrito, idTipoEntrada = entrada.idTipoEntrada };
                        entradaMapper.InsertarEntrada(nuevaEntrada);
                    }
                }

                DB.Commit();
                return ObtenerCarrito(idCliente);
            }
            catch (Exception)
            {
                DB.Rollback();
                throw;
            }
        }

        public List<ObtenerCarritoDTO> EliminarItemDelCarrito(int idCliente, int idEntrada)
        {
            DB.BeginTransaction();
            try
            {
                // 1. Necesitamos saber qué TipoEntrada es ANTES de borrar
                string queryTipo = "SELECT idTipoEntrada FROM Entrada WHERE id = @idEntrada";
                var pTipo = new ParameterList();
                pTipo.Add("@idEntrada", idEntrada);

                object tipoEntradaObj = DB.ExecuteScalar(queryTipo, pTipo);

                // 2. Borramos la entrada
                string queryDelete = "DELETE FROM Entrada WHERE id = @idEntrada;";
                var pDelete = new ParameterList();
                pDelete.Add("@idEntrada", idEntrada);
                DB.ExecuteNonQuery(queryDelete, pDelete);

                // 3. Devolvemos 1 al stock de ese TipoEntrada (si lo encontramos)
                if (tipoEntradaObj != null && tipoEntradaObj != DBNull.Value)
                {
                    int idTipoEntrada = Convert.ToInt32(tipoEntradaObj);

                    // Usamos CASE para evitar números negativos (protección contra data corrupta)
                    string queryUpdateStock = "UPDATE TipoEntrada " +
                                              "SET cantidadVendida = CASE WHEN (cantidadVendida - 1) < 0 THEN 0 ELSE (cantidadVendida - 1) END " +
                                              "WHERE id = @idTipoEntrada;";

                    var pUpdate = new ParameterList();
                    pUpdate.Add("@idTipoEntrada", idTipoEntrada);
                    DB.ExecuteNonQuery(queryUpdateStock, pUpdate);
                }

                DB.Commit();
                return ObtenerCarrito(idCliente);
            }
            catch (Exception)
            {
                DB.Rollback();
                throw;
            }
        }

        public (List<ObtenerCarritoDTO> carrito, List<RechazadoDTO> rechazados) SincronizarCarrito(int idCliente, RequestSincronizarCarrito request)
        {
            var rechazados = new List<RechazadoDTO>();

            DB.BeginTransaction();
            try
            {
                // --- LÓGICA REESCRITA PARA EVITAR DEADLOCK ---
                // 1. Intentamos insertar un carrito NUEVO solo si el cliente NO tiene uno ACTIVO.
                // Esta operación es atómica y evita el patrón conflictivo de SELECT-then-INSERT.
                string upsertQuery =
                    "INSERT INTO Carrito (idCliente, fechaCreacion, fechaExpiracion) " +
                    "SELECT @idCliente, UTC_TIMESTAMP(), UTC_TIMESTAMP() + INTERVAL 10 MINUTE " +
                    "WHERE NOT EXISTS (SELECT 1 FROM Carrito WHERE idCliente = @idCliente AND fechaExpiracion > UTC_TIMESTAMP());";

                var upsertParams = new ParameterList();
                upsertParams.Add("@idCliente", idCliente);
                DB.ExecuteNonQuery(upsertQuery, upsertParams);

                // 2. Ahora, con total seguridad, obtenemos el ID del carrito que DEBE existir.
                // (ya sea el que existía antes o el que acabamos de crear).
                string queryCarrito = "SELECT id FROM Carrito WHERE idCliente = @idCliente AND fechaExpiracion > UTC_TIMESTAMP() LIMIT 1";
                var selectParams = new ParameterList();
                selectParams.Add("@idCliente", idCliente);
                object carritoIdObj = DB.ExecuteScalar(queryCarrito, selectParams);

                if (carritoIdObj == null || carritoIdObj == DBNull.Value)
                {
                    // Este error solo debería ocurrir si la consulta de inserción condicional falla,
                    // lo cual sería un problema muy grave a nivel de base de datos.
                    throw new Exception("No se pudo crear o encontrar un carrito para el cliente después del intento de inserción.");
                }
                int idCarrito = Convert.ToInt32(carritoIdObj);

                string updateExpirationQuery = "UPDATE Carrito SET fechaExpiracion = UTC_TIMESTAMP() + INTERVAL 10 MINUTE WHERE id = @idCarrito;";
                var updateParams = new ParameterList();
                updateParams.Add("@idCarrito", idCarrito);
                DB.ExecuteNonQuery(updateExpirationQuery, updateParams);

                // 3. El resto del flujo para añadir entradas continúa como antes.
                foreach (var entradaReq in request.entradas)
                {
                    string queryStock = "SELECT nombre, cantidadEntradas, cantidadVendida FROM TipoEntrada WHERE id = @idTipoEntrada FOR UPDATE;";
                    var parametrosStock = new ParameterList();
                    parametrosStock.Add("@idTipoEntrada", entradaReq.idTipoEntrada);

                    int cantidadDisponible = 0;
                    string nombreTipoEntrada = "Entrada Desconocida";

                    DB.Select(queryStock, parametrosStock);
                    try
                    {
                        if (DB.Read())
                        {
                            nombreTipoEntrada = DB.GetString("nombre");
                            cantidadDisponible = DB.GetInt("cantidadEntradas") - DB.GetInt("cantidadVendida");
                        }
                    }
                    finally { DB.CloseReader(); }

                    if (cantidadDisponible >= entradaReq.cantidad)
                    {
                        string queryUpdateStock = "UPDATE TipoEntrada SET cantidadVendida = cantidadVendida + @cantidad WHERE id = @idTipoEntrada;";
                        var parametrosUpdate = new ParameterList();
                        parametrosUpdate.Add("@cantidad", entradaReq.cantidad);
                        parametrosUpdate.Add("@idTipoEntrada", entradaReq.idTipoEntrada);
                        DB.ExecuteNonQuery(queryUpdateStock, parametrosUpdate);

                        var entradaMapper = new EntradaMapper(globales, DB);
                        for (int i = 0; i < entradaReq.cantidad; i++)
                        {
                            Entrada nuevaEntrada = new() { idCarrito = idCarrito, idTipoEntrada = entradaReq.idTipoEntrada };
                            entradaMapper.InsertarEntrada(nuevaEntrada);
                        }
                    }
                    else
                    {
                        rechazados.Add(new RechazadoDTO { idTipoEntrada = entradaReq.idTipoEntrada, nombre = nombreTipoEntrada, cantidadSolicitada = entradaReq.cantidad, cantidadDisponible = cantidadDisponible });
                    }
                }

                DB.Commit();
                // Al final, llamamos a ObtenerCarrito que nos devolverá el contenido completo.
                var carritoFinal = ObtenerCarrito(idCliente);
                return (carritoFinal, rechazados);
            }
            catch (Exception)
            {
                DB.Rollback();
                throw;
            }
        }


        public void LimpiarCarrito(int idCliente)
        {
            DB.BeginTransaction();
            try
            {
                string queryEntradas =
                    "SELECT e.idTipoEntrada, COUNT(e.id) as cantidad, c.id as idCarrito " +
                    "FROM Entrada e JOIN Carrito c ON e.idCarrito = c.id " +
                    "WHERE c.idCliente = @idCliente AND UTC_TIMESTAMP() < c.fechaExpiracion " +
                    "GROUP BY e.idTipoEntrada, c.id;";

                var parametros = new ParameterList();
                parametros.Add("@idCliente", idCliente);
                var entradasParaLiberar = new List<(int idTipoEntrada, int cantidad, int idCarrito)>();

                DB.Select(queryEntradas, parametros);
                try
                {
                    while (DB.Read()) { entradasParaLiberar.Add((DB.GetInt("idTipoEntrada"), DB.GetInt("cantidad"), DB.GetInt("idCarrito"))); }
                }
                finally { DB.CloseReader(); }

                if (entradasParaLiberar.Any())
                {
                    int idCarrito = entradasParaLiberar.First().idCarrito;

                    foreach (var item in entradasParaLiberar)
                    {
                        // Usamos CASE para evitar números negativos
                        string queryUpdateStock = "UPDATE TipoEntrada " +
                                                  "SET cantidadVendida = CASE WHEN (cantidadVendida - @cantidad) < 0 THEN 0 ELSE (cantidadVendida - @cantidad) END " +
                                                  "WHERE id = @idTipoEntrada;";

                        var pUpdate = new ParameterList();
                        pUpdate.Add("@cantidad", item.cantidad);
                        pUpdate.Add("@idTipoEntrada", item.idTipoEntrada);
                        DB.ExecuteNonQuery(queryUpdateStock, pUpdate);
                    }

                    var pCarrito = new ParameterList();
                    pCarrito.Add("@idCarrito", idCarrito);
                    DB.ExecuteNonQuery("DELETE FROM Entrada WHERE idCarrito = @idCarrito", pCarrito);
                    DB.ExecuteNonQuery("DELETE FROM Carrito WHERE id = @idCarrito", pCarrito);
                }

                DB.Commit();
            }
            catch (Exception)
            {
                DB.Rollback();
                throw;
            }
        }


        /// <summary>
        /// Elimina todas las entradas de un tipo específico (tier) del carrito
        /// y devuelve el stock.
        /// </summary>
        /// <returns>La lista actualizada de items del carrito.</returns>
        public List<ObtenerCarritoDTO> EliminarTipoEntradaDelCarrito(int idCliente, int idTipoEntrada)
        {
            DB.BeginTransaction();
            try
            {
                string queryCarrito = "SELECT id FROM Carrito WHERE idCliente = @idCliente AND fechaExpiracion > UTC_TIMESTAMP() LIMIT 1";
                var pCarrito = new ParameterList();
                pCarrito.Add("@idCliente", idCliente);
                object carritoIdObj = DB.ExecuteScalar(queryCarrito, pCarrito);

                if (carritoIdObj == null || carritoIdObj == DBNull.Value)
                {
                    DB.Commit();
                    return new List<ObtenerCarritoDTO>();
                }

                int idCarrito = Convert.ToInt32(carritoIdObj);

                string queryCount = "SELECT COUNT(id) FROM Entrada WHERE idCarrito = @idCarrito AND idTipoEntrada = @idTipoEntrada";
                var pParams = new ParameterList();
                pParams.Add("@idCarrito", idCarrito);
                pParams.Add("@idTipoEntrada", idTipoEntrada);

                int cantidadAEliminar = Convert.ToInt32(DB.ExecuteScalar(queryCount, pParams));

                if (cantidadAEliminar > 0)
                {
                    string queryDelete = "DELETE FROM Entrada WHERE idCarrito = @idCarrito AND idTipoEntrada = @idTipoEntrada";
                    DB.ExecuteNonQuery(queryDelete, pParams);

                    // Usamos CASE para evitar números negativos
                    string queryUpdateStock = "UPDATE TipoEntrada " +
                                              "SET cantidadVendida = CASE WHEN (cantidadVendida - @cantidad) < 0 THEN 0 ELSE (cantidadVendida - @cantidad) END " +
                                              "WHERE id = @idTipoEntrada;";

                    var pUpdate = new ParameterList();
                    pUpdate.Add("@cantidad", cantidadAEliminar);
                    pUpdate.Add("@idTipoEntrada", idTipoEntrada);
                    DB.ExecuteNonQuery(queryUpdateStock, pUpdate);
                }

                DB.Commit();
                return ObtenerCarrito(idCliente);
            }
            catch (Exception)
            {
                DB.Rollback();
                throw;
            }
        }
    }
}
        