import { redirect } from "next/navigation";

export async function searchBarSubmit(data) {
  "use server";
  console.log("big balls");
  let search = data.get("searchBarText");
  //console.log("/user/eventos/buscar/?search="+(search?.innerText ?? "afro"))
  redirect("/user/eventos/buscar/?search=" + (search ?? "afro"));
  //redirect("/auth/login")
}
