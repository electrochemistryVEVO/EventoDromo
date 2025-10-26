"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Layouts/navbar/navbar_con_login.jsx";
import { Footer } from "@/components/Layouts/footer";

export default function PerfilLayout({ children }) {
  const searchParams = useSearchParams();
  const tab = (searchParams?.get("tab") ?? "entradas").toString();

  const REMOTE_BANNER = "/images/otros/baner-perfil.jpg";
  const FALLBACK_BANNER = "/images/cards-04.png";
  const [bannerSrc, setBannerSrc] = useState(REMOTE_BANNER);
  const [hasTriedFallback, setHasTriedFallback] = useState(false);

  const sidebarLinks = [
    { name: "info", href: "/user/perfil?tab=info", label: "Información Personal" },
    { name: "entradas", href: "/user/perfil?tab=entradas", label: "Mis Entradas" },
    { name: "dromopuntos", href: "/user/perfil?tab=dromopuntos", label: "Mis DromoPuntos" },
  ];

  return (
    <>
      <Navbar />
      <div className="bg-[#f8f8f8]">
        <div
          className="relative flex h-[363px] w-full items-center justify-center overflow-hidden"
          role="banner"
        >
          <div className="relative z-10 flex w-full max-w-[1200px] flex-col gap-1 px-5 text-white">
            <h1 className="text-4xl font-bold leading-none sm:text-5xl lg:text-6xl">
              Bienvenido a tu perfil
            </h1>
            <p className="text-xl opacity-95 sm:text-2xl">Revisa todos tus beneficios</p>
          </div>

          <div className="absolute inset-0 bg-linear-to-b from-black/45 via-black/25 to-transparent" />

          <img
            src={bannerSrc}
            alt="Banner de perfil"
            className="absolute inset-0 h-full w-full object-cover object-[50%_38%]"
            onError={() => {
              if (!hasTriedFallback) {
                setHasTriedFallback(true);
                setBannerSrc(FALLBACK_BANNER);
              }
            }}
            loading="lazy"
          />
        </div>

        <div className="flex w-full flex-col py-7 lg:grid lg:grid-cols-[1fr_240px_2px_minmax(0,1200px)_1fr] lg:items-start lg:gap-0">
          <aside
            className="relative z-30 w-full px-5 lg:col-start-2 lg:mr-4"
            aria-label="Navegación de perfil"
          >
            <nav className="w-full">
              <ul className="flex flex-col gap-5 py-8 my-5 list-none">
                {sidebarLinks.map(({ name, href, label }) => {
                  const isActive = tab === name;
                  const cardClasses = `flex h-[107px] w-full items-center gap-4 rounded-2xl px-5 py-4 transition-transform duration-150 ease-out ${
                    isActive
                      ? "bg-[#00C49A] text-white shadow-[0_6px_18px_rgba(0,196,154,0.12)]"
                      : "bg-[#e6e6e6] text-[#111] hover:scale-[1.01]"
                  }`;
                  const textClasses = `hidden text-2xl font-medium lg:block ${
                    isActive ? "text-white" : "text-[#111]"
                  }`;
                  return (
                    <li key={name}>
                      <Link href={href} className="block">
                        <div className={cardClasses}>
                          <div
                            className="flex w-[18px] flex-col items-center justify-center gap-2"
                            aria-hidden="true"
                          >
                            {[...Array(5)].map((_, index) => (
                              <span
                                key={index}
                                className="h-[15px] w-[15px] rounded-full bg-white shadow-[0_2px_4px_rgba(0,0,0,0.08)]"
                              />
                            ))}
                          </div>
                          <div className={textClasses}>{label}</div>
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </aside>

          <div
            className="hidden h-full w-0.5 self-stretch rounded-sm bg-black/50 lg:col-start-3 lg:block"
            aria-hidden="true"
          />

          <main
            className="w-full px-5 mt-6 lg:col-start-4 lg:mx-14 lg:mt-0"
            id="perfil-main"
          >
            <div className="relative rounded-lg bg-[#ebebeb] px-6 py-5 shadow-[0_4px_12px_rgba(9,10,10,0.03)]">
              {children}
            </div>
          </main>
        </div>
      </div>
      <Footer />
    </>
  );
}
