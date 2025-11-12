
import { medicos } from './medicos.js';
import { turnos } from './turnos.js';
import { reservas } from './reservas.js';
import { especialidades } from './especialidades.js';
import { obrasSociales } from './obrasSociales.js';

const KEY_MEDICOS = 'listaMedicos';
const KEY_TURNOS = 'listaTurnos';
const KEY_RESERVAS = 'listaReservas';
const KEY_ESPECIALIDADES = 'listaEspecialidades';
const KEY_OBRAS_SOCIALES = 'listaObrasSociales';

export function guardarMedicos(medicosAGuardar) {
    localStorage.setItem(KEY_MEDICOS, JSON.stringify(medicosAGuardar));
}
export function obtenerMedicos() {
    const medicosGuardados = localStorage.getItem(KEY_MEDICOS);
    if (medicosGuardados) {
        return JSON.parse(medicosGuardados);
    } else {
        guardarMedicos(medicos);
        return medicos;
    }
}

export function guardarTurnos(turnosAGuardar) {
    localStorage.setItem(KEY_TURNOS, JSON.stringify(turnosAGuardar));
}
export function obtenerTurnos() {
    const turnosGuardados = localStorage.getItem(KEY_TURNOS);
    if (turnosGuardados) {
        return JSON.parse(turnosGuardados);
    } else {
        guardarTurnos(turnos);
        return turnos;
    }
}

export function guardarReservas(reservasAGuardar) {
    localStorage.setItem(KEY_RESERVAS, JSON.stringify(reservasAGuardar));
}
export function obtenerReservas() {
    const reservasGuardadas = localStorage.getItem(KEY_RESERVAS);
    if (reservasGuardadas) {
        return JSON.parse(reservasGuardadas);
    } else {
        guardarReservas(reservas); 
        return reservas;
    }
}

export function guardarEspecialidades(especialidadesAGuardar) {
    localStorage.setItem(KEY_ESPECIALIDADES, JSON.stringify(especialidadesAGuardar));
}
export function obtenerEspecialidades() {
    const especialidadesGuardadas = localStorage.getItem(KEY_ESPECIALIDADES);
    if (especialidadesGuardadas) {
        return JSON.parse(especialidadesGuardadas);
    } else {
        guardarEspecialidades(especialidades);
        return especialidades;
    }
}

export function guardarObrasSociales(obrasSocialesAGuardar) {
    localStorage.setItem(KEY_OBRAS_SOCIALES, JSON.stringify(obrasSocialesAGuardar));
}

export function obtenerObrasSociales() { 
    const obrasSocialesGuardadas = localStorage.getItem(KEY_OBRAS_SOCIALES);
    if (obrasSocialesGuardadas) {
        return JSON.parse(obrasSocialesGuardadas);
    } else {
        guardarObrasSociales(obrasSociales); 
        return obrasSociales;
    }
}