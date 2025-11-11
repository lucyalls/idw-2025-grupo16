
document.addEventListener('DOMContentLoaded', () => {
    if (!sessionStorage.getItem('token')) {
        alert("Solo puede acceder personal autorizado, por favor inicie sesion");
        window.location.href = '../index.html';
        return;
    }
    const salir = document.getElementById('salir');
    if (salir) {
        salir.addEventListener('click', () => {
            sessionStorage.clear();
            window.location.href = '../index.html';
        })
        
    }
});