import MisEntradas from "../../../components/Layouts/perfil/mis-entradas.controller";
import InformacionPersonal from "../../../components/Layouts/perfil/informacion-personal/informacion-personal";
import MisDromoPuntos from "../../../components/Layouts/perfil/mis-dromopuntos";

export const metadata = {
  title: "Perfil — Usuario",
  description: "Sección de perfil del usuario",
};

export default async function Page({ searchParams }) {
  const params = await searchParams; // resolver el proxy antes de leer propiedades
  const tab = (params?.tab || "entradas").toString();

  return (
    <>
      {tab === "info" && <InformacionPersonal />}
      {tab === "dromopuntos" && <MisDromoPuntos />}
      {tab === "entradas" && <MisEntradas />}
    </>
  );
}