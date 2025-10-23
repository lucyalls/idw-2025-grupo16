import {medicos} from './medicos.js';
const KEY_LOCAL_STORAGE = 'listaMedicos';

export function guardarMedicos(medicos) {
    localStorage.setItem(KEY_LOCAL_STORAGE, JSON.stringify(medicos));
}

export function obtenerMedicos() {
    const medicosGuardados = localStorage.getItem(KEY_LOCAL_STORAGE);

    if (medicosGuardados) {
        return JSON.parse(medicosGuardados);
    } else {
        guardarMedicos(medicos);
        return medicos;
    }
}