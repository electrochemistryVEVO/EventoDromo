'use client'
import {insertarLocal, obtenerLocalPorId, editarLocal, eliminarLocal} from "@/services/gestionLocal.service";

function validateInput(){
    return true
}

export async function submitInput(event){
    event.preventDefault()
    if(!validateInput(event.target))return;
    let local = {
        nombre: event.target.nombre.value,
        idCiudad: event.target.idCiudad.value,
        direccion: event.target.direccion.value,
        capacidad: event.target.capacidad.value,
        isDeleted: false,
        idAdministrador: sessionStorage.getItem('userData')?.id ?? 1
    }
    console.log(local)
    await insertarLocal(local)
    return false;
    //return false;
}

export async function deleteLocal(id){
    await eliminarLocal(id)
    return false;
}

export async function modifyLocal(event,modalData){
    event.preventDefault()
    if(!validateInput(event.target))return;
    let local = {
        id: modalData.id,
        nombre: event.target.nombre.value,
        idCiudad: event.target.idCiudad.value,
        direccion: event.target.direccion.value,
        capacidad: event.target.capacidad.value,
        isDeleted: modalData.isDeleted,
        idAdministrador: modalData.idAdministrador
    }
    console.log(local)
    await editarLocal( local)
    return false;
}

export async function loadLocal(id,setModalData,setCreatePopup,setEdit){
    console.log("bud")
    obtenerLocalPorId(id)
        .then((data)=>{
            let local = data?.data
            setModalData({
                id: local.id,
                nombre: local.nombre,
                idCiudad: local.idCiudad,
                direccion: local.direccion,
                capacidad: local.capacidad,
                isDeleted: local.isDeleted,
                idAdministrador: local.idAdministrador
            })
            setEdit(true);
            setCreatePopup(true);
        })

}



