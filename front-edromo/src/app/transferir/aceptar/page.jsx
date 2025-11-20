"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function AceptarTransferenciaPage() {
  const searchParams = useSearchParams();
  const [estado, setEstado] = useState("cargando"); // cargando, exito, error
  const [mensaje, setMensaje] = useState("");
  const [accion, setAccion] = useState(""); // aceptar o rechazar

  useEffect(() => {
    const token = searchParams.get("token");
    const accionParam = searchParams.get("accion") || "aceptar";
    
    setAccion(accionParam);

    if (!token) {
      setEstado("error");
      setMensaje("Token inválido o no proporcionado");
      return;
    }

    // Llamar al API para procesar la transferencia
    procesarTransferencia(token, accionParam);
  }, [searchParams]);

  const procesarTransferencia = async (token, accionParam) => {
    try {
      // Usar variable de entorno para el endpoint del API
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api';
      
      // Verificar que el backend esté corriendo
      const response = await fetch(
        `${apiUrl}/TransferirEntradas/ResponderTransferencia?token=${token}&accion=${accionParam}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      ).catch(err => {
        console.error("Error de conexión:", err);
        throw new Error(`No se pudo conectar con el servidor. Asegúrate de que el backend esté corriendo en ${apiUrl}`);
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setEstado("exito");
        setMensaje(data.message || "Operación completada exitosamente");
      } else {
        setEstado("error");
        setMensaje(data.error || "Ocurrió un error al procesar la transferencia");
      }
    } catch (error) {
      setEstado("error");
      setMensaje("Error de conexión con el servidor");
      console.error("Error:", error);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      padding: "20px"
    }}>
      <div style={{
        background: "white",
        borderRadius: "20px",
        padding: "40px",
        maxWidth: "500px",
        width: "100%",
        boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
        textAlign: "center"
      }}>
        {estado === "cargando" && (
          <>
            <div style={{
              width: "60px",
              height: "60px",
              border: "4px solid #f3f3f3",
              borderTop: "4px solid #00C49A",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "0 auto 20px"
            }}></div>
            <h2 style={{ color: "#333", marginBottom: "10px" }}>
              Procesando {accion === "aceptar" ? "aceptación" : "rechazo"}...
            </h2>
            <p style={{ color: "#666" }}>Por favor espera un momento</p>
          </>
        )}

        {estado === "exito" && (
          <>
            <div style={{
              width: "80px",
              height: "80px",
              background: accion === "aceptar" ? "#00C49A" : "#ff9800",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px",
              fontSize: "40px",
              color: "white"
            }}>
              {accion === "aceptar" ? "✓" : "✕"}
            </div>
            <h2 style={{ 
              color: accion === "aceptar" ? "#00C49A" : "#ff9800", 
              marginBottom: "15px" 
            }}>
              {accion === "aceptar" ? "¡Entradas Aceptadas!" : "Transferencia Rechazada"}
            </h2>
            <p style={{ color: "#666", fontSize: "16px", lineHeight: "1.6" }}>
              {mensaje}
            </p>
            {accion === "aceptar" && (
              <p style={{ 
                marginTop: "20px", 
                color: "#999", 
                fontSize: "14px" 
              }}>
                Las entradas ahora están disponibles en tu cuenta. 
                Inicia sesión para verlas en "Mis Entradas".
              </p>
            )}
            {accion === "rechazar" && (
              <p style={{ 
                marginTop: "20px", 
                color: "#999", 
                fontSize: "14px" 
              }}>
                Las entradas han sido devueltas al remitente.
              </p>
            )}
          </>
        )}

        {estado === "error" && (
          <>
            <div style={{
              width: "80px",
              height: "80px",
              background: "#f44336",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px",
              fontSize: "40px",
              color: "white"
            }}>
              ⚠
            </div>
            <h2 style={{ color: "#f44336", marginBottom: "15px" }}>
              Error
            </h2>
            <p style={{ color: "#666", fontSize: "16px", lineHeight: "1.6" }}>
              {mensaje}
            </p>
            <p style={{ 
              marginTop: "20px", 
              color: "#999", 
              fontSize: "14px" 
            }}>
              Posibles causas:
              <br />• La transferencia ya fue procesada
              <br />• El token ha expirado (24 horas)
              <br />• El enlace es inválido
            </p>
          </>
        )}

        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
}
