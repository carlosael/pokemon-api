const conexao = require('../conexao');
const jwt = require('jsonwebtoken');
const jwtSecret = require('../jwt_secret');

const listarPokemons = async (req, res) => {
    const { token } = req.body;

    if (!token) {
        return res.status(400).json('O campo token é obrigatório.');
    }

    try {
        jwt.verify(token,jwtSecret);
    } catch (error) {
        return res.status(400).json('O token é inválido');
    }

    try {
        const { rows: pokemons } = await conexao.query('select * from pokemons');

        const pokemonsFormatado = pokemons.map(pokemon => {
            return { ...pokemon, habilidades: pokemon.habilidades.split(", ")}
        })

        return res.status(200).json(pokemonsFormatado);
    } catch (error) {
        return res.status(400).json(error.message)
    }
}

const obterPokemon = async (req, res) => {
    const { id } = req.params;
    const { token } = req.body;

    if (!token) {
        return res.status(400).json('O campo token é obrigatório.');
    }

    try {
        jwt.verify(token,jwtSecret);
    } catch (error) {
        return res.status(400).json('O token é inválido');
    }

    try {
        const pokemon = await conexao.query('select * from pokemons where id = $1', [id]);

        if (pokemon.rowCount === 0) {
            return res.status(404).json('Pokemon não encontrado.')
        }

        return res.status(200).json(pokemon.rows[0]);
    } catch (error) {
        return res.status(400).json(error.message)
    }

}

const cadastrarPokemon = async (req, res) => {
    const { nome, habilidades, imagem, apelido , token } = req.body;

    if (!nome) {
        return res.status(400).json('O campo nome é obrigatório.');
    }

    if (!habilidades) {
        return res.status(400).json('O campo habilidades é obrigatório.');
    }

    if (!imagem) {
        return res.status(400).json('O campo imagem é obrigatório.');
    }

    if (!apelido) {
        return res.status(400).json('O campo apelido é obrigatório.');
    }

    if (!token) {
        return res.status(400).json('O campo token é obrigatório.');
    }

    try {
        jwt.verify(token,jwtSecret);
    } catch (error) {
        return res.status(400).json('O token é inválido');
    }

    try {
        const tokenDecodificado = jwt.verify(token,jwtSecret);

        const query = `insert into pokemons (nome, habilidades, imagem, apelido, usuario_id)
        values ($1, $2, $3, $4, $5)`;

        await conexao.query(query, [nome, habilidades, imagem, apelido, tokenDecodificado.id]);

        return res.status(200).json('Pokemon cadastrado com sucesso.');
    } catch (error) {
        return res.status(400).json(error.message)
    }

    
}

const atualizarPokemon = async (req, res) => {
    const { id } = req.params;
    const { nome, habilidades, imagem, apelido , token } = req.body;

    if (!nome) {
        return res.status(400).json('O campo nome é obrigatório.');
    }

    if (!habilidades) {
        return res.status(400).json('O campo habilidades é obrigatório.');
    }

    if (!imagem) {
        return res.status(400).json('O campo imagem é obrigatório.');
    }

    if (!apelido) {
        return res.status(400).json('O campo apelido é obrigatório.');
    }

    if (!token) {
        return res.status(400).json('O campo token é obrigatório.');
    }

    try {
        jwt.verify(token,jwtSecret);
    } catch (error) {
        return res.status(400).json('O token é inválido');
    }

    try {
        const pokemon = await conexao.query('select * from pokemons where id = $1', [id]);

        if (pokemon.rowCount === 0) {
            return res.status(404).json('Pokemon não encontrado.');
        }

        const query = `update pokemons set 
        nome =$1,
        habilidades = $2,
        imagem = $3,
        apelido = $4
        where id = $5`;

        await conexao.query(query, [nome, habilidades, imagem, apelido, id]);

        return res.status(200).json('Pokemon atualizado com sucesso');
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const excluirPokemon = async (req, res) => {
    const { id } = req.params;

    const { token } = req.body;

    if (!token) {
        return res.status(400).json('O campo token é obrigatório.');
    }

    try {
        jwt.verify(token,jwtSecret);
    } catch (error) {
        return res.status(400).json('O token é inválido');
    }

    try {
        const query = 'select * from pokemons where id=$1';
        const pokemon = await conexao.query(query, [id]);

        if (pokemon.rowCount === 0) {
            return res.status(404).json('Pokemon não encontrado.');
        }

        const secondQuery = 'delete from pokemons where id = $1';
        await conexao.query(secondQuery, [id]);

        return res.status(200).json('O pokemon excluído com sucesso.');
    } catch (error) {
        return res.status(400).json(error.message)
    }
}

module.exports = {
    listarPokemons,
    obterPokemon,
    cadastrarPokemon,
    atualizarPokemon,
    excluirPokemon
}