import { 
    obtenerObrasSociales, 
    guardarObrasSociales 
} from './localStorage.js';

const form = document.getElementById("form-obra-social");
const inputId = document.getElementById("obra-social-id");
const inputNombre = document.getElementById("obra-social-nombre");
const inputPorcentaje = document.getElementById("obra-social-porcentaje");
const inputPlan = document.getElementById("obra-social-plan");
const inputDireccion = document.getElementById("obra-social-direccion");
const inputTelefono = document.getElementById("obra-social-telefono");
const tablaBody = document.getElementById("tabla-obras-sociales-body");
const btnGuardar = document.getElementById("btn-guardar");
const btnCancelar = document.getElementById("btn-cancelar");
const formTitulo = document.getElementById("form-titulo");

document.addEventListener('DOMContentLoaded', () => {
    mostrarObrasSociales();
    
    form.addEventListener("submit", handleFormSubmit);
    btnCancelar.addEventListener("click", limpiarFormulario);
});

function mostrarObrasSociales() {
    tablaBody.innerHTML = "";
    const obras = obtenerObrasSociales();

    if (obras.length === 0) {
        tablaBody.innerHTML = '<tr><td colspan="7">No hay Obras Sociales cargadas.</td></tr>';
        return;
    }

    obras.forEach((obra) => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${obra.id}</td>
            <td>${obra.nombre}</td>
            <td>${obra.plan || '-'}</td>
            <td>${obra.telefono || '-'}</td>
            <td>${obra.direccion || '-'}</td>
            <td>${obra.porcentaje || 0}%</td>
            <td>
                <button class="btn btn-warning btn-sm" onclick="window.editarObraSocial(${obra.id})">Editar</button>
                <button class="btn btn-danger btn-sm" onclick="window.eliminarObraSocial(${obra.id})">Eliminar</button>
            </td>
        `;
        tablaBody.appendChild(fila);
    });
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    const id = inputId.value;
    const nombre = inputNombre.value.trim();
    const telefono = inputTelefono.value.trim();
    const direccion = inputDireccion.value.trim();
    const plan = inputPlan.value.trim();
    const porcentaje = parseFloat(inputPorcentaje.value.trim()) || 0;

    if (!nombre || !telefono || !direccion || !plan) {
        alert("Por favor, complete todos los campos (*).");
        return;
    }

    const datosObra = { nombre, telefono, direccion, plan, porcentaje };
    let obras = obtenerObrasSociales();

    if (id) {
        obras = obras.map(o => {
            if (o.id === parseInt(id)) {
                return { ...o, ...datosObra };
            }
            return o;
        });
        alert("Obra Social actualizada.");
    } else {
        const maxId = obras.length > 0 ? Math.max(...obras.map(o => o.id)) : 0;
        obras.push({ id: maxId + 1, ...datosObra });
        alert("Obra Social creada.");
    }
    
    guardarObrasSociales(obras);
    limpiarFormulario();
    mostrarObrasSociales();
}

window.editarObraSocial = function(id) {
    const obras = obtenerObrasSociales();
    const obra = obras.find(o => o.id === id);

    if (!obra) return;

    inputId.value = obra.id;
    inputNombre.value = obra.nombre;
    inputTelefono.value = obra.telefono;
    inputDireccion.value = obra.direccion;
    inputPlan.value = obra.plan;
    inputPorcentaje.value = obra.porcentaje || 0;

    formTitulo.textContent = `Editando Obra Social ID: ${obra.id}`;
    btnGuardar.textContent = "Actualizar";
    btnGuardar.classList.remove('btn-primary');
    btnGuardar.classList.add('btn-success');
    btnCancelar.classList.remove("d-none");
    window.scrollTo(0, 0);
};

window.eliminarObraSocial = function(id) {
    if (confirm("¿Seguro que desea eliminar esta obra social?")) {
        let obras = obtenerObrasSociales();
        obras = obras.filter(o => o.id !== id);
        guardarObrasSociales(obras);
        mostrarObrasSociales();
    }
};

function limpiarFormulario() {
    form.reset();
    inputId.value = "";
    
    formTitulo.textContent = "Registro de nueva Obra Social:";
    btnGuardar.textContent = "Agregar Obra Social";
    btnGuardar.classList.remove('btn-success');
    btnGuardar.classList.add('btn-primary');
    btnCancelar.classList.add("d-none");
}