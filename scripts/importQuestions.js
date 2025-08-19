// scripts/importQuestions.js
const fs = require('fs');
const path = require('path');
const { sequelize, Question } = require('../models');
const dataPath = path.join(__dirname, '..', 'data', 'questions_500.json');

async function run(){
  await sequelize.sync();
  const raw = fs.readFileSync(dataPath, 'utf8');
  const arr = JSON.parse(raw);
  // Normalize and insert (if id exists skip)
  for(const it of arr){
    await Question.findOrCreate({ where: { question: it.question }, defaults: {
      grade: it.grade || 1,
      difficulty: it.difficulty || 'easy',
      question: it.question,
      options: it.options,
      answer: String(it.answer),
      source: it.source || 'import'
    }});
  }
  console.log('Import finished');
  process.exit(0);
}

run().catch(err=>{ console.error(err); process.exit(1); });
