using EventodromoRest.Modelos;
using EventodromoRest.Modelos.Utiles;
using EventodromoRest.Negocio;
using System.Data;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;
using static System.Runtime.InteropServices.JavaScript.JSType;


namespace EventodromoRest.Mappers
{
    public class LocalMapper(Globales.Globales globales, DBManager.DBManager DB)
    {
        public List<LocalCiudadImagenDTO> ListarLocales()
        {
            List<LocalCiudadImagenDTO> listaLocal = new List<LocalCiudadImagenDTO>();
            lock (DB)
            {
                string query = @"SELECT
                                    L.ID,
                                    L.NOMBRE,
                                    L.IMAGENURL,
                                    C.NOMBRE AS CIUDADNOMBRE
                                FROM
                                    Local AS L
                                JOIN
                                    Ciudad AS C ON L.idCiudad = C.ID
                                WHERE
                                    L.isDeleted = 0;"; // Asumiendo que 0 es 'no borrado'

                DB.Select(query, null);
                while (DB.Read())
                {
                    LocalCiudadImagenDTO local = new()
                    {
                        idLocal = DB.GetInt("ID"),
                        nombreLocal = DB.GetString("NOMBRE"),
                        nombreCiudad = DB.GetString("CIUDADNOMBRE"),
                        imagenURL = DB.GetString("IMAGENURL")
                    };
                    listaLocal.Add(local);
                }

                return listaLocal;
            }
        }

        public List<LocalCiudadImagenDTO> ListarLocalesDestacados()
        {
            lock (DB)
            {
                string query = @"
            SELECT DISTINCT
                l.id,
                l.nombre,
                c.nombre as ciudad,
                COALESCE(l.imagenURL, e.imagenURL) as imagen
            FROM Local l
            INNER JOIN Ciudad c ON l.idCiudad = c.id
            LEFT JOIN Evento e ON l.id = e.idLocal AND e.isDeleted = 0
            WHERE l.isDeleted = 0
            ORDER BY l.id
            LIMIT 4;";

                DB.Select(query, new ParameterList());

                var resultados = new List<LocalCiudadImagenDTO>();
                while (DB.Read())
                {
                    var dto = new LocalCiudadImagenDTO
                    {
                        idLocal = DB.GetInt("id"),
                        nombreLocal = DB.GetString("nombre"),
                        nombreCiudad = DB.GetString("ciudad"),
                        imagenURL = DB.GetString("imagen")
                    };
                    resultados.Add(dto);
                }
                return resultados;
            }
        }

        public List<Local> ListarLocales2()
        {
            List<Local> listaLocal = new();
            lock (DB)
            {
                string query = "SELECT * FROM Local";
                DB.Select(query, null);
                while (DB.Read())
                {
                    Local local = new()
                    {
                        id = DB.GetInt("ID"),
                        nombre = DB.GetString("NOMBRE"),
                        idCiudad = DB.GetInt("IDCIUDAD"),
                        direccion = DB.GetString("DIRECCION"),
                        capacidad = DB.GetInt("CAPACIDAD"),
                        isDeleted = DB.GetBoolean("ISDELETED"),
                        idAdministrador = DB.GetInt("CREADOPOR"),
                    };
                    listaLocal.Add(local);
                }

                // ✅ IMPORTANT: Close reader before making additional queries
                DB.CloseReader();
            }

            // Cerrar DataReader antes de nuevas consultas
            foreach (var local in listaLocal)
            {
                local.ciudad = ObtenerCiudadPorId(local.idCiudad);
                local.administrador = ObtenerAdministradorPorId(local.idAdministrador);
            }

            return listaLocal;
        }

        public List<int> ListarIdLocales()
        {
            List<int> listaIdLocales = new();
            lock (DB)
            {
                string query = "SELECT ID FROM Local";
                DB.Select(query, null);
                while (DB.Read())
                {
                    listaIdLocales.Add(DB.GetInt("ID"));
                }
                
                // ✅ IMPORTANT: Close reader before returning
                DB.CloseReader();
            }
            return listaIdLocales;
        }

        public int InsertarLocal(Local local)
        {
            lock (DB)
            {
                string query = @"INSERT INTO Local 
                    (NOMBRE, IDCIUDAD, DIRECCION, CAPACIDAD, IMAGENURL, ISDELETED, CREADOPOR, latitud, longitud, googleMapsUrl) 
                    VALUES 
                    (@NOMBRE, @IDCIUDAD, @DIRECCION, @CAPACIDAD, @IMAGENURL, @ISDELETED, @CREADOPOR, @LATITUD, @LONGITUD, @GOOGLEMAPSURL); 
                    SELECT LAST_INSERT_ID();";
                var parametros = new ParameterList();
                parametros.Add("@NOMBRE", local.nombre);
                parametros.Add("@IDCIUDAD", local.idCiudad);
                parametros.Add("@DIRECCION", local.direccion);
                parametros.Add("@CAPACIDAD", local.capacidad);
                parametros.Add("@IMAGENURL", local.imagenURL);
                parametros.Add("@ISDELETED", local.isDeleted);
                parametros.Add("@CREADOPOR", local.idAdministrador);
                parametros.Add("@LATITUD", local.Latitud);
                parametros.Add("@LONGITUD", local.Longitud);
                parametros.Add("@GOOGLEMAPSURL", local.GoogleMapsUrl);
                object result = DB.ExecuteScalar(query, parametros);
                int newId = Convert.ToInt32(result);
                return newId;
            }
        }

       public Local ObtenerLocalPorId(int id)
        {
            lock (DB)
            {
                string query = "SELECT * FROM Local WHERE ID = @ID";
                var parametros = new ParameterList();
                parametros.Add("@ID", id);
                DB.Select(query, parametros);
                if (DB.Read())
                {
                    Local local = new Local();
                    local.id = DB.GetInt("ID");
                    local.nombre = DB.GetString("NOMBRE");
                    local.idCiudad = DB.GetInt("IDCIUDAD");
                    local.direccion = DB.GetString("DIRECCION");
                    local.capacidad = DB.GetInt("CAPACIDAD");
                    local.isDeleted = DB.GetBoolean("ISDELETED");
                    local.idAdministrador = DB.GetInt("CREADOPOR");
                    local.imagenURL = DB.GetString("IMAGENURL");
                    local.ciudad = ObtenerCiudadPorId(local.idCiudad);
                    local.administrador = ObtenerAdministradorPorId(local.idAdministrador);
                    return local;
                }
                else
                {
                    return null;
                }
            }
        }

        public int EliminarLocalPorId(int id)
        {
            lock (DB)
            {
                string query = "DELETE FROM Local WHERE ID = @ID";
                var parametros = new ParameterList();
                parametros.Add("@ID", id);
                int rowsAffected = DB.ExecuteNonQuery(query, parametros);
                return rowsAffected;
            }
        }

        public int ModificarLocal(Local local)
        {
            lock (DB)
            {
                string query = @"UPDATE Local SET 
                    NOMBRE = @NOMBRE, 
                    IDCIUDAD = @IDCIUDAD, 
                    DIRECCION = @DIRECCION, 
                    CAPACIDAD = @CAPACIDAD, 
                    ISDELETED = @ISDELETED, 
                    CREADOPOR = @CREADOPOR,
                    latitud = @LATITUD,
                    longitud = @LONGITUD,
                    googleMapsUrl = @GOOGLEMAPSURL
                    WHERE ID = @ID";
                var parametros = new ParameterList();
                parametros.Add("@NOMBRE", local.nombre);
                parametros.Add("@IDCIUDAD", local.idCiudad);
                parametros.Add("@DIRECCION", local.direccion);
                parametros.Add("@CAPACIDAD", local.capacidad);
                parametros.Add("@ISDELETED", local.isDeleted);
                parametros.Add("@CREADOPOR", local.idAdministrador);
                parametros.Add("@LATITUD", local.Latitud);
                parametros.Add("@LONGITUD", local.Longitud);
                parametros.Add("@GOOGLEMAPSURL", local.GoogleMapsUrl);
                parametros.Add("@ID", local.id);
                int rowsAffected = DB.ExecuteNonQuery(query, parametros);
                return rowsAffected;
            }
        }

        private Ciudad ObtenerCiudadPorId(int v)
        {
            var ciudadMapper = new CiudadMapper(globales, DB);
            return ciudadMapper.ObtenerCiudadPorId(v);
        }

        private Administrador ObtenerAdministradorPorId(int v)
        {
            var administradorMapper = new AdministradorMapper(globales, DB);
            return administradorMapper.ObtenerAdministradorPorId(v);
        }

        public ResponseLocal ObtenerLocalPorIdEvento(int eventoId)
        {
            CiudadMapper ciudadMapper = new CiudadMapper(globales, DB);
            lock (DB)
            {
                string query = @"SELECT
                                    L.id AS ID,
                                    L.nombre AS NOMBRE,
                                    L.direccion AS DIRECCION,
                                    L.idCiudad AS IDCIUDAD,
                                    L.latitud AS latitud,
                                    L.longitud AS longitud
                                FROM
                                    Local AS L
                                JOIN
                                    Evento AS E ON L.id = E.idLocal
                                WHERE
                                    E.id = @IdEvento;";

                var parametros = new ParameterList();
                parametros.Add("@IdEvento", eventoId);
                DB.Select(query, parametros);
                if (DB.Read())
                {
                    ResponseLocal local = new ResponseLocal();
                    local.id = DB.GetInt("ID");
                    local.nombre = DB.GetString("NOMBRE");
                    local.direccion = DB.GetString("DIRECCION");
                    local.ciudad = new Ciudad()
                    {
                        id = DB.GetInt("IDCIUDAD")
                    };
                    
                    // Obtener coordenadas
                    var latitud = DB.GetNullableDecimal("latitud");
                    var longitud = DB.GetNullableDecimal("longitud");
                    
                    local.Latitud = latitud;
                    local.Longitud = longitud;
                    
                    // Generar iframe dinámicamente si hay coordenadas
                    if (latitud.HasValue && longitud.HasValue)
                    {
                        local.googleMapsEmbed = GenerarGoogleMapsIframe(latitud.Value, longitud.Value);
                    }
                    else
                    {
                        // Fallback a OpenStreetMap del Teatro Municipal si no hay coordenadas
                        local.googleMapsEmbed = "<iframe src=\"https://www.openstreetmap.org/export/embed.html?bbox=-77.038,-12.047,-77.036,-12.045&layer=mapnik&marker=-12.046,-77.037\" width=\"600\" height=\"450\" style=\"border:0;\" allowfullscreen=\"\" loading=\"lazy\"></iframe>";
                    }

                    local.ciudad = ciudadMapper.ObtenerCiudadPorId((int)local.ciudad.id);
                    return local;
                }
                else
                {
                    return null;
                }
            }
        }
        
        /// <summary>
        /// Genera un iframe de Google Maps basado en coordenadas
        /// </summary>
        private string GenerarGoogleMapsIframe(decimal latitud, decimal longitud)
        {
            // Usar InvariantCulture para que use punto decimal en lugar de coma
            string lat = latitud.ToString(System.Globalization.CultureInfo.InvariantCulture);
            string lng = longitud.ToString(System.Globalization.CultureInfo.InvariantCulture);
            
            // Calcular bbox (bounding box) para OpenStreetMap
            decimal bboxOffset = 0.01m;
            string minLng = (longitud - bboxOffset).ToString(System.Globalization.CultureInfo.InvariantCulture);
            string minLat = (latitud - bboxOffset).ToString(System.Globalization.CultureInfo.InvariantCulture);
            string maxLng = (longitud + bboxOffset).ToString(System.Globalization.CultureInfo.InvariantCulture);
            string maxLat = (latitud + bboxOffset).ToString(System.Globalization.CultureInfo.InvariantCulture);
            
            // URL de OpenStreetMap (gratuito, sin API key)
            string mapUrl = $"https://www.openstreetmap.org/export/embed.html?bbox={minLng},{minLat},{maxLng},{maxLat}&layer=mapnik&marker={lat},{lng}";
            
            return $"<iframe src=\"{mapUrl}\" width=\"600\" height=\"450\" style=\"border:0;\" allowfullscreen=\"\" loading=\"lazy\"></iframe>";
        }

        public List<Local> ListarLocalesAdmin()
        {
            List<Local> listaLocal = new List<Local>();
            lock (DB)
            {
                string query = "SELECT Local.*,COUNT(E.id) AS EVENTOS,C.nombre AS NOMBRECIUDAD"
                               + " FROM Local LEFT JOIN Evento AS E ON Local.id = E.idLocal"
                               + " LEFT JOIN Ciudad AS C ON Local.idCiudad = C.id"
                               + " GROUP BY Local.id;";
                DB.Select(query, null);
                while (DB.Read())
                {
                    Local local = new()
                    {
                        id = DB.GetInt("ID"),
                        nombre = DB.GetString("NOMBRE"),
                        idCiudad = DB.GetInt("IDCIUDAD"),
                        nombreCiudad = DB.GetString("NOMBRECIUDAD"),
                        eventos = DB.GetInt("EVENTOS"),
                        direccion = DB.GetString("DIRECCION"),
                        capacidad = DB.GetInt("CAPACIDAD"),
                        imagenURL = DB.GetString("IMAGENURL"),
                        isDeleted = DB.GetBoolean("ISDELETED")
                    };
                    listaLocal.Add(local);
                }
                return listaLocal;
            }
        }
        public bool VerificarDireccionUnica(string direccion)
        {
            lock (DB)
            {
                string query = "SELECT 1 FROM Local WHERE direccion = @DIRECCION LIMIT 1";
                var parametros = new ParameterList();
                parametros.Add("@DIRECCION", direccion);

                DB.Select(query, parametros);
                bool existe = DB.Read();
                DB.CloseReader();
                return existe;
            }
        }

        public int ModificarLocalAdmin(Local local)
        {
            lock (DB)
            {
                string query = "UPDATE Local SET NOMBRE = @NOMBRE, IDCIUDAD = @IDCIUDAD, DIRECCION = @DIRECCION, CAPACIDAD = @CAPACIDAD, IMAGENURL = @IMAGENURL, latitud = @LATITUD, longitud = @LONGITUD, googleMapsUrl = @GOOGLEMAPSURL WHERE ID = @ID";
                var parametros = new ParameterList();
                parametros.Add("@NOMBRE", local.nombre);
                parametros.Add("@IDCIUDAD", local.idCiudad);
                parametros.Add("@DIRECCION", local.direccion);
                parametros.Add("@CAPACIDAD", local.capacidad);
                parametros.Add("@IMAGENURL", local.imagenURL);
                parametros.Add("@LATITUD", local.Latitud);
                parametros.Add("@LONGITUD", local.Longitud);
                parametros.Add("@GOOGLEMAPSURL", local.GoogleMapsUrl);
                parametros.Add("@ID", local.id);
                int rowsAffected = DB.ExecuteNonQuery(query, parametros);
                return rowsAffected;
            }
        }

        public int ActualizarEstadoLocal(int idLocal, bool isDeleted)
        {
            lock (DB)
            {
                string query = "UPDATE Local SET isDeleted = @ISDELETED WHERE ID = @ID";

                var parametros = new ParameterList();
                parametros.Add("@ISDELETED", isDeleted);
                parametros.Add("@ID", idLocal);

                // ExecuteNonQuery devuelve el número de filas afectadas
                int rowsAffected = DB.ExecuteNonQuery(query, parametros);
                return rowsAffected;
            }
        }

        public List<OcuapcionLocalResponse> OcupacionLocales ()
        {
            List<OcuapcionLocalResponse> listaOcupacion = new();
            lock (DB)
            {
                string query = @"
                SELECT
                  l.id AS idLocal,
                  l.nombre AS NombreLocal,
                  DATE(f.fechaHora) AS Dia,
                  SUM(t.cantidadEntradas) AS TotalEntradas,
                  SUM(t.cantidadVendida) AS TotalVendidas
                FROM Local l
                LEFT JOIN Evento e ON e.idLocal = l.id AND e.isDeleted = 0
                LEFT JOIN FechaEvento f ON f.idEvento = e.id
                LEFT JOIN TipoEntrada t ON t.idFechaEvento = f.id
                WHERE f.fechaHora IS NOT NULL
                GROUP BY
                  l.id,
                  l.nombre,
                  DATE(f.fechaHora)
                ORDER BY
                  l.id, Dia;
                ";
                DB.Select(query, null);
                
                // Diccionario para agrupar por local
                var localesDict = new Dictionary<int, (string nombre, HashSet<DateTime> diasUnicos, List<decimal> tasasOcupacionPorDia)>();
                
                while (DB.Read())
                {
                    int idLocal = DB.GetInt("idLocal");
                    string nombreLocal = DB.GetString("NombreLocal");
                    DateTime dia = DB.GetDateTime("Dia");
                    int totalEntradas = DB.GetInt("TotalEntradas");
                    int totalVendidas = DB.GetInt("TotalVendidas");
                    
                    // Calcular tasa de ocupación del día (evitar división por cero)
                    decimal tasaDia = totalEntradas > 0 
                        ? ((decimal)totalVendidas / totalEntradas) * 100 
                        : 0;
                    
                    // Agregar o actualizar local en el diccionario
                    if (!localesDict.ContainsKey(idLocal))
                    {
                        localesDict[idLocal] = (nombreLocal, new HashSet<DateTime>(), new List<decimal>());
                    }
                    
                    localesDict[idLocal].diasUnicos.Add(dia);
                    localesDict[idLocal].tasasOcupacionPorDia.Add(tasaDia);
                }
                
                DB.CloseReader();
                
                // Convertir el diccionario a la lista de respuesta
                foreach (var kvp in localesDict)
                {
                    int idLocal = kvp.Key;
                    string nombreLocal = kvp.Value.nombre;
                    int diasOcupados = kvp.Value.diasUnicos.Count;
                    decimal tasaOcupacionPromedio = kvp.Value.tasasOcupacionPorDia.Any() 
                        ? kvp.Value.tasasOcupacionPorDia.Average() 
                        : 0;
                    
                    listaOcupacion.Add(new OcuapcionLocalResponse
                    {
                        idLocal = idLocal,
                        nombreLocal = nombreLocal,
                        diasOcupados = diasOcupados,
                        tasaOcupacion = Math.Round(tasaOcupacionPromedio, 1)
                    });
                }
            }
            return listaOcupacion;
        }

        public int InsertarLocalesMasivo(List<LocalMasivoItem> locales, int idAdministrador)
        {
            lock (DB)
            {
                try
                {
                    if (locales == null || !locales.Any())
                        return 0;

                    // Iniciar transacción
                    DB.BeginTransaction();

                    // Construir query con múltiples VALUES en un solo INSERT
                    var valuesClauses = new List<string>();
                    var parametros = new ParameterList();

                    for (int i = 0; i < locales.Count; i++)
                    {
                        var local = locales[i];

                        // Crear parámetros únicos para cada registro
                        string pNombre = $"@NOMBRE{i}";
                        string pIdCiudad = $"@IDCIUDAD{i}";
                        string pDireccion = $"@DIRECCION{i}";
                        string pCapacidad = $"@CAPACIDAD{i}";
                        string pImagenUrl = $"@IMAGENURL{i}";
                        string pIsDeleted = $"@ISDELETED{i}";
                        string pCreadoPor = $"@CREADOPOR{i}";

                        // Agregar parámetros
                        parametros.Add(pNombre, local.nombre);
                        parametros.Add(pIdCiudad, local.idCiudad);
                        parametros.Add(pDireccion, local.direccion);
                        parametros.Add(pCapacidad, local.capacidad);
                        parametros.Add(pImagenUrl, string.IsNullOrWhiteSpace(local.imagen) ? null : local.imagen);
                        parametros.Add(pIsDeleted, false);
                        parametros.Add(pCreadoPor, idAdministrador);

                        // Construir cláusula VALUES para este registro
                        valuesClauses.Add($"({pNombre}, {pIdCiudad}, {pDireccion}, {pCapacidad}, {pImagenUrl}, {pIsDeleted}, {pCreadoPor})");
                    }

                    // Construir query completo con todos los VALUES
                    string query = "INSERT INTO Local (NOMBRE, IDCIUDAD, DIRECCION, CAPACIDAD, IMAGENURL, ISDELETED, CREADOPOR) " +
                                  $"VALUES {string.Join(", ", valuesClauses)}";

                    // Ejecutar una sola vez
                    int insertados = DB.ExecuteNonQuery(query, parametros);

                    // Confirmar transacción
                    DB.Commit();
                    return insertados;
                }
                catch (Exception)
                {
                    // Revertir transacción en caso de error
                    DB.Rollback();
                    throw;
                }
            }
        }

        public bool VerificarDireccionesDuplicadasEnBD(List<string> direcciones)
        {
            lock (DB)
            {
                if (direcciones == null || !direcciones.Any())
                    return false;

                // Crear lista de parámetros
                var parametros = new ParameterList();
                var placeholders = new List<string>();
                
                for (int i = 0; i < direcciones.Count; i++)
                {
                    string paramName = $"@DIRECCION{i}";
                    parametros.Add(paramName, direcciones[i]);
                    placeholders.Add(paramName);
                }

                string query = $"SELECT COUNT(*) FROM Local WHERE direccion IN ({string.Join(",", placeholders)})";
                
                object result = DB.ExecuteScalar(query, parametros);
                int count = Convert.ToInt32(result);
                
                return count > 0;
            }
        }

        public List<string> ObtenerDireccionesDuplicadasEnBD(List<string> direcciones)
        {
            lock (DB)
            {
                var duplicadas = new List<string>();
                
                if (direcciones == null || !direcciones.Any())
                    return duplicadas;

                // Crear lista de parámetros
                var parametros = new ParameterList();
                var placeholders = new List<string>();
                
                for (int i = 0; i < direcciones.Count; i++)
                {
                    string paramName = $"@DIRECCION{i}";
                    parametros.Add(paramName, direcciones[i]);
                    placeholders.Add(paramName);
                }

                string query = $"SELECT direccion FROM Local WHERE direccion IN ({string.Join(",", placeholders)})";
                
                DB.Select(query, parametros);
                while (DB.Read())
                {
                    duplicadas.Add(DB.GetString("direccion"));
                }
                DB.CloseReader();
                
                return duplicadas;
            }
        }

        public bool VerificarCiudadesExisten(List<int> idsCiudad)
        {
            lock (DB)
            {
                if (idsCiudad == null || !idsCiudad.Any())
                    return true;

                var idsUnicos = idsCiudad.Distinct().ToList();
                
                // Crear lista de parámetros
                var parametros = new ParameterList();
                var placeholders = new List<string>();
                
                for (int i = 0; i < idsUnicos.Count; i++)
                {
                    string paramName = $"@ID{i}";
                    parametros.Add(paramName, idsUnicos[i]);
                    placeholders.Add(paramName);
                }

                string query = $"SELECT COUNT(*) FROM Ciudad WHERE id IN ({string.Join(",", placeholders)})";
                
                object result = DB.ExecuteScalar(query, parametros);
                int count = Convert.ToInt32(result);
                
                // Todas las ciudades deben existir
                return count == idsUnicos.Count;
            }
          
        }
        public List<Feat_MetricDashB_ObtenerOcupacionLocales> ObtenerOcupacionLocalesUltimos30Dias()
        {
            List<Feat_MetricDashB_ObtenerOcupacionLocales> lista = new List<Feat_MetricDashB_ObtenerOcupacionLocales>();

            string query = @"
            SELECT 
                L.id AS idLocal,
                L.nombre AS nombreLocal,
                COUNT(DISTINCT DATE(FE.fechaHora)) AS diasOcupados,
                (COUNT(DISTINCT DATE(FE.fechaHora)) * 100.0) / 30 AS tasaOcupacion
            FROM Local L
            LEFT JOIN Evento E 
                ON E.idLocal = L.id
            LEFT JOIN FechaEvento FE
                ON FE.idEvento = E.id
               AND FE.fechaHora >= DATE_SUB(NOW(), INTERVAL 30 DAY)
            GROUP BY L.id, L.nombre;
        ";
            DB.Select(query, null);

            while (DB.Read())
            {
                Feat_MetricDashB_ObtenerOcupacionLocales local = new()
                {
                    id =DB.GetInt("idLocal"),
                    nombre = DB.GetString("nombreLocal"),
                    diasOcupados = DB.GetInt("diasOcupados"),
                    tasaOcupacion = DB.GetDecimal("tasaOcupacion")
                };
                lista.Add(local);
            }
            DB.CloseReader();

            return lista;
        }
    }
}
