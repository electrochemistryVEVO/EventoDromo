'use client'
import {InfoEvento} from "./controller";
import { Suspense } from "react";


export default function App(){
  return (
    <Suspense fallback={(<h1>Espere un momento...</h1>)}>
      <InfoEvento/>
    </Suspense>
  )
}