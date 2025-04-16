import jwt from 'jsonwebtoken';

export default function authMiddleware(req, res, next) {
    console.log("%%%% authMiddleware");
  const token = req.cookies.auth;
  if (!token) {
    res.statusCode = 401;
    res.send('Need authentication');
    return;
  }

  try {
    const validity = jwt.verify(token, 'secret');
    const userId = validity.userId;
    req.userId = userId;
    next();
    return;
  } catch (e) {
    console.error(e);
    res.statusCode = 401;
    res.send('Authentication failed\n');
    return;
  }
};