import "@/css/user-style.css";
import AdminLayoutClient from "./AdminLayoutClient";

export const metadata = {
  title: "Eventodromo Admin",
  description: "Proyecto ingenieria de software",
};

export default function RootLayout({ children }) {
  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
