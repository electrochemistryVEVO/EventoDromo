import "bootstrap/dist/css/bootstrap.css";
import "@/css/user-style.css";
import Image from "next/image";
import UserLoginWebLayoutClient from "./UserLoginWebLayoutClient";
import { Footer } from "@/components/Layouts/footer"; // Importamos el nuevo Footer

export const metadata = {
  title: "Eventodromo",
  description: "Proyecto ingenieria de software",
};

export default function RootLayout({ children }) {
  return <UserLoginWebLayoutClient>{children}</UserLoginWebLayoutClient>;
}
