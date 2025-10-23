import { obtenerMedicos, guardarMedicos } from './localStorage.js';

const formAltaMedico = document.getElementById('altaMedicosForm');
const apellidoInput = document.getElementById('apellido');
const nombreInput = document.getElementById('nombre');
const especialidadInput = document.getElementById('especialidad');
const telefonoInput = document.getElementById('telefono');
const diasAtencionInput = document.getElementById('dias-atencion');
const obraSocialInput = document.getElementById('obra-social');
<<<<<<< HEAD
const tablaMedicosBody = document.querySelector('#tabla-medicos tbody');


let idEditando = null; 

function limpiarFormulario(){
    formAltaMedico.reset();
    idEditando = null;
    const submitBtn = document.getElementById('submitBtn');
    if(submitBtn) submitBtn.textContent = 'Registrar médico';
=======
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
>>>>>>> 8db1f7e61bd99cb55cb222b584e66c423967aa1e
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

<<<<<<< HEAD
    const nuevo = {
        id: Date.now(),
        apellido,
        nombre,
        especialidad,
        telefono,
        diasAtencion,
        obraSocial
    };

    medicos.push(nuevo);
    guardarMedicos(medicos);
    alert(`El médico ${apellido} ${nombre} ha sido dado de alta.`);
    limpiarFormulario();
    listarMedicos();
}
<<<<<<< HEAD

function crearFilaMedico(m){
    const tr = document.createElement('tr');
    tr.innerHTML = `
        <td>${m.apellido} ${m.nombre}</td>
        <td>${m.especialidad}</td>
        <td>${m.telefono || '-'}</td>
        <td>${m.obraSocial || '-'}</td>
        <td>${m.diasAtencion || '-'}</td>
        <td>
          <button type="button" class="btn-ver" onclick="verMedico(${m.id})">Ver</button>
          <button type="button" class="btn-editar" onclick="editarMedico(${m.id})">Editar</button>
          <button type="button" class="btn-eliminar" onclick="eliminarMedico(${m.id})">Eliminar</button>
        </td>
    `;
    return tr;
}

export function listarMedicos(){
    if(!tablaMedicosBody) return;
    const medicos = obtenerMedicos();
    tablaMedicosBody.innerHTML = '';
    if(medicos.length === 0){
        tablaMedicosBody.innerHTML = '<tr><td colspan="6">No hay médicos registrados.</td></tr>';
        return;
    }
    medicos.forEach(m => tablaMedicosBody.appendChild(crearFilaMedico(m)));
}

window.verMedico = function(id){
    const medicos = obtenerMedicos();
    const m = medicos.find(x => String(x.id) === String(id));
    if(!m){ alert('Médico no encontrado'); return; }
    const detalle = `Nombre: ${m.apellido} ${m.nombre}\nEspecialidad: ${m.especialidad}\nTeléfono: ${m.telefono || '-'}\nObras Sociales: ${m.obraSocial || '-'}\nDías de atención: ${m.diasAtencion || '-'}`;
    alert(detalle);
}

window.editarMedico = function(id){
    const medicos = obtenerMedicos();
    const m = medicos.find(x => String(x.id) === String(id));
    if(!m){ alert('Médico no encontrado'); return; }
    apellidoInput.value = m.apellido || '';
    nombreInput.value = m.nombre || '';
    especialidadInput.value = m.especialidad || '';
    telefonoInput.value = m.telefono || '';
    diasAtencionInput.value = m.diasAtencion || '';
    obraSocialInput.value = m.obraSocial || '';
    idEditando = m.id;
    const submitBtn = document.getElementById('submitBtn');
    if(submitBtn) submitBtn.textContent = 'Guardar cambios';
    formAltaMedico.scrollIntoView({behavior: 'smooth'});
}

window.eliminarMedico = function(id){
    if(!confirm('¿Querés eliminar este médico?')) return;
    let medicos = obtenerMedicos();
    medicos = medicos.filter(m => String(m.id) !== String(id));
    guardarMedicos(medicos);
    listarMedicos();
=======
    localStorage.setItem('medicos', JSON.stringify(medicos));
    formAltaMedico.reset();
    actualizarTabla();
>>>>>>> 8db1f7e61bd99cb55cb222b584e66c423967aa1e
}

actualizarTabla();
formAltaMedico.addEventListener('submit', altaMedicos);
<<<<<<< HEAD

document.addEventListener('DOMContentLoaded', function(){
    listarMedicos();
});
=======
actualizarTabla();
formAltaMedico.addEventListener('submit', altaMedicos);
>>>>>>> 6b3d11472c324a466c97d1c013ff777e635855f7
=======
>>>>>>> 8db1f7e61bd99cb55cb222b584e66c423967aa1e
