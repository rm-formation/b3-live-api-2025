import express from 'express';
import pokemonRouter from './routers/pokemonRouter.mjs';
import userRouter from './routers/userRouter.mjs';
import jwt from 'jsonwebtoken';
import { loadOne } from './db/dbInterface.mjs';

const app = express();
const port = 3000;

app.use(express.json());

app.get('/secret', async (req, res) => {
  const token = req.headers.auth;
  if (!token) {
    res.statusCode = 401;
    res.send('Need authentication');
  }

  try {
    const validity = jwt.verify(token, 'secret');
    const userId = validity.userId;
    const user = await loadOne('user', userId);
    res.send(`Hello ${user.pseudo}\n`);
  } catch (e) {
    res.statusCode = 401;
    res.send('Authentication failed\n');
  }

  res.send();
});

app.use('/user', userRouter);
app.use('/pokemon', pokemonRouter);

app.listen(port, () => {
  console.log(`PokeVinciAPI listening on port ${port}`);
});
