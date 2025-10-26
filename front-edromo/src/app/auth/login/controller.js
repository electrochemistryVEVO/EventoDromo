"use client";

import { autenticarUsuario } from "@/services/loginService.js";

export async function onSubmit(formData) {
  try {
    const loginInfo = {
      Correo: formData.get("email"),
      Password: formData.get("password"),
    };

    const response = await autenticarUsuario(loginInfo);

    if (response.success) {
      const rol = response.rol;
      // const cliente = response.cliente; // <- cuando tu backend lo devuelva

      // Guardar en sessionStorage si quieres mantener tu lógica anterior
      sessionStorage.setItem(
        "session",
        JSON.stringify({
          rol,
          // cliente,
        })
      );

      // 👇 devolvemos TODO lo que el componente necesita:
      return {
        success: true,
        rol,
        // clientData: cliente, // opcional futuro
      };
    } else {
      return { error: "Credenciales inválidas" };
    }
  } catch (error) {
    console.error("Error en el login:", error);
    return { error: "Error al intentar iniciar sesión" };
  }
}
