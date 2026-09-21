const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { usuarios } = require("../database");

const SEGREDO = "nossa_chave_super_hiper_mega_secreta";

async function login(email, senha) {
    const usuario = usuarios.find(u => u.email === email);
    if (!usuario) {
        return { erro: "usuario ou senha incorretos." };
    }

    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
    if (!senhaCorreta) {
        return { erro: "usuario ou senha incorretos." };
    }

    if (!usuario.validado) {
        return { erro: "conta ainda nao validada." };
    }

    const token = jwt.sign(
        { nome: usuario.nome, email: usuario.email, role: usuario.role },
        SEGREDO,
        { expiresIn: '2h' }
    );

    return {
        mensagem: "login realizado com sucesso!",
        token: token,
        role: usuario.role
    };
}

module.exports = login;