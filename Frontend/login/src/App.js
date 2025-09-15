import './App.css';
import logo from './assets/logo.png';
import imagenMitad from './assets/imagenMitad.png';
function App() {
  return (
    <div className="App">
      <div className='imagen-mitad'>
        <img
          src={imagenMitad}
          alt="Imagen de fondo"
          className="background-image"
        />
      </div>
      <div className="login-form-container">
        {/* Imagen encima del formulario */}
        <img
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
