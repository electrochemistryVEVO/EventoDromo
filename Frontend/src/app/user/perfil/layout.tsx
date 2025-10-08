"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { PropsWithChildren } from "react";
import "./perfil.css";

export default function PerfilLayout({ children }: PropsWithChildren) {
  const searchParams = useSearchParams();
  const tab = (searchParams?.get("tab") ?? "entradas").toString();

  const REMOTE_BANNER =
    "https://0b6f33a6-f216-4645-98ae-d4fef9b8eee6-00-200tr4xsxrq60.riker.replit.dev/img/Banner.png";
  const FALLBACK_BANNER = "/images/cards-04.png";
  const [bannerSrc, setBannerSrc] = useState(REMOTE_BANNER);

  const linkClass = (name: string) =>
    `perfil-sidebar-link ${tab === name ? "active" : ""}`;

  return (
    <div className="perfil-page">
      {/* Banner: contenido primero, overlay, luego imagen (imagen debajo del texto mediante z-index) */}
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
            if (bannerSrc !== FALLBACK_BANNER) setBannerSrc(FALLBACK_BANNER);
          }}
          loading="lazy"
        />
      </div>

      {/* Main container: centered */}
      <div className="perfil-container">
        <aside className="perfil-sidebar" aria-label="Navegación de perfil">
          <nav>
            <ul>
              <li>
                <Link href="/user/perfil?tab=info" className={linkClass("info")}>
                  Información Personal
                </Link>
              </li>
              <li>
                <Link href="/user/perfil?tab=entradas" className={linkClass("entradas")}>
                  Mis Entradas
                </Link>
              </li>
              <li>
                <Link href="/user/perfil?tab=dromopuntos" className={linkClass("dromopuntos")}>
                  Mis DromoPuntos
                </Link>
              </li>
            </ul>
          </nav>
        </aside>

        <main className="perfil-main" id="perfil-main">
          <div className="perfil-main-inner">{children}</div>
        </main>
      </div>
    </div>
  );
}