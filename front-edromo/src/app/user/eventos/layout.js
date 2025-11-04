import "bootstrap/dist/css/bootstrap.css";
import "@/css/user-style.css";
import Image from "next/image";
import Navbar from "@/components/Layouts/navbar/navbar_con_login.jsx";
import { Footer } from "@/components/Layouts/footer"; // Importamos el nuevo Footer

export const metadata = {
  title: "Eventodromo",
  description: "Proyecto ingenieria de software",
};

export default function RootLayout({ children }) {
  return (
    <div className="grid min-h-dvh grid-rows-[auto_1fr_auto]">
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}
