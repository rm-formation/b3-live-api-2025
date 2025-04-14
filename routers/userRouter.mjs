import { Router } from "express";
import { loadAll, loadOne, saveOne } from "../db/dbInterface.mjs";
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

const userRouter = Router();

function hashPassword(password, salt) {
    if (!salt) {
        salt = crypto.randomBytes(32).toString('hex');
    }
    const hashedPassword = (crypto.scryptSync(password, salt, 64)).toString('hex');
    console.log({password, salt, hashedPassword});
    return { hashedPassword, salt };
}

userRouter.post('/signup', async (req, res) => {
    const user = req.body;
    const usersArray = await loadAll('user');
    const pseudoIsTaken = usersArray.find(item => item.pseudo === user.pseudo);
    if (pseudoIsTaken) {
        res.statusCode = 400;
        res.send('Ce pseudo est déjà utilisé');
    } else {
        const passwordHash = hashPassword(user.password);
        delete user.password;
        user.passwordHash = `${passwordHash.hashedPassword}:${passwordHash.salt}`;
        await saveOne('user', user);
        res.send();
    }
});

userRouter.post('/signin', async (req, res) => {
    const { pseudo, password } = req.body;
    const users = await loadAll('user');
    const userInDB = users.find(item => item.pseudo === pseudo);
    if (!userInDB) {
        res.statusCode = 400;
        res.send();
    }
    const [ hashedPasswordInDB, salt ] = userInDB.passwordHash.split(':');
    const inputPasswordHash = hashPassword(password, salt).hashedPassword;
    if (inputPasswordHash === hashedPasswordInDB) {
        const token = jwt.sign({
            userId: userInDB.id
        }, 'secret', { expiresIn: '1h' });
        res.send(token);
    } else {
        res.statusCode = 401;
        res.send('Authentication failed');
    }
});

userRouter.post('/signout', (req, res) => {

});

export default userRouter;