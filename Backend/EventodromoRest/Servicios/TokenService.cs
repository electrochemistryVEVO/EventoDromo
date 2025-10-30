using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace EventodromoRest.Servicios
{
    public class TokenService
    {
        private readonly string _secretKey;

        public TokenService(string secretKey)
        {
            _secretKey = secretKey;
        }

        public string GenerarToken(int idCliente)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_secretKey);

            // 👇 Solo guardamos el ID del cliente
            var claims = new[]
            {
                new Claim("idCliente", idCliente.ToString())
            };

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddHours(4), // dura 4h, por ejemplo
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(key),
                    SecurityAlgorithms.HmacSha256Signature
                )
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        public int? ObtenerIdDesdeToken(string token)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_secretKey);

            try
            {
                // Validar y leer el token
                var parameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    ClockSkew = TimeSpan.Zero // sin tolerancia extra
                };

                // Validar el token
                var principal = tokenHandler.ValidateToken(token, parameters, out SecurityToken validatedToken);

                // Verificar que el algoritmo sea el esperado
                if (validatedToken is JwtSecurityToken jwtToken &&
                    jwtToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.InvariantCultureIgnoreCase))
                {
                    // Buscar el claim "idCliente"
                    var idClaim = principal.Claims.FirstOrDefault(c => c.Type == "idCliente");
                    if (idClaim == null)
                        return null;

                    // Convertir el claim a int
                    if (int.TryParse(idClaim.Value, out int idCliente))
                        return idCliente;
                }

                return null;
            }
            catch
            {
                // Token inválido o expirado
                return null;
            }
        }

    }
}
