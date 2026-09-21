document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Você precisa fazer login primeiro.');
        window.location.href = '../login/login.html';
        return;
    }

    // ===== Pega o ID do aviso pela URL (?id=3) =====
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    if (!id) {
        alert('Nenhum aviso selecionado.');
        window.location.href = './pedagogia.html';
        return;
    }

    const btnEditar = document.getElementById('btn-editar');
    const btnDeletar = document.getElementById('btn-deletar');
    const btnConfirmar = document.getElementById('btn-confirmar');
    const inputData = document.getElementById('data-aviso');
    const textareaConteudo = document.getElementById('texto-aviso');

    // campos começam travados — só liberam ao clicar no lápis
    inputData.setAttribute('disabled', 'true');
    textareaConteudo.setAttribute('disabled', 'true');

    // ===== Carrega os dados do aviso pra preencher a tela =====
    async function carregarAviso() {
        try {
            const resposta = await fetch(`/api/pedagogia/avisos/${id}`, {
                headers: { 'Authorization': 'Bearer ' + token }
            });

            if (!resposta.ok) {
                alert('Aviso não encontrado.');
                window.location.href = './pedagogia.html';
                return;
            }

            const aviso = await resposta.json();
            inputData.value = aviso.data || '';
            textareaConteudo.value = aviso.texto;

        } catch (erro) {
            console.error('Erro ao carregar aviso:', erro);
        }
    }

    carregarAviso();

    // ===== Botão lápis: libera edição =====
    btnEditar.addEventListener('click', () => {
        inputData.removeAttribute('disabled');
        textareaConteudo.removeAttribute('disabled');
        textareaConteudo.focus();
        alert("Modo de edição ativado! Faça suas alterações.");
    });

    // ===== Botão lixeira: apaga o aviso de vez =====
    btnDeletar.addEventListener('click', async () => {
        if (!confirm("Tem certeza que deseja excluir este aviso definitivamente?")) {
            return;
        }

        try {
            const resposta = await fetch(`/api/pedagogia/avisos/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': 'Bearer ' + token }
            });

            const resultado = await resposta.json();

            if (resultado.ok) {
                alert('Aviso excluído com sucesso.');
                window.location.href = './pedagogia.html';
            } else {
                alert(resultado.erro || 'Erro ao excluir o aviso.');
            }
        } catch (erro) {
            console.error('Erro ao excluir aviso:', erro);
            alert('Erro ao excluir o aviso.');
        }
    });

    // ===== Botão check: salva as edições e republica =====
    btnConfirmar.addEventListener('click', async () => {
        const texto = textareaConteudo.value.trim();
        const data = inputData.value;

        if (texto === '') {
            alert('Escreve alguma coisa antes de confirmar!');
            return;
        }

        btnConfirmar.disabled = true;
        btnConfirmar.innerText = 'Salvando...';

        try {
            const resposta = await fetch(`/api/pedagogia/avisos/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
                body: JSON.stringify({ texto, data })
            });

            const resultado = await resposta.json();

            if (resultado.ok) {
                alert('Aviso atualizado e reenviado aos responsáveis!');
                window.location.href = './pedagogia.html';
            } else {
                alert(resultado.erro || 'Erro ao atualizar o aviso.');
            }
        } catch (erro) {
            console.error('Erro ao atualizar aviso:', erro);
            alert('Erro ao publicar as alterações. Tenta de novo.');
        } finally {
            btnConfirmar.disabled = false;
            btnConfirmar.innerHTML = '<i class="bi bi-check-lg"></i>';
        }
    });
});