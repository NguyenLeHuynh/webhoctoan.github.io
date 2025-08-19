// routes/admin.js
const express = require('express');
const router = express.Router();
const { User, Question, Attempt } = require('../models');
const { authMiddleware, permit } = require('../middleware/auth');

router.get('/users', authMiddleware, permit('admin'), async (req,res)=>{
  const users = await User.findAll({ attributes: ['id','username','email','role','grade'] });
  res.json(users);
});

router.get('/reports', authMiddleware, permit('admin'), async (req,res)=>{
  const totalUsers = await User.count();
  const totalQuestions = await Question.count();
  const totalAttempts = await Attempt.count();
  res.json({ totalUsers, totalQuestions, totalAttempts });
});

module.exports = router;
