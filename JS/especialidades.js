function obtenerEspecialidades() {
  return JSON.parse(localStorage.getItem("especialidades")) || [];
}

function guardarEspecialidades(especialidades) {
  localStorage.setItem("especialidades", JSON.stringify(especialidades));
}

function mostrarEspecialidades() {
  const tabla = document.getElementById("tablaEspecialidades");
  const especialidades = obtenerEspecialidades();

  tabla.innerHTML = "";

  especialidades.forEach((esp) => {
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${esp.id}</td>
      <td>${esp.nombre}</td>
      <td>${esp.descripcion}</td>
      <td>
        <button class="btn btn-sm btn-warning" onclick="editarEspecialidad(${esp.id})">Editar</button>
        <button class="btn btn-sm btn-danger" onclick="eliminarEspecialidad(${esp.id})">Eliminar</button>
      </td>
    `;
    tabla.appendChild(fila);
  });
}

document.getElementById("formEspecialidad").addEventListener("submit", (e) => {
  e.preventDefault();

  const nombre = document.getElementById("nombre").value.trim();
  const descripcion = document.getElementById("descripcion").value.trim();

  if (nombre === "" || descripcion === "") {
    alert("Por favor completá todos los campos.");
    return;
  }

  const especialidades = obtenerEspecialidades();
  const id = especialidades.length > 0 ? especialidades[especialidades.length - 1].id + 1 : 1;

  especialidades.push({ id, nombre, descripcion });
  guardarEspecialidades(especialidades);

  document.getElementById("formEspecialidad").reset();
  mostrarEspecialidades();
});

function eliminarEspecialidad(id) {
  if (!confirm("¿Seguro que querés eliminar esta especialidad?")) return;

  const especialidades = obtenerEspecialidades().filter((esp) => esp.id !== id);
  guardarEspecialidades(especialidades);
  mostrarEspecialidades();
}

function editarEspecialidad(id) {
  const especialidades = obtenerEspecialidades();
  const especialidad = especialidades.find((esp) => esp.id === id);

  if (!especialidad) return;

  document.getElementById("nombre").value = especialidad.nombre;
  document.getElementById("descripcion").value = especialidad.descripcion;

  const boton = document.querySelector("#formEspecialidad button");
  boton.textContent = "Guardar Cambios";
  boton.onclick = function (e) {
    e.preventDefault();
    guardarEdicion(id);
  };
}

function guardarEdicion(id) {
  const nombre = document.getElementById("nombre").value.trim();
  const descripcion = document.getElementById("descripcion").value.trim();

  if (nombre === "" || descripcion === "") {
    alert("Por favor completá todos los campos.");
    return;
  }

  const especialidades = obtenerEspecialidades().map((esp) => {
    if (esp.id === id) {
      return { ...esp, nombre, descripcion };
    }
    return esp;
  });

  guardarEspecialidades(especialidades);
  mostrarEspecialidades();

  document.getElementById("formEspecialidad").reset();
  const boton = document.querySelector("#formEspecialidad button");
  boton.textContent = "Agregar Especialidad";
  boton.onclick = null;
}

document.addEventListener("DOMContentLoaded", mostrarEspecialidades);
