import { Router } from "express";
import { loadAll, loadOne, saveOne } from "../db/dbInterface.mjs";
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import authMiddleware from "../middlewares/auth.mjs";
import envVars from "../envVars.mjs";

const userRouter = Router();

function hashPassword(password, salt) {
    if (!salt) {
        salt = crypto.randomBytes(32).toString('hex');
    }
    const hashedPassword = (crypto.scryptSync(password, salt, 64)).toString('hex');
    return { hashedPassword, salt };
}

userRouter.get('/checkConnection', authMiddleware, async (req, res) => {
    res.send();
});

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
    console.log("signin");
    const { pseudo, password } = req.body;
    const users = await loadAll('user');
    console.log("users", users);
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
        }, envVars.secretJWT, { expiresIn: '1h' });
        res.cookie('auth', token, {
            secure: true,
            httpOnly: true
        });
        // res.setHeader('Set-Cookie', `auth=${token}; Path=/`);
        res.send();
    } else {
        res.statusCode = 401;
        res.send('Authentication failed');
    }
});

userRouter.post('/signout', (req, res) => {
    res.cookie('auth', '');
    res.send();
});

export default userRouter;