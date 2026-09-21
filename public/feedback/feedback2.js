const formFeedback = document.getElementById('formFeedback');
const resultadoDiv = document.getElementById('resultadoFeedback');

formFeedback.addEventListener('submit', function (event) {
    event.preventDefault();

    const texto = document.getElementById('texto').value.trim();
    const emailUsuario = sessionStorage.getItem('emailFeedback') || '';

    const btnSubmit = formFeedback.querySelector('button[type="submit"]') || formFeedback.querySelector('input[type="submit"]');

    if (texto === '') {
        alert('Escreva algo antes de enviar!');
        return;
    }

    if (texto.length < 5) {
        alert('O feedback precisa ter pelo menos 5 caracteres.');
        return;
    }

    if (btnSubmit) {
        btnSubmit.disabled = true;
        btnSubmit.dataset.originalText = btnSubmit.innerText || btnSubmit.value;
        if (btnSubmit.tagName === 'INPUT') {
            btnSubmit.value = 'Enviando...';
        } else {
            btnSubmit.innerText = 'Enviando...';
        }
    }

    fetch('/api/feedback', {   // ⬅️ ÚNICA LINHA QUE MUDOU (antes era '/enviar-feedback')
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ texto, emailUsuario })
    })
        .then(res => res.json())
        .then(data => {
            if (data.ok) {
                resultadoDiv.innerText = 'Feedback enviado com sucesso.';
                sessionStorage.removeItem('emailFeedback');
                formFeedback.reset();
            } else {
                resultadoDiv.innerText = data.erro || 'Deu erro, tenta de novo.';
            }
        })
        .catch(err => {
            console.error('Erro ao enviar feedback:', err);
            resultadoDiv.innerText = 'Erro ao enviar feedback, tente novamente.';
        })
        .finally(() => {
            if (btnSubmit) {
                btnSubmit.disabled = false;
                if (btnSubmit.tagName === 'INPUT') {
                    btnSubmit.value = btnSubmit.dataset.originalText;
                } else {
                    btnSubmit.innerText = btnSubmit.dataset.originalText;
                }
            }
        });
});