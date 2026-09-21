document.getElementById('form-cadastro').addEventListener('submit', async function (evento) {
    evento.preventDefault(); // impede a página de recarregar

    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
    const confirmarSenha = document.getElementById('confirmarSenha').value;

    const resposta = await fetch('/api/cadastro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email, senha, confirmarsenha: confirmarSenha })
    });

    const resultado = await resposta.text();
    alert(resultado); // mostra a resposta do servidor (depois trocamos por algo mais bonito na tela)
});