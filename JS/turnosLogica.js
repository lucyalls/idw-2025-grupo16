import { especialidades } from "./especialidades.js";
import { medicos } from "./medicos.js"; 
import {
    obtenerMedicos,
    obtenerTurnos,
    guardarTurnos,
    obtenerReservas,
    guardarReservas,
    obtenerEspecialidades,
    obtenerObrasSociales
} from "./localStorage.js";

let estadoReserva = {
    idEspecialidad: null,
    idMedico: null,
    idTurno: null,
    vieneDeEspecialidad: false
};

const divListaEspecialidades = document.getElementById('lista-especialidades');
const divListaProfesionales = document.getElementById('lista-profesionales');
const divListaTurnos = document.getElementById('lista-turnos');
const tituloPaso3 = document.getElementById('titulo-paso-3');
const tituloPaso4 = document.getElementById('titulo-paso-4');
const formReserva = document.getElementById('form-reserva');
const infoTurnoSeleccionado = document.getElementById('info-turno-seleccionado');
const inputIdTurno = document.getElementById('id-turno-reservado');
const inputPacienteNombre = document.getElementById('paciente-nombre');
const inputPacienteDNI = document.getElementById('paciente-dni');
const selectPacienteObraSocial = document.getElementById('paciente-obra-social');
const formBuscarReservas = document.getElementById('form-buscar-reservas');
const inputDniBuscar = document.getElementById('dni-buscar');
const divResultadoReservas = document.getElementById('resultado-reservas');
const inputPacienteNacimiento = document.getElementById('paciente-nacimiento');

function mostrarPaso(numeroPaso) {
    document.querySelectorAll('.paso').forEach(paso => paso.classList.add('d-none'));
    const panelAMostrar = document.getElementById(`paso-${numeroPaso}`);
    if (panelAMostrar) panelAMostrar.classList.remove('d-none');
}

document.addEventListener('DOMContentLoaded', function() {
    cargarObrasSocialesSelect();

    document.getElementById('btn-buscar-especialidad').addEventListener('click', () => {
        estadoReserva.vieneDeEspecialidad = true;
        poblarEspecialidades();
        mostrarPaso(2);
    });

    document.getElementById('btn-buscar-profesional').addEventListener('click', () => {
        estadoReserva.vieneDeEspecialidad = false;
        poblarProfesionales(null);
        mostrarPaso(3);
    });

    document.getElementById('btn-volver-a-1').addEventListener('click', () => mostrarPaso(1));
    document.getElementById('btn-volver-a-paso3').addEventListener('click', () => {
        mostrarPaso(estadoReserva.vieneDeEspecialidad ? 2 : 1);
    });
    document.getElementById('btn-volver-a-3').addEventListener('click', () => mostrarPaso(3));
    document.getElementById('btn-volver-a-4').addEventListener('click', () => mostrarPaso(4));

    formBuscarReservas.addEventListener('submit', (event) => {
        event.preventDefault();
        const dniBuscado = inputDniBuscar.value.trim();
        if (!dniBuscado) {
            divResultadoReservas.innerHTML = '<div class="alert alert-warning">Por favor, ingresá un DNI.</div>';
            return;
        }
        mostrarMisReservas(dniBuscado);
    });

    formReserva.addEventListener('submit', (event) => {
        event.preventDefault();
        procesarReserva();
    });
});

function poblarEspecialidades() {
    divListaEspecialidades.innerHTML = '';
    const especialidades = obtenerEspecialidades();
    
    especialidades.forEach(esp => {
        const btn = document.createElement('button');
        btn.className = 'list-group-item list-group-item-action';
        btn.type = 'button';
        btn.textContent = esp.nombre;
        btn.dataset.id = esp.id;
        divListaEspecialidades.appendChild(btn);
    });
}

divListaEspecialidades.addEventListener('click', (event) => {
    const boton = event.target.closest('button');
    if (boton) {
        const idEspecialidad = parseInt(boton.dataset.id);
        estadoReserva.idEspecialidad = idEspecialidad;
        poblarProfesionales(idEspecialidad);
        mostrarPaso(3);
    }
});

function poblarProfesionales(idEspecialidad) {
    divListaProfesionales.innerHTML = ''; 
    const medicosGuardados = obtenerMedicos();
    const listaMedicos = medicosGuardados && medicosGuardados.length ? medicosGuardados : medicos;
    const especialidades = obtenerEspecialidades(); 
    
    let medicosFiltrados = [];
    
    if (idEspecialidad) {
        medicosFiltrados = listaMedicos.filter(m => m.especialidad === idEspecialidad);
        const esp = especialidades.find(e => e.id === idEspecialidad);
        tituloPaso3.textContent = `Paso 3: Elegí un Profesional (${esp.nombre})`;
    } else {
        medicosFiltrados = listaMedicos;
        tituloPaso3.textContent = `Paso 3: Elegí un Profesional (Todos)`;
    }

    if (medicosFiltrados.length === 0) {
        divListaProfesionales.innerHTML = '<p>No hay médicos disponibles para esta especialidad.</p>';
        return;
    }

    const placeholderImg = "img/doctor_placeholder.png";

    medicosFiltrados.forEach(medico => {
        const especialidad = especialidades.find(e => e.id === medico.especialidad);
        const especialidadNombre = especialidad ? especialidad.nombre : "Especialidad no definida";
        
        const divCol = document.createElement('div');
        divCol.className = 'col-6 col-md-4 col-lg-3 mb-4';

        divCol.innerHTML = `
            <div class="card h-100 text-center shadow-sm"> 
                <img src="${medico.foto || placeholderImg}" 
                     class="card-img-top" 
                     style="height: 180px; object-fit: cover;" 
                     alt="Foto de ${medico.nombre} ${medico.apellido}">
                     
                <div class="card-body d-flex flex-column p-2">
                    <h5 class="card-title fs-6">${medico.nombre} ${medico.apellido}</h5>
                    <h6 class="card-subtitle mb-2 text-muted small">${especialidadNombre}</h6>
                    <p class="card-text small text-muted flex-grow-1" style="font-size: 0.8em;">
                        ${medico.descripcion || 'Sin descripción.'}
                    </p> 
                    <button type="button" 
                            class="btn-principal btn-sm mt-auto btn-ver-turnos" 
                            data-id="${medico.id}"> Ver Turnos
                    </button>
                </div>
            </div>
        `;
        divListaProfesionales.appendChild(divCol);
    });
}

divListaProfesionales.addEventListener('click', (event) => {
    const boton = event.target.closest('.btn-ver-turnos');
    if (boton) {
        const idMedico = parseInt(boton.dataset.id);
        estadoReserva.idMedico = idMedico;
        poblarTurnos(idMedico);
        mostrarPaso(4);
    }
});

function poblarTurnos(idMedico) {
    divListaTurnos.innerHTML = '';
    const turnos = obtenerTurnos();
    const listaMedicos = obtenerMedicos() || medicos; 
    const medico = listaMedicos.find(m => m.id === idMedico);
    tituloPaso4.textContent = `Paso 4: Elegí un Turno (Dr. ${medico.apellido})`;

    const turnosDisponibles = turnos.filter(t => t.idMedico === idMedico && t.disponible === true);

    if (turnosDisponibles.length === 0) {
        divListaTurnos.innerHTML = '<p>El Dr. no tiene más turnos disponibles.</p>';
        return;
    }

    turnosDisponibles.forEach(turno => {
        const btn = document.createElement('button');
        btn.className = 'list-group-item list-group-item-action';
        btn.type = 'button';
        btn.textContent = turno.fechaHora;
        btn.dataset.id = turno.id;
        divListaTurnos.appendChild(btn);
    });
}

divListaTurnos.addEventListener('click', (event) => {
    const boton = event.target.closest('button');
    if (boton) {
        const idTurno = parseInt(boton.dataset.id);
        estadoReserva.idTurno = idTurno;
        poblarFormulario(idTurno);
        mostrarPaso(5);
    }
});

function cargarObrasSocialesSelect() {
    const obras = obtenerObrasSociales();
    selectPacienteObraSocial.innerHTML = '<option value="" disabled selected>Seleccione una</option>';
    obras.forEach(obra => {
        const option = document.createElement('option');
        option.value = obra.id;
        option.textContent = `${obra.nombre} (${obra.porcentaje}% cobertura)`;
        selectPacienteObraSocial.appendChild(option);
    });
}

function poblarFormulario(idTurno) {
    const listaMedicos = obtenerMedicos() || medicos;
    const turnos = obtenerTurnos();
    
    const turno = turnos.find(t => t.id === idTurno);
    const medico = listaMedicos.find(m => m.id === turno.idMedico);

    infoTurnoSeleccionado.innerHTML = `
        Estás reservando con: <strong>${medico.nombre} ${medico.apellido}</strong><br>
        Fecha: <strong>${turno.fechaHora}</strong><br>
        Valor: <strong>$${medico.valorConsulta}</strong>
    `;
    inputIdTurno.value = idTurno;
}

function procesarReserva() {
    const idTurno = parseInt(inputIdTurno.value);
    const nombrePaciente = inputPacienteNombre.value.trim();
    const dniPaciente = inputPacienteDNI.value.trim();
    const idObraSocial = selectPacienteObraSocial.value;
    const fechaNacimiento = inputPacienteNacimiento.value;

    if (!idTurno || !nombrePaciente || !dniPaciente || !idObraSocial || !fechaNacimiento) {
        alert("Por favor complete todos los campos obligatorios.");
        return;
    }

    let todosLosTurnos = obtenerTurnos();
    let todasLasReservas = obtenerReservas();
    let listaMedicos = obtenerMedicos() || medicos;

    let maxId = todasLasReservas.length > 0 ? Math.max(...todasLasReservas.map(r => r.id)) : 0;
    const nuevoIdReserva = maxId + 1;

    const turnoSeleccionado = todosLosTurnos.find(t => t.id === idTurno);
    const medicoDelTurno = listaMedicos.find(m => m.id === turnoSeleccionado.idMedico);

    const nuevaReserva = {
        id: nuevoIdReserva,
        documentoPaciente: dniPaciente,
        nombrePaciente: nombrePaciente,
        fechaNacimiento: fechaNacimiento,
        idTurno: idTurno,
        idEspecialidad: medicoDelTurno.especialidad,
        idObraSocial: idObraSocial,
        valorTotal: medicoDelTurno.valorConsulta
    };

    todasLasReservas.push(nuevaReserva);
    guardarReservas(todasLasReservas);

    const indiceTurno = todosLosTurnos.findIndex(t => t.id === idTurno);
    todosLosTurnos[indiceTurno].disponible = false;
    guardarTurnos(todosLosTurnos);

    alert(`¡Reserva confirmada con el ID ${nuevoIdReserva}!\nPaciente: ${nombrePaciente}\nMédico: ${medicoDelTurno.nombre} ${medicoDelTurno.apellido}\nFecha: ${turnoSeleccionado.fechaHora}`);

    formReserva.reset();
    estadoReserva = {};
    mostrarPaso(1);
}

function mostrarMisReservas(dni) {
    divResultadoReservas.innerHTML = "";
    const todasLasReservas = obtenerReservas();
    const listaMedicos = obtenerMedicos() || medicos;
    const turnos = obtenerTurnos();

    const misReservas = todasLasReservas.filter(r => r.documentoPaciente === dni);

    if (misReservas.length === 0) {
        divResultadoReservas.innerHTML = `<div class="alert alert-info">No se encontraron reservas para el DNI: <strong>${dni}</strong></div>`;
        return;
    }

    let html = '<h4 class="mb-3">Reservas Encontradas:</h4><div class="list-group">';

    misReservas.forEach(reserva => {
        const turno = turnos.find(t => t.id === reserva.idTurno);
        const medico = turno ? listaMedicos.find(m => m.id === turno.idMedico) : null;
        
        const nombreMedico = medico ? `${medico.nombre} ${medico.apellido}` : 'Médico no encontrado';
        const fechaTurno = turno ? turno.fechaHora : 'Turno no encontrado';
        
        let estadoTurno = ' (RESERVADO)';
        if (!turno) {
            estadoTurno = ' (TURNO ELIMINADO POR ADMIN)';
        } else if (turno.disponible) {
            estadoTurno = ' (CANCELADO)';
        }

        html += `
            <div class="list-group-item">
                <div class="d-flex w-100 justify-content-between">
                    <h5 class="mb-1">Médico: <strong>${nombreMedico}</strong></h5>
                    <small>Reserva ID: ${reserva.id}</small>
                </div>
                <p class="mb-1">Fecha: <strong>${fechaTurno}</strong><span class="text-muted">${estadoTurno}</span></p>
                <small>Paciente: ${reserva.nombrePaciente}</small>
            </div>
        `;
    });

    html += '</div>';
    divResultadoReservas.innerHTML = html;
}
