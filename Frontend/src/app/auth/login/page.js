"use client"; 
// 👆 Indica a Next.js que este componente se ejecuta en el **lado del cliente (navegador)**.
// Esto es necesario porque usamos hooks como useState y useRouter.

import "./App.css"; // 📁 Importa los estilos CSS para esta página.
import logo from "@/assets/logos/logo_eventodromo.png"; // 📷 Logo de tu aplicación.
import Image from "next/image"; // 🖼️ Componente optimizado de Next.js para imágenes.
import imagenMitad from "@/assets/pictures/imagenMitad.png"; // 📷 Imagen decorativa lateral.
import { useRouter } from "next/navigation"; // 🚀 Hook de Next.js para redirigir a otras rutas.
import { useState } from "react"; // 🧠 Hook de React para manejar estados (como el error).
import { onSubmit } from "./controller"; // 📡 Función que procesa el login (definida en controller.js).

function App() {
  const router = useRouter(); // 🔄 Permite navegar a otras páginas desde el código.
  const [error, setError] = useState(""); // 📍 Estado para guardar el mensaje de error (si lo hay).

  // 📤 Esta función se ejecuta cuando el usuario envía el formulario.
  const handleSubmit = async (e) => {
    e.preventDefault(); 
    // ✋ Evita que el formulario recargue la página (comportamiento por defecto del HTML).

    const formData = new FormData(e.target); 
    // 📄 Crea un objeto con todos los campos del formulario (email, password, etc.)

    try {
      const result = await onSubmit(formData); 
      // 📡 Llama a la función onSubmit del controller.js para procesar el login.
      //    - Esta función probablemente hace una petición al backend.

      if (result?.error) {
        // ❌ Si la respuesta tiene un campo `error`, significa que las credenciales son incorrectas.
        setError(result.error);
      } else if (result?.success) {
        // ✅ Si el login fue exitoso (result.success === true):

        // 👤 Redirigimos según el rol del usuario:
        if (result.rol === "A") {
          router.push("/home"); 
          // 📍 Si el rol es "A" (admin), lo enviamos a la página principal del administrador.
        } else if (result.rol === "U") {
          router.push("/user/eventos"); 
          // 📍 Si el rol es "U" (usuario normal), lo enviamos a la sección de eventos.
        } else {
          // ⚠️ Si el rol no coincide con ninguno esperado, mostramos un error.
          setError("Rol de usuario no válido");
        }
      }
    } catch (err) {
      // 💥 Si ocurre un error en la petición o en el proceso:
      setError("Error al iniciar sesión");
      console.error(err); // 🐛 Lo mostramos en consola para depurar.
    }
  };

  // 🧱 Aquí empieza el renderizado (lo que se ve en pantalla)
  return (
    <div className="App"> 
      {/* Contenedor principal */}
      
      <div className="login-form-container">
        {/* 🧩 Sección izquierda: formulario de login */}

        <div className="logo-container">
          {/* 📷 Logo en la parte superior */}
          <Image src={logo} alt="Logo" className="login-logo" priority />
        </div>

        {/* 🔙 Link para volver a la página principal */}
        <a href="/" className="volver-inicio">Volver al inicio</a>

        {/* 📩 Formulario de login */}
        <form className="login-text" onSubmit={handleSubmit}>
          {/* ⚠️ Si hay un error, lo mostramos en pantalla */}
          {error && <div className="error-message">{error}</div>}

          {/* 📧 Campo de email */}
          <div>
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" required />
          </div>

          {/* 🔑 Campo de contraseña */}
          <div>
            <label htmlFor="password">Contraseña</label>
            <input type="password" id="password" name="password" required />
          </div>

          {/* 🔐 Link para recuperar contraseña */}
          <a className="alinear-derecha" href="/forgot-password">
            ¿Olvidaste tu contraseña?
          </a>

          {/* 🔘 Botón para ingresar y links de registro */}
          <div className="login-hipervinculos-container">
            <button type="submit">Ingresa</button>
            <p>¿Aún no tienes cuenta?</p>
            <a href="/auth/signup">Registrate Aquí</a>
          </div>
        </form>
      </div>

      {/* 📷 Sección derecha: imagen decorativa */}
      <div className="imagen-mitad">
        <Image
          src={imagenMitad}
          alt="Imagen de fondo"
          className="background-image"
          priority
        />
      </div>
    </div>
  );
}

export default App; 
// 📤 Exporta el componente para que Next.js lo use como página.
