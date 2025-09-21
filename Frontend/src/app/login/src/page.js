import './App.css';
import logo from './assets/logo.png';
import Image from "next/image";
import imagenMitad from './assets/imagenMitad.png';
function App() {
  const onSubmit = (event) => {
    let loginInfo = {};
    loginInfo.user = document.getElementById("email").innerText;
    loginInfo.password = document.getElementById("password").innerText;
    fetch("http://eventodromo-aspnet-1:8000/api/Usuario/AutenticarUsuario", {
      method: "POST",
      headers: {
        "Content-Type": "Application/JSON",
      },
      body: JSON.stringify(loginInfo),
    })
      .then((res)=>res.json())
      .then((response)=>{
        console.log(JSON.stringify(response));
      })
      .catch((error) => {
        console.log(error);
      });
  }
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
        <form className="login-text">
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
        </form>
      </div>
    </div>
  );
}

export default App;
