
import 'bootstrap/dist/css/bootstrap.css';
import BootstrapClient from '@/components/BootstrapComponent';
import "@/css/satoshi.css";
import "@/css/style.css";

import "flatpickr/dist/flatpickr.min.css";
import "jsvectormap/dist/jsvectormap.css";

import type { Metadata } from "next";
import type { PropsWithChildren } from "react";
import Image from "next/image";
import logoMinimo from "@/assets/logos/logo_eventodromo_minimo.png";

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <div className="relative min-h-screen bg-gray-100">
      {/* Barra verde superior */}
      <div className="bg-[#00C49A] w-full h-[78px]" />

      {/* Contenedor para el logo */}
      <div className="absolute top-0 left-8 flex h-[134.5px] items-center">
        {/* Círculo del logo */}
        <div
          className="relative"
          style={{
            width: '113px',
            height: '113px',
          }}
        >
          <div className="bg-white rounded-full w-full h-full flex items-center justify-center shadow-lg">
            <Image
              src={logoMinimo}
              alt="Eventodromo Logo"
              width={75} // Ajustado para el nuevo tamaño del círculo
              height={75}
              className="object-contain"
            />
          </div>
        </div>
      </div>

      {/* Contenido de la página con padding superior para no ser tapado por el logo */}
      <main className="px-8 pt-24">{children}</main>
    </div>
  );
}
