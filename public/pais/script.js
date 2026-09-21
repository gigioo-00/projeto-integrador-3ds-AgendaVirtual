const token = localStorage.getItem('token');

if (!token) {
    alert('Você precisa fazer login primeiro.');
    window.location.href = '../login/login.html';
}

function pegarDadosDoToken(token) {
    const partes = token.split('.');
    return JSON.parse(atob(partes[1]));
}

const usuario = pegarDadosDoToken(token);
const elementoNome = document.getElementById('nome-usuario');
if (elementoNome) elementoNome.textContent = usuario.nome;

async function carregarAvisos() {
    try {
        const resposta = await fetch('/api/pais/agenda', {
            headers: { 'Authorization': 'Bearer ' + token }
        });

        if (resposta.status === 401 || resposta.status === 403) {
            const erro = await resposta.json();
            alert(erro.erro);
            localStorage.removeItem('token');
            localStorage.removeItem('role');
            window.location.href = '../login/login.html';
            return;
        }

        const dados = await resposta.json();
        desenharCards(dados.avisos);
    } catch (erro) {
        console.error('Erro ao carregar avisos:', erro);
    }
}

function desenharCards(avisos) {
    const container = document.querySelector('.lista-cards');
    container.innerHTML = '';

    if (avisos.length === 0) {
        container.innerHTML = '<p style="text-align:center;">Nenhum aviso publicado ainda.</p>';
        return;
    }

    const LIMITE_CARACTERES = 100;

    avisos.forEach((aviso, index) => {
        const cor = index % 2 === 0 ? 'escuro' : 'claro';
        const texto = aviso.texto;
        const textoEhLongo = texto.length > LIMITE_CARACTERES;

        const card = document.createElement('div');
        card.className = `card-aviso ${cor}`;

        if (textoEhLongo) {
            const resumo = texto.substring(0, LIMITE_CARACTERES).trim() + '...';
            card.innerHTML = `
                <h2 class="data">${aviso.data || 'sem data'}</h2>
                <p class="descricao">${resumo}</p>
                <details>
                    <summary>ler mais</summary>
                    <p>${texto}</p>
                </details>
            `;
        } else {
            card.innerHTML = `
                <h2 class="data">${aviso.data || 'sem data'}</h2>
                <p class="descricao">${texto}</p>
            `;
        }

        container.appendChild(card);
    });
}

carregarAvisos();

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    window.location.href = '../login/login.html';
}