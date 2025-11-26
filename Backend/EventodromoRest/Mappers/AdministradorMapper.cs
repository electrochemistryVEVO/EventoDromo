using EventodromoRest.Modelos;
using EventodromoRest.Modelos.Utiles;


namespace EventodromoRest.Mappers
{
    public class AdministradorMapper(Globales.Globales globales, DBManager.DBManager DB)
    {
        public List<Administrador> ListarAdministrador()
        {
            List<Administrador> listaAdministrador = new List<Administrador>();
            lock (DB)
            {
                string query = "SELECT * FROM Administrador";
                DB.Select(query, null);
                while (DB.Read())
                {
                    Administrador administrador = new()
                    {
                        id = DB.GetInt("ID"),
                        nombres = DB.GetString("NOMBRES"),
                        apellidos = DB.GetString("APELLIDOS"),
                        email = DB.GetString("EMAIL"),
                        passwordHash = DB.GetString("PASSWORDHASH"),
                        fechaCreacion = DB.GetDateTime("FECHACREACION"),
                    };
                    listaAdministrador.Add(administrador);
                }
                return listaAdministrador;
            }
        }

        public int InsertarAdministrador(Administrador administrador)
        {
            lock (DB)
            {
                string query = "INSERT INTO Administrador (NOMBRES, APELLIDOS, EMAIL, PASSWORDHASH, FECHACREACION) VALUES (@NOMBRES, @APELLIDOS, @EMAIL, @PASSWORDHASH, @FECHACREACION); SELECT LAST_INSERT_ID();";
                var parametros = new ParameterList();
                parametros.Add("@NOMBRES", administrador.nombres);
                parametros.Add("@APELLIDOS", administrador.apellidos);
                parametros.Add("@EMAIL", administrador.email);
                parametros.Add("@PASSWORDHASH", administrador.passwordHash);
                parametros.Add("@FECHACREACION", administrador.fechaCreacion);
                object result = DB.ExecuteScalar(query, parametros);
                int newId = Convert.ToInt32(result);
                return newId;
            }
        }

        public Administrador ObtenerAdministradorPorId(int id)
        {
            lock (DB)
            {
                string query = "SELECT * FROM Administrador WHERE ID = @ID";
                var parametros = new ParameterList();
                parametros.Add("@ID", id);
                DB.Select(query, parametros);
                if (DB.Read())
                {
                    Administrador administrador = new()
                    {
                        id = DB.GetInt("ID"),
                        nombres = DB.GetString("NOMBRES"),
                        apellidos = DB.GetString("APELLIDOS"),
                        email = DB.GetString("EMAIL"),
                        passwordHash = DB.GetString("PASSWORDHASH"),
                        fechaCreacion = DB.GetDateTime("FECHACREACION"),
                    };
                    return administrador;
                }
                else
                {
                    return null;
                }
            }
        }

        public int EliminarAdministradorPorId(int id)
        {
            lock (DB)
            {
                string query = "DELETE FROM Administrador WHERE ID = @ID";
                var parametros = new ParameterList();
                parametros.Add("@ID", id);
                int rowsAffected = DB.ExecuteNonQuery(query, parametros);
                return rowsAffected;
            }
        }
        public int ModificarAdministrador(Administrador administrador)
        {
            lock (DB)
            {
                string query = "UPDATE Administrador SET NOMBRES = @NOMBRES, APELLIDOS = @APELLIDOS, EMAIL = @EMAIL, PASSWORDHASH = @PASSWORDHASH, FECHACREACION = @FECHACREACION WHERE ID = @ID";
                var parametros = new ParameterList();
                parametros.Add("@NOMBRES", administrador.nombres);
                parametros.Add("@APELLIDOS", administrador.apellidos);
                parametros.Add("@EMAIL", administrador.email);
                parametros.Add("@PASSWORDHASH", administrador.passwordHash);
                parametros.Add("@FECHACREACION", administrador.fechaCreacion);
                parametros.Add("@ID", administrador.id);
                int rowsAffected = DB.ExecuteNonQuery(query, parametros);
                return rowsAffected;
            }
        }

        public MetricasDashboardDTO ObtenerMetricasDashboard()
        {
            lock (DB)
            {
                string query = @"
WITH 
Fechas AS (
    SELECT 
        DATE_FORMAT(NOW(), '%Y-%m-01 00:00:00') as InicioMesActual,
        DATE_FORMAT(DATE_SUB(NOW(), INTERVAL 1 MONTH), '%Y-%m-01 00:00:00') as InicioMesAnterior
),

KpiTransaccional AS (
    SELECT 
        COALESCE(SUM(CASE WHEN t.fechaHoraCompra >= f.InicioMesActual THEN t.montoTotal ELSE 0 END), 0) as Ingresos_Actual,
        COALESCE(SUM(CASE WHEN t.fechaHoraCompra >= f.InicioMesAnterior AND t.fechaHoraCompra < f.InicioMesActual THEN t.montoTotal ELSE 0 END), 0) as Ingresos_Anterior,
        
        COALESCE(COUNT(DISTINCT CASE WHEN t.fechaHoraCompra >= f.InicioMesActual THEN t.idCliente END), 0) as Compradores_Actual,
        COALESCE(COUNT(DISTINCT CASE WHEN t.fechaHoraCompra >= f.InicioMesAnterior AND t.fechaHoraCompra < f.InicioMesActual THEN t.idCliente END), 0) as Compradores_Anterior
    FROM Transaccion t
    JOIN Fechas f ON 1=1
    WHERE t.fechaHoraCompra >= f.InicioMesAnterior
),

KpiEntradas AS (
    SELECT 
        COALESCE(COUNT(CASE WHEN t.fechaHoraCompra >= f.InicioMesActual THEN 1 END), 0) as Actual,
        COALESCE(COUNT(CASE WHEN t.fechaHoraCompra >= f.InicioMesAnterior AND t.fechaHoraCompra < f.InicioMesActual THEN 1 END), 0) as Anterior
    FROM LineaTransaccion lt
    JOIN Transaccion t ON lt.idTransaccion = t.id
    JOIN Fechas f ON 1=1
    WHERE t.fechaHoraCompra >= f.InicioMesAnterior
),

KpiPuntos AS (
    SELECT 
        COALESCE(SUM(CASE WHEN t.fechaHoraCompra >= f.InicioMesActual THEN tp.puntosGastados ELSE 0 END), 0) as Actual,
        COALESCE(SUM(CASE WHEN t.fechaHoraCompra >= f.InicioMesAnterior AND t.fechaHoraCompra < f.InicioMesActual THEN tp.puntosGastados ELSE 0 END), 0) as Anterior
    FROM TransaccionPuntos tp
    JOIN Transaccion t ON tp.idTransaccion = t.id
    JOIN Fechas f ON 1=1
    WHERE t.fechaHoraCompra >= f.InicioMesAnterior
),

KpiUsuarios AS (
    SELECT 
        COALESCE(COUNT(CASE WHEN c.fechaCreacion >= f.InicioMesActual THEN 1 END), 0) as Actual,
        COALESCE(COUNT(CASE WHEN c.fechaCreacion >= f.InicioMesAnterior AND c.fechaCreacion < f.InicioMesActual THEN 1 END), 0) as Anterior
    FROM Cliente c
    JOIN Fechas f ON 1=1
    WHERE c.fechaCreacion >= f.InicioMesAnterior
)

SELECT 
    t.Ingresos_Actual as Ingresos_Monto,
    IF(t.Ingresos_Anterior = 0, 0, ((t.Ingresos_Actual - t.Ingresos_Anterior) / t.Ingresos_Anterior) * 100) as Ingresos_Cambio,
    
    p.Actual as Puntos_Monto, 
    IF(p.Anterior = 0, 0, ((p.Actual - p.Anterior) / p.Anterior) * 100) as Puntos_Cambio,
    
    e.Actual as Entradas_Monto,
    IF(e.Anterior = 0, 0, ((e.Actual - e.Anterior) / e.Anterior) * 100) as Entradas_Cambio,
    
    u.Actual as Usuarios_Monto,
    IF(u.Anterior = 0, 0, ((u.Actual - u.Anterior) / u.Anterior) * 100) as Usuarios_Cambio,
    
    IF(u.Actual = 0, 0, (t.Compradores_Actual / u.Actual) * 100) as Conversion_Tasa,
    
    IF(u.Anterior = 0 OR t.Compradores_Anterior = 0, 0, 
       ( ( (IF(u.Actual=0,0,t.Compradores_Actual/u.Actual)) - (t.Compradores_Anterior/u.Anterior) ) / (t.Compradores_Anterior/u.Anterior) ) * 100
    ) as Conversion_Cambio

FROM KpiTransaccional t
JOIN KpiEntradas e ON 1=1
JOIN KpiPuntos p ON 1=1
JOIN KpiUsuarios u ON 1=1;";

                MetricasDashboardDTO metricas = new MetricasDashboardDTO();

                DB.Select(query, null);

                try
                {
                    if (DB.Read())
                    {
                        metricas.ingresosTotales = new MetricaConMontoDTO
                        {
                            valor = DB.GetDecimal("Ingresos_Monto"),
                            porcentajeCambio = DB.GetDecimal("Ingresos_Cambio")
                        };

                        metricas.puntosUsadosPromedio = new MetricaConMontoDTO
                        {
                            valor = DB.GetInt("Puntos_Monto"),
                            porcentajeCambio = DB.GetDecimal("Puntos_Cambio")
                        };

                        metricas.entradasVendidas = new MetricaConMontoDTO
                        {
                            valor = DB.GetInt("Entradas_Monto"),
                            porcentajeCambio = DB.GetDecimal("Entradas_Cambio")
                        };

                        metricas.usuariosNuevos = new MetricaConMontoDTO
                        {
                            valor = DB.GetInt("Usuarios_Monto"),
                            porcentajeCambio = DB.GetDecimal("Usuarios_Cambio")
                        };

                        metricas.tasaConversion = new MetricaConMontoDTO
                        {
                            valor = DB.GetDecimal("Conversion_Tasa"),
                            porcentajeCambio = DB.GetDecimal("Conversion_Cambio")
                        };
                    }
                }
                finally
                {
                    DB.CloseReader();
                }

                return metricas;
            }
        }
    }
}
