import { obtenerMedicos, guardarMedicos } from './localStorage.js';

const formAltaMedico = document.getElementById('altaMedicosForm');
const apellidoInput = document.getElementById('apellido');
const nombreInput = document.getElementById('nombre');
const especialidadInput = document.getElementById('especialidad');
const telefonoInput = document.getElementById('telefono');
const diasAtencionInput = document.getElementById('dias-atencion');
const obraSocialInput = document.getElementById('obra-social')

let flagIdex = null;
function actualizarTabla() {
    let medicos = JSON.parse(localStorage.getItem('medicos')) || [];
    tablaMedicosBody.innerHTML = '';
    medicos.forEach(medicos, index=> {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${medicos.apellido}</td>
            <td>${medicos.nombre}</td>
            <td>${medicos.especialidad}</td>
            <td>${medicos.telefono}</td>
            <td>${medicos.diasAtencion}</td>
            <td>${medicos.obraSocial}</td>
            <td>
                <button class="editar-btn" data-index="${index}">Editar</button>
                <button class="eliminar-btn" data-index="${index}">Eliminar</button>
            </td>
        `;
        tablaMedicosBody.appendChild(fila);
    });
       tablaMedicosBody.addEventListener('click', function(event) {
    if (event.target.classList.contains('editar-btn')) {
        const index = event.target.getAttribute('data-index');
        const medicos = JSON.parse(localStorage.getItem('medicos')) || [];
        // Seleccionar el médico a editar
    }
});
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
    apellidoInput.value = medico.apellido;
    nombreInput.value = medico.nombre;
    especialidadInput.value = medico.especialidad;
    telefonoInput.value = medico.telefono;
    diasAtencionInput.value = medico.diasAtencion;
    obraSocialInput.value = medico.obraSocial;
    flagIdex = index;
        function eliminarMedico(index) {
    let medicos = JSON.parse(localStorage.getItem('medicos')) || [];
        if (!confirm('¿Estás seguro de que deseas eliminar a ${medicos[index].nombre} ${medicos[index].apellido}?'')) {
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
        alert(
            `El médico ${apellido} ${nombre} ha sido dado de alta con la especialidad de ${especialidad}\n` +
            `Teléfono: ${telefono}\n` +
            `Obras sociales aceptadas: ${obraSocial}\n` +
            `Días de atención: ${diasAtencion}`
            let medicos = JSON.parse(localStorage.getItem('medicos')) || [];
            
        );
          formAltaMedico.reset();
}
actualizarTabla();
formAltaMedico.addEventListener('submit', altaMedicos);
