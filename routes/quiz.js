// routes/quiz.js
const express = require('express');
const router = express.Router();
const { Question, Attempt } = require('../models');
const { authMiddleware } = require('../middleware/auth');

// Get random questions
router.post('/random', authMiddleware, async (req,res)=>{
  const { grade, count = 20 } = req.body;
  const where = {};
  if(grade && grade !== 'all') where.grade = grade;
  const pool = await Question.findAll({ where });
  if(pool.length < count) return res.status(400).json({ error: 'Not enough questions' });
  // random sample
  const shuffled = pool.sort(()=>0.5-Math.random()).slice(0,count);
  // send only id, question, options (no answer)
  const payload = shuffled.map(q=>({ id: q.id, question: q.question, options: q.options, grade: q.grade, difficulty: q.difficulty }));
  res.json({ quiz: payload });
});

// Submit attempt
router.post('/submit', authMiddleware, async (req,res)=>{
  const { answers /* [{questionId, selected}] */, durationSec, type='quiz' } = req.body;
  const user = req.user;
  // grade optional: derive from first question
  let score = 0;
  for(const a of answers){
    const q = await Question.findByPk(a.questionId);
    if(!q) continue;
    if(String(q.answer) === String(a.selected)) score += 1;
  }
  const attempt = await Attempt.create({
    studentId: user.id,
    type,
    grade: answers.length ? (await Question.findByPk(answers[0].questionId)).grade : null,
    score,
    durationSec: durationSec || 0,
    meta: { answers }
  });
  res.json({ ok: true, attemptId: attempt.id, score });
});

module.exports = router;
