<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Administrar Obras Sociales | Clínica Los Teros</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="CSS/style.css">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet">
</head>

<body class="d-flex flex-column min-vh-100">
  <header>
    <nav class="custom-navbar navbar navbar-expand-lg">
      <div class="container-fluid">
        <a class="navbar-title" href="index.html">
          <h2>Clínica Los Teros</h2>
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item"><a class="nav-link" href="index.html">Inicio</a></li>
            <li class="nav-item"><a class="nav-link" href="institucional.html">Institucional</a></li>
            <li class="nav-item"><a class="nav-link" href="contacto.html">Contacto</a></li>
            <li class="nav-item"><a class="nav-link active" href="admin.html">Administración</a></li>
          </ul>
        </div>
        <div class="collapse navbar-collapse" id="navbarNav2">
          <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
            <li class="nav-item"><button id="salir" class="btn btn-danger btn-sm">Cerrar Sesión</button></li>
          </ul>
        </div>
      </div>
    </nav>
  </header>

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
const porcentajeInput = document.getElementById("porcentaje"); // Campo nuevo agregado
const idInput = document.getElementById("id");

const tablaListado = document.getElementById("tablaListado");
const btnGuardar = document.getElementById("btnGuardar");
const btnCancelar = document.getElementById("btnCancelar");

let editIndex = null;

// --- Mostrar datos en la tabla ---
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
      <td>${obra.porcentaje || 0}%</td> <!-- COLUMNA DE PORCENTAJE -->
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
  const porcentaje = parseFloat(porcentajeInput.value.trim()) || 0; // NUEVO CAMPO

  if (!nombre || !telefono || !direccion || !plan) {
    alert("Por favor, complete todos los campos.");
    return;
  }

  if (editIndex === null) {
    // Alta nueva
    obras.push({ nombre, telefono, direccion, plan, porcentaje });
  } else {
    // Edición
    obras[editIndex] = { nombre, telefono, direccion, plan, porcentaje };
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
    // Reasignar IDs
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
  porcentajeInput.value = obra.porcentaje || 0;

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
  porcentajeInput.value = "";
}

// --- Inicializar ---
mostrarObrasSociales();



