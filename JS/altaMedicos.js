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
let idEditando = null;

function limpiarFormulario() {
    formAltaMedico.reset();
    idEditando = null;
    flagIndex = null;
    const submitBtn = document.getElementById('submitBtn');
    if (submitBtn) submitBtn.textContent = 'Registrar médico';
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

function crearFilaMedico(m){
    const tr = document.createElement('tr');
    const nombreCompleto = m.apellido ? `${m.apellido} ${m.nombre}` : m.nombre;
    
    tr.innerHTML = `
        <td>${nombreCompleto || ''}</td>
        <td>${m.especialidad || '-'}</td>
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

function editarMedico(index) {
    let medicos = obtenerMedicos(); 
    const medico = medicos[index];
    if (!medico) return;
    
    apellidoInput.value = medico.apellido || '';
    nombreInput.value = medico.nombre || '';
    especialidadInput.value = medico.especialidad || '';
    telefonoInput.value = medico.telefono || '';
    diasAtencionInput.value = medico.diasAtencion || '';
    obraSocialInput.value = medico.obraSocial || '';
    
    flagIndex = index; 
    
    if (medico.id) idEditando = medico.id; 
}

function eliminarMedico(index) {

    let medicos = obtenerMedicos(); 
    if (!confirm(`¿Estás seguro de que deseas eliminar a ${medicos[index].nombre} ${medicos[index].apellido}?`)) {
        return;
    }
    medicos.splice(index, 1);
    
    guardarMedicos(medicos); 
    
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

    let medicos = obtenerMedicos(); 

    const datosMedico = { apellido, nombre, especialidad, telefono, diasAtencion, obraSocial };

    if (flagIndex !== null) {
        medicos[flagIndex] = { ...medicos[flagIndex], ...datosMedico };
        alert(`El médico ${apellido} ${nombre} ha sido actualizado.`);
        flagIndex = null;
        idEditando = null;
    } 

    if (idEditando !== null) {
        const index = medicos.findIndex(m => m.id === idEditando);
        if (index !== -1) {
             medicos[index] = { ...medicos[index], ...datosMedico };
             alert(`El médico ${apellido} ${nombre} ha sido actualizado.`);
        }
        idEditando = null;
    } else {
        const nuevo = {
            id: Date.now(),
            ...datosMedico
        };
        medicos.push(nuevo);
        alert(
            `El médico ${apellido} ${nombre} ha sido dado de alta con la especialidad de ${especialidad}`
        );
    }

    guardarMedicos(medicos); 
    
    limpiarFormulario();
    listarMedicos();
}

export function listarMedicos(){
    if(!tablaMedicosBody) return;
    const medicos = obtenerMedicos();
    tablaMedicosBody.innerHTML = '';
    if(medicos.length === 0){
        tablaMedicosBody.innerHTML = '<tr><td colspan="7">No hay médicos registrados.</td></tr>'; 
        return;
    }
    medicos.forEach(m => tablaMedicosBody.appendChild(crearFilaMedico(m)));
}

window.verMedico = function(id){
    const medicos = obtenerMedicos();
    const m = medicos.find(x => String(x.id) === String(id));
    if(!m){ alert('Médico no encontrado'); return; }
    const detalle = `Nombre: ${m.apellido || ''} ${m.nombre || ''}\nEspecialidad: ${m.especialidad || '-'}\nTeléfono: ${m.telefono || '-'}\nObras Sociales: ${m.obraSocial || '-'}\nDías de atención: ${m.diasAtencion || '-'}`;
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
}

document.addEventListener('DOMContentLoaded', function(){
    listarMedicos();
});

formAltaMedico.addEventListener('submit', altaMedicos);