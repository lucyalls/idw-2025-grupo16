// ===============================
// Funciones auxiliares generales
// ===============================
function obtenerDatos(clave) {
  return JSON.parse(localStorage.getItem(clave)) || [];
}

function guardarDatos(clave, lista) {
  localStorage.setItem(clave, JSON.stringify(lista));
}

// --- Detectar qué página está activa ---
const esPaginaAdminObrasSociales = document.getElementById("tablaListado") !== null;
const esPaginaAdminReservas = document.getElementById("tabla-obras-body") !== null;

// ===================================================
// tabla 1: "adminObrasSociales"
// ===================================================
if (esPaginaAdminObrasSociales) {
  const nombreInput = document.getElementById("nombre");
  const telefonoInput = document.getElementById("telefono");
  const direccionInput = document.getElementById("direccion");
  const planInput = document.getElementById("plan");
  const porcentajeInput = document.getElementById("porcentaje");
  const idInput = document.getElementById("id");

  const tablaListado = document.getElementById("tablaListado");
  const btnGuardar = document.getElementById("btnGuardar");
  const btnCancelar = document.getElementById("btnCancelar");

  let editIndex = null;
  const STORAGE_KEY = "obrasSociales";

  function mostrarObrasSociales() {
    const obras = obtenerDatos(STORAGE_KEY);
    tablaListado.innerHTML = "";

    obras.forEach((obra, index) => {
      const fila = document.createElement("tr");
      fila.innerHTML = `
        <td>${obra.id}</td>
        <td>${obra.nombre}</td>
        <td>${obra.direccion}</td>
        <td>${obra.plan}</td>
        <td>${obra.telefono}</td>
        <td>${obra.porcentaje || 0}%</td>
        <td>
          <button class="btn btn-warning btn-sm" onclick="editarObraSocial(${index})">Editar</button>
          <button class="btn btn-danger btn-sm" onclick="eliminarObraSocial(${index})">Eliminar</button>
        </td>
      `;
      tablaListado.appendChild(fila);
    });
  }

  window.editarObraSocial = function(index) {
    const obras = obtenerDatos(STORAGE_KEY);
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
  };

  window.eliminarObraSocial = function(index) {
    const obras = obtenerDatos(STORAGE_KEY);
    if (confirm("¿Seguro que desea eliminar esta obra social?")) {
      obras.splice(index, 1);
      obras.forEach((obra, idx) => (obra.id = idx + 1));
      guardarDatos(STORAGE_KEY, obras);
      mostrarObrasSociales();
    }
  };

  btnGuardar.addEventListener("click", (e) => {
    e.preventDefault();
    const obras = obtenerDatos(STORAGE_KEY);
    const nombre = nombreInput.value.trim();
    const telefono = telefonoInput.value.trim();
    const direccion = direccionInput.value.trim();
    const plan = planInput.value.trim();
    const porcentaje = parseFloat(porcentajeInput.value.trim()) || 0;

    if (!nombre || !telefono || !direccion || !plan) {
      alert("Por favor, complete todos los campos.");
      return;
    }

    if (editIndex === null) {
      obras.push({ nombre, telefono, direccion, plan, porcentaje });
    } else {
      obras[editIndex] = { nombre, telefono, direccion, plan, porcentaje };
      editIndex = null;
      btnCancelar.style.display = "none";
      btnGuardar.textContent = "Guardar";
    }

    obras.forEach((obra, idx) => (obra.id = idx + 1));
    guardarDatos(STORAGE_KEY, obras);
    limpiarFormulario();
    mostrarObrasSociales();
  });

  btnCancelar.addEventListener("click", () => {
    limpiarFormulario();
    editIndex = null;
    btnCancelar.style.display = "none";
    btnGuardar.textContent = "Guardar";
  });

  function limpiarFormulario() {
    if (idInput) idInput.value = "";
    nombreInput.value = "";
    telefonoInput.value = "";
    direccionInput.value = "";
    planInput.value = "";
    porcentajeInput.value = "";
  }

  mostrarObrasSociales();
}

// ===================================================
// tabla 2: "adminReserva"
// ===================================================
if (esPaginaAdminReservas) {
  const form = document.getElementById("form-obra-social");
  const nombreInput = document.getElementById("nombre");
  const porcentajeInput = document.getElementById("porcentaje");
  const tablaBody = document.getElementById("tabla-obras-body");

  let editIndex = null;
  const STORAGE_KEY = "reservas";

  function mostrarReservas() {
    const reservas = obtenerDatos(STORAGE_KEY);
    tablaBody.innerHTML = "";

    reservas.forEach((reserva, index) => {
      const fila = document.createElement("tr");
      fila.innerHTML = `
        <td>${reserva.id}</td>
        <td>${reserva.nombre}</td>
        <td>${reserva.porcentaje || 0}%</td>
        <td>
          <button class="btn btn-warning btn-sm" onclick="editarReserva(${index})">Editar</button>
          <button class="btn btn-danger btn-sm" onclick="eliminarReserva(${index})">Eliminar</button>
        </td>
      `;
      tablaBody.appendChild(fila);
    });
  }

  window.eliminarReserva = function(index) {
    const reservas = obtenerDatos(STORAGE_KEY);
    if (confirm("¿Seguro que desea eliminar esta obra social?")) {
      reservas.splice(index, 1);
      reservas.forEach((r, idx) => (r.id = idx + 1));
      guardarDatos(STORAGE_KEY, reservas);
      mostrarReservas();
    }
  };

  window.editarReserva = function(index) {
    const reservas = obtenerDatos(STORAGE_KEY);
    const reserva = reservas[index];
    nombreInput.value = reserva.nombre;
    porcentajeInput.value = reserva.porcentaje || 0;
    editIndex = index;
  };

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const reservas = obtenerDatos(STORAGE_KEY);
    const nombre = nombreInput.value.trim();
    const porcentaje = parseFloat(porcentajeInput.value.trim()) || 0;

    if (!nombre) {
      alert("Debe ingresar un nombre.");
      return;
    }

    if (editIndex === null) {
      reservas.push({ nombre, porcentaje });
    } else {
      reservas[editIndex].nombre = nombre;
      reservas[editIndex].porcentaje = porcentaje;
      editIndex = null;
    }

    reservas.forEach((r, idx) => (r.id = idx + 1));
    guardarDatos(STORAGE_KEY, reservas);
    form.reset();
    mostrarReservas();
  });

  mostrarReservas();
}


