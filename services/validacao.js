const { usuarios } = require("../database");

function validar(nome) {
    const usuario = usuarios.find(u => u.nome === nome);
    if (!usuario) {
        return "usuario nao encontrado.";
    }
    usuario.validado = true;
    return "conta validada.";
}

module.exports = validar;