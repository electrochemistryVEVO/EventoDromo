using EventodromoRest.Modelos;
using EventodromoRest.Modelos.Utiles;
using System.Collections.Generic;

namespace EventodromoRest.Mappers
{
    public class MisEntradasMapper(Globales.Globales globales, DBManager.DBManager DB)
    {
        private readonly DBManager.DBManager DB = DB;

        public PaginacionResponse<EntradaEventoAuxiliar> ListarMisEntradasPaginado(int idCliente, FiltroEntradasRequest filtros)
        {
            var response = new PaginacionResponse<EntradaEventoAuxiliar>();
            var parametros = new ParameterList();
            parametros.Add("@idCliente", idCliente);

            // --- 1. CONSULTA BASE (Sin cambios) ---
            string sqlBase = @"
                FROM LineaTransaccion LT
                JOIN Transaccion T ON LT.idTransaccion = T.id
                JOIN Carrito CA ON T.idCarrito = CA.id
                JOIN Entrada E ON LT.idEntrada = E.id
                JOIN TipoEntrada TE ON E.idTipoEntrada = TE.id
                JOIN FechaEvento FE ON TE.idFechaEvento = FE.id
                JOIN Evento EV ON FE.idEvento = EV.id
                JOIN Local L ON EV.idLocal = L.id
                JOIN Ciudad CI ON L.idCiudad = CI.id
                JOIN Pais P ON CI.idPais = P.ID
            ";

            // --- 2. WHERE DINÁMICO ---
            // Filtramos solo por el cliente del carrito
            // Las entradas transferidas se muestran en una transacción separada creada para el destinatario
            // Filtramos entradas que el usuario actualmente posee (no transferidas a otros)
            string sqlWhere = @" WHERE CA.idCliente = @idCliente 
                AND (
                    (E.idClienteActual IS NULL)
                    OR E.idClienteActual = @idCliente
                ) ";

            if (!string.IsNullOrEmpty(filtros.fechaInicio))
            {
                sqlWhere += " AND DATE(FE.fechaHora) >= @fechaInicio ";
                parametros.Add("@fechaInicio", filtros.fechaInicio);
            }
            if (!string.IsNullOrEmpty(filtros.fechaFin))
            {
                sqlWhere += " AND DATE(FE.fechaHora) <= @fechaFin ";
                parametros.Add("@fechaFin", filtros.fechaFin);
            }
            bool quiereVigentes = filtros.estados.Contains("vigente");
            bool quiereVencidos = filtros.estados.Contains("vencido");
            if (quiereVigentes && !quiereVencidos)
            {
                sqlWhere += " AND FE.fechaHora > NOW() ";
            }
            else if (!quiereVigentes && quiereVencidos)
            {
                sqlWhere += " AND FE.fechaHora <= NOW() ";
            }

            // --- 3. GROUP BY (Clave de la agrupación) ---
            // Agrupamos por Transacción y FechaEvento.
            // Si compras 2 tickets para el viernes y 2 para el sábado en la misma
            // transacción, se mostrarán como 2 grupos (lo cual es correcto).
            string sqlGroupBy = @"
                GROUP BY 
                    T.id, T.numeroTransaccion,
                    FE.id, FE.fechaHora,
                    EV.id, EV.nombre, EV.imagenURL,
                    L.id, L.direccion, L.nombre,
                    CI.id, CI.nombre,
                    P.id, P.nombre
            ";

            lock (DB)
            {
                // --- 4. CONSULTA DE CONTEO (ACTUALIZADA) ---
                // Contamos los grupos, no las líneas individuales
                string sqlCount = $"SELECT COUNT(DISTINCT T.id, FE.id) {sqlBase} {sqlWhere}";
                int totalItems = Convert.ToInt32(DB.ExecuteScalar(sqlCount, parametros));

                // --- 5. CÁLCULO DE PAGINACIÓN (Sin cambios) ---
                int pageSize = filtros.tamanoPagina;
                int totalPages = (int)Math.Ceiling((double)totalItems / pageSize);
                int offset = (filtros.pagina - 1) * pageSize;

                response.totalItems = totalItems;
                response.totalPages = totalPages;
                response.currentPage = filtros.pagina;
                response.items = new List<EntradaEventoAuxiliar>();

                if (totalItems == 0) return response;

                // --- 6. CONSULTA DE DATOS (ACTUALIZADA) ---
                // Agregamos COUNT() y SUM() para agrupar
                string sqlSelect = $@"
                    SELECT 
                        T.numeroTransaccion AS transaccion,
                        EV.id AS idEvento,
                        EV.nombre AS titulo,
                        FE.fechaHora,
                        L.direccion, L.nombre AS localNombre,
                        CI.nombre AS ciudadNombre,
                        P.nombre AS paisNombre,
                        EV.imagenURL AS imagen,
                        
                        -- Agregaciones
                        COUNT(LT.id) AS cantidad,
                        SUM(LT.precio) AS precio
                        
                    {sqlBase} {sqlWhere} {sqlGroupBy}
                    ORDER BY FE.fechaHora DESC
                    LIMIT @pageSize OFFSET @offset
                ";

                parametros.Add("@pageSize", pageSize);
                parametros.Add("@offset", offset);

                DB.Select(sqlSelect, parametros);
                while (DB.Read())
                {
                    DateTime fechaHora = DB.GetDateTime("fechaHora");

                    response.items.Add(new EntradaEventoAuxiliar
                    {
                        id = DB.GetInt("idEvento"),
                        transaccion = DB.GetString("transaccion"),
                        titulo = DB.GetString("titulo"),
                        fecha = fechaHora.ToString("yyyy-MM-dd"),
                        ciudadNombre = DB.GetString("ciudadNombre"),
                        paisNombre = DB.GetString("paisNombre"),
                        localNombre = DB.GetString("localNombre"),
                        hora = fechaHora.ToString("HH:mm"),
                        direccion = $"{DB.GetString("direccion")}, {DB.GetString("ciudadNombre")}, {DB.GetString("paisNombre")}",

                        // Estos campos ahora vienen del COUNT y SUM
                        cantidad = DB.GetInt("cantidad"),
                        precio = DB.GetDecimal("precio"),

                        imagen = DB.GetString("imagen"),
                        estado = fechaHora > DateTime.Now ? "vigente" : "vencido"
                    });
                }
                DB.CloseReader();
            }

            return response;
        }
    }
}