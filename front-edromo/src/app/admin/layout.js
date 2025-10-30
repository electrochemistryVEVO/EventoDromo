import "@/css/user-style.css";
import Navbar from "@/components/Layouts/navbar/navbar_admin.jsx";

export const metadata = {
  title: "Eventodromo Admin",
  description: "Proyecto ingenieria de software",
};

export default function RootLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
