document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Você precisa fazer login primeiro.');
        window.location.href = '../login/login.html';
        return;
    }

    const btnConfirmar = document.getElementById('btn-confirmar');
    const btnDeletar = document.getElementById('btn-deletar');
    const inputData = document.getElementById('data-aviso');
    const textareaConteudo = document.getElementById('texto-aviso');

    btnDeletar.addEventListener('click', () => {
        if (confirm("Tem certeza que deseja limpar o conteúdo deste aviso?")) {
            inputData.value = '';
            textareaConteudo.value = '';
        }
    });

    btnConfirmar.addEventListener('click', () => {
        const texto = textareaConteudo.value.trim();
        const data = inputData.value;

        if (texto === '') {
            alert('Escreve alguma coisa antes de confirmar!');
            return;
        }

        btnConfirmar.disabled = true;
        btnConfirmar.innerText = 'Enviando...';

        fetch('/api/pedagogia/avisos', {   // ⬅️ ESSA É A LINHA QUE PRECISA MUDAR
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({ texto, data })
        })
        .then(res => res.json())
        .then(resposta => {
            if (resposta.ok) {
                alert("Aviso salvo e e-mails enviados com sucesso!");
                window.location.href = './pedagogia.html';
            } else {
                alert(resposta.erro || "Aviso salvo, mas houve um problema ao enviar os e-mails.");
            }
        })
        .catch(err => {
            console.error('Erro ao notificar por email:', err);
            alert("Erro ao publicar o aviso. Tenta de novo.");
        })
        .finally(() => {
            btnConfirmar.disabled = false;
            btnConfirmar.innerHTML = '<i class="bi bi-check-lg"></i>';
        });
    });
});