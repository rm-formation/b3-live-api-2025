import express from 'express';
import pokemonRouter from './routers/pokemonRouter.mjs';
import userRouter from './routers/userRouter.mjs';
import jwt from 'jsonwebtoken';
import { loadOne } from './db/dbInterface.mjs';
import authMiddleware from './middlewares/auth.mjs';
import path from 'path';
import cookieParser from 'cookie-parser';

const app = express();
const port = 3000;

app.use(express.json());
app.use(cookieParser());

app.use(
  '/public',
  express.static(path.join(import.meta.dirname, 'public'))
);

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Access-Control-Allow-Methods', '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  next();
});

app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    res.send();
    return;
  }
  next();
});

app.get('/secret', authMiddleware, async (req, res) => {
  const userId = req.userId;
  const user = await loadOne('user', userId);
  res.send(`Hello ${user.pseudo}\n`);
});


app.use('/user', userRouter);
app.use('/pokemon', pokemonRouter);

app.listen(port, () => {
  console.log(`PokeVinciAPI listening on port ${port}`);
});
