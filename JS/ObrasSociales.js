// --- Funciones auxiliares para manejar localStorage ---
function obtenerObrasSociales() {
  return JSON.parse(localStorage.getItem("obrasSociales")) || [];
}

function guardarObrasSociales(lista) {
  localStorage.setItem("obrasSociales", JSON.stringify(lista));
}

// --- Referencias a elementos del DOM ---
const form = document.getElementById("formObraSocial");
const nombreInput = document.getElementById("nombre");
const telefonoInput = document.getElementById("telefono");
const direccionInput = document.getElementById("direccion");
const planInput = document.getElementById("plan");
const tablaBody = document.getElementById("tablaObrasSociales");
const btnCancelar = document.getElementById("btnCancelar");

let editIndex = null;

// --- Mostrar datos ---
function mostrarObrasSociales() {
  const obras = obtenerObrasSociales();
  tablaBody.innerHTML = "";

  obras.forEach((obra, index) => {
    const fila = document.createElement("tr");

    fila.innerHTML = `
      <td>${obra.nombre}</td>
      <td>${obra.telefono}</td>
      <td>${obra.direccion}</td>
      <td>${obra.plan}</td>
      <td>
        <button onclick="editarObraSocial(${index})">Editar</button>
        <button onclick="eliminarObraSocial(${index})">Eliminar</button>
      </td>
    `;

    tablaBody.appendChild(fila);
  });
}

// --- Agregar o editar ---
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const nombre = nombreInput.value.trim();
  const telefono = telefonoInput.value.trim();
  const direccion = direccionInput.value.trim();
  const plan = planInput.value.trim();

  if (!nombre || !telefono || !direccion || !plan) {
    alert("Por favor, complete todos los campos.");
    return;
  }

  const obras = obtenerObrasSociales();

  const nuevaObra = { nombre, telefono, direccion, plan };

  if (editIndex === null) {
    obras.push(nuevaObra); // Alta
  } else {
    obras[editIndex] = nuevaObra; // Edición
    editIndex = null;
    btnCancelar.style.display = "none";
  }

  guardarObrasSociales(obras);
  form.reset();
  mostrarObrasSociales();
});

// --- Eliminar ---
function eliminarObraSocial(index) {
  const obras = obtenerObrasSociales();
  if (confirm("¿Seguro que desea eliminar esta obra social?")) {
    obras.splice(index, 1);
    guardarObrasSociales(obras);
    mostrarObrasSociales();
  }
}

// --- Editar ---
function editarObraSocial(index) {
  const obras = obtenerObrasSociales();
  const obra = obras[index];

  nombreInput.value = obra.nombre;
  telefonoInput.value = obra.telefono;
  direccionInput.value = obra.direccion;
  planInput.value = obra.plan;

  editIndex = index;
  btnCancelar.style.display = "inline";
}

// --- Cancelar edición ---
btnCancelar.addEventListener("click", () => {
  form.reset();
  editIndex = null;
  btnCancelar.style.display = "none";
});

// --- Inicializar ---
mostrarObrasSociales();

