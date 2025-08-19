// routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { SECRET } = require('../middleware/auth');

router.post('/register', async (req,res)=>{
  const { username, email, password, role, grade } = req.body;
  if(!username || !password) return res.status(400).json({ error: 'Missing fields' });
  const exists = await User.findOne({ where: { username } });
  if(exists) return res.status(400).json({ error: 'Username taken' });
  const hash = await bcrypt.hash(password, 10);
  const u = await User.create({ username, email, passwordHash: hash, role: role||'student', grade: grade||null });
  const token = jwt.sign({ id: u.id, role: u.role }, SECRET, { expiresIn: '7d' });
  res.json({ token, user: { id:u.id, username:u.username, role:u.role, grade:u.grade } });
});

router.post('/login', async (req,res)=>{
  const { username, password } = req.body;
  if(!username || !password) return res.status(400).json({ error: 'Missing fields' });
  const u = await User.findOne({ where: { username } });
  if(!u) return res.status(400).json({ error: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, u.passwordHash);
  if(!ok) return res.status(400).json({ error: 'Invalid credentials' });
  const token = jwt.sign({ id: u.id, role: u.role }, SECRET, { expiresIn: '7d' });
  res.json({ token, user: { id:u.id, username:u.username, role:u.role, grade:u.grade } });
});

module.exports = router;
