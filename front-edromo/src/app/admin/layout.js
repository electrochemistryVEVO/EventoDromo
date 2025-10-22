import "@/css/user-style.css";

export const metadata = {
  title: "Eventodromo Admin",
  description: "Proyecto ingenieria de software",
};

export default function RootLayout({ children }) {
  return (
    <>
      <body>{children}</body>
    </>
  );
}
