import { Router } from "express";
import { loadAll, loadOne, saveOne } from '../db/dbInterface.mjs';

const pokemonRouter = Router();

pokemonRouter.get('/', async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  const pokemons = await loadAll('pokemon');
  res.send(JSON.stringify(pokemons));
});

pokemonRouter.get('/:id', async (req, res) => {
  const pokemon = await loadOne('pokemon', req.params.id);
  res.setHeader('Content-Type', 'application/json');
  if (pokemon) {
    res.send(JSON.stringify(pokemon));
  } else {
    res.statusCode = 404;
    res.send('Not found');
  }
});

pokemonRouter.post('/', async (req, res) => {
  const pokemon = req.body;
  await saveOne('pokemon', pokemon);
  res.send('OK\n');
});

export default pokemonRouter;