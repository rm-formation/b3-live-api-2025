import { Router } from "express";
import { loadAll, loadOne, saveOne } from '../db/dbInterface.mjs';
import jwt from 'jsonwebtoken';
import authMiddleware from "../middlewares/auth.mjs";

const pokemonRouter = Router();

pokemonRouter.use(authMiddleware);

pokemonRouter.get('/', async (req, res) => {
  console.log("%%%% pokemonRouter get /")
  res.setHeader('Content-Type', 'application/json');
  const pokemons = await loadAll('pokemon');
  res.send(JSON.stringify(pokemons.filter(p => p.userId === req.userId)));
});

pokemonRouter.get('/:id', async (req, res) => {
  const pokemon = await loadOne('pokemon', req.params.id);
  res.setHeader('Content-Type', 'application/json');
  if (pokemon && pokemon.userId === req.userId) {
    res.send(JSON.stringify(pokemon));
  } else {
    res.statusCode = 404;
    res.send('Not found');
  }
});

pokemonRouter.post('/', async (req, res) => {
  const pokemon = req.body;
  pokemon.userId = req.userId;
  await saveOne('pokemon', pokemon);
  res.send('OK\n');
});

export default pokemonRouter;