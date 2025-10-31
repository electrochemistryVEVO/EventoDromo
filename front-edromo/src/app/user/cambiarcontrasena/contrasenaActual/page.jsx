"use client";

import { useChangePasswordController } from "./controller";

export default function ChangePasswordPage() {
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
          disabled={isLoading}
        />

        {error && <p style={styles.errorText}>{error}</p>}

        <button
          type="submit"
          style={{
            ...styles.button,
            ...(isLoading ? styles.buttonDisabled : {}),
          }}
          disabled={isLoading}
        >
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
    boxSizing: "border-box",
  },
  button: {
    width: "100%",
    padding: "1rem",
    backgroundColor: "#00A99D",
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
    color: "#D32F2F",
    fontSize: "0.9rem",
    marginTop: "0.5rem",
  },
  disclaimer: {
    marginTop: "1rem",
    fontSize: "0.9rem",
    color: "#555",
  },
};
