document.getElementById('form-login').addEventListener('submit', async function (evento) {
    evento.preventDefault();

    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    const resposta = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha })
    });

    const resultado = await resposta.json();

    if (resultado.token) {
        localStorage.setItem('token', resultado.token);
        localStorage.setItem('role', resultado.role);

        if (resultado.role === 'pedagogia') {
            window.location.href = '../pedagogia/pedagogia.html';
        } else {
            window.location.href = '../pais/agenda.html'; // ⬅️ ajuste pro nome real do seu arquivo
        }
    } else {
        alert(resultado.erro);
    }
});