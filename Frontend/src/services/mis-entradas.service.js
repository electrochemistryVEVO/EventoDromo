export async function getEntradas() {
  const res = await fetch("/data/entradas.json"); // para cambiar al back: fetch("https://localhost:44372/api/EntradaEventoAuxiliar/ListarTodasLasEntradas");
  console.log(res);
  if (!res.ok) throw new Error("Error cargando entradas (status " + res.status + ")");
  const json = await res.json();

  // GenericResponse { success: bool, mensaje: string, data: T, error: string }
  if (!json) throw new Error("Respuesta vacía del servicio de entradas");
  if (json.success === false) {
    // prioriza error, luego mensaje
    throw new Error(json.error || json.mensaje || "Error en respuesta del servicio");
  }

  return json.data ?? [];
}