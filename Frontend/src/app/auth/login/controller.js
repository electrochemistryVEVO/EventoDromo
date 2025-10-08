"use client";
import { autenticarUsuario } from "../service";

export async function onSubmit(formData) {
  try {
    const loginInfo = {
      correo: formData.get("email"),
      password: formData.get("password"),
    };

    const response = await autenticarUsuario(loginInfo);

    if (response.success) {
      // En lugar de usar cookies del servidor, usamos localStorage o sessionStorage
      sessionStorage.setItem(
        "session",
        JSON.stringify({
          token: response.token,
          user: loginInfo.correo,
          rol: response.rol,
        }),
      );

      return {
        success: true,
        rol: response.rol,
      };
    } else {
      return { error: "Credenciales inválidas" };
    }
  } catch (error) {
    console.error("Error en el login:", error);
    return { error: "Error al intentar iniciar sesión" };
  }
}
