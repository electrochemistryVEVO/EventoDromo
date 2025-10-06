
import {Container,Row,Col,Stack} from "react-bootstrap";
import { useSearchParams } from "next/navigation";
import LazyImage from "@/components/ui-elements/lazyImage";
import { useState,Suspense } from "react";

import Image from "next/image";
import iconMenosEntrada from '@/assets/icons/minusEntrada.png'
import iconMasEntrada from '@/assets/icons/plusEntrada.png'
import iconMasEntradaDeshabilitado from '@assets/icons/plusEntradaNoDisponible.png'

const eventoMockData = [
  {
    id: 0,
    nombre: "Festival Overpass Lima",
    descripcion: "Concierto internacional con artistas destacados.",
    idTipoEvento: 1, // Concierto
    idLocal: 1,
    creadoPor: 1,
    fechaPublicacion: new Date("2025-09-14"),
    fechaCompra: new Date("2025-09-14"),
    isDeleted: 1,
    imagenURL: "festival-overpass-lima.png"
  },
  {
    id: 1,
    nombre: "Noches de Folklore",
    descripcion: "Presentación cultural con danzas típicas y música peruana.",
    idTipoEvento: 3, // Teatro / Cultural
    idLocal: 1,
    creadoPor: 1,
    fechaPublicacion: new Date("2025-09-06"),
    fechaCompra: new Date("2025-09-06"),
    isDeleted: 1,
    imagenURL: "noches-de-folklore.jpg"
  },
  {
    id: 2,
    nombre: "Carmen Ópera de Georges Bizet",
    descripcion: "Ópera clásica presentada en el Teatro Municipal de Lima.",
    idTipoEvento: 3, // Teatro
    idLocal: 1,
    creadoPor: 1,
    fechaPublicacion: new Date("2025-09-10"),
    fechaCompra: new Date("2025-09-10"),
    isDeleted: 1,
    imagenURL: "carmen-opera.jpg"
  },
  {
    id: 3,
    nombre: "Tour + Museo Monumental",
    descripcion: "Recorrido por el Estadio Monumental y su museo.",
    idTipoEvento: 2, // Deportivo
    idLocal: 1,
    creadoPor: 1,
    fechaPublicacion: new Date("2025-09-11"),
    fechaCompra: new Date("2025-09-11"),
    isDeleted: 1,
    imagenURL: "tour-museo-monumental.jpg"
  },
  {
    id: 4,
    nombre: "Daniela Darcourt",
    descripcion: "Concierto de salsa en vivo de Daniela Darcourt.",
    idTipoEvento: 1, // Concierto
    idLocal: 1,
    creadoPor: 1,
    fechaPublicacion: new Date("2025-09-15"),
    fechaCompra: new Date("2025-09-15"),
    isDeleted: 1,
    imagenURL: "daniela-darcourt.png"
  },
  {
    id: 5,
    nombre: "Linkin Park",
    descripcion: "From Zero World Tour con Linkin Park en Lima.",
    idTipoEvento: 1, // Concierto
    idLocal: 1,
    creadoPor: 1,
    fechaPublicacion: new Date("2025-09-19"),
    fechaCompra: new Date("2025-09-19"),
    isDeleted: 1,
    imagenURL: "linkin-park.jpg"
  },
  {
    id: 6,
    nombre: "Imagine Dragons",
    descripcion: "Concierto de la banda Imagine Dragons en Lima.",
    idTipoEvento: 1, // Concierto
    idLocal: 1,
    creadoPor: 1,
    fechaPublicacion: new Date("2025-09-21"),
    fechaCompra: new Date("2025-09-21"),
    isDeleted: 1,
    imagenURL: "imagine-dragons.jpg"
  },
  {
    id: 7,
    nombre: "Carrera 10 Kilómetros Alimentación 10/10",
    descripcion: "Carrera de atletismo para promover la buena alimentación.",
    idTipoEvento: 2, // Deportivo
    idLocal: 1,
    creadoPor: 1,
    fechaPublicacion: new Date("2025-09-22"),
    fechaCompra: new Date("2025-09-22"),
    isDeleted: 1,
    imagenURL: "carrera-10k.png"
  },
  {
    id: 8,
    nombre: "Rimac Sports Festival",
    descripcion: "Evento deportivo con diferentes disciplinas.",
    idTipoEvento: 2, // Deportivo
    idLocal: 1,
    creadoPor: 1,
    fechaPublicacion: new Date("2025-09-24"),
    fechaCompra: new Date("2025-09-24"),
    isDeleted: 1,
    imagenURL: "rimac-sports-festival.png"
  },
  {
    id: 9,
    nombre: "Marinera y Show Peruano",
    descripcion: "Evento cultural con baile de marinera y espectáculos típicos.",
    idTipoEvento: 3, // Teatro / Cultural
    idLocal: 1,
    creadoPor: 1,
    fechaPublicacion: new Date("2025-09-26"),
    fechaCompra: new Date("2025-09-26"),
    isDeleted: 1,
    imagenURL: "marinera-show.png"
  }
];
// ==========================================================
// FECHAS DE EVENTO (1 a muchos por evento)
// ==========================================================
const fechaEventoMockData = [
  { id: 1, fechaHora: new Date("2025-11-14T19:00:00"), idEvento: 0 },
  { id: 2, fechaHora: new Date("2025-11-15T19:00:00"), idEvento: 0 },
  { id: 3, fechaHora: new Date("2025-10-05T20:00:00"), idEvento: 1 },
  { id: 4, fechaHora: new Date("2025-09-30T19:30:00"), idEvento: 2 },
  { id: 5, fechaHora: new Date("2025-09-30T10:00:00"), idEvento: 3 },
  { id: 6, fechaHora: new Date("2025-11-20T21:00:00"), idEvento: 4 },
  { id: 7, fechaHora: new Date("2025-11-25T20:00:00"), idEvento: 5 },
  { id: 8, fechaHora: new Date("2025-12-02T20:30:00"), idEvento: 6 },
  { id: 9, fechaHora: new Date("2025-10-12T08:00:00"), idEvento: 7 },
  { id: 10, fechaHora: new Date("2025-10-20T09:00:00"), idEvento: 8 },
  { id: 11, fechaHora: new Date("2025-10-26T18:00:00"), idEvento: 9 }
];

// ==========================================================
// TIPOS DE ENTRADA (1 a muchos por fecha)
// ==========================================================
const tipoEntradaMockData = [
  // Evento 1 - Overpass Lima
  { id: 1, nombre: "General", precio: 150, limiteCompra: 4, puntos: 1500, cantidadEntradas: 5000, cantidadVendida: 3100, idFechaEvento: 0 },
  { id: 2, nombre: "VIP", precio: 300, limiteCompra: 4, puntos: 2800, cantidadEntradas: 2000, cantidadVendida: 1500, idFechaEvento: 0},
  { id: 3, nombre: "Platinum", precio: 500, limiteCompra: 2, puntos: 4500, cantidadEntradas: 1000, cantidadVendida: 700, idFechaEvento: 0 },

  // Evento 2 - Noches de Folklore
  { id: 4, nombre: "General", precio: 60, limiteCompra: 6, puntos: 600, cantidadEntradas: 800, cantidadVendida: 400, idFechaEvento: 2 },
  { id: 5, nombre: "Preferencial", precio: 90, limiteCompra: 6, puntos: 900, cantidadEntradas: 400, cantidadVendida: 200, idFechaEvento: 2 },

  // Evento 3 - Carmen Ópera
  { id: 6, nombre: "General", precio: 120, limiteCompra: 4, puntos: 1100, cantidadEntradas: 1000, cantidadVendida: 850, idFechaEvento: 3 },
  { id: 7, nombre: "VIP", precio: 200, limiteCompra: 4, puntos: 1800, cantidadEntradas: 500, cantidadVendida: 300, idFechaEvento: 3 },

  // Evento 4 - Tour Museo Monumental
  { id: 8, nombre: "General", precio: 40, limiteCompra: 6, puntos: 400, cantidadEntradas: 1000, cantidadVendida: 600, idFechaEvento: 4 },

  // Evento 5 - Daniela Darcourt
  { id: 9, nombre: "General", precio: 100, limiteCompra: 4, puntos: 900, cantidadEntradas: 2000, cantidadVendida: 1300, idFechaEvento: 5 },
  { id: 10, nombre: "VIP", precio: 200, limiteCompra: 2, puntos: 1800, cantidadEntradas: 1000, cantidadVendida: 600, idFechaEvento: 5 },

  // Evento 6 - Linkin Park
  { id: 11, nombre: "General", precio: 250, limiteCompra: 4, puntos: 2300, cantidadEntradas: 4000, cantidadVendida: 2500, idFechaEvento: 6 },
  { id: 12, nombre: "Platinum", precio: 600, limiteCompra: 2, puntos: 5500, cantidadEntradas: 1500, cantidadVendida: 1100, idFechaEvento: 6 },

  // Evento 7 - Imagine Dragons
  { id: 13, nombre: "General", precio: 220, limiteCompra: 4, puntos: 2000, cantidadEntradas: 4500, cantidadVendida: 3700, idFechaEvento: 7},
  { id: 14, nombre: "VIP", precio: 450, limiteCompra: 2, puntos: 4200, cantidadEntradas: 2000, cantidadVendida: 1700, idFechaEvento: 7 },

  // Evento 8 - Carrera 10K
  { id: 15, nombre: "Inscripción General", precio: 80, limiteCompra: 1, puntos: 700, cantidadEntradas: 1500, cantidadVendida: 1000, idFechaEvento: 8 },

  // Evento 9 - Rimac Sports Festival
  { id: 16, nombre: "General", precio: 50, limiteCompra: 4, puntos: 500, cantidadEntradas: 1200, cantidadVendida: 800, idFechaEvento: 9 },
  { id: 17, nombre: "VIP", precio: 100, limiteCompra: 2, puntos: 900, cantidadEntradas: 600, cantidadVendida: 400, idFechaEvento: 9 },

  // Evento 10 - Marinera y Show Peruano
  { id: 18, nombre: "General", precio: 70, limiteCompra: 4, puntos: 600, cantidadEntradas: 1000, cantidadVendida: 700, idFechaEvento: 10 },
  { id: 19, nombre: "Preferencial", precio: 120, limiteCompra: 2, puntos: 1000, cantidadEntradas: 500, cantidadVendida: 300, idFechaEvento: 10 }
];
let idEventoActual = 0;
const fechaEventoPlaceholder = {id:-1,fechaHora:new Date(),idEvento:-1}

function SelectTipoEntrada(props){
  //TODO: Reorganizar
  let fechaEvento = props.fechaEvento
  let cartasTiposEntrada = []
  //Hipotesis: Esta tautologia reiniciara entradasSeleccionadas cada vez que se actualice fechaEvento
  const [entradasSeleccionadas,setEntradasSeleccionadas] = useState(fechaEvento===fechaEvento?{}:{});
  console.log(entradasSeleccionadas)

  //FUNCIONES ADICIONALES

  const agregarEntrada = (tipoEntrada) => {
    let nuevEntradasSeleccionadas = {...entradasSeleccionadas}
    if(nuevEntradasSeleccionadas.hasOwnProperty(tipoEntrada.id.toString())){
      nuevEntradasSeleccionadas[tipoEntrada.id.toString()].cantidad++
      nuevEntradasSeleccionadas[tipoEntrada.id.toString()].subtotal += tipoEntrada.precio
    }
    else{
      nuevEntradasSeleccionadas[tipoEntrada.id] = {
        cantidad : 1,
        subtotal : tipoEntrada.precio
      }

    }
    console.log(entradasSeleccionadas)
    console.log(nuevEntradasSeleccionadas)
    setEntradasSeleccionadas(nuevEntradasSeleccionadas)
  }

  const removerEntrada = (tipoEntrada) => {
    let nuevEntradasSeleccionadas = {...entradasSeleccionadas}
    if(nuevEntradasSeleccionadas.hasOwnProperty(tipoEntrada.id.toString())){
      nuevEntradasSeleccionadas[tipoEntrada.id.toString()].cantidad--
      nuevEntradasSeleccionadas[tipoEntrada.id.toString()].subtotal -= tipoEntrada.precio
      if(nuevEntradasSeleccionadas[tipoEntrada.id.toString()].cantidad<=0)delete nuevEntradasSeleccionadas[tipoEntrada.id]
    }

    setEntradasSeleccionadas(nuevEntradasSeleccionadas)
  }

  const contarEntradas = (tipoEntrada) => {

    if(entradasSeleccionadas.hasOwnProperty(tipoEntrada.id.toString())){
      return entradasSeleccionadas[tipoEntrada.id].cantidad;
    }
    return 0;
  }
  const obtenerPrecioTotal = () => {
    let acum = 0;

    for(let entrada of Array.from(Object.values(entradasSeleccionadas))){
      acum += entrada.subtotal;
    }
    return acum;
  }

  const hayEntradasDisponibles = (tipoEntrada) => {
      let capacidad = tipoEntrada.cantidadEntradas - tipoEntrada.cantidadVendida;
      let cantidadAComprar = contarEntradas(tipoEntrada)
      return capacidad - cantidadAComprar > 0
  }

  //COMPONENTES

  for(let tipoEntrada of tipoEntradaMockData){
    if(tipoEntrada.idFechaEvento===fechaEvento.id)cartasTiposEntrada.push(
      <Row>
        <Col>
          {tipoEntrada.nombre} <br/>
          S/.{tipoEntrada.precio}
        </Col>
        <Col>
          {hayEntradasDisponibles(tipoEntrada)?(<button onClick={() => {agregarEntrada(tipoEntrada)}}>
          <Image src={iconMasEntrada} alt='...'/>
        </button>):(<Image src={iconMasEntradaDeshabilitado} alt='...'/>)}
          {contarEntradas(tipoEntrada)}
          <button onClick={() => {removerEntrada(tipoEntrada)}}>
            <Image src={iconMenosEntrada} alt='...'/>
          </button>

        </Col>
      </Row>
    )
  }
  return(
    <>
      <h4>Entradas</h4>
      <div>
        <Container>
          {cartasTiposEntrada}
        </Container>
        <h4>Total: S/.{obtenerPrecioTotal()}</h4>
      </div>
    </>
  )
}

function fechaYaIncluida(fechas,fecha){
  for(let _fecha of fechas){
    if(_fecha.fechaHora.toLocaleDateString()===fecha.fechaHora.toLocaleDateString())return true;
  }
  return false
}

function SelectFechaHora(props){
  let evento = props.evento;
  const [currentFecha,setCurrentFecha] = useState(fechaEventoPlaceholder)
  const [currentHora,setCurrentHora] =  useState(fechaEventoPlaceholder)
  //validacion de fecha

  let fechas = []
  let optionFechas = []
  for(let fechaEvento of fechaEventoMockData){
    if(fechaEvento.idEvento===evento.id && !fechaYaIncluida(fechas,fechaEvento)){fechas.push(fechaEvento);console.log(fechaEvento.fechaHora.toString());optionFechas.push(
      <option>{fechaEvento.fechaHora.toLocaleDateString()}</option>
    )}
  }
  let horarios = []
  let optionHorarios = []
  for(let fecha of fechas){
    if(fecha.fechaHora.toLocaleDateString()===currentFecha.fechaHora.toLocaleDateString()){horarios.push(fecha);optionHorarios.push(
      <option>{fecha.fechaHora.toLocaleTimeString()}</option>
    )}
  }
  return(
    <>
    <p>Fecha:  <select id="ddlFechaEvento"
                       onChange={() => {
                         let index = document.getElementById("ddlFechaEvento").selectedIndex;
                         if(index===0){setCurrentFecha(fechaEventoPlaceholder);return;}
                         setCurrentFecha(fechas[index-1])}}>
      <option>Seleccionar fecha</option>
      {optionFechas}
    </select></p>
    <p>Horario:  <select id="ddlHorarioEvento"
                          disabled={currentFecha.id===-1}
                         onChange={() => {
                           let index = document.getElementById("ddlHorarioEvento").selectedIndex;
                           if(index===0){setCurrentHora(fechaEventoPlaceholder);return;}
                           setCurrentHora(horarios[index-1])}}>
      <option>Seleccionar horario</option>
      {optionHorarios}
    </select></p>
      <Suspense>
        <SelectTipoEntrada fechaEvento={currentHora}/>
      </Suspense>
      </>
  )
}
export function InfoEvento(){
  'use client'
  let params = useSearchParams();
  let eventoId = params.get("id");
  eventoId=parseInt(eventoId);
  console.log(eventoId);
  let evento = eventoMockData[eventoId];
  let fechaPublicacionFecha = new Intl.DateTimeFormat("es-419", {
    dateStyle: "full"
  }).format(evento.fechaPublicacion)
  let hh = evento.fechaPublicacion.getHours().toString()
  let mm = evento.fechaPublicacion.getMinutes().toString()
  let fechaPublicacionHora = hh + ':' + (mm[1]?mm:'0'+mm)
  return (
    <Stack direction="horizontal">
      <Container>
        <Row>
          <LazyImage imageUrl={evento.imagenURL}/>
        </Row>
        <Row>
          <h4>{evento.nombre}</h4>
        </Row>
        <Row>
          <h4>Descripcion</h4>
          <hl/>
          <p>{evento.descripcion}</p>
        </Row>
      </Container>
      <Container>
        <Row>
          <h4>{evento.nombre}</h4>
          <hl/>
          <Suspense fallback={(<SelectFechaHora evento={eventoMockData[idEventoActual]}/>)}>
          <SelectFechaHora evento={evento}/>
          </Suspense>
        </Row>
        <Row>

        </Row>
      </Container>
    </Stack>
  )
}