document.addEventListener('DOMContentLoaded', async() => {
    const tablaUsuariosBody = document.querySelector('#tablaUsuarios tbody');

    try {
        const response = await fetch('https://dummyjson.com/users');
        if (response.ok) {
            const data = await response.json();
            const usuarios = data.users;

            usuarios.forEach((usuario) => {
                const fila = document.createElement('tr');
                fila.innerHTML = `
                    <td>${usuario.username}</td>
                    <td>${usuario.lastName}</td>
                    <td>${usuario.firstName}</td>
                    <td>${usuario.email}</td>
                    <td>${usuario.phone}</td>
                `;
                tablaUsuariosBody.appendChild(fila);
            });
        } else {
            console.error(response.status);
            throw Error('Error al listar los usuarios');
        }
    } catch (error) {
        console.error(response.status);
        throw Error('Error en DummyJSON');
    }
})