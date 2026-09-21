const nodemailer = require('nodemailer');

const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'lulaticospedagogia@gmail.com',
        pass: 'dnwofjipjgkzmini',
    }
});

async function enviarFeedback(texto, emailUsuario) {
    if (!texto || texto.trim().length < 5) {
        return { status: 400, corpo: { ok: false, erro: 'Feedback muito curto.' } };
    }

    try {
        await transport.sendMail({
            from: 'Lulaticos Suporte <lulaticospedagogia@gmail.com>',
            to: 'lulaticospedagogia@gmail.com',
            subject: 'Novo feedback recebido',
            html: `<h1>Novo feedback</h1>
                   <p><strong>De:</strong> ${emailUsuario || 'anônimo'}</p>
                   <p>${texto}</p>`,
            text: texto,
        });

        return { status: 200, corpo: { ok: true } };
    } catch (err) {
        console.error('Erro ao enviar feedback:', err);
        return { status: 500, corpo: { ok: false } };
    }
}

module.exports = { enviarFeedback };