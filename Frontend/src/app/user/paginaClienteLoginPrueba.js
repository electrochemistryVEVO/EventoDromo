"use client";

import { useEffect, useState } from "react";

export default function PaginaClienteLoginPrueba() {
  const [rol, setRol] = useState(null);

  useEffect(() => {
    const session = sessionStorage.getItem("session");
    if (session) {
      const { rol } = JSON.parse(session);
      setRol(rol);
    }
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "2rem" }}>
      <h1>Página de Cliente</h1>
      {rol ? (
        <p>Bienvenido, tu rol es: <strong>{rol}</strong></p>
      ) : (
        <p>No hay sesión activa.</p>
      )}
    </div>
  );
}
