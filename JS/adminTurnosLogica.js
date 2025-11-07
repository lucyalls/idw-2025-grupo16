import { 
    obtenerMedicos, 
    obtenerTurnos, 
    guardarTurnos
} from './localStorage.js';

const formTurnos = document.getElementById('form-turnos');
const inputId = document.getElementById('turno-id');
const selectMedico = document.getElementById('turno-medico');
const inputFecha = document.getElementById('turno-fecha');
const tablaBody = document.getElementById('tabla-turnos-body');
const formTitulo = document.getElementById('form-titulo');
const btnCancelar = document.getElementById('btn-cancelar-edicion');

document.addEventListener('DOMContentLoaded', () => {
    cargarMedicosSelect();
    listarTurnosAdmin();

    formTurnos.addEventListener('submit', handleFormSubmit);
    
    btnCancelar.addEventListener('click', limpiarFormulario);
});

function cargarMedicosSelect() {
    const medicos = obtenerMedicos();
    medicos.forEach(medico => {
        const option = document.createElement('option');
        option.value = medico.id;
        option.textContent = `${medico.nombre} ${medico.apellido} (ID: ${medico.id})`;
        selectMedico.appendChild(option);
    });
}

function listarTurnosAdmin() {
    tablaBody.innerHTML = '';
    const turnos = obtenerTurnos();
    const medicos = obtenerMedicos();

    if (turnos.length === 0) {
        tablaBody.innerHTML = '<tr><td colspan="5">No hay turnos cargados.</td></tr>';
        return;
    }

    turnos.forEach(turno => {
        const medico = medicos.find(m => m.id === turno.idMedico);
        const nombreMedico = medico ? `${medico.nombre} ${medico.apellido}` : 'Médico no encontrado';
        
        const estado = turno.disponible 
            ? '<span class="badge bg-success">Disponible</span>' 
            : '<span class="badge bg-danger">Reservado</span>';
        
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${turno.id}</td>
            <td>${nombreMedico}</td>
            <td>${turno.fechaHora}</td>
            <td>${estado}</td>
            <td>
                <button class="btn btn-sm btn-warning" onclick="cargarTurnoParaEditar(${turno.id})">Editar</button>
                <button class="btn btn-sm btn-danger" onclick="eliminarTurno(${turno.id})">Eliminar</button>
            </td>
        `;
        tablaBody.appendChild(tr);
    });
}

function handleFormSubmit(event) {
    event.preventDefault();

    const id = inputId.value;
    const idMedico = parseInt(selectMedico.value);
    const fechaHora = inputFecha.value;

    if (!idMedico || !fechaHora) {
        alert("Por favor complete todos los campos.");
        return;
    }

    let turnos = obtenerTurnos();

    if (id) {
        const index = turnos.findIndex(t => t.id === parseInt(id));
        if (index !== -1) {
            turnos[index].idMedico = idMedico;
            turnos[index].fechaHora = fechaHora;
            alert('Turno actualizado con éxito.');
        }
    } else {
        const maxId = turnos.length > 0 ? Math.max(...turnos.map(t => t.id)) : 0;
        
        const nuevoTurno = {
            id: maxId + 1,
            idMedico: idMedico,
            fechaHora: fechaHora,
            disponible: true
        };
        turnos.push(nuevoTurno);
        alert('Turno creado con éxito.');
    }

    guardarTurnos(turnos);
    limpiarFormulario();
    listarTurnosAdmin();
}

window.cargarTurnoParaEditar = function(id) {
    const turnos = obtenerTurnos();
    const turno = turnos.find(t => t.id === id);

    if (turno) {
        inputId.value = turno.id;
        selectMedico.value = turno.idMedico;
        inputFecha.value = turno.fechaHora;
        formTitulo.textContent = `Editando Turno ID: ${turno.id}`;
        btnCancelar.classList.remove('d-none');
        window.scrollTo(0, 0);
    }
}

window.eliminarTurno = function(id) {
    if (confirm(`¿Estás seguro de que querés eliminar el turno ID: ${id}?`)) {
        let turnos = obtenerTurnos();
        turnos = turnos.filter(t => t.id !== id);
        guardarTurnos(turnos);
        listarTurnosAdmin();
        alert('Turno eliminado.');
    }
}

function limpiarFormulario() {
    formTurnos.reset();
    inputId.value = '';
    formTitulo.textContent = 'Cargar nuevo turno';
    btnCancelar.classList.add('d-none');
}