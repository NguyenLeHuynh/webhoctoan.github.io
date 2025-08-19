// middleware/auth.js
const jwt = require('jsonwebtoken');
const { User } = require('../models');
require('dotenv').config();
const SECRET = process.env.JWT_SECRET || 'secret_dev_key';

async function authMiddleware(req, res, next){
  const h = req.headers.authorization;
  if(!h) return res.status(401).json({ error: 'No token' });
  const token = h.split(' ')[1];
  try {
    const payload = jwt.verify(token, SECRET);
    req.user = await User.findByPk(payload.id);
    next();
  } catch (err) { return res.status(401).json({ error: 'Invalid token' }); }
}

function permit(...roles){
  return (req, res, next) => {
    if(!req.user) return res.status(401).json({ error: 'Unauthorized' });
    if(!roles.includes(req.user.role)) return res.status(403).json({ error: 'Forbidden' });
    next();
  };
}

module.exports = { authMiddleware, permit, SECRET };
