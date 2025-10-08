//'use client'
//TODO: usar componente aparte en vez de hacerlo todo en una pagina
import './App.css';

import { cookies } from "next/headers";

//import logo from '../assets/logo.png';
import logo from '@/assets/logos/eventodromo.svg'
import Image from "next/image";
import { redirect } from 'next/navigation';
import imagenMitad from '@/assets/pictures/imagenMitad.png';
import Form from "next/form";
import { onSubmit } from "./controller";

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
        } else if (result.rol === "C") {
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
      <div className='imagen-mitad'>
        <Image
          src={imagenMitad}
          alt="Imagen de fondo"
          className="background-image"
        />
      </div>
      <div className="login-form-container">
        {/* Imagen encima del formulario */}
        <Image
          src={logo}
          alt="Logo"
          className="login-logo"
        />
        <Form className="login-text" action={onSubmit}>
          <div>
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" required />
          </div>
          <div>
            <label htmlFor="password">Contraseña</label>
            <input type="password" id="password" name="password" required />

          </div>
          <a className='alinear-derecha' href="#create-account">¿Olvidaste tu contraseña?</a>
          <div className="login-hipervinculos-container">
            <button type="submit">Ingresar</button>
            <p>¿Aún no tienes cuenta?</p>
            <a href="#create-account">Registrate aquí</a>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default App;
