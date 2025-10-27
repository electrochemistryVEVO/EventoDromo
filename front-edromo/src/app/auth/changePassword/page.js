"use client";

export default function ChangePasswordPage() {
  return (
    <div style={{ padding: "2rem", maxWidth: "500px", margin: "0 auto", textAlign: "left" }}>
      <h1 style={{ fontSize: "2.5rem", fontWeight: "bold", marginBottom: "1.5rem", textAlign: "center" }}>
        Cambiar contraseña
      </h1>

      <label htmlFor="currentPassword" style={{ display: "block", marginBottom: "0.5rem", fontSize: "1rem", color: "#555" }}>
        Ingresa tu contraseña actual
      </label>
      <input
        type="password"
        id="currentPassword"
        placeholder="********"
        style={{
          width: "100%",
          padding: "1rem",
          borderRadius: "8px",
          border: "1px solid #ccc",
          marginBottom: "1.5rem",
          fontSize: "1rem",
        }}
      />

      <button
        style={{
          width: "100%",
          padding: "1rem",
          backgroundColor: "#00c199",
          color: "white",
          border: "none",
          borderRadius: "8px",
          fontSize: "1.2rem",
          fontWeight: "bold",
          cursor: "pointer",
        }}
      >
        Siguiente
      </button>

      <p style={{ marginTop: "1rem", fontSize: "0.9rem", color: "#555" }}>
        *Una vez realice el cambio, no podrá realizar otro cambio hasta 24h después
      </p>
    </div>
  );
}
