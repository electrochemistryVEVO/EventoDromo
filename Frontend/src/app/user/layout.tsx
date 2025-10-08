
import 'bootstrap/dist/css/bootstrap.css';
import BootstrapClient from '@/components/BootstrapComponent';
import "@/css/satoshi.css";
import "@/css/style.css";
import "@/css/user-style.css"
import { Sidebar } from "@/components/Layouts/sidebar";

import "flatpickr/dist/flatpickr.min.css";
import "jsvectormap/dist/jsvectormap.css";

import { Header } from "@/components/Layouts/header";
import type { Metadata } from "next";
import NextTopLoader from "nextjs-toploader";
import type { PropsWithChildren } from "react";
import Image from "next/image";
import logo from "@/assets/logos/eventodromo.png";
//import { Logo } from "@/components/logo";
import Script from "next/script";
import { text } from "node:stream/consumers";
import { searchBarSubmit } from "./layout-controller";
import Form from "next/form";
//import { Providers } from "../providers";

export const metadata: Metadata = {
  title: {
    template: "%s | NextAdmin - Next.js Dashboard Kit",
    default: "NextAdmin - Next.js Dashboard Kit",
  },
  description:
    "Next.js admin dashboard toolkit with 200+ templates, UI components, and integrations for fast dashboard development.",
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <>
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <meta name="description" content="" />
        <meta name="author" content="" />
        <title>Shop Homepage - Start Bootstrap Template</title>
        <link rel="icon" type="image/x-icon" href="@/assets/favicon.ico" />
      </head>
      <body>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container px-4 px-lg-5">
          <a className="navbar-brand" href="/user/eventos/lista"><Image
            src={logo}
            height={100}
            alt=""
            role="presentation"
          /></a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                  data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false"
                  aria-label="Toggle navigation"><span className="navbar-toggler-icon"></span></button>

          <div className="navbar-collapse" id="navbarSupportedContent">
            <Form id="navSearchBar" className="d-flex" action={searchBarSubmit}>
              <input className="search-bar px-4 py-3 rounded-2" placeholder="Busca tus eventos" id="searchBarText" name="searchBarText" type="text">

              </input>
            </Form>
            <form id="navShoppingCart" className="d-flex">

              <button className="btn btn-outline-dark" type="submit">
                <i className="bi-cart-fill me-1"></i>
                Cart
                <span className="badge bg-dark text-white ms-1 rounded-pill">0</span>
              </button>
            </form>
          </div>
        </div>
      </nav>
      {children}
      <footer className="bg-dark py-5 text-white">
        <div className="container">
          <div className="row">
            <div className="col">
              <Image
                src={logo}
                height={100}
                alt=""
                role="presentation"
              />
              <div className="col container">
                <div className="row">
                  <h2>Conversemos</h2>
                </div>
              </div>
            </div>
          </div>
          <hr/>
          Todos los derechos reservados
        </div>
      </footer>
      </body>
    </>
  );
}
