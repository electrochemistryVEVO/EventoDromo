using System.Net;
using System.Net.Mail;
using System.Text;
using EventodromoRest.Modelos.Utiles;

namespace EventodromoRest.Servicios
{
    public class EmailService
    {
        private readonly string _smtpServer = "smtp.gmail.com";
        private readonly int _smtpPort = 587;
        private readonly string _fromEmail = "divadibu132@gmail.com";
        private readonly string _fromPassword = "tqsm mgmi djbv fntn";
        private readonly string _fromName = "Eventodromo";
        private readonly string _logoUrl = "https://eventodromo-s3.s3.us-east-1.amazonaws.com/Eventodromo+logo.png";

        /// <summary>
        /// Envía un email de confirmación al remitente después de transferir entradas.
        /// </summary>
        public async Task<bool> EnviarEmailRemitenteTransferenciaAsync(
            string emailRemitente, 
            string nombreRemitente,
            string nombreEvento,
            string emailDestino,
            int cantidadEntradas,
            List<string> tiposEntrada,
            int horasExpiracion)
        {
            try
            {
                var templateData = new EmailTemplateData
                {
                    Titulo = "Transferencia Enviada",
                    Emoji = "✅",
                    MensajePrincipal = $"Has transferido exitosamente <strong>{cantidadEntradas} entrada(s)</strong> para <strong>{nombreEvento}</strong> a <strong>{emailDestino}</strong>.",
                    DetalleTitulo = "Entradas Transferidas",
                    DetalleItems = tiposEntrada,
                    AlertaTipo = "warning",
                    AlertaIcono = "⏳",
                    AlertaMensaje = $"<strong>Estado:</strong> Pendiente de aceptación<br>El destinatario tiene <strong>{horasExpiracion} horas</strong> para aceptar o rechazar las entradas."
                };

                string htmlBody = GenerarHtmlEmail(nombreRemitente, templateData);

                return await EnviarEmailAsync(
                    emailRemitente,
                    "✅ Transferencia de Entradas Enviada - Eventodromo",
                    htmlBody
                );
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error enviando email al remitente: {ex.Message}");
                return false;
            }
        }

        /// <summary>
        /// Envía un email al destinatario con botones para aceptar o rechazar la transferencia.
        /// </summary>
        public async Task<bool> EnviarEmailDestinatarioTransferenciaAsync(
            string emailDestino,
            string nombreRemitente,
            string nombreEvento,
            int cantidadEntradas,
            List<string> tiposEntrada,
            string tokenTransferencia,
            string urlBase,
            int horasExpiracion)
        {
            try
            {
                string urlAceptar = $"{urlBase}/transferir/aceptar?token={tokenTransferencia}&accion=aceptar";
                string urlRechazar = $"{urlBase}/transferir/aceptar?token={tokenTransferencia}&accion=rechazar";

                var templateData = new EmailTemplateData
                {
                    Titulo = $"¡{nombreRemitente} te ha enviado entradas!",
                    Emoji = "🎟️",
                    MensajePrincipal = $"¡Prepárate para una noche increíble! Este es el resumen de las entradas que has recibido para <strong>{nombreEvento}</strong>:",
                    DetalleTitulo = "Entradas Recibidas",
                    DetalleItems = tiposEntrada,
                    DetalleFooter = $"<strong>Total:</strong> {cantidadEntradas} entrada(s)",
                    AlertaTipo = "info",
                    AlertaIcono = "⏰",
                    AlertaMensaje = $"<strong>Tiempo límite para aceptar:</strong><br>Tienes <strong>{horasExpiracion} horas</strong> para aceptar o rechazar estas entradas. Después de este tiempo, la transferencia expirará automáticamente.",
                    Botones = new List<EmailButton>
                    {
                        new EmailButton { Texto = "✅ Aceptar mis Entradas", Url = urlAceptar, Primario = true },
                        new EmailButton { Texto = "❌ Rechazar transferencia", Url = urlRechazar, Primario = false }
                    },
                    NotaPie = "Para guardar estas entradas de forma segura en tu cuenta, el siguiente paso es iniciar sesión. Si aún no tienes una, ¡no te preocupes! <strong>Crear una cuenta</strong> es gratis y rápido."
                };

                string htmlBody = GenerarHtmlEmail("", templateData);

                return await EnviarEmailAsync(
                    emailDestino,
                    "🎟️ ¡Has recibido entradas! - Eventodromo",
                    htmlBody
                );
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error enviando email al destinatario: {ex.Message}");
                return false;
            }
        }

        /// <summary>
        /// Envía un email de confirmación de compra con tarjeta.
        /// </summary>
        public async Task<bool> EnviarEmailConfirmacionCompraTarjetaAsync(
            string emailCliente,
            string nombreCliente,
            string numeroTransaccion,
            DateTime fechaCompra,
            decimal montoTotal,
            int puntosGanados,
            string ultimos4DigitosTarjeta,
            List<DetalleEntradaEmail> entradas,
            decimal? montoDescuento = null,
            string codigoDescuento = null)
        {
            try
            {
                // Agrupar entradas por evento
                var entradasPorEvento = entradas
                    .GroupBy(e => e.NombreEvento)
                    .Select(g => new
                    {
                        NombreEvento = g.Key,
                        Entradas = g.ToList()
                    })
                    .ToList();

                // Construir lista de items para mostrar
                var detalleItems = new List<string>();
                
                foreach (var grupo in entradasPorEvento)
                {
                    detalleItems.Add($"<strong>🎫 {grupo.NombreEvento}</strong>");
                    foreach (var entrada in grupo.Entradas)
                    {
                        detalleItems.Add($"&nbsp;&nbsp;&nbsp;&nbsp;• {entrada.Cantidad}x {entrada.TipoEntrada} - S/ {entrada.PrecioUnitario:F2}");
                    }
                }

                var templateData = new EmailTemplateData
                {
                    Titulo = "¡Compra Confirmada!",
                    Emoji = "🎉",
                    MensajePrincipal = "Tu compra se ha procesado exitosamente. A continuación encontrarás los detalles de tu transacción:",
                    DetalleTitulo = "Resumen de Compra",
                    DetalleItems = detalleItems,
                    DetalleFooter = $@"
                        <strong>💳 Método de pago:</strong> Tarjeta terminada en {ultimos4DigitosTarjeta}<br>
                        {(montoDescuento.HasValue && montoDescuento.Value > 0 
                            ? $"<strong>💵 Subtotal:</strong> S/ {(montoTotal + montoDescuento.Value):F2}<br><strong>🎟️ Descuento{(string.IsNullOrEmpty(codigoDescuento) ? "" : $" ({codigoDescuento})")}:</strong> <span style='color: #00C49A;'>- S/ {montoDescuento.Value:F2}</span><br>" 
                            : "")}
                        <strong>💰 Total pagado:</strong> S/ {montoTotal:F2}<br>
                        <strong>⭐ Puntos ganados:</strong> {puntosGanados} puntos<br>
                        <strong>📅 Fecha:</strong> {fechaCompra:dd/MM/yyyy HH:mm}<br>
                        <strong>🔖 N° Transacción:</strong> {numeroTransaccion}",
                    AlertaTipo = "success",
                    AlertaIcono = "✅",
                    AlertaMensaje = "<strong>¡Listo para el evento!</strong><br>Tus entradas ya están disponibles en la sección <strong>\"Mis Entradas\"</strong> de tu cuenta. Podrás mostrarlas en el evento desde tu celular.",
                    NotaPie = "Recuerda que puedes revisar tus entradas en cualquier momento desde tu perfil. ¡Disfruta el evento!"
                };

                string htmlBody = GenerarHtmlEmail(nombreCliente, templateData);

                return await EnviarEmailAsync(
                    emailCliente,
                    $"🎉 Compra Confirmada - {numeroTransaccion} - Eventodromo",
                    htmlBody
                );
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error enviando email de confirmación de compra con tarjeta: {ex.Message}");
                return false;
            }
        }

        /// <summary>
        /// Envía un email de confirmación de compra con puntos.
        /// </summary>
        public async Task<bool> EnviarEmailConfirmacionCompraPuntosAsync(
            string emailCliente,
            string nombreCliente,
            string numeroTransaccion,
            DateTime fechaCompra,
            int puntosGastados,
            List<DetalleEntradaEmail> entradas,
            decimal? montoDescuento = null,
            string codigoDescuento = null)
        {
            try
            {
                // Agrupar entradas por evento
                var entradasPorEvento = entradas
                    .GroupBy(e => e.NombreEvento)
                    .Select(g => new
                    {
                        NombreEvento = g.Key,
                        Entradas = g.ToList()
                    })
                    .ToList();

                // Construir lista de items para mostrar
                var detalleItems = new List<string>();
                
                foreach (var grupo in entradasPorEvento)
                {
                    detalleItems.Add($"<strong>🎫 {grupo.NombreEvento}</strong>");
                    foreach (var entrada in grupo.Entradas)
                    {
                        detalleItems.Add($"&nbsp;&nbsp;&nbsp;&nbsp;• {entrada.Cantidad}x {entrada.TipoEntrada} - S/ {entrada.PrecioUnitario:F2}");
                    }
                }

                var templateData = new EmailTemplateData
                {
                    Titulo = "¡Canje Exitoso!",
                    Emoji = "⭐",
                    MensajePrincipal = "Has canjeado tus puntos exitosamente. A continuación encontrarás los detalles de tu transacción:",
                    DetalleTitulo = "Resumen de Canje",
                    DetalleItems = detalleItems,
                    DetalleFooter = $@"
                        <strong>⭐ Método de pago:</strong> Puntos Eventodromo<br>
                        {(montoDescuento.HasValue && montoDescuento.Value > 0 
                            ? $"<strong>💵 Subtotal en puntos:</strong> {puntosGastados + (int)(montoDescuento.Value * 10)} puntos<br><strong>🎟️ Descuento{(string.IsNullOrEmpty(codigoDescuento) ? "" : $" ({codigoDescuento})")}:</strong> <span style='color: #00C49A;'>- {(int)(montoDescuento.Value * 10)} puntos</span><br>" 
                            : "")}
                        <strong>💎 Puntos gastados:</strong> {puntosGastados} puntos<br>
                        <strong>💰 Total:</strong> S/ 0.00 (Pagado con puntos)<br>
                        <strong>📅 Fecha:</strong> {fechaCompra:dd/MM/yyyy HH:mm}<br>
                        <strong>🔖 N° Transacción:</strong> {numeroTransaccion}",
                    AlertaTipo = "success",
                    AlertaIcono = "✅",
                    AlertaMensaje = "<strong>¡Listo para el evento!</strong><br>Tus entradas ya están disponibles en la sección <strong>\"Mis Entradas\"</strong> de tu cuenta. Podrás mostrarlas en el evento desde tu celular.",
                    NotaPie = "Has aprovechado tus puntos de forma inteligente. ¡Disfruta el evento!"
                };

                string htmlBody = GenerarHtmlEmail(nombreCliente, templateData);

                return await EnviarEmailAsync(
                    emailCliente,
                    $"⭐ Canje Confirmado - {numeroTransaccion} - Eventodromo",
                    htmlBody
                );
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error enviando email de confirmación de compra con puntos: {ex.Message}");
                return false;
            }
        }

        /// <summary>
        /// Método genérico para enviar emails con diferentes propósitos.
        /// </summary>
        public async Task<bool> EnviarEmailGenericoAsync(
            string destinatario,
            string asunto,
            string nombreDestinatario,
            EmailTemplateData templateData)
        {
            try
            {
                string htmlBody = GenerarHtmlEmail(nombreDestinatario, templateData);
                return await EnviarEmailAsync(destinatario, asunto, htmlBody);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error enviando email genérico: {ex.Message}");
                return false;
            }
        }

        /// <summary>
        /// Método base para enviar emails usando SMTP.
        /// </summary>
        private async Task<bool> EnviarEmailAsync(string destinatario, string asunto, string cuerpoHtml)
        {
            try
            {
                MailAddress addressFrom = new MailAddress(_fromEmail, _fromName);
                MailAddress addressTo = new MailAddress(destinatario);
                
                MailMessage message = new MailMessage(addressFrom, addressTo);
                message.Subject = asunto;
                message.IsBodyHtml = true;
                message.Body = cuerpoHtml;
                message.BodyEncoding = Encoding.UTF8;

                SmtpClient client = new SmtpClient(_smtpServer);
                client.Port = _smtpPort;
                client.EnableSsl = true;
                client.UseDefaultCredentials = false;
                client.Credentials = new NetworkCredential(_fromEmail, _fromPassword);

                await client.SendMailAsync(message);
                Console.WriteLine($"✅ Email enviado exitosamente a {destinatario}");
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Error enviando email: {ex.Message}");
                return false;
            }
        }

        /// <summary>
        /// Genera el HTML del email usando una plantilla flexible y reutilizable.
        /// </summary>
        private string GenerarHtmlEmail(string nombreDestinatario, EmailTemplateData data)
        {
            // Saludo personalizado
            string saludo = !string.IsNullOrWhiteSpace(nombreDestinatario) 
                ? $"<p style='color: #666; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;'>Hola <strong>{nombreDestinatario}</strong>,</p>" 
                : "";

            // Lista de items del detalle
            string detalleItemsHtml = data.DetalleItems != null && data.DetalleItems.Count > 0
                ? string.Join("", data.DetalleItems.Select(item => 
                    $"<div style='background-color: #f5f5f5; padding: 12px; margin: 8px 0; border-radius: 6px; border-left: 4px solid #00C49A;'>{item}</div>"))
                : "";

            // Footer del detalle
            string detalleFooterHtml = !string.IsNullOrWhiteSpace(data.DetalleFooter)
                ? $"<p style='color: #666; margin: 15px 0 0 0; font-size: 14px;'>{data.DetalleFooter}</p>"
                : "";

            // Bloque de detalle completo
            string bloqueDetalleHtml = !string.IsNullOrWhiteSpace(detalleItemsHtml)
                ? $@"<div style='background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;'>
                        <h3 style='color: #333; margin: 0 0 15px 0; font-size: 18px;'>📋 {data.DetalleTitulo ?? "Detalles"}:</h3>
                        {detalleItemsHtml}
                        {detalleFooterHtml}
                    </div>"
                : "";

            // Alerta (warning, info, success, error)
            string alertaColorFondo = data.AlertaTipo switch
            {
                "warning" => "#FFF9E6",
                "info" => "#FFF3E0",
                "success" => "#E8F5E9",
                "error" => "#FFEBEE",
                _ => "#F5F5F5"
            };

            string alertaColorBorde = data.AlertaTipo switch
            {
                "warning" => "#FFA726",
                "info" => "#FF9800",
                "success" => "#4CAF50",
                "error" => "#F44336",
                _ => "#BDBDBD"
            };

            string alertaHtml = !string.IsNullOrWhiteSpace(data.AlertaMensaje)
                ? $@"<div style='background-color: {alertaColorFondo}; border-left: 4px solid {alertaColorBorde}; padding: 15px; border-radius: 4px; margin: 20px 0;'>
                        <p style='color: #333; margin: 0; font-size: 14px;'>
                            {data.AlertaIcono} {data.AlertaMensaje}
                        </p>
                    </div>"
                : "";

            // Botones de acción
            string botonesHtml = "";
            if (data.Botones != null && data.Botones.Count > 0)
            {
                if (data.Botones.Count == 1)
                {
                    var btn = data.Botones[0];
                    string bgColor = btn.Primario ? "#00C49A" : "#f5f5f5";
                    string textColor = btn.Primario ? "white" : "#666";
                    string border = btn.Primario ? "" : "border: 2px solid #e0e0e0;";

                    botonesHtml = $@"
                    <table width='100%' cellpadding='0' cellspacing='0' style='margin: 30px 0;'>
                        <tr>
                            <td align='center'>
                                <a href='{btn.Url}' style='display: inline-block; background-color: {bgColor}; color: {textColor}; text-align: center; padding: 15px 40px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px; {border}'>
                                    {btn.Texto}
                                </a>
                            </td>
                        </tr>
                    </table>";
                }
                else if (data.Botones.Count == 2)
                {
                    var btn1 = data.Botones[0];
                    var btn2 = data.Botones[1];

                    string bg1 = btn1.Primario ? "#00C49A" : "#f5f5f5";
                    string text1 = btn1.Primario ? "white" : "#666";
                    string border1 = btn1.Primario ? "" : "border: 2px solid #e0e0e0;";

                    string bg2 = btn2.Primario ? "#00C49A" : "#f5f5f5";
                    string text2 = btn2.Primario ? "white" : "#666";
                    string border2 = btn2.Primario ? "" : "border: 2px solid #e0e0e0;";

                    botonesHtml = $@"
                    <table width='100%' cellpadding='0' cellspacing='0' style='margin: 30px 0;'>
                        <tr>
                            <td width='48%'>
                                <a href='{btn1.Url}' style='display: block; background-color: {bg1}; color: {text1}; text-align: center; padding: 15px 20px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px; {border1}'>
                                    {btn1.Texto}
                                </a>
                            </td>
                            <td width='4%'></td>
                            <td width='48%'>
                                <a href='{btn2.Url}' style='display: block; background-color: {bg2}; color: {text2}; text-align: center; padding: 15px 20px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px; {border2}'>
                                    {btn2.Texto}
                                </a>
                            </td>
                        </tr>
                    </table>";
                }
            }

            // Nota al pie
            string notaPieHtml = !string.IsNullOrWhiteSpace(data.NotaPie)
                ? $@"<p style='color: #999; font-size: 13px; line-height: 1.6; margin: 20px 0 0 0; text-align: center;'>
                        {data.NotaPie}
                    </p>"
                : "";

            return $@"
<!DOCTYPE html>
<html>
<head>
    <meta charset='utf-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
</head>
<body style='margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;'>
    <table width='100%' cellpadding='0' cellspacing='0' style='background-color: #f4f4f4; padding: 20px;'>
        <tr>
            <td align='center'>
                <table width='600' cellpadding='0' cellspacing='0' style='background-color: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);'>
                    <!-- Header -->
                    <tr>
                        <td style='background: linear-gradient(135deg, #00C49A 0%, #00A67E 100%); padding: 30px 20px; text-align: center;'>
                            <img src='{_logoUrl}' alt='Eventodromo Logo' style='max-width: 200px; height: auto; margin-bottom: 10px;'>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style='padding: 40px 30px;'>
                            <h2 style='color: #333; margin: 0 0 20px 0;'>{data.Emoji} {data.Titulo}</h2>
                            {saludo}
                            <p style='color: #666; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;'>
                                {data.MensajePrincipal}
                            </p>
                            
                            {bloqueDetalleHtml}
                            {alertaHtml}
                            {botonesHtml}
                            {notaPieHtml}
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style='background-color: #f9f9f9; padding: 20px; text-align: center; border-top: 1px solid #e0e0e0;'>
                            <p style='color: #999; font-size: 12px; margin: 0;'>
                                © 2025 Eventodromo. Todos los derechos reservados.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>";
        }
    }

    // ===== DTOs para configurar emails =====
    public class EmailTemplateData
    {
        public string? Titulo { get; set; }
        public string? Emoji { get; set; }
        public string? MensajePrincipal { get; set; }
        public string? DetalleTitulo { get; set; } = "Detalles";
        public List<string>? DetalleItems { get; set; }
        public string? DetalleFooter { get; set; }
        public string? AlertaTipo { get; set; } // warning, info, success, error
        public string? AlertaIcono { get; set; }
        public string? AlertaMensaje { get; set; }
        public List<EmailButton>? Botones { get; set; }
        public string? NotaPie { get; set; }
    }

    public class EmailButton
    {
        public string? Texto { get; set; }
        public string? Url { get; set; }
        public bool Primario { get; set; } = true;
    }
}
