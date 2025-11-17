import "bootstrap/dist/css/bootstrap.css";
//import "@/css/style.css";

import "flatpickr/dist/flatpickr.min.css";
import "jsvectormap/dist/jsvectormap.css";

import Image from "next/image";
import UserLoginCarritoLayoutClient from "./UserLoginCarritoLayoutClient";

export default function RootLayout({ children }) {
  return <UserLoginCarritoLayoutClient>{children}</UserLoginCarritoLayoutClient>;
}
