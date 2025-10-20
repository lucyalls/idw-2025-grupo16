const formAltaMedico = document.getElementById('altaMedicosForm');
const apellidoInput = document.getElementById('apellido');
const nombreInput = document.getElementById('nombre');
const especialidadInput = document.getElementById('especialidad');

function altaMedicos(event) {

        event.preventDefault();

        let apellido = apellidoInput.value.trim();
        let nombre = nombreInput.value.trim();
        let especialidad = especialidadInput.value.trim();

        if (!nombre || !apellido || !especialidad) {
            alert('Completar los campos obligatorios');
            return;
        }
        alert( `El médico ${apellido} ${nombre} ha sido dado de alta con la especialidad de ${especialidad}` );

        formAltaMedico.reset();
}


formAltaMedico.addEventListener('submit', altaMedicos);