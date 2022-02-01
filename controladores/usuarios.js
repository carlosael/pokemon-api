const conexao = require('../conexao');
const securePassword = require('secure-password');

const pwd = securePassword();

const cadastrarUsuario = async (req,res) => {
    const { nome, email , senha } = req.body;

    if (!nome) {
        return res.status(400).json('O campo nome é obrigatório.');
    }

    if (!email) {
        return res.status(400).json('O campo email é obrigatório.');
    }

    if (!senha) {
        return res.status(400).json('O campo senha é obrigatório.');
    }

    try {
        const query = `select * from usuarios where email = $1`;
        const usuarioCadastrado = await conexao.query(query, [email]);

        if (usuarioCadastrado.rowCount > 0) {
            return res.status(404).json('Esse email já foi cadastrado.');
        }
    } catch (error) {
        return res.status(400).json(error.message);
    }

    try {
        const hash = (await pwd.hash(Buffer.from(senha))).toString('hex');
        const query = 'insert into usuarios (nome, email, senha) values ($1, $2, $3)';
        await conexao.query(query, [nome, email, hash]);


        return res.status(200).json('Usuário cadastrado com sucesso.');
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

module.exports = {
    cadastrarUsuario
}

