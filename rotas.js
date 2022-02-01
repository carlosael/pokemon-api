const express = require('express');
const usuarios = require('./controladores/usuarios');
const pokemon = require('./controladores/pokemon');
const login = require('./controladores/login');

const rotas = express();

// usuarios
rotas.post('/usuarios', usuarios.cadastrarUsuario);

// login
rotas.post('/login', login.login);

// pokemons
rotas.get('/pokemons', pokemon.listarPokemons);
rotas.get('/pokemons/:id', pokemon.obterPokemon);
rotas.post('/pokemons', pokemon.cadastrarPokemon);
rotas.put('/pokemons/:id', pokemon.atualizarPokemon);
rotas.delete('/pokemon/:id', pokemon.excluirPokemon);

module.exports = rotas;
