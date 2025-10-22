import { obtenerMedicos, guardarMedicos } from './localStorage.js';

const formAltaMedico = document.getElementById('altaMedicosForm');
const apellidoInput = document.getElementById('apellido');
const nombreInput = document.getElementById('nombre');
const especialidadInput = document.getElementById('especialidad');
const telefonoInput = document.getElementById('telefono');
const diasAtencionInput = document.getElementById('dias-atencion');
const obraSocialInput = document.getElementById('obra-social')

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
        );

        formAltaMedico.reset();
}

formAltaMedico.addEventListener('submit', altaMedicos);