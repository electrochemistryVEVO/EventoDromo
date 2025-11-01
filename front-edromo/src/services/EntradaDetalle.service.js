//const API_URL = "http://localhost:8080/api"
const API_URL = "http://localhost:5189/api"
export async function obtenerDetallePorId(idEvento){
    let url = API_URL+"/Evento/ObtenerEventoPorId"
    return await fetch(url,{
        method: "POST",
        headers:{
        'Content-Type':'application/json'
        },body:JSON.stringify({idEvento})})
        .then((res)=>res.json())
        .catch((err)=>{console.log(err);return err;})
}

export async function listarEventosPorBusqueda(busqueda){
    let url = API_URL + "/Evento/ListarEventosPorBusqueda";
    return await fetch(url,{
        method: "POST",
        headers:{
            'Content-Type':'application/json'
        },body:JSON.stringify({busqueda})})
        .then((res)=>res.json())
        .catch((err)=>{console.log(err);return err;})
}