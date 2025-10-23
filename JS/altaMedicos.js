import { obtenerMedicos, guardarMedicos } from './localStorage.js';

const formAltaMedico = document.getElementById('altaMedicosForm');
const apellidoInput = document.getElementById('apellido');
const nombreInput = document.getElementById('nombre');
const especialidadInput = document.getElementById('especialidad');
const telefonoInput = document.getElementById('telefono');
const diasAtencionInput = document.getElementById('dias-atencion');
const obraSocialInput = document.getElementById('obra-social');
const tablaMedicosBody = document.querySelector('#tabla-medicos tbody');


let idEditando = null; 

function limpiarFormulario(){
    formAltaMedico.reset();
    idEditando = null;
    const submitBtn = document.getElementById('submitBtn');
    if(submitBtn) submitBtn.textContent = 'Registrar médico';
}

function altaMedicos(event) {
    event.preventDefault();

    const apellido = apellidoInput.value.trim();
    const nombre = nombreInput.value.trim();
    const especialidad = especialidadInput.value.trim();
    const telefono = telefonoInput.value.trim();
    const diasAtencion = diasAtencionInput.value.trim();
    const obraSocial = obraSocialInput.value.trim();

    if (!nombre || !apellido || !especialidad) {
        alert('Completar los campos obligatorios (nombre, apellido, especialidad)');
        return;
    }

    const medicos = obtenerMedicos();

    if(idEditando){
        const idx = medicos.findIndex(m => String(m.id) === String(idEditando));
        if(idx !== -1){
            medicos[idx].apellido = apellido;
            medicos[idx].nombre = nombre;
            medicos[idx].especialidad = especialidad;
            medicos[idx].telefono = telefono;
            medicos[idx].diasAtencion = diasAtencion;
            medicos[idx].obraSocial = obraSocial;
            guardarMedicos(medicos);
            alert('Médico modificado correctamente');
            limpiarFormulario();
            listarMedicos();
            return;
        }
    }

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
}

formAltaMedico.addEventListener('submit', altaMedicos);

document.addEventListener('DOMContentLoaded', function(){
    listarMedicos();
});
