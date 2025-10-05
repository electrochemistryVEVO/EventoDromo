import '@/css/styles.css'
import { CarruselEventos, ListaEventos } from "./controller";
//import BootstrapClient from "@/components/BootstrapComponent";
import Image from "next/image";
import logo from "@/assets/logos/eventodromo.svg";
//import 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.5.0/font/bootstrap-icons.css'
//import { useEffect } from "react";

function App() {
  return (
    <div>
      <CarruselEventos></CarruselEventos>
      <section className="py-5">
        <ListaEventos></ListaEventos>
      </section>
    </div>
  );
}

export default App;