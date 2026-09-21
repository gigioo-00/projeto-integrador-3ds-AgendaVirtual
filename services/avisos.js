const nodemailer = require('nodemailer');
const { usuarios } = require("../database");

const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'lulaticospedagogia@gmail.com',
        pass: 'dnwofjipjgkzmini',
    }
});

const avisos = [];
let proximoId = 1;

async function enviarEmailsAviso(texto, data, tituloEmail) {
    const responsaveis = usuarios.filter(u => u.role === "responsavel" && u.validado === true);
    console.log(`Enviando para ${responsaveis.length} responsável(is)...`);

    const envios = responsaveis.map(usuario => {
        return transport.sendMail({
            from: 'Lulaticos <lulaticospedagogia@gmail.com>',
            to: usuario.email,
            subject: tituloEmail,
            html: `
                <h1>Olá ${usuario.nome}!</h1>
                <p style="font-weight: 300;">${tituloEmail}</p>
                <p><strong>Data:</strong> ${data || 'não informada'}</p>
                <p>${texto}</p>
            `,
            text: `${tituloEmail} (${data || 'sem data'}): ${texto}`,
        })
        .then(() => console.log('Email enviado para', usuario.email))
        .catch(err => console.error(' Erro ao enviar para', usuario.email, err.message));
    });

    await Promise.all(envios);
    return responsaveis.length;''
}

async function publicarAviso(texto, data) {
    if (!texto || texto.trim() === '') {
        return { status: 400, corpo: { ok: false, erro: 'Texto do aviso é obrigatório.' } };
    }

    const novoAviso = { id: proximoId++, texto, data, criadoEm: new Date() };
    avisos.push(novoAviso);

    const totalEnviados = await enviarEmailsAviso(texto, data, 'Novo aviso pendente!');

    return { status: 200, corpo: { ok: true, aviso: novoAviso, totalEnviados } };
}

function listarAvisos() {
    return avisos;
}

function buscarAvisoPorId(id) {
    return avisos.find(a => a.id === Number(id));
}

async function editarAviso(id, texto, data) {
    const aviso = buscarAvisoPorId(id);
    if (!aviso) {
        return { status: 404, corpo: { ok: false, erro: 'Aviso não encontrado.' } };
    }
    if (!texto || texto.trim() === '') {
        return { status: 400, corpo: { ok: false, erro: 'Texto do aviso é obrigatório.' } };
    }

    aviso.texto = texto;
    aviso.data = data;
    aviso.editadoEm = new Date();

    const totalEnviados = await enviarEmailsAviso(texto, data, 'Um aviso foi atualizado!');

    return { status: 200, corpo: { ok: true, aviso, totalEnviados } };
}

function deletarAviso(id) {
    const index = avisos.findIndex(a => a.id === Number(id));
    if (index === -1) {
        return { status: 404, corpo: { ok: false, erro: 'Aviso não encontrado.' } };
    }
    avisos.splice(index, 1);
    return { status: 200, corpo: { ok: true } };
}

module.exports = { publicarAviso, listarAvisos, buscarAvisoPorId, editarAviso, deletarAviso };