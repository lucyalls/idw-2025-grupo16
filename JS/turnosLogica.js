import { especialidades } from "./especialidades.js";
import {
  obtenerMedicos,
  obtenerTurnos,
  guardarTurnos,
  obtenerReservas,
  guardarReservas,
  obtenerEspecialidades
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

window.mostrarPaso = function(numeroPaso) {
    document.querySelectorAll('.paso').forEach(paso => {
        paso.classList.add('d-none');
    });
    
    const panelAMostrar = document.getElementById(`paso-${numeroPaso}`);
    if (panelAMostrar) {
        panelAMostrar.classList.remove('d-none');
    }
}

window.volverAPaso1 = function() {
    mostrarPaso(1);
}
window.volverAPaso3 = function() {
    mostrarPaso(3);
}
window.volverAPaso4 = function() {
    mostrarPaso(4);
}
window.volverDesdeProfesionales = function() {
    if (estadoReserva.vieneDeEspecialidad) {
        mostrarPaso(2);
    } else {
        mostrarPaso(1);
    }
}

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

function poblarEspecialidades() {
    divListaEspecialidades.innerHTML = '';
    const especialidades = obtenerEspecialidades();
    
    especialidades.forEach(esp => {
        divListaEspecialidades.innerHTML += `
            <button type="button" 
                    class="list-group-item list-group-item-action" 
                    onclick="handleEspecialidadClick(${esp.id})">
                ${esp.nombre}
            </button>
        `;
    });
}

window.handleEspecialidadClick = function(idEspecialidad) {
    estadoReserva.idEspecialidad = idEspecialidad;
    poblarProfesionales(idEspecialidad);
    mostrarPaso(3);
}

function poblarProfesionales(idEspecialidad) {
    divListaProfesionales.innerHTML = ''; 
    const medicos = obtenerMedicos();
    const especialidades = obtenerEspecialidades(); 
    
    let medicosFiltrados = [];
    
    if (idEspecialidad) {
        medicosFiltrados = medicos.filter(m => m.especialidad === idEspecialidad);
        const esp = especialidades.find(e => e.id === idEspecialidad);
        tituloPaso3.textContent = `Paso 3: Elegí un Profesional (${esp.nombre})`;
    } else {
        medicosFiltrados = medicos;
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
        divCol.className = 'col-6 col-md-4 col-lg-2 mb-4'; 

        divCol.innerHTML = `
            <div class="card h-100 text-center"> 
                
                <img src="${medico.foto || placeholderImg}" 
                     class="card-img-top" 
                     style="height: 180px; object-fit: cover;" 
                     alt="Foto de ${medico.nombre} ${medico.apellido}">
                     
                <div class="card-body d-flex flex-column p-2">
                    
                    <h5 class="card-title fs-6">${medico.nombre} ${medico.apellido}</h5>
                    
                    <h6 class="card-subtitle mb-2 text-muted">${especialidadNombre}</h6>
                    
                    <p class="card-text small text-muted flex-grow-1">
                        ${medico.descripcion || ''}
                    </p> 
                    
                    <button type="button" 
                            class="btn-principal btn-sm mt-auto" 
                            onclick="handleProfesionalClick(${medico.id})">
                        Ver Turnos
                    </button>
                </div>
            </div>
        `;
        divListaProfesionales.appendChild(divCol);
    });
}

window.handleProfesionalClick = function(idMedico) {
    estadoReserva.idMedico = idMedico;
    poblarTurnos(idMedico);
    mostrarPaso(4);
}

function poblarTurnos(idMedico) {
    divListaTurnos.innerHTML = '';
    const turnos = obtenerTurnos();
    const medico = obtenerMedicos().find(m => m.id === idMedico);
    tituloPaso4.textContent = `Paso 4: Elegí un Turno (Dr. ${medico.apellido})`;

    const turnosDisponibles = turnos.filter(t => t.idMedico === idMedico && t.disponible === true);

    if (turnosDisponibles.length === 0) {
        divListaTurnos.innerHTML = '<p>El Dr. no tiene más turnos disponibles.</p>';
        return;
    }

    turnosDisponibles.forEach(turno => {
        divListaTurnos.innerHTML += `
            <button type="button" 
                    class="list-group-item list-group-item-action" 
                    onclick="handleTurnoClick(${turno.id})">
                ${turno.fechaHora}
            </button>
        `;
    });
}

window.handleTurnoClick = function(idTurno) {
    estadoReserva.idTurno = idTurno;
    poblarFormulario(idTurno);
    mostrarPaso(5);
}

function poblarFormulario(idTurno) {
    const medicos = obtenerMedicos();
    const turnos = obtenerTurnos();
    
    const turno = turnos.find(t => t.id === idTurno);
    const medico = medicos.find(m => m.id === turno.idMedico);

    infoTurnoSeleccionado.innerHTML = `
        Estás reservando con: <strong>${medico.nombre} ${medico.apellido}</strong><br>
        Fecha: <strong>${turno.fechaHora}</strong><br>
        Valor: <strong>$${medico.valorConsulta}</strong>
    `;
    inputIdTurno.value = idTurno;
}

formReserva.addEventListener('submit', (event) => {
    event.preventDefault();

    const idTurno = parseInt(inputIdTurno.value);
    const nombrePaciente = inputPacienteNombre.value.trim();
    const dniPaciente = inputPacienteDNI.value.trim();
    const idObraSocial = selectPacienteObraSocial.value;
    const fechaNacimiento = document.getElementById('paciente-nacimiento').value;

    if (!idTurno || !nombrePaciente || !dniPaciente || !idObraSocial || !fechaNacimiento) {
        alert("Por favor complete todos los campos obligatorios.");
        return;
    }

    let todosLosTurnos = obtenerTurnos();
    let todasLasReservas = obtenerReservas();
    let medicos = obtenerMedicos();

    let maxId = 0;
    if (todasLasReservas.length > 0) {
        maxId = Math.max(...todasLasReservas.map(r => r.id));
    }
    
    const nuevoIdReserva = maxId + 1;

    const turnoSeleccionado = todosLosTurnos.find(t => t.id === idTurno);
    const medicoDelTurno = medicos.find(m => m.id === turnoSeleccionado.idMedico);

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

    alert(`¡Reserva confirmada con el ID ${nuevoIdReserva}!
Paciente: ${nombrePaciente}
Médico: ${medicoDelTurno.nombre} ${medicoDelTurno.apellido}
Fecha: ${turnoSeleccionado.fechaHora}`);

    formReserva.reset();
    estadoReserva = {};
    mostrarPaso(1);
});
