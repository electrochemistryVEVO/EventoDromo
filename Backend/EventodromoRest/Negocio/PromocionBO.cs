using EventodromoRest.DBManager;
using EventodromoRest.Globales;
using EventodromoRest.Mappers;
using EventodromoRest.Modelos;
using EventodromoRest.Modelos.Utiles;

namespace EventodromoRest.Negocio
{
    public class PromocionBO
    {
        private readonly Globales.Globales globales;
        private readonly DBManager.DBManager DB;
        private readonly PromocionMapper promocionMapper;

        public PromocionBO(Globales.Globales globales, DBManager.DBManager DB)
        {
            this.globales = globales;
            this.DB = DB;
            this.promocionMapper = new PromocionMapper(globales, DB);
        }

        /// <summary>
        /// Valida un código de descuento sin aplicarlo
        /// </summary>
        public ResponseValidarPromocion ValidarCodigo(string codigo, int? idCarrito)
        {
            try
            {
                // 1. Verificar que el código existe
                var promocion = promocionMapper.ObtenerPromocionPorCodigo(codigo);
                if (promocion == null)
                {
                    return new ResponseValidarPromocion
                    {
                        valido = false,
                        mensaje = "El código ingresado no es válido"
                    };
                }

                // 2. Verificar fechas de vigencia
                DateTime ahora = DateTime.Now;
                if (ahora < promocion.fechaInicio)
                {
                    return new ResponseValidarPromocion
                    {
                        valido = false,
                        mensaje = $"Este código estará disponible desde el {promocion.fechaInicio:dd/MM/yyyy}"
                    };
                }

                if (ahora > promocion.fechaFin)
                {
                    return new ResponseValidarPromocion
                    {
                        valido = false,
                        mensaje = "Este código ha expirado"
                    };
                }

                // 3. Verificar usos disponibles
                if (promocion.usosMaximos.HasValue && promocion.usosActuales >= promocion.usosMaximos.Value)
                {
                    return new ResponseValidarPromocion
                    {
                        valido = false,
                        mensaje = "Este código ya no tiene usos disponibles"
                    };
                }

                // 4. Si hay carrito, verificar aplicabilidad
                if (idCarrito.HasValue && promocion.id.HasValue)
                {
                    bool esAplicable = promocionMapper.VerificarAplicabilidadPromocion(promocion.id.Value, idCarrito.Value);
                    if (!esAplicable)
                    {
                        return new ResponseValidarPromocion
                        {
                            valido = false,
                            mensaje = "Este código no es aplicable a las entradas de tu carrito"
                        };
                    }
                }

                // 5. Todo válido - retornar información del descuento
                var response = new ResponseValidarPromocion
                {
                    valido = true,
                    mensaje = "Código válido",
                    tipo = promocion.tipo,
                    codigo = promocion.codigo
                };

                if (promocion.tipo == "PORCENTAJE")
                {
                    response.descuentoPorcentaje = promocion.valor;
                    response.mensaje = $"¡Código válido! {promocion.valor}% de descuento";
                }
                else if (promocion.tipo == "MONTO_FIJO")
                {
                    response.descuentoMonto = promocion.valor;
                    response.mensaje = $"¡Código válido! S/ {promocion.valor:F2} de descuento";
                }

                return response;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error al validar código: {ex.Message}");
                return new ResponseValidarPromocion
                {
                    valido = false,
                    mensaje = "Error al validar el código"
                };
            }
        }

        /// <summary>
        /// Aplica un código de descuento a un carrito
        /// </summary>
        public ResponseAplicarPromocion AplicarCodigo(string codigo, int idCarrito)
        {
            try
            {
                // 1. Validar código completo
                var validacion = ValidarCodigo(codigo, idCarrito);
                if (!validacion.valido)
                {
                    return new ResponseAplicarPromocion
                    {
                        exito = false,
                        mensaje = validacion.mensaje,
                        descuentoAplicado = 0,
                        subtotal = 0,
                        total = 0
                    };
                }

                // 2. Obtener la promoción
                var promocion = promocionMapper.ObtenerPromocionPorCodigo(codigo);
                if (promocion == null)
                {
                    return new ResponseAplicarPromocion
                    {
                        exito = false,
                        mensaje = "Código no encontrado",
                        descuentoAplicado = 0,
                        subtotal = 0,
                        total = 0
                    };
                }

                // 3. Verificar si ya tiene una promoción aplicada
                var promocionActual = promocionMapper.ObtenerPromocionDeCarrito(idCarrito);
                if (promocionActual != null)
                {
                    // Si es el mismo código, informar que ya está aplicado
                    if (promocionActual.codigo == codigo)
                    {
                        var montoActual = promocionMapper.ObtenerMontoDescuentoCarrito(idCarrito);
                        var subtotalActual = CalcularSubtotalCarrito(idCarrito);
                        
                        return new ResponseAplicarPromocion
                        {
                            exito = true,
                            mensaje = "Este código ya está aplicado",
                            descuentoAplicado = montoActual,
                            subtotal = subtotalActual,
                            total = subtotalActual - montoActual,
                            promocion = new PromocionAplicada
                            {
                                codigo = promocionActual.codigo,
                                tipo = promocionActual.tipo,
                                valor = promocionActual.valor
                            }
                        };
                    }

                    // Si es diferente, remover el anterior primero
                    if (promocionActual.id.HasValue)
                    {
                        promocionMapper.DecrementarUsosPromocion(promocionActual.id.Value);
                    }
                    promocionMapper.RemoverPromocionDeCarrito(idCarrito);
                }

                // 4. Calcular el descuento
                if (!promocion.id.HasValue)
                {
                    return new ResponseAplicarPromocion
                    {
                        exito = false,
                        mensaje = "Error: ID de promoción inválido",
                        descuentoAplicado = 0,
                        subtotal = 0,
                        total = 0
                    };
                }

                decimal montoDescuento = CalcularMontoDescuento(promocion, idCarrito);
                decimal subtotal = CalcularSubtotalCarrito(idCarrito);
                decimal total = Math.Max(0, subtotal - montoDescuento); // No puede ser negativo

                // 5. Aplicar promoción al carrito
                promocionMapper.AplicarPromocionACarrito(idCarrito, promocion.id.Value, montoDescuento);

                // 6. Incrementar contador de usos
                promocionMapper.IncrementarUsosPromocion(promocion.id.Value);

                // 7. Retornar resultado exitoso
                return new ResponseAplicarPromocion
                {
                    exito = true,
                    mensaje = "Código aplicado exitosamente",
                    descuentoAplicado = montoDescuento,
                    subtotal = subtotal,
                    total = total,
                    promocion = new PromocionAplicada
                    {
                        codigo = promocion.codigo,
                        tipo = promocion.tipo,
                        valor = promocion.valor
                    }
                };
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error al aplicar código: {ex.Message}");
                return new ResponseAplicarPromocion
                {
                    exito = false,
                    mensaje = "Error al aplicar el código",
                    descuentoAplicado = 0,
                    subtotal = 0,
                    total = 0
                };
            }
        }

        /// <summary>
        /// Remueve un código de descuento de un carrito
        /// </summary>
        public GenericResponse<object> RemoverCodigo(int idCarrito)
        {
            try
            {
                // 1. Obtener promoción actual
                var promocionActual = promocionMapper.ObtenerPromocionDeCarrito(idCarrito);
                
                if (promocionActual == null)
                {
                    return new GenericResponse<object>
                    {
                        Success = false,
                        Message = "No hay ningún código aplicado"
                    };
                }

                // 2. Decrementar contador de usos
                if (promocionActual.id.HasValue)
                {
                    promocionMapper.DecrementarUsosPromocion(promocionActual.id.Value);
                }

                // 3. Remover del carrito
                promocionMapper.RemoverPromocionDeCarrito(idCarrito);

                // 4. Retornar éxito
                return new GenericResponse<object>
                {
                    Success = true,
                    Message = "Código removido exitosamente"
                };
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error al remover código: {ex.Message}");
                return new GenericResponse<object>
                {
                    Success = false,
                    Message = "Error al remover el código"
                };
            }
        }

        /// <summary>
        /// Calcula el monto de descuento según el tipo de promoción
        /// </summary>
        private decimal CalcularMontoDescuento(Promocion promocion, int idCarrito)
        {
            if (!promocion.id.HasValue)
            {
                return 0;
            }

            // Obtener entradas aplicables
            var entradas = promocionMapper.ObtenerEntradasAplicables(promocion.id.Value, idCarrito);
            
            if (!entradas.Any())
            {
                return 0;
            }

            decimal subtotalAplicable = entradas.Sum(e => e.precio);

            if (promocion.tipo == "PORCENTAJE")
            {
                // Calcular porcentaje del subtotal aplicable
                return Math.Round(subtotalAplicable * (promocion.valor / 100), 2);
            }
            else if (promocion.tipo == "MONTO_FIJO")
            {
                // Monto fijo, pero no puede exceder el subtotal
                return Math.Min(promocion.valor, subtotalAplicable);
            }

            return 0;
        }

        /// <summary>
        /// Calcula el subtotal del carrito (suma de precios de todas las entradas)
        /// </summary>
        private decimal CalcularSubtotalCarrito(int idCarrito)
        {
            lock (DB)
            {
                string query = @"
                    SELECT COALESCE(SUM(te.precio), 0) as subtotal
                    FROM Entrada e
                    INNER JOIN TipoEntrada te ON e.idTipoEntrada = te.id
                    WHERE e.idCarrito = @IDCARRITO";

                var parametros = new ParameterList();
                parametros.Add("@IDCARRITO", idCarrito);

                DB.Select(query, parametros);

                decimal subtotal = 0;

                if (DB.Read())
                {
                    subtotal = DB.GetDecimal("subtotal");
                }

                DB.CloseReader();
                return subtotal;
            }
        }
    }
}
