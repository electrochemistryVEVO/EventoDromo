import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { autenticarUsuario } from "../service";

export async function onSubmit(event) {
  "use server";
  try {
    const loginInfo = {
      correo: event.get("email"),
      password: event.get("password"),
    };

    const response = await autenticarUsuario(loginInfo);

    if (response.success) {
      // Guardar la sesión en las cookies
      cookies().set(
        "session",
        {
          token: response.token, // Si el backend devuelve un token
          user: loginInfo.correo,
        },
        {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 10 * 60 * 60, // 10 horas
        },
      );

      redirect("/home");
    } else {
      return { error: "Credenciales inválidas" };
    }
  } catch (error) {
    console.error("Error en el login:", error);
    return { error: "Error al intentar iniciar sesión" };
  }
}
