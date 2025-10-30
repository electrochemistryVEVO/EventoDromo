// Servicio cliente para invocar TransferirEntradasController del backend
const API_BASE = (typeof process !== 'undefined' && process.env && process.env.REACT_APP_API_URL)
  ? String(process.env.REACT_APP_API_URL).replace(/\/$/, '')
  : ''; // si está vacío usará rutas relativas (ej. /api/...)

async function requestJson(path, { method = 'GET', body = null, token = null } = {}) {
  const headers = { Accept: 'application/json' };
  if (body != null) headers['Content-Type'] = 'application/json';
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body != null ? JSON.stringify(body) : undefined,
    credentials: 'include'
  });

  const text = await res.text().catch(() => null);
  let payload = null;
  try { payload = text ? JSON.parse(text) : null; } catch { payload = text; }

  if (!res.ok) {
    const msg = (payload && payload.message) ? payload.message : (payload || res.statusText || 'Error en la petición');
    const err = new Error(msg);
    err.status = res.status;
    err.payload = payload;
    throw err;
  }
  return payload;
}

/**
 * transferTickets: llamada pensada para la UI que envía email + items [{id, qty},...]
 * Intenta llamar a POST /api/TransferirEntradas/transfer-by-email (implementa este endpoint en backend si quieres)
 * Si no existe backend o falla la petición, devuelve un mock (útil en desarrollo).
 */
export async function transferTickets({ toEmail, items = [], token = null } = {}) {
  if (!toEmail || typeof toEmail !== 'string') throw new Error('toEmail requerido');
  if (!Array.isArray(items) || items.length === 0) throw new Error('items requerido');

  const validItems = items
    .map(it => ({ id: Number(it.id), qty: Number(it.qty) || 0 }))
    .filter(it => it.id > 0 && it.qty > 0);

  if (validItems.length === 0) throw new Error('No hay cantidades válidas para transferir');

  const path = `/api/TransferirEntradas/transfer-by-email`;
  try {
    return await requestJson(path, { method: 'POST', body: { toEmail, items: validItems }, token });
  } catch (err) {
    // fallback mock para desarrollo
    console.warn('transferTickets error, usando mock fallback:', err.message || err);
    await new Promise(r => setTimeout(r, 600));
    const mockTransferred = validItems.map(it => ({
      id: it.id,
      qty: it.qty,
      toEmail,
      transferId: `mock-${Date.now()}-${it.id}`
    }));
    return { success: true, mock: true, transferred: mockTransferred };
  }
}

/**
 * transferByClientIds: llama al endpoint existente que re-asigna carritos por ids de cliente
 * POST /api/TransferirEntradas/transferir/{idClienteOrigen}/{idClienteDestino}
 * body opcional: { EntradaIds: [1,2,3] }
 */
export async function transferByClientIds(idClienteOrigen, idClienteDestino, entradaIds = null, token = null) {
  if (!Number.isInteger(idClienteOrigen) || idClienteOrigen <= 0) throw new Error('idClienteOrigen inválido');
  if (!Number.isInteger(idClienteDestino) || idClienteDestino <= 0) throw new Error('idClienteDestino inválido');
  if (idClienteOrigen === idClienteDestino) throw new Error('idClienteOrigen y idClienteDestino deben ser diferentes');

  const path = `/api/TransferirEntradas/transferir/${idClienteOrigen}/${idClienteDestino}`;
  const body = (entradaIds && Array.isArray(entradaIds)) ? { EntradaIds: entradaIds.map(n => Number(n)) } : {};
  return await requestJson(path, { method: 'POST', body, token });
}

/**
 * Conveniencia: transferir a partir de DTO { idClienteOrigen, idClienteDestino, entradaIds? }
 */
export async function transferFromDto(dto = {}, token = null) {
  if (!dto) throw new Error('dto requerido');
  const { idClienteOrigen, idClienteDestino, entradaIds } = dto;
  return await transferByClientIds(idClienteOrigen, idClienteDestino, entradaIds || null, token);
}

export async function getCurrentClient(token = null) {
  // Espera respuesta: { id: number, ... }
  return await requestJson('/api/Clientes/me', { method: 'GET', token });
}

export async function getClientByEmail(email, token = null) {
  if (!email || typeof email !== 'string') throw new Error('email requerido');
  // Ajusta la ruta si tu backend tiene otra (por-email, obtener-por-email, etc.)
  return await requestJson(`/api/Clientes/por-email?email=${encodeURIComponent(email)}`, { method: 'GET', token });
}

/**
 * Conveniencia: transferir usando correo destino + items [{id, qty},...]
 * - busca id cliente destino por email
 * - obtiene cliente actual (origen) vía /api/Clientes/me
 * - construye EntradaIds a partir de items (duplica id según qty)
 * - llama transferByClientIds(origenId, destinoId, entradaIds)
 */
export async function transferByEmail(toEmail, items = [], token = null) {
  if (!toEmail) throw new Error('toEmail requerido');
  if (!Array.isArray(items) || items.length === 0) throw new Error('items requerido');

  const dest = await getClientByEmail(toEmail, token);
  if (!dest || !dest.id) throw new Error('Cliente destino no encontrado');

  const origin = await getCurrentClient(token);
  if (!origin || !origin.id) throw new Error('Cliente origen (actual) no encontrado');

  // Construir EntradaIds: repetir id según qty (si tu backend espera otra estructura, ajusta aquí)
  const entradaIds = [];
  items.forEach(it => {
    const id = Number(it.id);
    const qty = Math.max(0, Number(it.qty) || 0);
    for (let i = 0; i < qty; i++) entradaIds.push(id);
  });

  if (entradaIds.length === 0) throw new Error('No hay entradas válidas para transferir');

  return await transferByClientIds(origin.id, dest.id, entradaIds, token);
}

export default {
  transferTickets,
  transferByClientIds,
  transferFromDto,
  transferByEmail,
  getClientByEmail,
  getCurrentClient
};