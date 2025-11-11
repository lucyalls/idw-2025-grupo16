// --- Funciones auxiliares para manejar localStorage ---
function obtenerObrasSociales() {
  return JSON.parse(localStorage.getItem("obrasSociales")) || [];
}

function guardarObrasSociales(lista) {
  localStorage.setItem("obrasSociales", JSON.stringify(lista));
}

// --- Referencias a elementos del DOM ---
const nombreInput = document.getElementById("nombre");
const telefonoInput = document.getElementById("telefono");
const direccionInput = document.getElementById("direccion");
const planInput = document.getElementById("plan");
const idInput = document.getElementById("id");

const tablaListado = document.getElementById("tablaListado");
const btnGuardar = document.getElementById("btnGuardar");
const btnCancelar = document.getElementById("btnCancelar");

let editIndex = null;

// --- Mostrar datos en la segunda tabla ---
function mostrarObrasSociales() {
  const obras = obtenerObrasSociales();
  tablaListado.innerHTML = "";

  obras.forEach((obra, index) => {
    const fila = document.createElement("tr");

    fila.innerHTML = `
      <td>${obra.id}</td>
      <td>${obra.nombre}</td>
      <td>${obra.direccion}</td>
      <td>${obra.plan}</td>
      <td>${obra.telefono}</td>
      <td>
        <button class="btn btn-warning btn-sm" onclick="editarObraSocial(${index})">Editar</button>
        <button class="btn btn-danger btn-sm" onclick="eliminarObraSocial(${index})">Eliminar</button>
      </td>
    `;

    tablaListado.appendChild(fila);
  });
}

// --- Guardar o editar datos ---
btnGuardar.addEventListener("click", (e) => {
  e.preventDefault();

  const obras = obtenerObrasSociales();

  const nombre = nombreInput.value.trim();
  const telefono = telefonoInput.value.trim();
  const direccion = direccionInput.value.trim();
  const plan = planInput.value.trim();

  if (!nombre || !telefono || !direccion || !plan) {
    alert("Por favor, complete todos los campos.");
    return;
  }

  if (editIndex === null) {
    obras.push({ nombre, telefono, direccion, plan }); // Alta sin ID
  } else {
    obras[editIndex] = { nombre, telefono, direccion, plan }; // Edita sin ID
    editIndex = null;
    btnCancelar.style.display = "none";
    btnGuardar.textContent = "Guardar";
  }

  // Reasignar IDs secuenciales
  obras.forEach((obra, idx) => {
    obra.id = idx + 1;
  });

  guardarObrasSociales(obras);
  limpiarFormulario();
  mostrarObrasSociales();
});

// --- Eliminar obra social ---
function eliminarObraSocial(index) {
  const obras = obtenerObrasSociales();
  if (confirm("¿Seguro que desea eliminar esta obra social?")) {
    obras.splice(index, 1);
    // Reasignar IDs secuenciales después de eliminar
    obras.forEach((obra, idx) => {
      obra.id = idx + 1;
    });
    guardarObrasSociales(obras);
    mostrarObrasSociales();
  }
}

// --- Editar obra social ---
function editarObraSocial(index) {
  const obras = obtenerObrasSociales();
  const obra = obras[index];

  if (idInput) idInput.value = obra.id;
  nombreInput.value = obra.nombre;
  telefonoInput.value = obra.telefono;
  direccionInput.value = obra.direccion;
  planInput.value = obra.plan;

  editIndex = index;
  btnCancelar.style.display = "inline";
  btnGuardar.textContent = "Actualizar";
}

// --- Cancelar edición ---
btnCancelar.addEventListener("click", () => {
  limpiarFormulario();
  editIndex = null;
  btnCancelar.style.display = "none";
  btnGuardar.textContent = "Guardar";
});

// --- Limpiar formulario ---
function limpiarFormulario() {
  if (idInput) idInput.value = "";
  nombreInput.value = "";
  telefonoInput.value = "";
  direccionInput.value = "";
  planInput.value = "";
}

// --- Inicializar ---
mostrarObrasSociales();

