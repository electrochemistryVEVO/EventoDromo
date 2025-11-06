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
    }
}