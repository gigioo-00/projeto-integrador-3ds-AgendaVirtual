const formEmail = document.getElementById('formEmail');

formEmail.addEventListener('submit', function (event) {
    event.preventDefault();

    const email = document.getElementById('email').value.trim();

    if (email === '') {
        alert('Coloca um e-mail antes de continuar!');
        return;
    }

    // guarda o e-mail no navegador pra usar na página 2
    sessionStorage.setItem('emailFeedback', email);

    // vai pra tela de escrever o feedback
    window.location.href = 'feedback2.html';
});