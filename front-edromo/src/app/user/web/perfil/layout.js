"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import "./layout.css";

export default function PerfilLayout({ children }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, isAuthenticated } = useUser();
  const tab = (searchParams?.get("tab") ?? "entradas").toString();

  const [isChecking, setIsChecking] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  const REMOTE_BANNER = "/images/otros/baner-perfil.jpg";
  const FALLBACK_BANNER = "/images/cards-04.png";
  const [bannerSrc, setBannerSrc] = useState(REMOTE_BANNER);
  const [hasTriedFallback, setHasTriedFallback] = useState(false);

  useEffect(() => {
    // Función para verificar acceso - /user permite acceso público (cualquiera menos admin)
    const checkAccess = () => {
      // Verificar rol directamente desde el objeto user
      const userRole = user?.rol;
      console.log("Verificando acceso en /user/web/perfil - Usuario autenticado:", isAuthenticated, "Rol:", userRole);

      // Si el usuario es administrador, redirigir al dashboard de admin
      if (isAuthenticated && userRole === 'A') {
        console.warn("Admin detectado en perfil público. Redirigiendo al dashboard de admin.");
        window.location.href = "/admin/dashboard";
        return;
      }

      // Permitir acceso a usuarios no autenticados o clientes
      console.log("Acceso permitido a /user/web/perfil");
      setHasAccess(true);
      setIsChecking(false);
    };

    checkAccess();
  }, [user, isAuthenticated, router]);

  const linkClass = (name) =>
    `perfil-sidebar-link ${tab === name ? "active" : ""}`;

  // Mientras se verifica el rol, mostrar un loading
  if (isChecking || !hasAccess) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verificando permisos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="perfil-page">
      {/* Banner */}
      <div className="perfil-banner" role="banner">
        <div className="perfil-banner-content">
          <h1 className="perfil-banner-title">Bienvenido a tu perfil</h1>
          <p className="perfil-banner-sub">Revisa todos tus beneficios</p>
        </div>

        <div className="perfil-banner-overlay" />

        <img
          src={bannerSrc}
          alt="Banner de perfil"
          className="perfil-banner-img"
          onError={() => {
            // Si aún no hemos intentado con la imagen de fallback, la usamos.
            // Si la de fallback también falla, hasTriedFallback será true y no haremos nada más.
            if (!hasTriedFallback) {
              setHasTriedFallback(true);
              setBannerSrc(FALLBACK_BANNER);
            }
          }}
          loading="lazy"
        />
      </div>

      {/* Main container: centered */}
      <div className="perfil-container">
        <aside className="perfil-sidebar" aria-label="Navegación de perfil" style={{ zIndex: 10 }}>
          <nav>
            <ul className="perfil-sidebar-list">
              <li>
                <Link
                  href="/user/web/perfil?tab=info"
                  className={linkClass("info")}
                >
                  <div className="sidebar-card">
                    <div className="sidebar-dots" aria-hidden="true">
                      <span className="dot" />
                      <span className="dot" />
                      <span className="dot" />
                      <span className="dot" />
                      <span className="dot" />
                    </div>
                    <div className="sidebar-text">Información Personal</div>
                  </div>
                </Link>
              </li>

              <li>
                <Link
                  href="/user/web/perfil?tab=entradas"
                  className={linkClass("entradas")}
                >
                  <div className="sidebar-card">
                    <div className="sidebar-dots" aria-hidden="true">
                      <span className="dot" />
                      <span className="dot" />
                      <span className="dot" />
                      <span className="dot" />
                      <span className="dot" />
                    </div>
                    <div className="sidebar-text">Mis Entradas</div>
                  </div>
                </Link>
              </li>

              <li>
                <Link
                  href="/user/web/perfil?tab=dromopuntos"
                  className={linkClass("dromopuntos")}
                >
                  <div className="sidebar-card">
                    <div className="sidebar-dots" aria-hidden="true">
                      <span className="dot" />
                      <span className="dot" />
                      <span className="dot" />
                      <span className="dot" />
                      <span className="dot" />
                    </div>
                    <div className="sidebar-text">Mis DromoPuntos</div>
                  </div>
                </Link>
              </li>
            </ul>
          </nav>
        </aside>

        {/* vertical divider (hr parado) */}
        <div className="perfil-vertical-divider" aria-hidden="true" />

        <main className="perfil-main" id="perfil-main">
          <div className="perfil-main-inner">{children}</div>
        </main>
      </div>
    </div>
  );
}
