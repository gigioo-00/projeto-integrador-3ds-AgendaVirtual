const jwt = require("jsonwebtoken");
const SEGREDO = "nossa_chave_super_hiper_mega_secreta";

function permitirApenas(...rolesPermitidas) {
    return function (req, res, next) {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ erro: "token nao fornecido." });
        }

        const token = authHeader.split(" ")[1];

        try {
            const dados = jwt.verify(token, SEGREDO);
            if (!rolesPermitidas.includes(dados.role)) {
                return res.status(403).json({ erro: "acesso negado para essa role." });
            }
            req.usuario = dados;
            next();
        } catch (erro) {
            return res.status(401).json({ erro: "token invalido ou expirado." });
        }
    };
}

module.exports = permitirApenas;