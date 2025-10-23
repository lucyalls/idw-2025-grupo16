import { obtenerMedicos, guardarMedicos } from './localStorage.js';

const formAltaMedico = document.getElementById('altaMedicosForm');
const apellidoInput = document.getElementById('apellido');
const nombreInput = document.getElementById('nombre');
const especialidadInput = document.getElementById('especialidad');
const telefonoInput = document.getElementById('telefono');
const diasAtencionInput = document.getElementById('dias-atencion');
const obraSocialInput = document.getElementById('obra-social');
const tablaMedicosBody = document.getElementById('tabla-medicos-body');

let flagIndex = null;

function actualizarTabla() {
    let medicos = JSON.parse(localStorage.getItem('medicos')) || [];
    tablaMedicosBody.innerHTML = '';
    medicos.forEach((medico, index) => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${medico.apellido}</td>
            <td>${medico.nombre}</td>
            <td>${medico.especialidad}</td>
            <td>${medico.telefono}</td>
            <td>${medico.diasAtencion}</td>
            <td>${medico.obraSocial}</td>
            <td>
                <button class="editar-btn" data-index="${index}">Editar</button>
                <button class="eliminar-btn" data-index="${index}">Eliminar</button>
            </td>
        `;
        tablaMedicosBody.appendChild(fila);
    });
}

tablaMedicosBody.addEventListener('click', function(event) {
    if (event.target.classList.contains('editar-btn')) {
        const index = Number(event.target.dataset.index);
        editarMedico(index);
    }
    if (event.target.classList.contains('eliminar-btn')) {
        const index = Number(event.target.dataset.index);
        eliminarMedico(index);
    }
});

function editarMedico(index) {
    let medicos = JSON.parse(localStorage.getItem('medicos')) || [];
    const medico = medicos[index];
    if (!medico) return;
    apellidoInput.value = medico.apellido;
    nombreInput.value = medico.nombre;
    especialidadInput.value = medico.especialidad;
    telefonoInput.value = medico.telefono;
    diasAtencionInput.value = medico.diasAtencion;
    obraSocialInput.value = medico.obraSocial;
    flagIndex = index;
}

function eliminarMedico(index) {
    let medicos = JSON.parse(localStorage.getItem('medicos')) || [];
    if (!confirm(`¿Estás seguro de que deseas eliminar a ${medicos[index].nombre} ${medicos[index].apellido}?`)) {
        return;
    }
    medicos.splice(index, 1);
    localStorage.setItem('medicos', JSON.stringify(medicos));
    actualizarTabla();
    flagIndex = null;
}

function altaMedicos(event) {
    event.preventDefault();

    let apellido = apellidoInput.value.trim();
    let nombre = nombreInput.value.trim();
    let especialidad = especialidadInput.value.trim();
    let telefono = telefonoInput.value.trim();
    let diasAtencion = diasAtencionInput.value.trim();
    let obraSocial = obraSocialInput.value.trim();

    if (!nombre || !apellido || !especialidad || !telefono || !diasAtencion || !obraSocial) {
        alert('Completar los campos obligatorios');
        return;
    }

    let medicos = JSON.parse(localStorage.getItem('medicos')) || [];

    if (flagIndex !== null) {
        medicos[flagIndex] = { apellido, nombre, especialidad, telefono, diasAtencion, obraSocial };
        alert(`El médico ${apellido} ${nombre} ha sido actualizado.`);
        flagIndex = null;
    } else {
        medicos.push({ apellido, nombre, especialidad, telefono, diasAtencion, obraSocial });
        alert(
            `El médico ${apellido} ${nombre} ha sido dado de alta con la especialidad de ${especialidad}\n` +
            `Teléfono: ${telefono}\n` +
            `Obras sociales aceptadas: ${obraSocial}\n` +
            `Días de atención: ${diasAtencion}`
        );
    }

    localStorage.setItem('medicos', JSON.stringify(medicos));
    formAltaMedico.reset();
    actualizarTabla();
}

actualizarTabla();
formAltaMedico.addEventListener('submit', altaMedicos);
