using EventodromoRest.DBManager;
using EventodromoRest.Globales;
using EventodromoRest.Modelos;
using EventodromoRest.Modelos.Utiles;

namespace EventodromoRest.Mappers
{
    public class PromocionMapper
    {
        private readonly Globales.Globales globales;
        private readonly DBManager.DBManager DB;

        public PromocionMapper(Globales.Globales globales, DBManager.DBManager DB)
        {
            this.globales = globales;
            this.DB = DB;
        }

        /// <summary>
        /// Obtiene una promoción por su código
        /// </summary>
        public Promocion? ObtenerPromocionPorCodigo(string codigo)
        {
            lock (DB)
            {
                string query = @"
                    SELECT id, nombre, codigo, tipo, valor, fechaInicio, fechaFin, 
                           usosMaximos, usosActuales 
                    FROM Promocion 
                    WHERE codigo = @CODIGO";

                var parametros = new ParameterList();
                parametros.Add("@CODIGO", codigo.ToUpper());

                DB.Select(query, parametros);

                Promocion? promocion = null;

                if (DB.Read())
                {
                    promocion = new Promocion
                    {
                        id = DB.GetInt("id"),
                        nombre = DB.GetString("nombre") ?? string.Empty,
                        codigo = DB.GetString("codigo") ?? string.Empty,
                        tipo = DB.GetString("tipo") ?? string.Empty,
                        valor = DB.GetDecimal("valor"),
                        fechaInicio = DB.GetDateTime("fechaInicio"),
                        fechaFin = DB.GetDateTime("fechaFin"),
                        usosMaximos = DB.IsDBNull("usosMaximos") ? (int?)null : DB.GetInt("usosMaximos"),
                        usosActuales = DB.GetInt("usosActuales")
                    };
                }

                DB.CloseReader();
                return promocion;
            }
        }

        /// <summary>
        /// Obtiene una promoción por su ID
        /// </summary>
        public Promocion? ObtenerPromocionPorId(int idPromocion)
        {
            lock (DB)
            {
                string query = @"
                    SELECT id, nombre, codigo, tipo, valor, fechaInicio, fechaFin, 
                           usosMaximos, usosActuales 
                    FROM Promocion 
                    WHERE id = @IDPROMOCION";

                var parametros = new ParameterList();
                parametros.Add("@IDPROMOCION", idPromocion);

                DB.Select(query, parametros);

                Promocion? promocion = null;

                if (DB.Read())
                {
                    promocion = new Promocion
                    {
                        id = DB.GetInt("id"),
                        nombre = DB.GetString("nombre") ?? string.Empty,
                        codigo = DB.GetString("codigo") ?? string.Empty,
                        tipo = DB.GetString("tipo") ?? string.Empty,
                        valor = DB.GetDecimal("valor"),
                        fechaInicio = DB.GetDateTime("fechaInicio"),
                        fechaFin = DB.GetDateTime("fechaFin"),
                        usosMaximos = DB.IsDBNull("usosMaximos") ? (int?)null : DB.GetInt("usosMaximos"),
                        usosActuales = DB.GetInt("usosActuales")
                    };
                }

                DB.CloseReader();
                return promocion;
            }
        }

        /// <summary>
        /// Verifica si una promoción es aplicable a las entradas del carrito
        /// </summary>
        public bool VerificarAplicabilidadPromocion(int idPromocion, int idCarrito)
        {
            lock (DB)
            {
                string query = @"
                    SELECT COUNT(*) as count
                    FROM Entrada e
                    INNER JOIN TipoEntrada te ON e.idTipoEntrada = te.id
                    INNER JOIN Promocion_Aplicable pa ON pa.idTipoEntrada = te.id
                    WHERE e.idCarrito = @IDCARRITO 
                    AND pa.idPromocion = @IDPROMOCION";

                var parametros = new ParameterList();
                parametros.Add("@IDCARRITO", idCarrito);
                parametros.Add("@IDPROMOCION", idPromocion);

                DB.Select(query, parametros);

                int count = 0;
                if (DB.Read())
                {
                    count = DB.GetInt("count");
                }

                DB.CloseReader();

                // Si hay al menos una entrada aplicable, retornar true
                return count > 0;
            }
        }

        /// <summary>
        /// Obtiene las entradas del carrito que son aplicables a una promoción
        /// </summary>
        public List<EntradaConPrecio> ObtenerEntradasAplicables(int idPromocion, int idCarrito)
        {
            lock (DB)
            {
                string query = @"
                    SELECT e.id, te.precio
                    FROM Entrada e
                    INNER JOIN TipoEntrada te ON e.idTipoEntrada = te.id
                    INNER JOIN Promocion_Aplicable pa ON pa.idTipoEntrada = te.id
                    WHERE e.idCarrito = @IDCARRITO 
                    AND pa.idPromocion = @IDPROMOCION";

                var parametros = new ParameterList();
                parametros.Add("@IDCARRITO", idCarrito);
                parametros.Add("@IDPROMOCION", idPromocion);

                DB.Select(query, parametros);

                var entradas = new List<EntradaConPrecio>();

                while (DB.Read())
                {
                    entradas.Add(new EntradaConPrecio
                    {
                        idEntrada = DB.GetInt("id"),
                        precio = DB.GetDecimal("precio")
                    });
                }

                DB.CloseReader();
                return entradas;
            }
        }

        /// <summary>
        /// Incrementa el contador de usos de una promoción
        /// </summary>
        public void IncrementarUsosPromocion(int idPromocion)
        {
            lock (DB)
            {
                string query = @"
                    UPDATE Promocion 
                    SET usosActuales = usosActuales + 1 
                    WHERE id = @ID";

                var parametros = new ParameterList();
                parametros.Add("@ID", idPromocion);

                DB.ExecuteNonQuery(query, parametros);
            }
        }

        /// <summary>
        /// Decrementa el contador de usos de una promoción (al remover del carrito)
        /// </summary>
        public void DecrementarUsosPromocion(int idPromocion)
        {
            lock (DB)
            {
                string query = @"
                    UPDATE Promocion 
                    SET usosActuales = GREATEST(0, usosActuales - 1)
                    WHERE id = @ID";

                var parametros = new ParameterList();
                parametros.Add("@ID", idPromocion);

                DB.ExecuteNonQuery(query, parametros);
            }
        }

        /// <summary>
        /// Aplica una promoción a un carrito
        /// </summary>
        public void AplicarPromocionACarrito(int idCarrito, int idPromocion, decimal montoDescuento)
        {
            lock (DB)
            {
                string query = @"
                    UPDATE Carrito 
                    SET idPromocionAplicada = @IDPROMOCION,
                        montoDescuento = @MONTODESCUENTO
                    WHERE id = @IDCARRITO";

                var parametros = new ParameterList();
                parametros.Add("@IDPROMOCION", idPromocion);
                parametros.Add("@MONTODESCUENTO", montoDescuento);
                parametros.Add("@IDCARRITO", idCarrito);

                DB.ExecuteNonQuery(query, parametros);
            }
        }

        /// <summary>
        /// Remueve la promoción de un carrito
        /// </summary>
        public void RemoverPromocionDeCarrito(int idCarrito)
        {
            lock (DB)
            {
                string query = @"
                    UPDATE Carrito 
                    SET idPromocionAplicada = NULL,
                        montoDescuento = 0
                    WHERE id = @IDCARRITO";

                var parametros = new ParameterList();
                parametros.Add("@IDCARRITO", idCarrito);

                DB.ExecuteNonQuery(query, parametros);
            }
        }

        /// <summary>
        /// Obtiene la promoción actual aplicada a un carrito
        /// </summary>
        public Promocion? ObtenerPromocionDeCarrito(int idCarrito)
        {
            lock (DB)
            {
                string query = @"
                    SELECT p.id, p.nombre, p.codigo, p.tipo, p.valor, 
                           p.fechaInicio, p.fechaFin, p.usosMaximos, p.usosActuales,
                           c.montoDescuento
                    FROM Carrito c
                    INNER JOIN Promocion p ON c.idPromocionAplicada = p.id
                    WHERE c.id = @IDCARRITO";

                var parametros = new ParameterList();
                parametros.Add("@IDCARRITO", idCarrito);

                DB.Select(query, parametros);

                Promocion? promocion = null;

                if (DB.Read())
                {
                    promocion = new Promocion
                    {
                        id = DB.GetInt("id"),
                        nombre = DB.GetString("nombre") ?? string.Empty,
                        codigo = DB.GetString("codigo") ?? string.Empty,
                        tipo = DB.GetString("tipo") ?? string.Empty,
                        valor = DB.GetDecimal("valor"),
                        fechaInicio = DB.GetDateTime("fechaInicio"),
                        fechaFin = DB.GetDateTime("fechaFin"),
                        usosMaximos = DB.IsDBNull("usosMaximos") ? (int?)null : DB.GetInt("usosMaximos"),
                        usosActuales = DB.GetInt("usosActuales")
                    };
                }

                DB.CloseReader();
                return promocion;
            }
        }

        /// <summary>
        /// Obtiene el monto de descuento aplicado a un carrito
        /// </summary>
        public decimal ObtenerMontoDescuentoCarrito(int idCarrito)
        {
            lock (DB)
            {
                string query = @"
                    SELECT COALESCE(montoDescuento, 0) as montoDescuento
                    FROM Carrito 
                    WHERE id = @IDCARRITO";

                var parametros = new ParameterList();
                parametros.Add("@IDCARRITO", idCarrito);

                DB.Select(query, parametros);

                decimal montoDescuento = 0;

                if (DB.Read())
                {
                    montoDescuento = DB.GetDecimal("montoDescuento");
                }

                DB.CloseReader();
                return montoDescuento;
            }
        }
    }

    // Clase auxiliar para mapear entradas con precio
    public class EntradaConPrecio
    {
        public int idEntrada { get; set; }
        public decimal precio { get; set; }
    }
}
