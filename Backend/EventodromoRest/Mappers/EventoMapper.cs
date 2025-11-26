using EventodromoRest.Modelos;  
using EventodromoRest.Modelos.Utiles;
using System.Diagnostics;
namespace EventodromoRest.Mappers
{
    public class EventoMapper(Globales.Globales globales, DBManager.DBManager DB)
    {
        public List<Evento> ListarEventos()
        {
            List<Evento> listaEvento = new List<Evento>();
            var parametros = new ParameterList();
            lock (DB)
            {
                string query = "SELECT * FROM Evento";
                DB.Select(query, null);
                while (DB.Read())
                {
                    Evento evento = new()
                    {
                        id = DB.GetInt("ID"),
                        nombre = DB.GetString("NOMBRE"),
                        descripcion = DB.GetString("DESCRIPCION"),
                        idTipoEvento = DB.GetInt("IDTIPOEVENTO"),
                        idLocal = DB.GetInt("IDLOCAL"),
                        creadoPor = DB.GetInt("CREADOPOR"),
                        fechaPublicacion = DB.GetDateTime("FECHAPUBLICACION"),
                        fechaCompra = DB.GetDateTime("FECHACOMPRA"),
                        isDeleted = DB.GetBoolean("ISDELETED"),
                        imagenURL = DB.GetString("IMAGENURL"),
                    };
                    listaEvento.Add(evento);
                }
                foreach (Evento evento in listaEvento)
                {
                    evento.TipoEvento = ObtenerTipoEventoPorId(evento.idTipoEvento);
                    evento.Local = ObtenerLocalPorId(evento.idLocal);
                }
                return listaEvento;
            }
        }

        public List<Evento> ListarEventosPorTipo(int idTipoEvento)
        {
            List<Evento> listaEvento = new List<Evento>();
            lock (DB)
            {
                string query = "SELECT * FROM Evento WHERE idTipoEvento=@ID_TIPO_EVENTO";
                var parametros = new ParameterList();
                parametros.Add("@ID_TIPO_EVENTO",idTipoEvento);
                DB.Select(query, parametros);
                while (DB.Read())
                {
                    Evento evento = new()
                    {
                        id = DB.GetInt("ID"),
                        nombre = DB.GetString("NOMBRE"),
                        descripcion = DB.GetString("DESCRIPCION"),
                        idTipoEvento = DB.GetInt("IDTIPOEVENTO"),
                        idLocal = DB.GetInt("IDLOCAL"),
                        creadoPor = DB.GetInt("CREADOPOR"),
                        fechaPublicacion = DB.GetDateTime("FECHAPUBLICACION"),
                        fechaCompra = DB.GetDateTime("FECHACOMPRA"),
                        isDeleted = DB.GetBoolean("ISDELETED"),
                        imagenURL = DB.GetString("IMAGENURL"),

                    };
                    listaEvento.Add(evento);
                }
                //NOTA: Hacer las solicitudes anidadas despues de completar toda la lectura
                //Aparentemente, cuando el DB hace otra solicitud, se olvida de esta
                foreach(Evento evento in listaEvento){
                    evento.TipoEvento = ObtenerTipoEventoPorId(evento.idTipoEvento);
                    evento.Local = ObtenerLocalPorId(evento.idLocal);
                }
                return listaEvento;
            }
        }
        public int InsertarEvento(Evento evento)
        {
            lock (DB)
            {
                string query = "INSERT INTO Evento (NOMBRE, DESCRIPCION, IDTIPOEVENTO, IDLOCAL, CREADOPOR, FECHAPUBLICACION, FECHACOMPRA, ISDELETED, IMAGENURL) " +
                               "VALUES (@NOMBRE, @DESCRIPCION, @IDTIPOEVENTO, @IDLOCAL, @CREADOPOR, @FECHAPUBLICACION, @FECHACOMPRA, @ISDELETED, @IMAGENURL); SELECT LAST_INSERT_ID();";
                var parametros = new ParameterList();
                parametros.Add("@NOMBRE", evento.nombre);
                parametros.Add("@DESCRIPCION", evento.descripcion);
                parametros.Add("@IDTIPOEVENTO", evento.idTipoEvento);
                parametros.Add("@IDLOCAL", evento.idLocal);
                parametros.Add("@CREADOPOR", evento.creadoPor);
                parametros.Add("@FECHAPUBLICACION", evento.fechaPublicacion);
                parametros.Add("@FECHACOMPRA", evento.fechaCompra);
                parametros.Add("@ISDELETED", evento.isDeleted);
                parametros.Add("@IMAGENURL", evento.imagenURL);
                
                object result = DB.ExecuteScalar(query, parametros);
                int newId = Convert.ToInt32(result);
                return newId;
            }
        }

        public Evento ObtenerEventoPorId(int id)
        {
            int lastFechaEvento = -1;
            Debug.WriteLine("meow");
            lock (DB)
            {
                string query = "SELECT E.ID AS 'E.ID',E.NOMBRE AS 'E.NOMBRE', E.DESCRIPCION AS 'E.DESCRIPCION', E.IDTIPOEVENTO AS 'E.IDTIPOEVENTO'," +
                    "E.IDLOCAL AS 'E.IDLOCAL',E.CREADOPOR AS 'E.CREADOPOR', E.FECHAPUBLICACION AS 'E.FECHAPUBLICACION', E.FECHACOMPRA AS 'E.FECHACOMPRA'," +
                    "E.ISDELETED AS 'E.ISDELETED', E.IMAGENURL AS 'E.IMAGENURL'," +
                    "FE.ID AS 'FE.ID', FE.FECHAHORA AS 'FE.FECHAHORA', " +
                    "TE.ID AS 'TE.ID', TE.PRECIO AS 'TE.PRECIO', TE.LIMITECOMPRA AS 'TE.LIMITECOMPRA', TE.PUNTOS AS 'TE.PUNTOS'," +
                    "TE.NOMBRE AS 'TE.NOMBRE', TE.CANTIDADENTRADAS AS 'TE.CANTIDADENTRADAS', TE.CANTIDADVENDIDA AS 'TE.CANTIDADVENDIDA' " +
                    "FROM Evento E"
                   +" INNER JOIN FechaEvento FE ON E.ID=FE.IDEVENTO"
                   +" INNER JOIN TipoEntrada TE ON FE.ID=TE.IDFECHAEVENTO"
                   + " WHERE E.ID = @ID";
                var parametros = new ParameterList();
                parametros.Add("@ID", id);
                DB.Select(query, parametros);
                if (DB.Read())
                {
                    Debug.WriteLine("mroooow");
                    Evento evento = new()
                    {
                        id = DB.GetInt("E.ID"),
                        nombre = DB.GetString("E.NOMBRE"),
                        descripcion = DB.GetString("E.DESCRIPCION"),
                        idTipoEvento = DB.GetInt("E.IDTIPOEVENTO"),
                        idLocal = DB.GetInt("E.IDLOCAL"),
                        creadoPor = DB.GetInt("E.CREADOPOR"),
                        fechaPublicacion = DB.GetDateTime("E.FECHAPUBLICACION"),
                        fechaCompra = DB.GetDateTime("E.FECHACOMPRA"),
                        isDeleted = DB.GetBoolean("E.ISDELETED"),
                        imagenURL = DB.GetString("E.IMAGENURL"),
                    };
                    List<FechaEvento> listFE = new List<FechaEvento>();
                    List<TipoEntrada> listTE = new List<TipoEntrada>();
                    do
                    {
                        int _id = DB.GetInt("FE.ID");
                        if (lastFechaEvento != _id)
                        {
                            lastFechaEvento = _id;
                            listFE.Add(new FechaEvento() { 
                                id = _id,
                                fechaHora = DB.GetDateTime("FE.FECHAHORA"),
                                idEvento = evento.id
                            });
                        }
                        listTE.Add(new TipoEntrada()
                        {
                            id=DB.GetInt("TE.ID"),
                            precio=DB.GetDecimal("TE.PRECIO"),
                            limiteCompra=DB.GetInt("TE.LIMITECOMPRA"),
                            puntos=DB.GetInt("TE.PUNTOS"),
                            nombre=DB.GetString("TE.NOMBRE"),
                            cantidadEntradas=DB.GetInt("TE.CANTIDADENTRADAS"),
                            cantidadVendida=DB.GetInt("TE.CANTIDADVENDIDA"),
                            idFechaEvento=lastFechaEvento
                        });
                    } while (DB.Read());
                    evento.Local = ObtenerLocalPorId(evento.idLocal);
                    evento.TipoEvento = ObtenerTipoEventoPorId(evento.idTipoEvento);
                    evento.fechasEvento = listFE.ToArray();
                    evento.tiposEntrada = listTE.ToArray();
                    return evento;
                }
                else
                {
                    return null;
                }
            }
        }

        public int EliminarEventoPorId(int id)
        {
            lock (DB)
            {
                string query = "DELETE FROM Evento WHERE ID = @ID";
                var parametros = new ParameterList();
                parametros.Add("@ID", id);
                int rowsAffected = DB.ExecuteNonQuery(query, parametros);
                return rowsAffected;
            }
        }

        public int ModificarEvento(Evento evento)
        {
            lock (DB)
            {
                string query = "UPDATE Evento SET NOMBRE = @NOMBRE, DESCRIPCION = @DESCRIPCION, IDTIPOEVENTO = @IDTIPOEVENTO, IDLOCAL = @IDLOCAL, CREADOPOR = @CREADOPOR, FECHAPUBLICACION = @FECHAPUBLICACION, FECHACOMPRA = @FECHACOMPRA, ISDELETED = @ISDELETED, IMAGENURL = @IMAGENURL WHERE ID = @ID";
                var parametros = new ParameterList();
                parametros.Add("@ID", evento.id);
                parametros.Add("@NOMBRE", evento.nombre);
                parametros.Add("@DESCRIPCION", evento.descripcion);
                parametros.Add("@IDTIPOEVENTO", evento.idTipoEvento);
                parametros.Add("@IDLOCAL", evento.idLocal);
                parametros.Add("@CREADOPOR", evento.creadoPor);
                parametros.Add("@FECHAPUBLICACION", evento.fechaPublicacion);
                parametros.Add("@FECHACOMPRA", evento.fechaCompra);
                parametros.Add("@ISDELETED", evento.isDeleted);
                parametros.Add("@IMAGENURL", evento.imagenURL);

                int rowsAffected = DB.ExecuteNonQuery(query, parametros);
                return rowsAffected;

            }
        }

        private TipoEvento ObtenerTipoEventoPorId(int v)
        {
            var tipoEventoMapper = new TipoEventoMapper(globales, DB);
            return tipoEventoMapper.ObtenerTipoEventoPorId(v);
        }

        private Local ObtenerLocalPorId(int v)
        {
            var localMapper = new LocalMapper(globales, DB);
            return localMapper.ObtenerLocalPorId(v);
        }

        public List<Evento> ListarEventosBusqueda(string busqueda)
        {
            lock (DB)
            {
                List<Evento> listaEvento = new List<Evento>();
                string query = "SELECT * FROM  Evento WHERE NOMBRE LIKE CONCAT('%',@busqueda,'%')";
                var parametros = new ParameterList();
                parametros.Add("@busqueda", busqueda);
                DB.Select(query, parametros);
                while (DB.Read())
                {
                    Evento evento = new()
                    {
                        id = DB.GetInt("ID"),
                        nombre = DB.GetString("NOMBRE"),
                        descripcion = DB.GetString("DESCRIPCION"),
                        idTipoEvento = DB.GetInt("IDTIPOEVENTO"),
                        idLocal = DB.GetInt("IDLOCAL"),
                        creadoPor = DB.GetInt("CREADOPOR"),
                        fechaPublicacion = DB.GetDateTime("FECHAPUBLICACION"),
                        fechaCompra = DB.GetDateTime("FECHACOMPRA"),
                        isDeleted = DB.GetBoolean("ISDELETED"),
                        imagenURL = DB.GetString("IMAGENURL"),

                    };
                    listaEvento.Add(evento);
                }
                //NOTA: Hacer las solicitudes anidadas despues de completar toda la lectura
                //Aparentemente, cuando el DB hace otra solicitud, se olvida de esta
                foreach(Evento evento in listaEvento){
                    evento.TipoEvento = ObtenerTipoEventoPorId(evento.idTipoEvento);
                    evento.Local = ObtenerLocalPorId(evento.idLocal);
                }
                return listaEvento;
            }
        }

        public ResponseEvento ObtenerResponseEventoPorId(int eventoId)
        {
            lock (DB)
            {
                string query = "SELECT id, nombre, descripcion, imagenURL, idTipoEvento FROM Evento WHERE ID = @ID";
                var parametros = new ParameterList();
                parametros.Add("@ID", eventoId);
                DB.Select(query, parametros);
                if (DB.Read())
                {
                    ResponseEvento evento = new()
                    {
                        id = DB.GetInt("ID"),
                        nombre = DB.GetString("NOMBRE"),
                        descripcion = DB.GetString("DESCRIPCION"),
                        imagenUrl = DB.GetString("IMAGENURL"),
                        tipoEvento = new TipoEvento
                        {
                            id = DB.GetInt("IDTIPOEVENTO"),
                        }
                    };
                    evento.tipoEvento = ObtenerTipoEventoPorId((int)evento.tipoEvento.id);
                    return evento;
                }
                else
                {
                    return null;
                }
            }
        }

        public List<EventosLocalCiudadCategoriaDTO> ListarEventosActivosCompletos()
        {
            lock (DB)
            {
                // Consulta 1: Obtener eventos base
                string queryEventos = @"
            SELECT e.id, e.nombre, e.descripcion, e.imagenURL, 
                   MIN(f.fechaHora) AS fechaProximoEvento, e.idLocal, e.idTipoEvento
            FROM Evento AS e
            INNER JOIN FechaEvento f ON e.id = f.idEvento
            WHERE e.fechaPublicacion < NOW() 
                AND f.fechaHora > NOW()
                AND e.isDeleted = 0
            GROUP BY e.id, e.nombre, e.descripcion, e.imagenURL, e.idLocal, e.idTipoEvento
            ORDER BY fechaProximoEvento ASC;";

                DB.Select(queryEventos, new ParameterList());

                var eventosIds = new List<int>();
                var localesIds = new List<int>();
                var tiposEventoIds = new List<int>();
                var eventosBase = new List<dynamic>();

                while (DB.Read())
                {
                    var eventoId = DB.GetInt("id");
                    var localId = DB.GetInt("idLocal");
                    var tipoEventoId = DB.GetInt("idTipoEvento");

                    eventosBase.Add(new
                    {
                        id = eventoId,
                        nombre = DB.GetString("nombre"),
                        descripcion = DB.GetString("descripcion"),
                        imagenURL = DB.GetString("imagenURL"),
                        fechaProximoEvento = DB.GetDateTime("fechaProximoEvento"),
                        idLocal = localId,
                        idTipoEvento = tipoEventoId
                    });

                    eventosIds.Add(eventoId);
                    localesIds.Add(localId);
                    tiposEventoIds.Add(tipoEventoId);
                }
                DB.CloseReader();

                if (!eventosBase.Any())
                    return new List<EventosLocalCiudadCategoriaDTO>();

                // Consulta 2: Obtener todos los locales necesarios - CORREGIDO
                var localesDict = new Dictionary<int, LocalInfo>();
                if (localesIds.Any())
                {
                    string localesQuery = $@"
                SELECT l.id, l.nombre, c.nombre as ciudad
                FROM Local l
                INNER JOIN Ciudad c ON l.idCiudad = c.id
                WHERE l.id IN ({string.Join(",", localesIds.Distinct())}) AND l.isDeleted = 0";

                    DB.Select(localesQuery, new ParameterList());
                    while (DB.Read())
                    {
                        localesDict[DB.GetInt("id")] = new LocalInfo
                        {
                            Nombre = DB.GetString("nombre"),
                            Ciudad = DB.GetString("ciudad")
                        };
                    }
                    DB.CloseReader();
                }

                // Consulta 3: Obtener todos los tipos de evento
                var tiposEventoDict = new Dictionary<int, string>();
                if (tiposEventoIds.Any())
                {
                    string tiposQuery = $@"
                SELECT id, nombre FROM TipoEvento 
                WHERE id IN ({string.Join(",", tiposEventoIds.Distinct())})";

                    DB.Select(tiposQuery, new ParameterList());
                    while (DB.Read())
                    {
                        tiposEventoDict[DB.GetInt("id")] = DB.GetString("nombre");
                    }
                    DB.CloseReader();
                }

                // Consulta 4: Obtener precios mínimos por lote
                var preciosDict = new Dictionary<int, decimal>();
                if (eventosIds.Any())
                {
                    string preciosQuery = $@"
                SELECT f.idEvento, COALESCE(MIN(te.precio), 0) AS PrecioMinimo
                FROM FechaEvento f
                INNER JOIN TipoEntrada te ON f.id = te.idFechaEvento
                WHERE f.idEvento IN ({string.Join(",", eventosIds.Distinct())}) 
                    AND f.fechaHora > NOW()
                GROUP BY f.idEvento";

                    DB.Select(preciosQuery, new ParameterList());
                    while (DB.Read())
                    {
                        preciosDict[DB.GetInt("idEvento")] = DB.GetDecimal("PrecioMinimo");
                    }
                    DB.CloseReader();
                }

                // Combinar todos los datos en tus DTOs específicos - CORREGIDO
                var resultados = new List<EventosLocalCiudadCategoriaDTO>();
                foreach (var evento in eventosBase)
                {
                    var dto = new EventosLocalCiudadCategoriaDTO
                    {
                        id = evento.id,
                        nombre = evento.nombre,
                        fecha = evento.fechaProximoEvento.ToString("yyyy-MM-dd"),
                        precio = preciosDict.ContainsKey(evento.id) ? (double)preciosDict[evento.id] : 0,
                        imagen = evento.imagenURL
                    };

                    // Asignar datos del local si existe
                    if (localesDict.ContainsKey(evento.idLocal))
                    {
                        dto.nombreLocal = localesDict[evento.idLocal].Nombre;
                        dto.ciudad = localesDict[evento.idLocal].Ciudad;
                    }
                    else
                    {
                        dto.nombreLocal = "";
                        dto.ciudad = "";
                    }

                    // Asignar categoría si existe
                    if (tiposEventoDict.ContainsKey(evento.idTipoEvento))
                    {
                        dto.categoria = tiposEventoDict[evento.idTipoEvento];
                    }
                    else
                    {
                        dto.categoria = "";
                    }

                    resultados.Add(dto);
                }

                return resultados;
            }
        }


        // En EventoMapper.cs (o un mapper principal)
        public ResponseObtenerEventoPorId ObtenerDatosCompletosEventoPorId(int eventoId)
        {
            ResponseObtenerEventoPorId resultado = new ResponseObtenerEventoPorId();

            // Usamos un solo lock para toda la operación
            lock (DB)
            {
                // --- CONSULTA 1: Datos principales (Evento, Local, Ciudad, Pais, TipoEvento) ---

                string queryPrincipal = @"
            SELECT
                E.id AS EventoId, E.nombre AS EventoNombre, E.descripcion, E.imagenURL,
                T.id AS TipoEventoId, T.nombre AS TipoEventoNombre,
                L.id AS LocalId, L.nombre AS LocalNombre, L.direccion,
                C.id AS CiudadId, C.nombre AS CiudadNombre,
                P.id AS PaisId, P.nombre AS PaisNombre
            FROM
                Evento AS E
            LEFT JOIN
                TipoEvento AS T ON E.idTipoEvento = T.id
            LEFT JOIN
                Local AS L ON E.idLocal = L.id
            LEFT JOIN
                Ciudad AS C ON L.idCiudad = C.id
            LEFT JOIN
                Pais AS P ON C.idPais = P.id
            WHERE
                E.id = @IdEvento;";

                var parametrosEvento = new ParameterList();
                parametrosEvento.Add("@IdEvento", eventoId);
                DB.Select(queryPrincipal, parametrosEvento);

                if (!DB.Read())
                {
                    DB.CloseReader();
                    return null; // Evento no encontrado
                }

                // Mapear datos de la Consulta 1
                resultado.evento = new ResponseEvento
                {
                    id = DB.GetInt("EventoId"),
                    nombre = DB.GetString("EventoNombre"),
                    descripcion = DB.GetString("descripcion"),
                    imagenUrl = DB.GetString("imagenURL"),
                    tipoEvento = new TipoEvento
                    {
                        id = DB.GetInt("TipoEventoId"),
                        nombre = DB.GetString("TipoEventoNombre")
                    }
                };

                resultado.local = new ResponseLocal
                {
                    id = DB.GetInt("LocalId"),
                    nombre = DB.GetString("LocalNombre"),
                    direccion = DB.GetString("direccion"),
                    googleMapsEmbed = "<iframe src=\"https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3901.9705727105875!2d-77.037574524449!3d-12.045545688191202!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9105c8ca3c54dd11%3A0x40b0447dcf24a5c8!2sTeatro%20Municipal%20de%20Lima!5e0!3m2!1ses!2spe!4v1760080206514!5m2!1ses!2spe\" width=\"600\" height=\"450\" ...></iframe>",
                    ciudad = new Ciudad
                    {
                        id = DB.GetInt("CiudadId"),
                        nombre = DB.GetString("CiudadNombre"),
                        idPais = DB.GetInt("PaisId"), // Asumiendo que quieres el ID
                        pais = new Pais
                        {
                            id = DB.GetInt("PaisId"),
                            nombre = DB.GetString("PaisNombre")
                        }
                    }
                };
                DB.CloseReader(); // Importante: Cerrar el primer reader

                // --- CONSULTA 2: Funciones (FechaEvento) y sus TiposDeEntrada (hijos) ---

                // Asumo que la columna en tu tabla TipoEntrada se llama LIMITECOMPRA
                string queryFunciones = @"
            SELECT
                F.ID AS FechaEventoId,
                F.FECHAHORA,
                T.ID AS TipoEntradaId,
                T.NOMBRE AS TipoEntradaNombre,
                T.PRECIO,
                T.PUNTOS,
                T.LIMITECOMPRA
            FROM
                FechaEvento AS F
            LEFT JOIN
                TipoEntrada AS T ON F.ID = T.IDFECHAEVENTO
            WHERE
                F.IDEVENTO = @IdEvento
            ORDER BY
                F.FECHAHORA, T.ID;";

                var parametrosFunciones = new ParameterList();
                parametrosFunciones.Add("@IdEvento", eventoId);
                DB.Select(queryFunciones, parametrosFunciones);

                // Usamos un Diccionario para agrupar los tipos de entrada en sus funciones
                var funcionesDict = new Dictionary<int, ResponseFechaEvento>();

                while (DB.Read())
                {
                    int fechaEventoId = DB.GetInt("FechaEventoId");

                    // Si la función (FechaEvento) no está en el diccionario, la creamos
                    if (!funcionesDict.ContainsKey(fechaEventoId))
                    {
                        DateTime fechaHora = DB.GetDateTime("FECHAHORA");
                        var nuevaFuncion = new ResponseFechaEvento
                        {
                            id = fechaEventoId,
                            fecha = fechaHora.ToString("yyyy-MM-dd"),
                            hora = fechaHora.ToString("HH-mm"),
                            tiposDeEntrada = new List<ResponseTipoEntrada>()
                        };
                        funcionesDict.Add(fechaEventoId, nuevaFuncion);
                    }

                    // Añadimos el TipoEntrada a la función correspondiente
                    // (Verificamos si existe, por si una función no tiene tipos de entrada)
                    if (!DB.IsDBNull("TipoEntradaId"))
                    {
                        var tipoEntrada = new ResponseTipoEntrada
                        {
                            id = DB.GetInt("TipoEntradaId"),
                            nombre = DB.GetString("TipoEntradaNombre"),
                            precio = double.Parse(DB.GetDecimal("PRECIO").ToString()),
                            puntos = DB.GetInt("PUNTOS"),
                            agotado = false, // Tu lógica original
                            limiteCompra = DB.GetInt("LIMITECOMPRA") // <<< MAPEO DEL NUEVO CAMPO
                        };
                        funcionesDict[fechaEventoId].tiposDeEntrada.Add(tipoEntrada);
                    }
                }
                DB.CloseReader(); // Cerrar el segundo reader

                // Convertir los valores del diccionario a la lista final
                resultado.funciones = funcionesDict.Values.ToList();
            } // Fin del lock(DB)

            return resultado;
        }

        public string ActualizarEvento(ActualizarEventoRequest request)
        {
            lock (DB)
            {
                ActualizarEventoRequest estadoActual = ObtenerEstadoActualEvento(request.idEvento);

                if (estadoActual == null)
                {
                    return "Evento no encontrado";
                }

                var queries = new List<string>();
                var parametros = new ParameterList();
                int paramCounter = 0;

                // 1. Comparar y actualizar EVENTO y LOCAL si hay cambios
                bool eventoModificado = false;
                bool localModificado = false;

                if (estadoActual.nombre != request.nombre ||
                    estadoActual.descripcion != request.descripcion ||
                    estadoActual.imagenURL != request.imagenURL ||
                    estadoActual.localId != request.localId ||
                    estadoActual.tipoEventoId != request.tipoEventoId ||
                    estadoActual.fechaPublicacion != request.fechaPublicacion ||
                    estadoActual.fechaCompra != request.fechaCompra)
                {
                    eventoModificado = true;
                    string updateEvento = @"
        UPDATE Evento 
        SET NOMBRE = @nombre, 
            DESCRIPCION = @descripcion, 
            IMAGENURL = @imagenURL, 
            IDLOCAL = @localId, 
            IDTIPOEVENTO = @tipoEventoId, 
            FECHAPUBLICACION = @fechaPublicacion, 
            FECHACOMPRA = @fechaCompra
        WHERE ID = @idEvento;";

                    queries.Add(updateEvento);
                    parametros.Add("@nombre", request.nombre);
                    parametros.Add("@descripcion", request.descripcion);
                    parametros.Add("@imagenURL", request.imagenURL);
                    parametros.Add("@localId", request.localId);
                    parametros.Add("@tipoEventoId", request.tipoEventoId);
                    parametros.Add("@fechaPublicacion", request.fechaPublicacion);
                    parametros.Add("@fechaCompra", request.fechaCompra);
                    parametros.Add("@idEvento", request.idEvento);
                }

                if (estadoActual.capacidad != request.capacidad)
                {
                    localModificado = true;
                    string updateLocal = @"
        UPDATE Local 
        SET CAPACIDAD = @capacidad 
        WHERE ID = @localId;";

                    queries.Add(updateLocal);
                    parametros.Add("@capacidad", request.capacidad);
                    if (!eventoModificado)
                    {
                        parametros.Add("@localId", request.localId);
                    }
                }

                // 2. Comparar y actualizar HORARIOS (FechaEvento)
                var horariosActualesDict = estadoActual.horarios.ToDictionary(h => h.id);
                var horariosRequestDict = request.horarios
                    .Where(h => h.id > 0)
                    .ToDictionary(h => h.id);

                // DELETE: horarios que están en BD pero no en request
                var horariosAEliminar = estadoActual.horarios
                    .Where(h => !request.horarios.Any(r => r.id == h.id))
                    .Select(h => h.id)
                    .ToList();

                if (horariosAEliminar.Any())
                {
                    string deleteHorarios = $@"
        DELETE FROM FechaEvento 
        WHERE ID IN ({string.Join(",", horariosAEliminar)});";
                    queries.Add(deleteHorarios);
                }

                // UPDATE: horarios existentes con cambios de fecha/hora
                foreach (var horarioRequest in request.horarios.Where(h => h.id > 0))
                {
                    if (horariosActualesDict.ContainsKey(horarioRequest.id))
                    {
                        var horarioActual = horariosActualesDict[horarioRequest.id];
                        if (horarioActual.fecha != horarioRequest.fecha ||
                            horarioActual.hora != horarioRequest.hora)
                        {
                            string pFecha = $"@fechaHoraUpd{paramCounter}";
                            string pId = $"@idFechaUpd{paramCounter}";

                            DateTime fechaHora = DateTime.Parse($"{horarioRequest.fecha} {horarioRequest.hora}");

                            string updateHorario = $@"
                UPDATE FechaEvento 
                SET FECHAHORA = {pFecha} 
                WHERE ID = {pId};";

                            queries.Add(updateHorario);
                            parametros.Add(pFecha, fechaHora);
                            parametros.Add(pId, horarioRequest.id);
                            paramCounter++;
                        }
                    }
                }

                // Después de los UPDATE/DELETE de horarios, pero ANTES de las entradas
                var mapeoHorariosNuevos = new Dictionary<int, int>(); // idTemp -> idReal

                var horariosNuevos = request.horarios
                .Where(h => h.id <= 0)
                .ToList();

                foreach (var horario in horariosNuevos)
                {
                    string pFecha = $"@fechaHora{paramCounter}";
                    string pEvento = $"@idEvento{paramCounter}";

                    DateTime fechaHora = DateTime.Parse($"{horario.fecha} {horario.hora}");

                    string insertHorario = $@"
                INSERT INTO FechaEvento (IDEVENTO, FECHAHORA) 
                VALUES ({pEvento}, {pFecha}); 
                SELECT LAST_INSERT_ID();";

                    parametros.Add(pFecha, fechaHora);
                    parametros.Add(pEvento, request.idEvento);

                    // Ejecutar inmediatamente para obtener el ID generado
                    object resultado = DB.ExecuteScalar(insertHorario, parametros);
                    int nuevoIdHorario = Convert.ToInt32(resultado);

                    // Mapear el ID temporal al real
                    mapeoHorariosNuevos[horario.id] = nuevoIdHorario;

                    parametros = new ParameterList(); // Resetear parámetros
                    paramCounter++;
                }

                // 3. Comparar y actualizar ENTRADAS (TipoEntrada)
                var entradasActualesDict = estadoActual.entradas.ToDictionary(e => e.idEntrada);
                var entradasRequestDict = request.entradas
                    .Where(e => e.idEntrada > 0)
                    .ToDictionary(e => e.idEntrada);

                // DELETE: entradas que están en BD pero no en request
                var entradasAEliminar = estadoActual.entradas
                    .Where(e => !request.entradas.Any(r => r.idEntrada == e.idEntrada))
                    .Select(e => e.idEntrada)
                    .ToList();

                if (entradasAEliminar.Any())
                {
                    string deleteEntradas = $@"
        DELETE FROM TipoEntrada 
        WHERE ID IN ({string.Join(",", entradasAEliminar)});";
                    queries.Add(deleteEntradas);
                }

                // INSERT: entradas nuevas (idEntrada = 0 o < 0)
                var entradasNuevas = request.entradas.Where(e => e.idEntrada <= 0).ToList();
                foreach (var entrada in entradasNuevas)
                {
                    int idFechaEvento = entrada.horario.id;

                    // Si el horario es nuevo, usar el ID real generado
                    if (idFechaEvento <= 0 && mapeoHorariosNuevos.ContainsKey(idFechaEvento))
                    {
                        idFechaEvento = mapeoHorariosNuevos[idFechaEvento];
                    }
                    else if (idFechaEvento <= 0)
                    {
                        continue; // Horario inválido, saltar
                    }

                    string pNombre = $"@entNombre{paramCounter}";
                    string pPrecio = $"@entPrecio{paramCounter}";
                    string pCantidad = $"@entCantidad{paramCounter}";
                    string pLimite = $"@entLimite{paramCounter}";
                    string pPuntos = $"@entPuntos{paramCounter}";
                    string pIdFecha = $"@entIdFecha{paramCounter}";

                    string insertEntrada = $@"
        INSERT INTO TipoEntrada (NOMBRE, PRECIO, CANTIDADENTRADAS, LIMITECOMPRA, PUNTOS, IDFECHAEVENTO, CANTIDADVENDIDA) 
        VALUES ({pNombre}, {pPrecio}, {pCantidad}, {pLimite}, {pPuntos}, {pIdFecha}, 0);";

                    queries.Add(insertEntrada);
                    parametros.Add(pNombre, entrada.nombre);
                    parametros.Add(pPrecio, entrada.precio);
                    parametros.Add(pCantidad, entrada.cantidadEntradas);
                    parametros.Add(pLimite, entrada.limiteCompra);
                    parametros.Add(pPuntos, entrada.puntos);
                    parametros.Add(pIdFecha, idFechaEvento);
                    paramCounter++;
                }

                // UPDATE: entradas existentes con cambios
                foreach (var entradaRequest in request.entradas.Where(e => e.idEntrada > 0))
                {
                    if (entradasActualesDict.ContainsKey(entradaRequest.idEntrada))
                    {
                        var entradaActual = entradasActualesDict[entradaRequest.idEntrada];

                        bool cambioHorario = entradaActual.horario.id != entradaRequest.horario.id;
                        bool cambiosBasicos = entradaActual.nombre != entradaRequest.nombre ||
                                             entradaActual.precio != entradaRequest.precio ||
                                             entradaActual.cantidadEntradas != entradaRequest.cantidadEntradas ||
                                             entradaActual.limiteCompra != entradaRequest.limiteCompra ||
                                             entradaActual.puntos != entradaRequest.puntos;

                        if (cambiosBasicos || cambioHorario)
                        {
                            string pNombre = $"@entUpdNombre{paramCounter}";
                            string pPrecio = $"@entUpdPrecio{paramCounter}";
                            string pCantidad = $"@entUpdCantidad{paramCounter}";
                            string pLimite = $"@entUpdLimite{paramCounter}";
                            string pPuntos = $"@entUpdPuntos{paramCounter}";
                            string pIdFecha = $"@entUpdIdFecha{paramCounter}";
                            string pId = $"@entUpdId{paramCounter}";

                            string updateEntrada = $@"
                UPDATE TipoEntrada 
                SET NOMBRE = {pNombre}, 
                    PRECIO = {pPrecio}, 
                    CANTIDADENTRADAS = {pCantidad}, 
                    LIMITECOMPRA = {pLimite}, 
                    PUNTOS = {pPuntos}, 
                    IDFECHAEVENTO = {pIdFecha} 
                WHERE ID = {pId};";

                            queries.Add(updateEntrada);
                            parametros.Add(pNombre, entradaRequest.nombre);
                            parametros.Add(pPrecio, entradaRequest.precio);
                            parametros.Add(pCantidad, entradaRequest.cantidadEntradas);
                            parametros.Add(pLimite, entradaRequest.limiteCompra);
                            parametros.Add(pPuntos, entradaRequest.puntos);
                            parametros.Add(pIdFecha, entradaRequest.horario.id);
                            parametros.Add(pId, entradaRequest.idEntrada);
                            paramCounter++;
                        }
                    }
                }

                // 4. Ejecutar todas las queries en un solo batch
                if (queries.Any())
                {
                    string batchQuery = string.Join("\n", queries);
                    int rowsAffected = DB.ExecuteNonQuery(batchQuery, parametros);
                    return $"Evento actualizado correctamente. {rowsAffected} operaciones realizadas.";
                }
                else
                {
                    return "No se detectaron cambios en el evento.";
                }
            }
        }

        public ActualizarEventoRequest ObtenerEstadoActualEvento(int eventoId)
        {
            lock (DB)
            {
                ActualizarEventoRequest estadoActual = new ActualizarEventoRequest();
                estadoActual.idEvento = eventoId;
                estadoActual.horarios = new List<HorarioDTO>();
                estadoActual.entradas = new List<EntradaYHorarioDTO>();

                string query = @"
SELECT E.id               AS idEvento,
       E.nombre           AS nombreEvento,
       E.descripcion      AS descripcion,
       E.imagenurl        AS imagenurl,
       E.idlocal          AS idlocal,
       E.idtipoevento     AS idtipoevento,
       L.capacidad        AS capacidadLocal,
       E.fechapublicacion AS fechapublicacion,
       E.fechacompra      AS fechacompra,
       F.id               AS idFecha,
       F.fechahora        AS fechahora,
       T.id               AS idTipoEntrada,
       T.nombre           AS nombreTipoEntrada,
       T.precio           AS precio,
       T.cantidadentradas AS cantidadentradas,
       T.limitecompra     AS limitecompra,
       T.puntos           AS puntos
FROM   Eventodromo.Evento E
       LEFT JOIN FechaEvento F
              ON E.id = F.idevento
       LEFT JOIN TipoEntrada T
              ON T.idfechaevento = F.id
       LEFT JOIN Local L
              ON L.id = E.idlocal
WHERE  E.id = @idEvento;
";

                var parametros = new ParameterList();
                parametros.Add("@idEvento", eventoId);
                DB.Select(query, parametros);

                bool isFirstRow = true;
                var horarioIdsAgregados = new HashSet<int>();

                while (DB.Read())
                {
                    if (isFirstRow)
                    {
                        estadoActual.nombre = DB.GetString("nombreEvento");
                        estadoActual.descripcion = DB.GetString("descripcion");
                        estadoActual.imagenURL = DB.GetString("imagenurl");
                        estadoActual.localId = DB.GetInt("idlocal");
                        estadoActual.tipoEventoId = DB.GetInt("idtipoevento");
                        estadoActual.capacidad = DB.GetInt("capacidadLocal");
                        estadoActual.fechaPublicacion = DB.GetDateTime("fechapublicacion");
                        estadoActual.fechaCompra = DB.GetDateTime("fechacompra");
                        isFirstRow = false;
                    }

                    int idFechaLeida = DB.GetInt("idFecha");
                    DateTime fechaHoraCompleta = DB.GetDateTime("fechahora");

                    if (horarioIdsAgregados.Add(idFechaLeida))
                    {
                        estadoActual.horarios.Add(new HorarioDTO
                        {
                            id = idFechaLeida,
                            fecha = fechaHoraCompleta.ToString("yyyy-MM-dd"),
                            hora = fechaHoraCompleta.ToString("HH:mm")
                        });
                    }

                    int idEntradaLeida = DB.GetInt("idTipoEntrada");
                    if (idEntradaLeida != null)
                    {
                        var horarioParaEntrada = new HorarioDTO
                        {
                            id = idFechaLeida,
                            fecha = fechaHoraCompleta.ToString("yyyy-MM-dd"),
                            hora = fechaHoraCompleta.ToString("HH:mm")
                        };

                        var entrada = new EntradaYHorarioDTO
                        {
                            idEntrada = idEntradaLeida,
                            nombre = DB.GetString("nombreTipoEntrada"),
                            precio = DB.GetDecimal("precio"),
                            cantidadEntradas = DB.GetInt("cantidadentradas"),
                            limiteCompra = DB.GetInt("limitecompra"),
                            puntos = DB.GetInt("puntos"),
                            horario = horarioParaEntrada
                        };

                        estadoActual.entradas.Add(entrada);
                    }
                }
                DB.CloseReader();
                return estadoActual;
            }
        }

        public List<ResponseEventoGetEventosMasVendidos> ObtenerEventosMasVendidos()
        {
            lock (DB)
            {
                string query = @"
            SELECT 
                E.ID AS IdEvento,
                E.NOMBRE AS NombreEvento,
                L.NOMBRE AS NombreLocal,
                -- Precio promedio de entradas del evento (opcional)
                COALESCE(AVG(TE.PRECIO), 0) AS PrecioPromedio,
                
                -- Entradas vendidas totales
                COALESCE(SUM(TE.CANTIDADVENDIDA), 0) AS EntradasVendidas

            FROM Evento E
            INNER JOIN Local L ON L.ID = E.IDLOCAL
            LEFT JOIN FechaEvento FE ON FE.IDEVENTO = E.ID
            LEFT JOIN TipoEntrada TE ON TE.IDFECHAEVENTO = FE.ID

            WHERE E.ISDELETED = 0   -- Solo eventos activos
            GROUP BY E.ID
            ORDER BY EntradasVendidas DESC
            LIMIT 5;
        ";

                DB.Select(query, null);

                var lista = new List<ResponseEventoGetEventosMasVendidos>();

                while (DB.Read())
                {
                    var item = new ResponseEventoGetEventosMasVendidos
                    {
                        id = DB.GetInt("IdEvento").ToString(),
                        nombre = DB.GetString("NombreEvento"),
                        ubicacion = DB.GetString("NombreLocal"),
                        precio = DB.GetDecimal("PrecioPromedio"),
                        entradasVendidas = DB.GetInt("EntradasVendidas")
                    };

                    lista.Add(item);
                }

                DB.CloseReader();
                return lista;
            }
        }

        public List<Evento> ObtenerEventosFiltrados(
            string? search,
            int? localId,
            string? status,
            DateTime? startDate,
            DateTime? endDate,
            int page,
            int pageSize,
            out int totalEventos)
        {
            lock (DB)
            {
                // Construcción dinámica del WHERE
                string where = "WHERE 1=1 ";
                var parametros = new ParameterList();

                if (!string.IsNullOrEmpty(search))
                {
                    where += "AND E.NOMBRE LIKE CONCAT('%', @SEARCH, '%') ";
                    parametros.Add("@SEARCH", search);
                }

                if (localId.HasValue && localId.Value != 0)
                {
                    where += "AND E.IDLOCAL = @LOCALID ";
                    parametros.Add("@LOCALID", localId.Value);
                }

                if (!string.IsNullOrEmpty(status))
                {
                    // ejemplo: status = "activo" o "eliminado"
                    if (status.ToLower() == "activo")
                        where += "AND E.ISDELETED = 0 ";
                    else if (status.ToLower() == "eliminado")
                        where += "AND E.ISDELETED = 1 ";
                }

                if (startDate.HasValue)
                {
                    where += "AND E.FECHAPUBLICACION >= @STARTDATE ";
                    parametros.Add("@STARTDATE", startDate.Value);
                }

                if (endDate.HasValue)
                {
                    where += "AND E.FECHAPUBLICACION <= @ENDDATE ";
                    parametros.Add("@ENDDATE", endDate.Value);
                }

                // Paginación: calcular OFFSET
                int offset = (page - 1) * pageSize;

                // Consulta principal
                string query = $@"
    SELECT SQL_CALC_FOUND_ROWS
        E.*
    FROM Evento E
    {where}
    ORDER BY E.FECHAPUBLICACION DESC
    LIMIT @OFFSET, @PAGESIZE;
";

                parametros.Add("@OFFSET", offset);
                parametros.Add("@PAGESIZE", pageSize);

                List<Evento> listaEvento = new();

                DB.Select(query, parametros);
                while (DB.Read())
                {
                    var evento = new Evento
                    {
                        id = DB.GetInt("ID"),
                        nombre = DB.GetString("NOMBRE"),
                        descripcion = DB.GetString("DESCRIPCION"),
                        idTipoEvento = DB.GetInt("IDTIPOEVENTO"),
                        idLocal = DB.GetInt("IDLOCAL"),
                        creadoPor = DB.GetInt("CREADOPOR"),
                        fechaPublicacion = DB.GetDateTime("FECHAPUBLICACION"),
                        fechaCompra = DB.GetDateTime("FECHACOMPRA"),
                        isDeleted = DB.GetBoolean("ISDELETED"),
                        imagenURL = DB.GetString("IMAGENURL"),
                    };
                    listaEvento.Add(evento);
                }
                DB.CloseReader();

                // Obtener el total real (sin LIMIT)
                DB.Select("SELECT FOUND_ROWS() AS Total;", null);
                totalEventos = DB.Read() ? DB.GetInt("Total") : listaEvento.Count;
                DB.CloseReader();

                // Cargar los objetos relacionados
                foreach (var evento in listaEvento)
                {
                    evento.TipoEvento = ObtenerTipoEventoPorId(evento.idTipoEvento);
                    evento.Local = ObtenerLocalPorId(evento.idLocal);
                }

                return listaEvento;
            }
        }

        public Evento ObtenerEventoPorIdSimple(int id)
        {
            lock (DB)
            {
                string query = @"
            SELECT 
                ID, 
                NOMBRE, 
                DESCRIPCION, 
                IDTIPOEVENTO, 
                IDLOCAL, 
                CREADOPOR, 
                FECHAPUBLICACION, 
                FECHACOMPRA, 
                ISDELETED, 
                IMAGENURL
            FROM Evento 
            WHERE ID = @ID";
        
                var parametros = new ParameterList();
                parametros.Add("@ID", id);
        
                Evento evento = null;
        
                DB.Select(query, parametros);
                try
                {
                    if (DB.Read())
                    {
                        evento = new Evento
                        {
                            id = DB.GetInt("ID"),
                            nombre = DB.GetString("NOMBRE"),
                            descripcion = DB.GetString("DESCRIPCION"),
                            idTipoEvento = DB.GetInt("IDTIPOEVENTO"),
                            idLocal = DB.GetInt("IDLOCAL"),
                            creadoPor = DB.GetInt("CREADOPOR"),
                            fechaPublicacion = DB.GetDateTime("FECHAPUBLICACION"),
                            fechaCompra = DB.GetDateTime("FECHACOMPRA"),
                            isDeleted = DB.GetBoolean("ISDELETED"),
                            imagenURL = DB.GetString("IMAGENURL")
                        };
                    }
                }
                finally
                {
                    DB.CloseReader();
                }
        
                return evento;
            }
        }
    }
}