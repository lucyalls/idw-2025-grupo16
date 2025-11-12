function listarReservasAdmin() {
    tablaBody.innerHTML = '';
    const reservas = obtenerReservas();
    const turnos = obtenerTurnos();
    const medicos = obtenerMedicos();
    const obrasSociales = obtenerObrasSociales(); // 🔹 Nuevo: obtenemos las obras sociales

    if (reservas.length === 0) {
        tablaBody.innerHTML = '<tr><td colspan="8">No hay ninguna reserva registrada.</td></tr>';
        return;
    }

    reservas.forEach(reserva => {
        const turno = turnos.find(t => t.id === reserva.idTurno);
        const medico = turno ? medicos.find(m => m.id === turno.idMedico) : null;
        const obraSocial = obrasSociales.find(o => o.nombre === reserva.obraSocial);

        const nombreMedico = medico ? `${medico.nombre} ${medico.apellido}` : 'Médico no encontrado';
        const fechaTurno = turno ? turno.fechaHora : 'Turno no encontrado';
        const nombreObraSocial = obraSocial ? obraSocial.nombre : 'Sin obra social';

        // 🔹 Calcular precio base y final
        let precioBase = medico ? parseFloat(medico.precioConsulta || 0) : 0;
        let precioFinal = precioBase;

        if (obraSocial && obraSocial.porcentaje) {
            precioFinal = precioBase - (precioBase * (obraSocial.porcentaje / 100));
        }

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${reserva.id}</td>
            <td>${reserva.nombrePaciente}</td>
            <td>${reserva.documentoPaciente}</td>
            <td>${nombreMedico}</td>
            <td>${fechaTurno}</td>
            <td>${nombreObraSocial}</td>
            <td>$${precioFinal.toFixed(2)}</td>
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

window.reagendarReserva = function(idReserva, idTurnoViejo) {
    const idTurnoNuevoInput = prompt(
        `Vas a mover la reserva ID: ${idReserva}.\n\n` +
        `Actualmente está en el Turno ID: ${idTurnoViejo}.\n\n` +
        `Por favor, ingresá el ID del NUEVO turno (disponible) al que querés moverla:`
    );

    if (!idTurnoNuevoInput) return;

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

    const indexTurnoNuevo = todosLosTurnos.findIndex(t => t.id === idTurnoNuevo);

    if (indexTurnoNuevo === -1) {
        alert(`Error: El turno con ID: ${idTurnoNuevo} no existe.`);
        return;
    }
    if (todosLosTurnos[indexTurnoNuevo].disponible === false) {
        alert(`Error: El turno con ID: ${idTurnoNuevo} ya está reservado.`);
        return;
    }

    const indexTurnoViejo = todosLosTurnos.findIndex(t => t.id === idTurnoViejo);
    if (indexTurnoViejo !== -1) {
        todosLosTurnos[indexTurnoViejo].disponible = true;
    }

    todosLosTurnos[indexTurnoNuevo].disponible = false;

    const indexReserva = todasLasReservas.findIndex(r => r.id === idReserva);
    if (indexReserva !== -1) {
        todasLasReservas[indexReserva].idTurno = idTurnoNuevo;
    }

    guardarTurnos(todosLosTurnos);
    guardarReservas(todasLasReservas);

    alert(`¡Éxito! La reserva ID: ${idReserva} se movió del Turno ${idTurnoViejo} al Turno ${idTurnoNuevo}.`);
    listarReservasAdmin();
}

window.cancelarReserva = function(idReserva, idTurno) {
    if (confirm(`¿Estás seguro de que querés CANCELAR esta reserva? (El turno ID: ${idTurno} volverá a estar disponible)`)) {
        let reservas = obtenerReservas();
        reservas = reservas.filter(r => r.id !== idReserva);
        guardarReservas(reservas);

        let turnos = obtenerTurnos();
        const indexTurno = turnos.findIndex(t => t.id === idTurno);
        
        if (indexTurno !== -1) {
            turnos[indexTurno].disponible = true;
            guardarTurnos(turnos);
        }

        alert('¡Reserva cancelada! El turno ahora está disponible nuevamente.');
        listarReservasAdmin();
    }
}
