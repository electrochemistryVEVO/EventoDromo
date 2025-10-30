// src/app/user-login/change-password/page.js

"use client";

import { useChangePasswordController } from "./controller";

export default function ChangePasswordPage() {
  // Usamos nuestro controlador para obtener el estado y la lógica.
  const {
    currentPassword,
    setCurrentPassword,
    error,
    isLoading,
    handleSubmit,
  } = useChangePasswordController();

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Cambiar contraseña</h1>

      {/* Usamos una etiqueta <form> para manejar el envío */}
      <form onSubmit={handleSubmit}>
        <label htmlFor="currentPassword" style={styles.label}>
          Ingresa tu contraseña actual
        </label>
        <input
          type="password"
          id="currentPassword"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          style={styles.input}
          disabled={isLoading} // Deshabilitamos el input mientras carga
        />

        {/* Mostramos el mensaje de error solo si existe */}
        {error && <p style={styles.errorText}>{error}</p>}

        <button
          type="submit"
          style={{
            ...styles.button,
            ...(isLoading ? styles.buttonDisabled : {}),
          }}
          disabled={isLoading}
        >
          {/* Cambiamos el texto del botón si está cargando */}
          {isLoading ? "Verificando..." : "Siguiente"}
        </button>
      </form>

      <p style={styles.disclaimer}>
        *Una vez realice el cambio, no podrá realizar otro cambio hasta 24h
        después
      </p>
    </div>
  );
}

// Para mayor limpieza, definimos los estilos como objetos.
const styles = {
  container: {
    padding: "2rem",
    maxWidth: "500px",
    margin: "auto",
    textAlign: "left",
  },
  title: {
    fontSize: "2.5rem",
    fontWeight: "bold",
    marginBottom: "1.5rem",
    textAlign: "center",
  },
  label: {
    display: "block",
    marginBottom: "0.5rem",
    fontSize: "1rem",
    color: "#555",
  },
  input: {
    width: "100%",
    padding: "1rem",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "1rem",
    boxSizing: "border-box", // Asegura que el padding no afecte el ancho total
  },
  button: {
    width: "100%",
    padding: "1rem",
    backgroundColor: "#00A99D", // Tono verde más similar a tus imágenes
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "1.2rem",
    fontWeight: "bold",
    cursor: "pointer",
    marginTop: "1.5rem",
    transition: "background-color 0.2s",
  },
  buttonDisabled: {
    backgroundColor: "#757575",
    cursor: "not-allowed",
  },
  errorText: {
    color: "#D32F2F", // Un tono de rojo para errores
    fontSize: "0.9rem",
    marginTop: "0.5rem",
  },
  disclaimer: {
    marginTop: "1rem",
    fontSize: "0.9rem",
    color: "#555",
  },
};
