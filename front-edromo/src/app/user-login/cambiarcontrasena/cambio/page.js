// src/app/user-login/change-password/step-2/page.js
"use client";

import { useChangePasswordStep2Controller } from "./controller";

export default function ChangePasswordStep2Page() {
  const {
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    error,
    isLoading,
    isSuccess,
    validations,
    handleSubmit,
    handleCancel,
    handleFinish,
  } = useChangePasswordStep2Controller();

  // Vista de éxito que se muestra cuando isSuccess es true
  if (isSuccess) {
    return (
      <div style={styles.successContainer}>
        <h1 style={styles.successTitle}>¡Cambio de contraseña exitoso!</h1>
        <button onClick={handleFinish} style={styles.successButton}>
          Terminar
        </button>
      </div>
    );
  }

  // Vista principal del formulario
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Cambiar contraseña</h1>

      <form onSubmit={handleSubmit}>
        <label htmlFor="newPassword" style={styles.label}>
          Ingresa tu nueva contraseña
        </label>
        <input
          type="password"
          id="newPassword"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          style={styles.input}
          disabled={isLoading}
        />

        <ValidationList validations={validations} />

        <label
          htmlFor="confirmPassword"
          style={{ ...styles.label, marginTop: "1.5rem" }}
        >
          Repite la nueva contraseña
        </label>
        <input
          type="password"
          id="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          style={styles.input}
          disabled={isLoading}
        />

        {error && <p style={styles.errorText}>{error}</p>}

        <div style={styles.buttonContainer}>
          <button
            type="button"
            onClick={handleCancel}
            style={styles.cancelButton}
            disabled={isLoading}
          >
            Cancelar
          </button>
          <button
            type="submit"
            style={{ ...styles.button, flex: 1 }}
            disabled={isLoading}
          >
            {isLoading ? "Guardando..." : "Siguiente"}
          </button>
        </div>
      </form>
    </div>
  );
}

// Componente para mostrar la lista de validaciones
const ValidationList = ({ validations }) => {
  const rules = [
    { key: "hasUpper", text: "1 Mayúscula" },
    { key: "hasNumber", text: "1 Número" },
    { key: "hasLower", text: "1 Minúscula" },
    { key: "hasSpecial", text: "1 Caracter especial" },
  ];

  return (
    <div style={{ marginTop: "0.75rem", marginBottom: "1rem" }}>
      <p style={{ margin: 0, color: "#555" }}>Debe usar al menos:</p>
      <ul style={{ listStyle: "none", paddingLeft: "1rem", margin: 0 }}>
        {rules.map((rule) => (
          <li
            key={rule.key}
            style={{ color: validations[rule.key] ? "#00A99D" : "#D32F2F" }}
          >
            • {rule.text}
          </li>
        ))}
      </ul>
    </div>
  );
};

// Estilos consistentes con la página anterior
const styles = {
  successContainer: {
    width: "100%", // Asegura que el contenedor ocupe todo el ancho
    flex: 1, // Ocupa el espacio vertical disponible
    display: "flex",
    flexDirection: "column",
    justifyContent: "center", // Centra verticalmente
    alignItems: "center", // Centra horizontalmente
    textAlign: "center", // Centra el texto de todos los hijos
    padding: "10rem",
    boxSizing: "border-box", // Evita que el padding afecte el ancho total
  },
  successTitle: {
    fontSize: "2.5rem",
    fontWeight: "bold",
    lineHeight: "1.2",
    margin: "0 0 2rem 0", // Margen inferior para separar del botón
  },
  successButton: {
    padding: "0.9rem 2.5rem", // Ajuste de padding para mejor apariencia
    backgroundColor: "#00A99D",
    color: "white",
    border: "none",
    borderRadius: "8px", // Bordes más redondeados como en la imagen
    fontSize: "1.1rem",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "background-color 0.2s",
  },
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
    backgroundColor: "#f0f0f0",
    boxSizing: "border-box",
  },
  errorText: {
    color: "#D32F2F",
    fontSize: "0.9rem",
    marginTop: "1rem",
    textAlign: "center",
  },
  buttonContainer: { display: "flex", gap: "1rem", marginTop: "2rem" },
  button: {
    padding: "1rem",
    backgroundColor: "#00A99D",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "1.2rem",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "background-color 0.2s",
  },
  cancelButton: {
    padding: "1rem",
    backgroundColor: "white",
    color: "#555",
    border: "1px solid #ccc",
    borderRadius: "8px",
    fontSize: "1.2rem",
    fontWeight: "bold",
    cursor: "pointer",
    flex: 1,
  },
};
