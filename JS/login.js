import { login } from "JS/auth.js";
const formLogin = document.getElementById('formLogin');
const usuario = document.getElementById('usuario');
const clave = document.getElementById('clave');
const mensaje = document.getElementById('mensaje');

function mostrarMensaje(texto, tipo = "danger"){
    mensaje.innerHTML = `
        <div class="col-md-6 col-lg-4">
            <div class="alert alert-${tipo}">${texto}</div>
        </div>`;
}

formLogin.addEventListener('submit', async function(event){
    event.preventDefault();

    let usuarioInput = usuario.value.trim();
    let claveInput = clave.value.trim();

    const isUsuario = await login(usuarioInput, claveInput);

    if(isUsuario){
        sessionStorage.setItem("usuarioLogueado", isUsuario.username);
        sessionStorage.setItem("token", isUsuario.accessToken);
        mostrarMensaje(`Hola, ${usuarioInput}`,"success");
        window.location.href = "admin.html";
    } else {
        mostrarMensaje('Datos inválidos', "danger")
    }
})