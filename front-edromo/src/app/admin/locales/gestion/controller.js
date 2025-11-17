'use client'
import { insertarLocal, obtenerLocalPorId, editarLocal, eliminarLocal, restaurarLocal } from "@/services/gestionLocal.service";

export async function submitInput(event) {
    event.preventDefault()
    
    const local = {
        nombre: event.target.nombre.value,
        idCiudad: event.target.idCiudad.value,
        direccion: event.target.direccion.value,
        capacidad: event.target.capacidad.value,
        isDeleted: false,
        idAdministrador: sessionStorage.getItem('userData')?.id ?? 1
    }
    
    await insertarLocal(local)
    return true;
}

export async function deleteLocal(id) {
    await eliminarLocal(id)
    return true;
}

export async function modifyLocal(event, modalData) {
    event.preventDefault()
    
    const local = {
        id: modalData.id,
        nombre: event.target.nombre.value,
        idCiudad: event.target.idCiudad.value,
        direccion: event.target.direccion.value,
        capacidad: event.target.capacidad.value,
        isDeleted: modalData.isDeleted,
        idAdministrador: modalData.idAdministrador
    }
    
    await editarLocal(local)
    return true;
}

export async function loadLocal(id, setModalData, setCreatePopup, setEdit) {
    const data = await obtenerLocalPorId(id)
    const local = data?.data
    
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
}

export async function restoreLocal(id) {
    const result = await restaurarLocal(id);
    return result;
}