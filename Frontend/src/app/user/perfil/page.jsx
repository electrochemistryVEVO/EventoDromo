import MisEntradas from "../../../components/Layouts/perfil/mis-entradas.controller";
import InformacionPersonal from "../../../components/Layouts/perfil/informacion-personal";
import MisDromoPuntos from "../../../components/Layouts/perfil/mis-dromopuntos";

export const metadata = {
  title: "Perfil — Usuario",
  description: "Sección de perfil del usuario",
};

export default function Page({ searchParams }) {
  const tab = (searchParams?.tab || "entradas").toString();

  return (
    <>
      {tab === "info" && <InformacionPersonal />}
      {tab === "dromopuntos" && <MisDromoPuntos />}
      {tab === "entradas" && <MisEntradas />}
    </>
  );
}