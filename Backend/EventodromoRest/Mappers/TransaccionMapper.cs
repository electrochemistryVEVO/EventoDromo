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

        public bool TransferirEntradas(int idCliente, RequestTransferencia request)
        {
            //public class RequestTransferencia
            //{
                //public string email { get; set; }
                //public List<int> entradas { get; set; }
            //}
            lock (DB)
            {
                //Obtener transaccion por el idCliente del cliente origen
                string query = "SELECT * FROM Transaccion WHERE idCliente = @idCliente";
                var parametros = new ParameterList();
                parametros.Add("@idCliente", idCliente);
                DB.Select(query, parametros);
                if (DB.Read())
                {
                    Transaccion transaccionOrigen = new()
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
                    transaccionOrigen.carrito = ObtenerCarritoPorId(transaccionOrigen.idCarrito);
                    transaccionOrigen.tipoDocumento = ObtenerTipoDocumentoPorId(transaccionOrigen.idTipoDocumento);
                    return true;
                }
                else
                {
                    return false;
                }

                //Obtener cliente destino por su correo
                query = "SELECT id, nombres, apellidos, idTipoDocumento, numeroDocumento FROM Cliente WHERE email = @email";
                parametros = new ParameterList();
                parametros.Add("@email", request.email);
                DB.Select(query, parametros);
                Cliente clienteDestino = new();
                if (DB.Read())
                {
                    clienteDestino = new Cliente()
                    {
                        id = DB.GetInt("id"),
                        nombres = DB.GetString("nombres"),
                        apellidos = DB.GetString("apellidos"),
                        //email = DB.GetString("email"),
                        //passwordhash = DB.GetString("passwordHash"),
                        ////fechanacimiento = DB.GetDateTime("fechaNacimiento"),
                        //idsexo = DB.GetInt("idSexo"),
                        idtipodocumento = DB.GetInt("idTipoDocumento"),
                        numerodocumento = DB.GetString("numeroDocumento"),
                        //telefono = DB.GetString("telefono"),
                        //idciudad = DB.GetInt("idCiudad"),
                        //politicadeprivacidad = DB.GetBoolean("politicaDePrivacidad"),
                        //enviodepublicidad = DB.GetBoolean("envioDePublicidad"),
                        ////fechacreacion = DB.GetDateTime("fechaCreacion"),
                        ////fechaultimaedicion = DB.GetDateTime("fechaUltimaEdicion"),
                        ////fechaultimasession = DB.GetDateTime("fechaUltimaSesion"),
                        //sexo = ObtenerSexoPorId(DB.GetInt("idSexo")),
                        //tipodocumento = ObtenerTipoDocumentoPorId(DB.GetInt("idTipoDocumento")),
                        //ciudad = ObtenerCiudadPorId(DB.GetInt("idCiudad"))
                    };
                    return true;
                }
                else
                {
                    return false;
                }

                //Obtener transaccion por el idCliente del cliente destino
                query = "SELECT * FROM Transaccion WHERE idCliente = @idCliente";
                parametros = new ParameterList();
                parametros.Add("@idCliente", clienteDestino.id);
                DB.Select(query, parametros);
                if (DB.Read())
                {
                    Transaccion transaccionDestino = new()
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
                    transaccionDestino.carrito = ObtenerCarritoPorId(transaccionDestino.idCarrito);
                    transaccionDestino.tipoDocumento = ObtenerTipoDocumentoPorId(transaccionDestino.idTipoDocumento);
                    return true;
                }
                else
                {
                    return false;
                }

                //Buscar LineaTransaccion, crear uno nuevo (copia del original)
                //Al original, colocarle transferido = true 
                //A la copia, colocarle transferido = false y cambiarle los datos del cliente al de cliente destino

            }
        }
        public List<Entrada> ObtenerEntradasPorTransaccion(int idTransaccion)
        {
            List<Entrada> listaEntradas = new List<Entrada>();
            lock (DB)
            {
                string query = @"SELECT e.* 
                        FROM Entrada e 
                        INNER JOIN LineaTransaccion lt ON e.id = lt.idEntrada 
                        WHERE lt.idTransaccion = @idTransaccion";
                var parametros = new ParameterList();
                parametros.Add("@idTransaccion", idTransaccion);

                DB.Select(query, parametros);
                while (DB.Read())
                {
                    Entrada entrada = new()
                    {
                        id = DB.GetInt("id"),
                        idCarrito = DB.GetInt("idCarrito"),
                        idTipoEntrada = DB.GetInt("idTipoEntrada")
                    };

                    // Obtener objetos relacionados
                    entrada.carrito = ObtenerCarritoPorId(entrada.idCarrito);
                    entrada.tipoEntrada = ObtenerTipoEntradaPorId(entrada.idTipoEntrada);

                    listaEntradas.Add(entrada);
                }
                return listaEntradas;
            }
        }

        private TipoEntrada ObtenerTipoEntradaPorId(int id)
        {
            var tipoEntradaMapper = new TipoEntradaMapper(globales, DB);
            return tipoEntradaMapper.ObtenerTipoEntradaPorId(id);
        }

        public ResponseProcesarPago CrearTransaccionTarjeta(int idCliente, RequestProcesarPago request)
        {
            DB.BeginTransaction();
            try
            {
                // --- 1. Obtener Carrito Activo ---
                var carrito = ObtenerCarritoActivoPorCliente(idCliente);
                if (carrito == null) throw new Exception("Tu carrito está vacío o ha expirado.");

                // --- 2. Obtener Entradas y Precios (Cálculo Server-Side) ---
                var entradasConPrecio = ObtenerEntradasConPrecio(carrito.id);
                if (!entradasConPrecio.Any()) throw new Exception("No se encontraron entradas válidas en tu carrito.");

                decimal montoTotalCalculado = entradasConPrecio.Sum(e => e.Precio);
                int puntosTotalesGanados = entradasConPrecio.Sum(e => e.Puntos);

                // --- 3. Insertar Tarjeta (solo los últimos 4 dígitos) ---
                string numeroTarjeta = request.DatosTarjeta.Numero.Replace(" ", "");
                string ultimos4Digitos = numeroTarjeta.Length > 4
                    ? numeroTarjeta.Substring(numeroTarjeta.Length - 4)
                    : numeroTarjeta;

                string queryTarjeta = "INSERT INTO Tarjeta (numero) VALUES (@ultimos4); SELECT LAST_INSERT_ID();";
                var pTarjeta = new ParameterList();
                pTarjeta.Add("@ultimos4", ultimos4Digitos);
                int idTarjeta = Convert.ToInt32(DB.ExecuteScalar(queryTarjeta, pTarjeta));

                // --- 4. Insertar Transacción Principal ---
                string numeroDeTransaccion = "TXN-" + Guid.NewGuid().ToString("N").Substring(0, 16).ToUpper();
                string queryTrans = "INSERT INTO Transaccion (idCarrito, fechaHoraCompra, numeroTransaccion, nombresCliente, apellidosCliente, emailCliente, numeroDocumentoCliente, idTipoDocumento, montoTotal, idCliente) " +
                                    "VALUES (@idCarrito, UTC_TIMESTAMP(), @numTrans, @nombres, @apellidos, @email, @numDoc, @idTipoDoc, @monto, @idCliente); SELECT LAST_INSERT_ID();";
                var pTrans = new ParameterList();
                pTrans.Add("@idCarrito", carrito.id);
                pTrans.Add("@numTrans", numeroDeTransaccion);
                pTrans.Add("@nombres", request.DatosFacturacion.Nombres);
                pTrans.Add("@apellidos", request.DatosFacturacion.Apellidos);
                pTrans.Add("@email", request.DatosFacturacion.Email);
                pTrans.Add("@numDoc", request.DatosFacturacion.NumeroDocumento);
                pTrans.Add("@idTipoDoc", request.DatosFacturacion.IdTipoDocumento);
                pTrans.Add("@monto", montoTotalCalculado);
                pTrans.Add("@idCliente", idCliente);

                int idTransaccion = Convert.ToInt32(DB.ExecuteScalar(queryTrans, pTrans));

                // --- 5. Vincular Tarjeta y Transacción ---
                string queryLinkTarj = "INSERT INTO TransaccionTarjeta (idTransaccion, idTarjeta) VALUES (@idTrans, @idTarj);";
                var pLinkTarj = new ParameterList();
                pLinkTarj.Add("@idTrans", idTransaccion);
                pLinkTarj.Add("@idTarj", idTarjeta);
                DB.ExecuteNonQuery(queryLinkTarj, pLinkTarj);

                // --- 6. Vincular cada Entrada (LineaTransaccion) ---
                foreach (var entrada in entradasConPrecio)
                {
                    string queryLinea = "INSERT INTO LineaTransaccion (idTransaccion, idEntrada, precio, puntosGanados) VALUES (@idTrans, @idEntrada, @precio, @puntos);";
                    var pLinea = new ParameterList();
                    pLinea.Add("@idTrans", idTransaccion);
                    pLinea.Add("@idEntrada", entrada.IdEntrada);
                    pLinea.Add("@precio", entrada.Precio);
                    pLinea.Add("@puntos", entrada.Puntos);
                    DB.ExecuteNonQuery(queryLinea, pLinea);
                }

                // --- 7. Registrar Puntos Ganados (si hay) ---
                if (puntosTotalesGanados > 0)
                {
                    // Obtener meses de vigencia desde configuración
                    var dromopuntosMapper = new DromopuntosMapper(globales, DB);
                    int mesesVigencia = dromopuntosMapper.ObtenerMesesVigenciaPuntos();

                    string queryPuntos = "INSERT INTO Punto (cantidad, cantidadRestante, fechaHoraRegistro, idCliente, fechaExpiracion) " +
                                         $"VALUES (@cant, @cantRestante, UTC_TIMESTAMP(), @idCli, UTC_TIMESTAMP() + INTERVAL {mesesVigencia} MONTH);";

                    var pPuntos = new ParameterList();
                    pPuntos.Add("@cant", puntosTotalesGanados);
                    pPuntos.Add("@cantRestante", puntosTotalesGanados);
                    pPuntos.Add("@idCli", idCliente);
                    DB.ExecuteNonQuery(queryPuntos, pPuntos);
                }

                // --- 8. Registrar en Auditoría (Asumo ID 1 = "Compra") ---
                string queryAudit = "INSERT INTO Auditoria (idCliente, idTipoAuditoria, descripcion, fechaHora, monto) VALUES (@idCli, 1, 'Compra de entradas', UTC_TIMESTAMP(), @monto);";
                var pAudit = new ParameterList();
                pAudit.Add("@idCli", idCliente);
                pAudit.Add("@monto", montoTotalCalculado);
                DB.ExecuteNonQuery(queryAudit, pAudit);

                // --- 9. "CERRAR" EL CARRITO (¡CORREGIDO!) ---
                // No borramos el carrito, solo actualizamos su expiración
                // para que ya no aparezca como "activo".
                string queryCerrarCarrito = "UPDATE Carrito SET fechaExpiracion = UTC_TIMESTAMP() WHERE id = @idCarrito";
                var pCarritoId = new ParameterList();
                pCarritoId.Add("@idCarrito", carrito.id);
                DB.ExecuteNonQuery(queryCerrarCarrito, pCarritoId);
                // ¡Ya no borramos las entradas!

                // --- 10. ¡Confirmar Transacción! ---
                DB.Commit();

                // --- 11. Retornar Respuesta Exitosa ---
                return new ResponseProcesarPago
                {
                    IdTransaccion = idTransaccion,
                    NumeroTransaccion = numeroDeTransaccion,
                    FechaCompra = DateTime.UtcNow,
                    MontoTotal = montoTotalCalculado,
                    PuntosGanados = puntosTotalesGanados,
                    Ultimos4DigitosTarjeta = ultimos4Digitos
                };
            }
            catch (Exception)
            {
                DB.Rollback(); // Si algo falla, deshacemos todo
                throw;
            }
        }

        private Carrito ObtenerCarritoActivoPorCliente(int idCliente)
        {
            // Busca un carrito que no haya expirado
            //string query = "SELECT * FROM Carrito WHERE idCliente = @idCli AND fechaExpiracion > UTC_TIMESTAMP() LIMIT 1";
            string query = "SELECT * FROM Carrito WHERE idCliente = @idCli AND fechaExpiracion > UTC_TIMESTAMP() " +
                           "ORDER BY fechaCreacion DESC LIMIT 1";
            var p = new ParameterList();
            p.Add("@idCli", idCliente);
            DB.Select(query, p);
            try
            {
                if (DB.Read())
                {
                    return new Carrito
                    {
                        id = DB.GetInt("id"),
                        idCliente = DB.GetInt("idCliente"),
                        fechaExpiracion = DB.GetDateTime("fechaExpiracion")
                    };
                }
            }
            finally { DB.CloseReader(); }
            return null; // No hay carrito activo
        }

        private List<PrecioEntradaDTO> ObtenerEntradasConPrecio(int idCarrito)
        {
            var lista = new List<PrecioEntradaDTO>();
            // Consulta optimizada: Trae solo los datos necesarios
            string query = "SELECT e.id, te.precio, te.puntos FROM Entrada e " +
                           "JOIN TipoEntrada te ON e.idTipoEntrada = te.id " +
                           "WHERE e.idCarrito = @idCarrito";
            var p = new ParameterList();
            p.Add("@idCarrito", idCarrito);
            DB.Select(query, p);
            try
            {
                while (DB.Read())
                {
                    lista.Add(new PrecioEntradaDTO
                    {
                        IdEntrada = DB.GetInt("id"),
                        Precio = DB.GetDecimal("precio"),
                        Puntos = DB.GetInt("puntos")
                    });
                }
            }
            finally { DB.CloseReader(); }
            return lista;
        }

        public ResponseProcesarPago CrearTransaccionPuntos(int idCliente, RequestProcesarPagoPuntos request)
        {
            DB.BeginTransaction();
            try
            {
                // --- 1. Obtener Carrito Activo ---
                var carrito = ObtenerCarritoActivoPorCliente(idCliente);
                if (carrito == null) throw new Exception("Tu carrito está vacío o ha expirado.");

                // --- 2. Obtener Entradas y Precios (Cálculo Server-Side) ---
                var entradasConPrecio = ObtenerEntradasConPrecio(carrito.id);
                if (!entradasConPrecio.Any()) throw new Exception("No se encontraron entradas válidas en tu carrito.");

                // --- 3. Verificar Puntos (Server-Side) ---
                decimal montoTotalCalculado = entradasConPrecio.Sum(e => e.Precio);
                decimal puntosPorSol = ObtenerPuntosPorSol();
                int puntosRequeridosServidor = (int)Math.Ceiling(montoTotalCalculado / puntosPorSol);

                // Verificamos que el front no mienta
                if (request.PuntosAGastar != puntosRequeridosServidor)
                {
                    throw new Exception("El costo en puntos ha cambiado. Por favor, intente de nuevo.");
                }

                // --- 4. Consumir Puntos (Lógica FIFO) ---
                // Este método valida el saldo y ejecuta los UPDATEs. Si falla, lanza excepción.
                ConsumirPuntos(idCliente, puntosRequeridosServidor);

                // --- 5. Insertar Transacción Principal (Monto 0.00) ---
                string numeroDeTransaccion = "TRP-" + Guid.NewGuid().ToString("N").Substring(0, 16).ToUpper();
                string queryTrans = "INSERT INTO Transaccion (idCarrito, fechaHoraCompra, numeroTransaccion, nombresCliente, apellidosCliente, emailCliente, numeroDocumentoCliente, idTipoDocumento, montoTotal, idCliente) " +
                                    "VALUES (@idCarrito, UTC_TIMESTAMP(), @numTrans, @nombres, @apellidos, @email, @numDoc, @idTipoDoc, 0.00, @idCliente); SELECT LAST_INSERT_ID();"; // <-- Monto 0
                var pTrans = new ParameterList();
                pTrans.Add("@idCarrito", carrito.id);
                pTrans.Add("@numTrans", numeroDeTransaccion);
                pTrans.Add("@nombres", request.DatosFacturacion.Nombres);
                pTrans.Add("@apellidos", request.DatosFacturacion.Apellidos);
                pTrans.Add("@email", request.DatosFacturacion.Email);
                pTrans.Add("@numDoc", request.DatosFacturacion.NumeroDocumento);
                pTrans.Add("@idTipoDoc", request.DatosFacturacion.IdTipoDocumento);
                pTrans.Add("@idCliente", idCliente);

                int idTransaccion = Convert.ToInt32(DB.ExecuteScalar(queryTrans, pTrans));

                // --- 6. Vincular Puntos y Transacción ---
                string queryLinkPuntos = "INSERT INTO TransaccionPuntos (idTransaccion, idCliente, puntosGastados) VALUES (@idTrans, @idCli, @puntosGastados);";
                var pLinkPuntos = new ParameterList();
                pLinkPuntos.Add("@idTrans", idTransaccion);
                pLinkPuntos.Add("@idCli", idCliente);
                pLinkPuntos.Add("@puntosGastados", puntosRequeridosServidor);
                DB.ExecuteNonQuery(queryLinkPuntos, pLinkPuntos);

                // --- 7. Vincular cada Entrada (LineaTransaccion) ---
                // Guardamos el precio original (para métricas) pero 0 puntos ganados.
                foreach (var entrada in entradasConPrecio)
                {
                    string queryLinea = "INSERT INTO LineaTransaccion (idTransaccion, idEntrada, precio, puntosGanados) VALUES (@idTrans, @idEntrada, @precio, 0);"; // Puntos Ganados = 0
                    var pLinea = new ParameterList();
                    pLinea.Add("@idTrans", idTransaccion);
                    pLinea.Add("@idEntrada", entrada.IdEntrada);
                    pLinea.Add("@precio", entrada.Precio); // Guardamos el precio original
                    DB.ExecuteNonQuery(queryLinea, pLinea);
                }

                // --- 8. Registrar en Auditoría (ID 4 = "Uso de Puntos") ---
                string queryAudit = "INSERT INTO Auditoria (idCliente, idTipoAuditoria, descripcion, fechaHora, monto) VALUES (@idCli, 4, 'Canje de puntos por compra', UTC_TIMESTAMP(), @monto);";
                var pAudit = new ParameterList();
                pAudit.Add("@idCli", idCliente);
                pAudit.Add("@monto", -puntosRequeridosServidor); // Monto negativo
                DB.ExecuteNonQuery(queryAudit, pAudit);

                // --- 9. "CERRAR" EL CARRITO ---
                string queryCerrarCarrito = "UPDATE Carrito SET fechaExpiracion = UTC_TIMESTAMP() WHERE id = @idCarrito";
                var pCarritoId = new ParameterList();
                pCarritoId.Add("@idCarrito", carrito.id);
                DB.ExecuteNonQuery(queryCerrarCarrito, pCarritoId);

                // --- 10. ¡Confirmar Transacción! ---
                DB.Commit();

                // --- 11. Retornar Respuesta Exitosa ---
                return new ResponseProcesarPago
                {
                    IdTransaccion = idTransaccion,
                    NumeroTransaccion = numeroDeTransaccion,
                    FechaCompra = DateTime.UtcNow,
                    MontoTotal = 0.00m, // Pago fue con puntos
                    PuntosGastados = puntosRequeridosServidor
                };
            }
            catch (Exception)
            {
                DB.Rollback(); // Si algo falla (ej. Puntos insuficientes), deshacemos todo
                throw;
            }
        }

        private decimal ObtenerPuntosPorSol()
        {
            // Lee la configuración de tu BD. Asumo ID 1.
            string query = "SELECT puntos_por_sol FROM configuracion WHERE id = 1";
            object result = DB.ExecuteScalar(query, new ParameterList());
            if (result != null && result != DBNull.Value)
            {
                return Convert.ToDecimal(result);
            }
            // Fallback por si la tabla está vacía, (10.00 como dijiste)
            return 10.00m;
        }

        private void ConsumirPuntos(int idCliente, int puntosAGastar)
        {
            // 1. Bloqueamos los lotes del cliente para evitar que compre dos veces
            string queryLotes = "SELECT id, cantidadRestante FROM Punto " +
                                "WHERE idCliente = @idCli AND cantidadRestante > 0 AND fechaExpiracion > UTC_TIMESTAMP() " +
                                "ORDER BY fechaExpiracion ASC FOR UPDATE;";
            var pLotes = new ParameterList();
            pLotes.Add("@idCli", idCliente);

            var lotesDisponibles = new List<LotePunto>();
            DB.Select(queryLotes, pLotes);
            try
            {
                while (DB.Read())
                {
                    lotesDisponibles.Add(new LotePunto
                    {
                        Id = DB.GetInt("id"),
                        CantidadRestante = DB.GetInt("cantidadRestante")
                    });
                }
            }
            finally { DB.CloseReader(); }

            // 2. Verificar si tiene fondos suficientes
            int totalDisponible = lotesDisponibles.Sum(l => l.CantidadRestante);
            if (totalDisponible < puntosAGastar)
            {
                throw new Exception("Puntos insuficientes. El usuario no tiene los puntos necesarios.");
            }

            // 3. Consumir los lotes (Lógica FIFO)
            int puntosRestantesPorGastar = puntosAGastar;

            foreach (var lote in lotesDisponibles)
            {
                if (puntosRestantesPorGastar <= 0) break; // Ya gastamos todo

                int puntosAConsumirDeEsteLote;
                if (lote.CantidadRestante >= puntosRestantesPorGastar)
                {
                    // Este lote cubre todo lo que falta
                    puntosAConsumirDeEsteLote = puntosRestantesPorGastar;
                }
                else
                {
                    // Este lote se consume por completo
                    puntosAConsumirDeEsteLote = lote.CantidadRestante;
                }

                // Actualizamos la BD
                int nuevoSaldoDelLote = lote.CantidadRestante - puntosAConsumirDeEsteLote;
                string queryUpdatePunto = "UPDATE Punto SET cantidadRestante = @restante WHERE id = @idPunto";
                var pUpdate = new ParameterList();
                pUpdate.Add("@restante", nuevoSaldoDelLote);
                pUpdate.Add("@idPunto", lote.Id);
                DB.ExecuteNonQuery(queryUpdatePunto, pUpdate);

                // Actualizamos el contador para el bucle
                puntosRestantesPorGastar -= puntosAConsumirDeEsteLote;
            }

            // Seguridad extra, aunque el check inicial debería bastar
            if (puntosRestantesPorGastar > 0)
            {
                throw new Exception("Error al consumir puntos, saldo inconsistente.");
            }
        }

        /// <summary>
        /// Obtiene los detalles de las entradas de una transacción para enviar por email.
        /// </summary>
        public List<Modelos.Utiles.DetalleEntradaEmail> ObtenerDetallesEntradasParaEmail(int idTransaccion)
        {
            lock (DB)
            {
                string query = @"
                    SELECT 
                        ev.nombre AS NombreEvento,
                        te.nombre AS TipoEntrada,
                        lt.precio AS PrecioUnitario,
                        COUNT(*) AS Cantidad
                    FROM LineaTransaccion lt
                    INNER JOIN Entrada e ON lt.idEntrada = e.id
                    INNER JOIN TipoEntrada te ON e.idTipoEntrada = te.id
                    INNER JOIN FechaEvento fe ON te.idFechaEvento = fe.id
                    INNER JOIN Evento ev ON fe.idEvento = ev.id
                    WHERE lt.idTransaccion = @idTrans
                    GROUP BY ev.nombre, te.nombre, lt.precio
                    ORDER BY ev.nombre, te.nombre";

                var parametros = new ParameterList();
                parametros.Add("@idTrans", idTransaccion);

                var detalles = new List<Modelos.Utiles.DetalleEntradaEmail>();

                DB.Select(query, parametros);
                try
                {
                    while (DB.Read())
                    {
                        detalles.Add(new Modelos.Utiles.DetalleEntradaEmail
                        {
                            NombreEvento = DB.GetString("NombreEvento"),
                            TipoEntrada = DB.GetString("TipoEntrada"),
                            Cantidad = DB.GetInt("Cantidad"),
                            PrecioUnitario = DB.GetDecimal("PrecioUnitario")
                        });
                    }
                }
                finally
                {
                    DB.CloseReader();
                }

                return detalles;
            }
        }

        /// <summary>
        /// Obtiene el detalle completo de una transacción filtrado por evento específico:
        /// - Información del evento (título, imagen, ubicación, fecha)
        /// - Datos de la transacción (número, fecha, estado)
        /// - Datos del cliente (nombre, email, tipo y número de documento)
        /// - Lista de entradas del evento específico (tipo, cantidad, precio)
        /// - Método de pago (tarjeta/puntos/transferencia)
        /// 
        /// Verifica que la transacción pertenezca al cliente autenticado
        /// </summary>
        public DetalleTransaccionCompleto? ObtenerDetalleCompleto(string numeroTransaccion, int idEvento, int idCliente)
        {
            lock (DB)
            {
                // Query principal que obtiene toda la información necesaria
                string query = @"
                    SELECT 
                        -- Datos del evento (directo desde el idEvento)
                        ev.nombre AS EventoTitulo,
                        ev.imagenURL AS EventoImagen,
                        CONCAT(l.nombre, ', ', c.nombre, ', ', p.nombre) AS EventoUbicacion,
                        fe.fechaHora AS EventoFecha,
                        
                        -- Datos de la transacción
                        t.numeroTransaccion AS TransaccionNumero,
                        t.fechaHoraCompra AS TransaccionFecha,
                        t.montoTotal AS TransaccionTotal,
                        
                        -- Datos del cliente (de la transacción)
                        CONCAT(t.nombresCliente, ' ', t.apellidosCliente) AS ClienteNombre,
                        t.emailCliente AS ClienteEmail,
                        td.nombre AS ClienteTipoDocumento,
                        t.numeroDocumentoCliente AS ClienteNumeroDocumento,
                        
                        -- Verificar el carrito para obtener el idCliente
                        ca.idCliente AS CarritoIdCliente,
                        
                        -- Verificar si existe tarjeta (obtener últimos 4 dígitos de la tabla Tarjeta)
                        CASE 
                            WHEN tar.numero IS NOT NULL THEN RIGHT(tar.numero, 4)
                            ELSE NULL
                        END AS TarjetaUltimos4,
                        
                        -- Verificar si existe pago con puntos
                        tp.puntosGastados AS PuntosPagados,
                        
                        -- Verificar si es transferencia (origen)
                        CASE 
                            WHEN ttr.idTransaccion IS NOT NULL THEN 1
                            ELSE 0
                        END AS EsTransferencia,
                        trp.emailDestino AS TransferenciaEmailDestino,
                        trp.estado AS TransferenciaEstado
                        
                    FROM Transaccion t
                    INNER JOIN Carrito ca ON t.idCarrito = ca.id
                    INNER JOIN TipoDocumento td ON t.idTipoDocumento = td.id
                    LEFT JOIN TransaccionTarjeta tt ON tt.idTransaccion = t.id
                    LEFT JOIN Tarjeta tar ON tt.idTarjeta = tar.id
                    LEFT JOIN TransaccionPuntos tp ON tp.idTransaccion = t.id
                    LEFT JOIN TransaccionTransferencia ttr ON ttr.idTransaccion = t.id
                    LEFT JOIN TransferenciaPendiente trp ON ttr.idTransferenciaPendiente = trp.id
                    -- Obtener datos del evento directamente usando el idEvento
                    LEFT JOIN Evento ev ON ev.id = @idEvento
                    LEFT JOIN Local l ON ev.idLocal = l.id
                    LEFT JOIN Ciudad c ON l.idCiudad = c.id
                    LEFT JOIN Pais p ON c.idPais = p.id
                    LEFT JOIN (
                        SELECT MIN(fechaHora) as fechaHora
                        FROM FechaEvento
                        WHERE idEvento = @idEvento
                    ) fe ON 1=1
                    WHERE t.numeroTransaccion = @numeroTransaccion
                    LIMIT 1";

                var parametros = new ParameterList();
                parametros.Add("@numeroTransaccion", numeroTransaccion);
                parametros.Add("@idEvento", idEvento);

                DB.Select(query, parametros);
                
                if (!DB.Read())
                {
                    DB.CloseReader();
                    return null; // Transacción no encontrada
                }

                // Verificar que la transacción pertenece al cliente
                int carritoIdCliente = DB.GetInt("CarritoIdCliente");
                if (carritoIdCliente != idCliente)
                {
                    DB.CloseReader();
                    throw new Exception("No tiene permisos para ver esta transacción.");
                }

                // Construir el objeto de respuesta
                var detalle = new DetalleTransaccionCompleto
                {
                    Evento = new EventoTransaccionDTO
                    {
                        Titulo = DB.GetStringOrNull("EventoTitulo") ?? "Evento no disponible",
                        Imagen = DB.GetStringOrNull("EventoImagen") ?? "",
                        Ubicacion = DB.GetStringOrNull("EventoUbicacion") ?? "",
                        Fecha = DB.GetNullableDateTime("EventoFecha") ?? DateTime.Now
                    },
                    Transaccion = new TransaccionDetalleDTO
                    {
                        NumeroTransaccion = DB.GetString("TransaccionNumero"),
                        Fecha = DB.GetDateTime("TransaccionFecha"),
                        Estado = "Completada"
                    },
                    Cliente = new ClienteTransaccionDTO
                    {
                        Nombre = DB.GetString("ClienteNombre"),
                        Email = DB.GetString("ClienteEmail"),
                        Telefono = "", // No está disponible en la transacción
                        TipoDocumento = DB.GetStringOrNull("ClienteTipoDocumento") ?? "DNI",
                        NumeroDocumento = DB.GetStringOrNull("ClienteNumeroDocumento") ?? ""
                    },
                    Total = DB.GetDecimal("TransaccionTotal")
                };

                // Determinar el método de pago
                string? tarjetaUltimos4 = DB.GetStringOrNull("TarjetaUltimos4");
                int? puntosPagados = DB.GetIntOrNull("PuntosPagados");
                bool esTransferencia = DB.GetInt("EsTransferencia") == 1;
                string? transferenciaEmail = DB.GetStringOrNull("TransferenciaEmailDestino");
                string? transferenciaEstado = DB.GetStringOrNull("TransferenciaEstado");

                if (esTransferencia)
                {
                    // Es una transferencia
                    if (transferenciaEstado == "pendiente")
                    {
                        // Pendiente de aceptación
                        detalle.MetodoPago = new MetodoPagoDTO
                        {
                            Tipo = "transferencia_pendiente",
                            Detalles = new DetallesPagoDTO
                            {
                                EmailDestino = transferenciaEmail
                            }
                        };
                        detalle.Transaccion.Estado = "Pendiente";
                    }
                    else
                    {
                        // Transferencia completada (recibida)
                        detalle.MetodoPago = new MetodoPagoDTO
                        {
                            Tipo = "transferencia",
                            Detalles = new DetallesPagoDTO()
                        };
                    }
                }
                else if (!string.IsNullOrEmpty(tarjetaUltimos4))
                {
                    // Pago con tarjeta
                    detalle.MetodoPago = new MetodoPagoDTO
                    {
                        Tipo = "tarjeta",
                        Detalles = new DetallesPagoDTO
                        {
                            Ultimos4Digitos = tarjetaUltimos4
                        }
                    };
                }
                else if (puntosPagados.HasValue && puntosPagados > 0)
                {
                    // Pago con puntos
                    detalle.MetodoPago = new MetodoPagoDTO
                    {
                        Tipo = "puntos",
                        Detalles = new DetallesPagoDTO
                        {
                            PuntosUtilizados = puntosPagados.Value
                        }
                    };
                }
                else
                {
                    // Caso por defecto (no debería ocurrir)
                    detalle.MetodoPago = new MetodoPagoDTO
                    {
                        Tipo = "tarjeta",
                        Detalles = new DetallesPagoDTO()
                    };
                }

                DB.CloseReader();

                // Obtener las entradas de la transacción filtradas por evento y cliente
                detalle.Entradas = ObtenerEntradasDeTransaccion(numeroTransaccion, idEvento, idCliente);

                return detalle;
            }
        }

        /// <summary>
        /// Obtiene la lista de entradas agrupadas por tipo para una transacción y evento específico
        /// Solo incluye entradas que el cliente actualmente posee (no transferidas a otros)
        /// </summary>
        private List<EntradaTransaccionDTO> ObtenerEntradasDeTransaccion(string numeroTransaccion, int idEvento, int idCliente)
        {
            lock (DB)
            {
                string query = @"
                    SELECT 
                        te.nombre AS TipoEntrada,
                        COUNT(*) AS Cantidad,
                        lt.precio AS PrecioUnitario,
                        (COUNT(*) * lt.precio) AS Subtotal,
                        COALESCE(e.estadoTransferencia, 'disponible') AS Estado
                    FROM Transaccion t
                    INNER JOIN LineaTransaccion lt ON lt.idTransaccion = t.id
                    INNER JOIN Entrada e ON lt.idEntrada = e.id
                    INNER JOIN TipoEntrada te ON e.idTipoEntrada = te.id
                    INNER JOIN FechaEvento fe ON te.idFechaEvento = fe.id
                    INNER JOIN Evento ev ON fe.idEvento = ev.id
                    WHERE t.numeroTransaccion = @numeroTransaccion
                      AND ev.id = @idEvento
                      AND (
                          (e.idClienteActual IS NULL AND t.idCliente = @idCliente)
                          OR e.idClienteActual = @idCliente
                      )
                    GROUP BY te.nombre, lt.precio, COALESCE(e.estadoTransferencia, 'disponible')
                    ORDER BY te.nombre, COALESCE(e.estadoTransferencia, 'disponible')";

                var parametros = new ParameterList();
                parametros.Add("@numeroTransaccion", numeroTransaccion);
                parametros.Add("@idEvento", idEvento);
                parametros.Add("@idCliente", idCliente);

                var entradas = new List<EntradaTransaccionDTO>();

                DB.Select(query, parametros);
                try
                {
                    while (DB.Read())
                    {
                        entradas.Add(new EntradaTransaccionDTO
                        {
                            TipoEntrada = DB.GetString("TipoEntrada"),
                            Cantidad = DB.GetInt("Cantidad"),
                            PrecioUnitario = DB.GetDecimal("PrecioUnitario"),
                            Subtotal = DB.GetDecimal("Subtotal"),
                            Estado = DB.GetString("Estado")
                        });
                    }
                }
                finally
                {
                    DB.CloseReader();
                }

                return entradas;
            }
        }
    }
}
