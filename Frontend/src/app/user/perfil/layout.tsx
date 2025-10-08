"use client";

import React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { PropsWithChildren } from "react";
import "./perfil.css"; // opcional: si usas Tailwind puedes quitar este archivo


export default function PerfilLayout({ children }: PropsWithChildren) {
  const searchParams = useSearchParams();
  const tab = (searchParams?.get("tab") ?? "entradas").toString();

  const linkClass = (name: string) =>
    `flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
      tab === name
        ? "bg-emerald-500 text-white"      // estado activo (cambiar colores si quieres)
        : "text-gray-700 hover:bg-gray-100" // estado inactivo
    }`;

  return (
    <div className="perfil-layout flex gap-6 p-6 min-h-[calc(100vh-200px)]">
      <aside className="perfil-sidebar w-56" aria-label="Navegación de perfil">
        <nav>
          <ul className="space-y-3">
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

      <section className="perfil-main flex-1 min-w-0">
        <header className="perfil-header mb-4">
          <h2 className="text-2xl font-semibold">Bienvenido a tu perfil</h2>
        </header>

        <main className="perfil-content bg-white p-6 rounded-lg shadow-sm">
          {children}
        </main>
      </section>
    </div>
  );
}