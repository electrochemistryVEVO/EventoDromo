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
      const token = response.token; // 🔹 Capturamos el token recibido del backend

      // Guardamos toda la info de sesión
      sessionStorage.setItem(
        "session",
        JSON.stringify({
          rol,
          token, // 🔹 Guardamos el token
        })
      );

      // 👇 devolvemos TODO lo que el componente necesita:
      return {
        success: true,
        rol,
        token, // 🔹 Lo devolvemos también al page.js
      };
    }else {
      // ❌ Si el backend respondió que las credenciales son incorrectas:
      return { error: "Credenciales inválidas" };
    }
  } catch (error) {
    console.error("Error en el login:", error);
    return { error: "Error al intentar iniciar sesión" };
  }
}
