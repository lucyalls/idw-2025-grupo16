import { medicos } from './medicos.js';
import { turnos } from './turnos.js';
import { especialidades } from './especialidades.js';

const KEY_MEDICOS = 'listaMedicos';
const KEY_TURNOS = 'listaTurnos';
const KEY_RESERVAS = 'listaReservas';
const KEY_ESPECIALIDADES = 'listaEspecialidades';

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

export function guardarReservas(reservas) {
    localStorage.setItem(KEY_RESERVAS, JSON.stringify(reservas));
}

export function obtenerReservas() {
    const reservasGuardadas = localStorage.getItem(KEY_RESERVAS);
    if (reservasGuardadas) {
        return JSON.parse(reservasGuardadas);
    } else {
        return [];
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