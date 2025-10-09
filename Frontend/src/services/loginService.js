const url =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/Cliente";
export async function autenticarUsuario(loginInfo) {
  
  try {
    // 🔹 Simulación con JSON local
    const res = await fetch("/data/loginHardCodeo.json");
    if (!res.ok) throw new Error("Error al cargar loginHardCodeo.json");

    const json = await res.json();

    // 🔹 Validaciones básicas
    if (!json || typeof json.success === "undefined") {
      throw new Error("Respuesta inválida o vacía del JSON");
    }

    return json; // ✅ devuelve { success, rol }

  } catch (error) {
    console.error("Error en autenticación:", error);
    throw error;
  }
}