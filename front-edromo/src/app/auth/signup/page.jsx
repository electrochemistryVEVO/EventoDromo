"use client";
import "@/css/signup-style.css";
import Image from "next/image";
import { useState, useEffect } from "react";
import { onSubmit } from "./controller";
import { obtenerDatosDeRegistro } from "@/services/SignUp.service";
import Link from "next/link";

const EMPTY_DATA = { 
  sexos: [], 
  tiposDocumento: [], 
  paises: [], 
  ciudades: [] 
};

function App() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [dataRegistro, setDataRegistro] = useState(EMPTY_DATA);
  const [paisSeleccionado, setPaisSeleccionado] = useState("");

  // Ciudades filtradas: se recalcula en cada renderizado
  const ciudadesFiltradas = dataRegistro.ciudades.filter(
    (c) => c.idPais.toString() === paisSeleccionado
  );

  // Lógica de carga de datos (Método GET)
  useEffect(() => {
    async function cargarDatos() {
      try {
        const data = await obtenerDatosDeRegistro();
        if (data && data.sexos && data.tiposDocumento && data.paises && data.ciudades) {
             setDataRegistro(data);
        } else {
             throw new Error("Estructura de datos del backend inválida.");
        }
      } catch (err) {
        console.error("Error al cargar datos del formulario:", err);
        setError(`Error al cargar opciones del formulario: ${err.message || 'Verifique el backend.'}`);
      } finally {
        setIsLoading(false);
      }
    }
    cargarDatos();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    // Obtener valores seleccionados (código/ID) del formulario
    const sexoSeleccionado = formData.get("sexo");
    const tipoDocSeleccionado = formData.get("tipoDocumento");
    const ciudadSeleccionada = formData.get("ciudad"); 

    try {
      // 1. Mapeo de Códigos/Valores a IDs numéricos
      const idSexo = parseInt(formData.get("sexo"));
      const idTipoDocumento = parseInt(formData.get("tipoDocumento"));
      const idCiudad = parseInt(formData.get("ciudad"));
      const idPais = parseInt(paisSeleccionado);

      // 2. Validación de selección (Verifica que se encontró un ID)
      if (!idSexo || !idTipoDocumento || !idCiudad || !paisSeleccionado) {
          setError("Por favor, complete correctamente todos los campos de selección.");
          return;
      }

      // 3. Inyecta los IDs numéricos en el formData para el envío POST
      formData.set("idsexo", idSexo);
      formData.set("idtipoDocumento", idTipoDocumento);
      formData.set("idciudad", idCiudad);
      formData.set("idpais", idPais);

      
      const result = await onSubmit(formData);
      
      if (result?.error) {
        setError(result.error);
      }
    } catch (err) {
      setError("Error al registrar usuario");
      console.error(err);
    }
  };

  return (
    <div className="App-signup">
      <div className="login-form-container-signup">
        <div className="form-header-signup">
          <div className="logo-container-signup">
            <Image
              src={"/images/logo/logo_eventodromo.png"}
              alt="Logo"
              className="login-logo"
              fill={true}
              style={{ objectFit: "contain" }}
              priority
            />
          </div>
          <Link href="/auth/login" className="volver-inicio-signup">
            Volver a iniciar sesión
          </Link>
          <h1>Bienvenido a Eventódromo</h1>
        </div>
        <div className="form-content">
          <form className="login-text-signup" onSubmit={handleSubmit}>
            {error && <div className="error-message-signup">{error}</div>}
            <div>
              <label htmlFor="nombres">Nombres</label>
              <input
                type="text"
                id="nombres"
                name="nombres"
                required
                placeholder="Nombres"
              />
            </div>
            <div>
              <label htmlFor="apellidos">Apellidos</label>
              <input
                type="text"
                id="apellidos"
                name="apellidos"
                required
                placeholder="Apellidos"
              />
            </div>
            <div>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                required
                placeholder="Email"
              />
            </div>
            <div>
              <label htmlFor="password">Contraseña</label>
              <input
                type="password"
                id="password"
                name="password"
                required
                placeholder="Contraseña"
              />
            </div>
            <div>
              <label htmlFor="tipoDocumento">Tipo de documento</label>
              <select id="tipoDocumento" name="tipoDocumento" className="select-custom" required>
                <option value="">Seleccionar</option>
                {dataRegistro.tiposDocumento.map((td) => (
                  <option key={td.id} value={td.id}> 
                    {td.nombre}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="numeroDocumento">Número de documento</label>
              <input
                type="text"
                id="numeroDocumento"
                name="numeroDocumento"
                required
                placeholder="Número de documento"
              />
            </div>
            <div>
              <label htmlFor="fechaNacimiento">Fecha de nacimiento</label>
              <input
                type="date"
                id="fechaNacimiento"
                name="fechaNacimiento"
                required
              />
            </div>
            <div>
              <label htmlFor="telefono">Teléfono</label>
              <input
                type="tel"
                id="telefono"
                name="telefono"
                required
                placeholder="Teléfono"
              />
            </div>
            <div>
              <label htmlFor="pais">País</label>
              <select 
                id="pais" 
                name="pais" 
                className="select-custom" 
                required
                onChange={(e) => {
                    setPaisSeleccionado(e.target.value); // Controla el estado para filtrar
                }} 
                value={paisSeleccionado}
              >
                <option value="">Seleccionar</option>
                {dataRegistro.paises.map((p) => (
                  <option key={p.id} value={p.id}> {/* VALUE es el ID, NOMBRE es el nombre */}
                    {p.nombre}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="ciudad">Ciudad</label>
              <select
                id="ciudad"
                name="ciudad"
                className="select-custom"
                required
                disabled={!paisSeleccionado || ciudadesFiltradas.length === 0}
              >
                <option value="">Seleccionar</option>
                {ciudadesFiltradas.map((c) => (
                  <option key={c.id} value={c.id}> {/* VALUE es el ID */}
                    {c.nombre}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="sexo">Sexo</label>
              <select id="sexo" name="sexo" className="select-custom" required>
                <option value="">Seleccionar</option>
                {dataRegistro.sexos.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.nombre}
                  </option>
                ))}
              </select>
            </div>
            <div className="checkbox-group">
              <input type="checkbox" id="terminos" name="terminos" required />
              <label htmlFor="terminos">
                Declaro que he leído y acepto los Términos y Condiciones, y
                Política de Privacidad de Eventódromo.
              </label>
            </div>
            <div className="checkbox-group">
              <input type="checkbox" id="promociones" name="promociones" />
              <label htmlFor="promociones">
                Autorizo que Teleticket envíe información sobre eventos y/o
                promociones que ofrece, así como encuestas.
              </label>
            </div>
            <button type="submit">Registrar</button>
          </form>
        </div>
      </div>
      <div className="imagen-mitad-signup">
        <Image
          src={"/images/otros/imagenMitad.png"}
          alt="Imagen de fondo"
          className="background-image"
          fill={true}
          priority
        />
      </div>
    </div>
  );
}

export default App;
