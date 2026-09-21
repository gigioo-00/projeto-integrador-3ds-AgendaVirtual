const bcrypt = require('bcrypt');
const { usuarios } = require("../database");

const EMAIL_PEDAGOGIA = "lulaticospedagogia@gmail.com";

async function cadastrar(nome, email, senha, confirmarsenha) {
    if (!nome || !email || !senha || !confirmarsenha) {
        return "preencha todos os campos.";
    }
    if (senha !== confirmarsenha) {
        return "as senhas nao coincidem.";
    }
    const existe = usuarios.find(u => u.nome === nome || u.email === email);
    if (existe) {
        return "usuarios ja cadastrado.";
    }

    const senhaCriptografada = await bcrypt.hash(senha, 10);
    const role = (email === EMAIL_PEDAGOGIA) ? "pedagogia" : "responsavel";

    usuarios.push({
        nome,
        email,
        senha: senhaCriptografada,
        role,
        validado: false
    });

    return "cadastro realizado com sucesso.";
}

module.exports = cadastrar;