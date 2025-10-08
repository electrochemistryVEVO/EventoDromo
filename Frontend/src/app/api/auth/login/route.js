import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { autenticarUsuario } from "../../service";

export async function POST(request) {
  try {
    const loginInfo = await request.json();
    const response = await autenticarUsuario(loginInfo);

    if (response.success) {
      // Configurar la cookie de sesión
      cookies().set(
        "session",
        {
          token: response.token,
          user: loginInfo.correo,
        },
        {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 10 * 60 * 60, // 10 horas
        },
      );

      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({
        success: false,
        message: "Credenciales inválidas",
      });
    }
  } catch (error) {
    console.error("Error en autenticación:", error);
    return NextResponse.json(
      { success: false, message: "Error del servidor" },
      { status: 500 },
    );
  }
}
