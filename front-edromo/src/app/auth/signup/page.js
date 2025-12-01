"use client";
import "@/css/signup-style.css";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { onSubmit } from "./controller";
import { obtenerDatosDeRegistro } from "@/services/signUpService";
import Link from "next/link";
import { showSuccess, showError, showWarning } from "@/components/Notifications/toast";

const EMPTY_DATA = { 
  sexos: [], 
  tiposDocumento: [], 
  paises: [], 
  ciudades: [] 
};

function App() {
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [dataRegistro, setDataRegistro] = useState(EMPTY_DATA);
  const [paisSeleccionado, setPaisSeleccionado] = useState("");
  const [tipoDocumentoSeleccionado, setTipoDocumentoSeleccionado] = useState("");
  const [numeroDocumento, setNumeroDocumento] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");

  // Ciudades filtradas: se recalcula en cada renderizado
  const ciudadesFiltradas = dataRegistro.ciudades.filter(
    (c) => c.idPais.toString() === paisSeleccionado
  );

  // Funciones de validación
  const calcularEdad = (fechaNac) => {
    const hoy = new Date();
    const nacimiento = new Date(fechaNac);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    return edad;
  };

  const validarDocumento = (tipoDoc, numero) => {
    const tipoDocumento = dataRegistro.tiposDocumento.find(td => td.id.toString() === tipoDoc);
    if (!tipoDocumento) return { valido: false, mensaje: "Tipo de documento no válido" };

    const nombreTipo = tipoDocumento.nombre.toLowerCase();
    
    // DNI - 8 dígitos numéricos
    if (nombreTipo.includes('dni')) {
      if (!/^\d{8}$/.test(numero)) {
        return { valido: false, mensaje: "El DNI debe tener exactamente 8 dígitos numéricos" };
      }
    }
    // Carné de Extranjería - 9 caracteres alfanuméricos
    else if (nombreTipo.includes('extranjería') || nombreTipo.includes('extranjeria')) {
      if (!/^[A-Z0-9]{9}$/.test(numero.toUpperCase())) {
        return { valido: false, mensaje: "El Carné de Extranjería debe tener 9 caracteres alfanuméricos" };
      }
    }
    // Pasaporte - 9-12 caracteres alfanuméricos
    else if (nombreTipo.includes('pasaporte')) {
      if (!/^[A-Z0-9]{9,12}$/.test(numero.toUpperCase())) {
        return { valido: false, mensaje: "El Pasaporte debe tener entre 9 y 12 caracteres alfanuméricos" };
      }
    }
    // Otros documentos - validación genérica
    else {
      if (numero.length < 6 || numero.length > 20) {
        return { valido: false, mensaje: "El documento debe tener entre 6 y 20 caracteres" };
      }
    }

    return { valido: true };
  };

  const validarFormulario = (formData) => {
    // Nombres
    const nombres = formData.get("nombres").trim();
    if (nombres.length < 2 || nombres.length > 50) {
      showError("Los nombres deben tener entre 2 y 50 caracteres");
      return false;
    }
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(nombres)) {
      showError("Los nombres solo pueden contener letras");
      return false;
    }

    // Apellidos
    const apellidos = formData.get("apellidos").trim();
    if (apellidos.length < 2 || apellidos.length > 50) {
      showError("Los apellidos deben tener entre 2 y 50 caracteres");
      return false;
    }
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(apellidos)) {
      showError("Los apellidos solo pueden contener letras");
      return false;
    }

    // Email
    const email = formData.get("email").trim();
    if (email.length > 100) {
      showError("El email no puede exceder 100 caracteres");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showError("Por favor ingresa un email válido");
      return false;
    }

    // Contraseña
    const password = formData.get("password");
    if (password.length < 6 || password.length > 50) {
      showError("La contraseña debe tener entre 6 y 50 caracteres");
      return false;
    }

    // Fecha de nacimiento - Mayor de 18 años
    const fechaNac = formData.get("fechaNacimiento");
    if (!fechaNac) {
      showError("Por favor ingresa tu fecha de nacimiento");
      return false;
    }
    const edad = calcularEdad(fechaNac);
    if (edad < 18) {
      showError("Debes ser mayor de 18 años para registrarte");
      return false;
    }
    if (edad > 120) {
      showError("Por favor ingresa una fecha de nacimiento válida");
      return false;
    }

    // Teléfono
    const telefono = formData.get("telefono").trim();
    if (!/^\+?\d{7,15}$/.test(telefono)) {
      showError("El teléfono debe contener entre 7 y 15 dígitos");
      return false;
    }

    // Dirección (opcional)
    const direccion = formData.get("direccion")?.trim() || "";
    if (direccion.length > 200) {
      showError("La dirección no puede exceder 200 caracteres");
      return false;
    }

    // Documento
    const tipoDoc = formData.get("tipoDocumento");
    const numDoc = formData.get("numeroDocumento").trim();
    const validacionDoc = validarDocumento(tipoDoc, numDoc);
    if (!validacionDoc.valido) {
      showError(validacionDoc.mensaje);
      return false;
    }

    // Validar selecciones
    if (!formData.get("sexo")) {
      showError("Por favor selecciona tu sexo");
      return false;
    }
    if (!formData.get("pais") || !formData.get("ciudad")) {
      showError("Por favor selecciona tu país y ciudad");
      return false;
    }

    // Términos y condiciones
    if (!formData.get("terminos")) {
      showError("Debes aceptar los términos y condiciones");
      return false;
    }

    return true;
  };

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
        showError(`Error al cargar opciones del formulario: ${err.message || 'Verifique el backend.'}`);
      } finally {
        setIsLoading(false);
      }
    }
    cargarDatos();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    // Validar formulario completo
    if (!validarFormulario(formData)) {
      return;
    }

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
          showError("Por favor, complete correctamente todos los campos de selección.");
          return;
      }

      // 3. Normalizar datos
      formData.set("nombres", formData.get("nombres").trim());
      formData.set("apellidos", formData.get("apellidos").trim());
      formData.set("email", formData.get("email").trim());
      formData.set("telefono", formData.get("telefono").trim());
      formData.set("numeroDocumento", formData.get("numeroDocumento").trim().toUpperCase());
      
      // Dirección es opcional
      const direccion = formData.get("direccion")?.trim() || "";
      formData.set("direccion", direccion);
      
      // 4. Inyecta los IDs numéricos en el formData para el envío POST
      formData.set("idsexo", idSexo);
      formData.set("idtipoDocumento", idTipoDocumento);
      formData.set("idciudad", idCiudad);
      formData.set("idpais", idPais);

      // Obtener redirect si existe
      const redirect = searchParams.get('redirect');
      const result = await onSubmit(formData, redirect);
      
      if (result?.error) {
        showError(result.error);
      } else {
        showSuccess("¡Registro exitoso! Bienvenido a Eventodromo");
      }
    } catch (err) {
      showError("Error al registrar usuario. Por favor intenta nuevamente");
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
            <div>
              <label htmlFor="nombres">Nombres</label>
              <input
                type="text"
                id="nombres"
                name="nombres"
                required
                maxLength={50}
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
                maxLength={50}
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
                maxLength={100}
                placeholder="correo@ejemplo.com"
              />
            </div>
            <div>
              <label htmlFor="password">Contraseña</label>
              <input
                type="password"
                id="password"
                name="password"
                required
                minLength={6}
                maxLength={50}
                placeholder="Mínimo 6 caracteres"
              />
            </div>
            <div>
              <label htmlFor="tipoDocumento">Tipo de documento</label>
              <select 
                id="tipoDocumento" 
                name="tipoDocumento" 
                className="select-custom" 
                required
                value={tipoDocumentoSeleccionado}
                onChange={(e) => setTipoDocumentoSeleccionado(e.target.value)}
              >
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
                maxLength={20}
                value={numeroDocumento}
                onChange={(e) => setNumeroDocumento(e.target.value)}
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
                max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
                value={fechaNacimiento}
                onChange={(e) => setFechaNacimiento(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="telefono">Teléfono</label>
              <input
                type="tel"
                id="telefono"
                name="telefono"
                required
                maxLength={15}
                placeholder="+51 999999999"
              />
            </div>
            <div>
              <label htmlFor="direccion">Dirección</label>
              <input
                type="text"
                id="direccion"
                name="direccion"
                maxLength={200}
                placeholder="Dirección (opcional)"
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
