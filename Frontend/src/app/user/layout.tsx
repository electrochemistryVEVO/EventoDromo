
import 'bootstrap/dist/css/bootstrap.css';
import "@/css/user-style.css"
import type { Metadata } from "next";
import type { PropsWithChildren } from "react";
import Image from "next/image";
import Navbar from '@/components/Layouts/Navbar';
import { Footer } from "@/components/Layouts/footer"; // Importamos el nuevo Footer

export const metadata: Metadata = {
  title: {
    template: "%s | NextAdmin - Next.js Dashboard Kit",
    default: "NextAdmin - Next.js Dashboard Kit",
  },
  description:
    "Next.js admin dashboard toolkit with 200+ templates, UI components, and integrations for fast dashboard development.",
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <>
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <meta name="description" content="" />
        <meta name="author" content="" />
        <title>Shop Homepage - Start Bootstrap Template</title>
        <link rel="icon" type="image/x-icon" href="@/assets/favicon.ico" />
      </head>
      <body>
      <Navbar />
      {children}
      <Footer />
      </body>
    </>
  );
}
