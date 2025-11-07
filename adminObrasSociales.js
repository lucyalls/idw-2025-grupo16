// Cargar datos guardados
let obrasSociales = JSON.parse(localStorage.getItem("obrasSociales")) || [];

const form = document.getElementById("formObraSocial");
const tabla = document.getElementById("tablaObrasSociales");
const nombreInput = document.getElementById("nombreObraSocial");
const codigoInput = document.getElementById("codigoObraSocial");

let idEditando = null;

// Mostrar datos
function mostrarObras() {
    tabla.innerHTML = "";

    if (obrasSociales.length === 0) {
        tabla.innerHTML = `<tr><td colspan="3">No hay datos cargados.</td></tr>`;
        return;
    }

    obrasSociales.forEach((obra, index) => {
        tabla.innerHTML += `
            <tr>
                <td>${obra.codigo}</td>
                <td>${obra.nombre}</td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="editarObra(${index})">Editar</button>
                    <button class="btn btn-danger btn-sm ms-1" onclick="eliminarObra(${index})">Eliminar</button>
                </td>
            </tr>`;
    });
}

// Guardar
form.addEventListener("submit", (e) => {
    e.preventDefault();

    const obra = {
        nombre: nombreInput.value,
        codigo: codigoInput.value
    };

    // Si estamos editando, reemplazamos
    if (idEditando !== null) {
        obrasSociales[idEditando] = obra;
        idEditando = null;
    } else {
        obrasSociales.push(obra);
    }

    localStorage.setItem("obrasSociales", JSON.stringify(obrasSociales));
    form.reset();
    mostrarObras();
});

// Editar
window.editarObra = (index) => {
    const obra = obrasSociales[index];
    nombreInput.value = obra.nombre;
    codigoInput.value = obra.codigo;
    idEditando = index;
};

// Eliminar
window.eliminarObra = (index) => {
    obrasSociales.splice(index, 1);
    localStorage.setItem("obrasSociales", JSON.stringify(obrasSociales));
    mostrarObras();
};

mostrarObras();
