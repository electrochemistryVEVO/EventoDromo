"use client";

import { useResetPasswordController } from "./controller"; // Asegúrate de la ruta

export default function ResetPasswordPage() {
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
    tokenMissing,
  } = useResetPasswordController();

  // 1. Vista de éxito (Igual que la Step 2)
  if (isSuccess) {
    return (
      <div style={styles.successContainer}>
        <h1 style={styles.successTitle}>¡Contraseña restablecida!</h1>
        <p style={{ marginBottom: "2rem", fontSize: "1.1rem", color: "#555" }}>
          Ya puedes acceder a tu cuenta con tu nueva contraseña.
        </p>
        <button onClick={handleFinish} style={styles.successButton}>
          Iniciar Sesión
        </button>
      </div>
    );
  }

  // 2. Vista de error fatal (Si no hay token en la URL)
  if (tokenMissing) {
    return (
      <div style={styles.successContainer}>
        <h1 style={{ ...styles.successTitle, color: "#D32F2F" }}>
          Enlace inválido
        </h1>
        <p style={{ marginBottom: "2rem", fontSize: "1.1rem", color: "#555" }}>
          {error}
        </p>
        <button onClick={handleCancel} style={styles.cancelButton}>
          Volver al inicio
        </button>
      </div>
    );
  }

  // 3. Vista principal del formulario (Diseño Moderno)
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Restablecer contraseña</h1>

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
          placeholder="Nueva contraseña"
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
          placeholder="Confirmar contraseña"
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
            {isLoading ? "Guardando..." : "Restablecer"}
          </button>
        </div>
      </form>
    </div>
  );
}

// Componente reutilizable de validaciones (Igual al tuyo)
const ValidationList = ({ validations }) => {
  const rules = [
    { key: "hasUpper", text: "1 Mayúscula" },
    { key: "hasNumber", text: "1 Número" },
    { key: "hasLower", text: "1 Minúscula" },
    { key: "hasSpecial", text: "1 Caracter especial" },
  ];

  return (
    <div style={{ marginTop: "0.75rem", marginBottom: "1rem" }}>
      <p style={{ margin: 0, color: "#555", fontSize: "0.9rem" }}>
        Debe usar al menos:
      </p>
      <ul
        style={{
          listStyle: "none",
          paddingLeft: "0.5rem",
          margin: "0.5rem 0 0 0",
        }}
      >
        {rules.map((rule) => (
          <li
            key={rule.key}
            style={{
              color: validations[rule.key] ? "#00A99D" : "#D32F2F",
              fontSize: "0.9rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <span>{validations[rule.key] ? "✔" : "•"}</span> {rule.text}
          </li>
        ))}
      </ul>
    </div>
  );
};

// Estilos unificados (Copiados de tu ejemplo y ajustados para centrar si es necesario)
const styles = {
  successContainer: {
    width: "100%",
    minHeight: "80vh", // Para que quede centrado verticalmente en pantalla completa
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    padding: "2rem",
    boxSizing: "border-box",
  },
  successTitle: {
    fontSize: "2.5rem",
    fontWeight: "bold",
    lineHeight: "1.2",
    color: "#333",
    marginBottom: "1rem",
  },
  successButton: {
    padding: "0.9rem 2.5rem",
    backgroundColor: "#00A99D",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "1.1rem",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "background-color 0.2s",
  },
  container: {
    padding: "2rem",
    maxWidth: "500px",
    margin: "2rem auto", // Margen arriba y abajo para separar del borde
    textAlign: "left",
    backgroundColor: "#fff", // Fondo blanco por si el body es gris
    // Opcional: Añadir sombra si quieres que flote
    // borderRadius: "12px",
    // boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
  },
  title: {
    fontSize: "2rem",
    fontWeight: "bold",
    marginBottom: "2rem",
    textAlign: "center",
    color: "#333",
  },
  label: {
    display: "block",
    marginBottom: "0.5rem",
    fontSize: "1rem",
    color: "#555",
    fontWeight: "500",
  },
  input: {
    width: "100%",
    padding: "1rem",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "1rem",
    backgroundColor: "#fff", // Input blanco para mejor contraste
    boxSizing: "border-box",
    outline: "none",
    transition: "border-color 0.2s",
  },
  errorText: {
    color: "#D32F2F",
    fontSize: "0.9rem",
    marginTop: "1rem",
    textAlign: "center",
    backgroundColor: "#FFEBEE",
    padding: "0.5rem",
    borderRadius: "4px",
  },
  buttonContainer: { display: "flex", gap: "1rem", marginTop: "2.5rem" },
  button: {
    padding: "1rem",
    backgroundColor: "#00A99D",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "1.1rem",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "background-color 0.2s",
  },
  cancelButton: {
    padding: "1rem 1.5rem",
    backgroundColor: "white",
    color: "#555",
    border: "1px solid #ccc",
    borderRadius: "8px",
    fontSize: "1.1rem",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "background-color 0.2s",
  },
};
