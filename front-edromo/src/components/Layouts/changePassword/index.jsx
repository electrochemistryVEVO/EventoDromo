// components/Layouts/changePassword/index.jsx
import React from "react";
import Image from "next/image";
import "@/css/changePassword-header.css"; // archivo de estilos específico

export function ChangePasswordHeader() {
  return (
    <header className="changePassword-header-container">
      <div className="changePassword-header-content">
        {/* Logo a la izquierda */}
        <div className="logo-section">
          <Image
            src={"/images/logo/eventodromo.png"}
            height={60} // Ajusta tamaño del header
            width={180}
            alt="EventoDromo Logo"
            role="presentation"
          />
        </div>

        {/* aqui el boton de perfil según figma */}
        
      </div>
    </header>
  );
}
