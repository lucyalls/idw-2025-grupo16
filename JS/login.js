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

formLogin.addEventListener('submit', function(event){
    event.preventDefault();

    let usuarioInput = usuario.value.trim();
    let claveInput = clave.value.trim();

    const isUsuario = usuarios.find(
        u => u.usuario === usuarioInput && u.clave === claveInput
    );

    if(isUsuario){
        sessionStorage.setItem("usuarioLogueado", usuarioInput);
        mostrarMensaje(`Hola, ${usuarioInput}`,"success");
        window.location.href = "admin.html";
    } else {
        mostrarMensaje('Datos inválidos', "danger")
    }
})