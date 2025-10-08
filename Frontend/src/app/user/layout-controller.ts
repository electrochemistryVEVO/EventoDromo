import { redirect } from "next/navigation";
import { FormEvent } from "react";

export async function searchBarSubmit(data:FormData){
  'use server'
  console.log("big balls");
  let search = data.get("searchBarText")
  //console.log("/user/eventos/buscar/?search="+(search?.innerText ?? "afro"))
  redirect("/user/eventos/buscar/?search="+(search ?? "afro"))
  //redirect("/auth/login")
}