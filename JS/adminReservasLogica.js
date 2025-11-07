/* =======================================================
   adminReservasLogica.js (Versión corregida)
   ======================================================= */

import { 
    obtenerMedicos, 
    obtenerTurnos, 
    guardarTurnos, 
    obtenerReservas, 
    guardarReservas
} from './localStorage.js';

// --- Selectores del DOM ---
// (Lo podemos buscar aquí porque 'type="module"' espera al HTML)
const tablaBody = document.getElementById('tabla-reservas-body');

// --- Carga inicial ---
// Cuando el HTML está listo, solo llamamos a la función
document.addEventListener('DOMContentLoaded', () => {
    listarReservasAdmin();
});

// --- Funciones ---

// (¡CORRECCIÓN! Sacamos esta función afuera del DOMContentLoaded)
function listarReservasAdmin() {
    tablaBody.innerHTML = ''; // Limpiamos la tabla
    const reservas = obtenerReservas();
    const turnos = obtenerTurnos();
    const medicos = obtenerMedicos();

    if (reservas.length === 0) {
        tablaBody.innerHTML = '<tr><td colspan="6">No hay ninguna reserva registrada.</td></tr>';
        return;
    }

    reservas.forEach(reserva => {
        const turno = turnos.find(t => t.id === reserva.idTurno);
        const medico = turno ? medicos.find(m => m.id === turno.idMedico) : null;
        
        const nombreMedico = medico ? `${medico.nombre} ${medico.apellido}` : 'Médico no encontrado';
        const fechaTurno = turno ? turno.fechaHora : 'Turno no encontrado';
        
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${reserva.id}</td>
            <td>${reserva.nombrePaciente}</td>
            <td>${reserva.documentoPaciente}</td>
            <td>${nombreMedico}</td>
            <td>${fechaTurno}</td>
            <td>
                <button class="btn btn-sm btn-warning" onclick="reagendarReserva(${reserva.id}, ${reserva.idTurno})">
                    Reagendar
                </button>
                <button class="btn btn-sm btn-danger" onclick="cancelarReserva(${reserva.id}, ${reserva.idTurno})">
                    Cancelar Reserva
                </button>
            </td>
        `;
        tablaBody.appendChild(tr);
    });
}

// (¡NUEVA FUNCIÓN!)
window.reagendarReserva = function(idReserva, idTurnoViejo) {
    
    // 1. Preguntamos al admin el ID del nuevo turno
    const idTurnoNuevoInput = prompt(
        `Vas a mover la reserva ID: ${idReserva}.\n\n` +
        `Actualmente está en el Turno ID: ${idTurnoViejo}.\n\n` +
        `Por favor, ingresá el ID del NUEVO turno (disponible) al que querés moverla:`
    );

    if (!idTurnoNuevoInput) {
        return; // El admin apretó "cancelar"
    }

    const idTurnoNuevo = parseInt(idTurnoNuevoInput);

    if (isNaN(idTurnoNuevo)) {
        alert("Error: Tenés que ingresar un número de ID.");
        return;
    }
    
    if (idTurnoNuevo === idTurnoViejo) {
        alert("Error: No podés reagendar al mismo turno.");
        return;
    }

    let todosLosTurnos = obtenerTurnos();
    let todasLasReservas = obtenerReservas();

    // 2. Verificamos que el NUEVO turno exista y esté disponible
    const indexTurnoNuevo = todosLosTurnos.findIndex(t => t.id === idTurnoNuevo);

    if (indexTurnoNuevo === -1) {
        alert(`Error: El turno con ID: ${idTurnoNuevo} no existe.`);
        return;
    }
    if (todosLosTurnos[indexTurnoNuevo].disponible === false) {
        alert(`Error: El turno con ID: ${idTurnoNuevo} ya está reservado.`);
        return;
    }

    // 3. ¡Éxito! Hacemos la transacción
    
    // a. Liberamos el TURNO VIEJO
    const indexTurnoViejo = todosLosTurnos.findIndex(t => t.id === idTurnoViejo);
    if (indexTurnoViejo !== -1) {
        todosLosTurnos[indexTurnoViejo].disponible = true;
    }

    // b. Ocupamos el TURNO NUEVO
    todosLosTurnos[indexTurnoNuevo].disponible = false;

    // c. Actualizamos la RESERVA
    const indexReserva = todasLasReservas.findIndex(r => r.id === idReserva);
    if (indexReserva !== -1) {
        todasLasReservas[indexReserva].idTurno = idTurnoNuevo;
    }

    // 4. Guardamos los cambios
    guardarTurnos(todosLosTurnos);
    guardarReservas(todasLasReservas);

    // 5. Avisamos y refrescamos la tabla
    alert(`¡Éxito! La reserva ID: ${idReserva} se movió del Turno ${idTurnoViejo} al Turno ${idTurnoNuevo}.`);
    listarReservasAdmin(); // <-- Ahora sí la puede llamar
}


// (¡CORRECCIÓN! Esta función ahora puede llamar a 'listarReservasAdmin')
window.cancelarReserva = function(idReserva, idTurno) {
    if (confirm(`¿Estás seguro de que querés CANCELAR esta reserva? (El turno ID: ${idTurno} volverá a estar disponible)`)) {
        
        // --- Paso 1: Eliminar la Reserva ---
        let reservas = obtenerReservas();
        reservas = reservas.filter(r => r.id !== idReserva);
        guardarReservas(reservas);

        // --- Paso 2: Liberar el Turno (¡MUY IMPORTANTE!) ---
        let turnos = obtenerTurnos();
        const indexTurno = turnos.findIndex(t => t.id === idTurno);
        
        if (indexTurno !== -1) {
            turnos[indexTurno].disponible = true; // Lo volvemos a poner disponible
            guardarTurnos(turnos);
        }

        alert('¡Reserva cancelada! El turno ahora está disponible nuevamente.');
        listarReservasAdmin(); // <-- Ahora sí la puede llamar
    }
}