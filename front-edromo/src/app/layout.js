import { Geist, Geist_Mono } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Eventodromo",
  description: "Proyecto ingenieria de software",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
      <Suspense fallback={(<h1>Espere un momento...</h1>)}>
        {children}
      </Suspense>
      </body>
    </html>
  );
}
