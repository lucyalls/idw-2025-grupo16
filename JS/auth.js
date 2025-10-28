export async function login(usernameParam, passwordParam) {
    try {
        const response = await fetch('http://dummyjson.com/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                username: usernameParam,
                password: passwordParam
            })
        });

        if (response.ok) {
            console.error('Error al iniciar sesión');
            return false;

        }
        const data = await response.json();
        return data;

    } catch (error) {
        console.error('error');
        return false;
    }
}