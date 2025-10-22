import React from "react";
import Image from "next/image";
import "@/css/footer-style.css"; // Importamos los nuevos estilos

export function Footer() {
  return (
    <footer className="footer-main-container">
      <div className="container">
        <div className="footer-content-row">
          {/* Columna del Logo */}
          <div>
            <Image
              src={"/images/logo/eventodromo.png"}
              height={100}
              width={300}
              alt="EventoDromo Logo"
              role="presentation"
            />
          </div>

          {/* Columna de Redes Sociales */}
          <div className="social-section">
            <h2>Conversemos</h2>
            <div className="social-icons-list">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src={"/images/icon/facebook.svg"}
                  alt="Facebook"
                  width={40}
                  height={40}
                />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src={"/images/icon/twitter.svg"}
                  alt="Twitter"
                  width={40}
                  height={40}
                />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src={"/images/icon/instagram.svg"}
                  alt="Instagram"
                  width={40}
                  height={40}
                />
              </a>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src={"/images/icon/tiktok.svg"}
                  alt="TikTok"
                  width={40}
                  height={40}
                />
              </a>
            </div>
          </div>
        </div>
        <hr />
        <p className="footer-bottom-text">
          © 2025 Eventodromo. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
