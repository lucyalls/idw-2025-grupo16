import { obtenerMedicos, guardarMedicos } from './localStorage.js';

const formAltaMedico = document.getElementById('altaMedicosForm');
const apellidoInput = document.getElementById('apellido');
const nombreInput = document.getElementById('nombre');
const matriculaInput = document.getElementById('matricula');
const especialidadInput = document.getElementById('especialidad');
const descripcionInput = document.getElementById('descripcion');
const obraSocialInput = document.getElementById('obra-social');
const fotoInput = document.getElementById('foto');
const valorConsultaInput = document.getElementById('valor-consulta');
const telefonoInput = document.getElementById('telefono');
const diasAtencionInput = document.getElementById('dias-atencion');
const tablaMedicosBody = document.getElementById('tabla-medicos-body');
const submitBtn = document.getElementById('submitBtn');

let idEditando = null;

function toBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

window.limpiarFormulario = function() {
    formAltaMedico.reset();
    idEditando = null;
    if (submitBtn) submitBtn.textContent = 'Registrar médico';

    Array.from(obraSocialInput.options).forEach(opt => opt.selected = false);
}

window.verMedico = function(id){
    const medicos = obtenerMedicos();
    const m = medicos.find(x => x.id === id);
    if(!m){ alert('Médico no encontrado'); return; }

    const especialidadTexto = especialidadInput.querySelector(`option[value="${m.especialidad}"]`)?.textContent || m.especialidad;
    const obrasSocialesTexto = (m.obrasSociales || []).map(idObra => {
        return obraSocialInput.querySelector(`option[value="${idObra}"]`)?.textContent || idObra;
    }).join(', ');

    const detalle = `
Nombre: ${m.apellido || ''} ${m.nombre || ''}
Matrícula: ${m.matricula || '-'}
Especialidad: ${especialidadTexto || '-'}
Descripción: ${m.descripcion || '-'}
Valor Consulta: ${m.valorConsulta ? '$' + m.valorConsulta : '-'}
Obras Sociales: ${obrasSocialesTexto || '-'}
Teléfono: ${m.telefono || '-'}
Días: ${m.diasAtencion || '-'}
    `;
    alert(detalle.trim());
}

window.editarMedico = function(id){
    const medicos = obtenerMedicos();
    const m = medicos.find(x => x.id === id);
    if(!m){ alert('Médico no encontrado'); return; }
    
    apellidoInput.value = m.apellido || '';
    nombreInput.value = m.nombre || '';
    matriculaInput.value = m.matricula || '';
    especialidadInput.value = m.especialidad || '';
    descripcionInput.value = m.descripcion || '';
    valorConsultaInput.value = m.valorConsulta || '';
    telefonoInput.value = m.telefono || '';
    diasAtencionInput.value = m.diasAtencion || '';

    Array.from(obraSocialInput.options).forEach(opt => opt.selected = false);
    if (m.obrasSociales && m.obrasSociales.length > 0) {
        m.obrasSociales.forEach(idObra => {
            const option = obraSocialInput.querySelector(`option[value="${idObra}"]`);
            if (option) option.selected = true;
        });
    }
    
    idEditando = m.id;
    
    if(submitBtn) submitBtn.textContent = 'Guardar cambios';
    formAltaMedico.scrollIntoView({behavior: 'smooth'});
}

window.eliminarMedico = function(id){
    let medicos = obtenerMedicos();
    const m = medicos.find(x => x.id === id);
    if (!m) return;

    if(!confirm(`¿Querés eliminar a ${m.nombre} ${m.apellido}?`)) return;

    medicos = medicos.filter(m => m.id !== id);
    
    guardarMedicos(medicos);
    listarMedicos();
}

function crearFilaMedico(m){
    const tr = document.createElement('tr');
    const nombreCompleto = m.apellido ? `${m.apellido} ${m.nombre}` : m.nombre;
    const especialidadOpt = especialidadInput.querySelector(`option[value="${m.especialidad}"]`);
    const especialidadTexto = especialidadOpt ? especialidadOpt.textContent : m.especialidad;
    const obrasSocialesTexto = (m.obrasSociales || []).map(idObra => {
        return obraSocialInput.querySelector(`option[value="${idObra}"]`)?.textContent || idObra;
    }).join(', ');
    
    tr.innerHTML = `
        <td>${m.id}</td>
        <td>${nombreCompleto || ''}</td>
        <td>${m.matricula || '-'}</td>
        <td>${especialidadTexto || '-'}</td>
        <td>${m.valorConsulta ? '$' + m.valorConsulta : '-'}</td>
        <td>${obrasSocialesTexto || '-'}</td> 
        <td>
            <button type="button" class="btn-ver" onclick="verMedico(${m.id})">Ver</button>
            <button type="button" class="btn-editar" onclick="editarMedico(${m.id})">Editar</button>
            <button type="button" class="btn-eliminar" onclick="eliminarMedico(${m.id})">Eliminar</button>
        </td>
    `;
    return tr;
}

async function altaMedicos(event) {
    event.preventDefault();

    let apellido = apellidoInput.value.trim();
    let nombre = nombreInput.value.trim();
    let especialidad = especialidadInput.value;
    let matricula = matriculaInput.value.trim();
    let descripcion = descripcionInput.value.trim();
    let valorConsulta = valorConsultaInput.value.trim();
    let telefono = telefonoInput.value.trim();
    let diasAtencion = diasAtencionInput.value.trim();
    let obrasSociales = Array.from(obraSocialInput.selectedOptions)
                             .map(option => option.value);
    const fotoFile = fotoInput.files[0];

    if (!nombre || !apellido || !especialidad || !matricula || !valorConsulta || obrasSociales.length === 0) {
        alert('Completar todos los campos obligatorios (*).');
        return;
    }

    let fotoBase64 = null;
    if (fotoFile) {
        try {
            fotoBase64 = await toBase64(fotoFile);
        } catch (error) {
            console.error("Error al convertir la foto:", error);
            alert("Hubo un error al procesar la imagen.");
            return;
        }
    }

    let medicos = obtenerMedicos(); 
 
    if (idEditando !== null) {

        const index = medicos.findIndex(m => m.id === idEditando);
        if (index !== -1) {
            
            medicos[index].apellido = apellido;
            medicos[index].nombre = nombre;
            medicos[index].matricula = parseInt(matricula);
            medicos[index].especialidad = especialidad;
            medicos[index].descripcion = descripcion;
            medicos[index].valorConsulta = parseFloat(valorConsulta);
            medicos[index].telefono = telefono;
            medicos[index].diasAtencion = diasAtencion;
            medicos[index].obrasSociales = obrasSociales;

            if (fotoBase64 !== null) {
                medicos[index].foto = fotoBase64;
            }

            alert(`El médico ${apellido} ${nombre} ha sido actualizado.`);
        }
        idEditando = null;

    } else {
        const nuevo = {
            id: Date.now(),
            apellido: apellido,
            nombre: nombre,
            matricula: parseInt(matricula),
            especialidad: especialidad,
            descripcion: descripcion,
            valorConsulta: parseFloat(valorConsulta),
            telefono: telefono,
            diasAtencion: diasAtencion,
            obrasSociales: obrasSociales,
            foto: fotoBase64
        };

        medicos.push(nuevo);
        alert(
            `El médico ${apellido} ${nombre} ha sido dado de alta.`
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

document.addEventListener('DOMContentLoaded', function(){
    listarMedicos();
});

formAltaMedico.addEventListener('submit', altaMedicos);