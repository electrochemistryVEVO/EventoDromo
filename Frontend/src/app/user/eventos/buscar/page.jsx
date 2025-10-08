
import { Suspense } from "react";
import { ListaEventosBusqueda } from "./controller";


export default function App(){
  return (<Suspense fallback={(<h1>Espere un momento...</h1>)}>
      <ListaEventosBusqueda/>
  </Suspense>)
}