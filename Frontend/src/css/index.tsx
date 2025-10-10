import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import "@/css/footer-style.css"; // Importamos los nuevos estilos

export function Footer() {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="footer-section about">
          <Image src="/images/logo/logo-eventodromo.svg" alt="EventoDromo Logo" width={150} height={40} />
          <p className="footer-description">
            La plataforma líder para descubrir y comprar entradas para los mejores eventos.
          </p>
        </div>
        <div className="footer-section links">
          <h4 className="footer-title">Navegación</h4>
          <ul>
            <li><Link href="/eventos/lista">Eventos</Link></li>
            <li><Link href="/nosotros">Sobre Nosotros</Link></li>
            <li><Link href="/contacto">Contacto</Link></li>
            <li><Link href="/faq">Preguntas Frecuentes</Link></li>
          </ul>
        </div>
        <div className="footer-section social">
          <h4 className="footer-title">Síguenos</h4>
          <div className="social-icons">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <Image src="/images/social/facebook.svg" alt="Facebook" width={24} height={24} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <Image src="/images/social/twitter.svg" alt="Twitter" width={24} height={24} />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <Image src="/images/social/instagram.svg" alt="Instagram" width={24} height={24} />
            </a>
          </div>
        </div>
        <div className="footer-section newsletter">
          <h4 className="footer-title">Suscríbete</h4>
          <p>Recibe notificaciones de los mejores eventos.</p>
          <form className="newsletter-form">
            <input type="email" placeholder="Tu correo electrónico" />
            <button type="submit">Suscribirse</button>
          </form>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} EventoDromo. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}