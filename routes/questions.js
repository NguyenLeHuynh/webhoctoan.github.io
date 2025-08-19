// routes/questions.js
const express = require('express');
const router = express.Router();
const { Question } = require('../models');
const multer = require('multer');
const upload = multer({ dest: 'tmp/' });
const csvParse = require('csv-parse/lib/sync');

// List & filter
router.get('/', async (req,res)=>{
  const { grade, q } = req.query;
  const where = {};
  if(grade) where.grade = grade;
  if(q) where.question = { [require('sequelize').Op.like]: `%${q}%` };
  const list = await Question.findAll({ where, limit: 1000 });
  res.json(list);
});

// Create
router.post('/', async (req,res)=>{
  const { grade, difficulty, question, options, answer, source } = req.body;
  const q = await Question.create({ grade, difficulty, question, options, answer, source });
  res.json(q);
});

// Bulk import via file (admin)
router.post('/import', upload.single('file'), async (req,res)=>{
  const file = req.file;
  if(!file) return res.status(400).json({ error: 'Missing file' });
  const content = require('fs').readFileSync(file.path, 'utf8');
  let imported = [];
  try {
    if(file.originalname.endsWith('.json')){
      imported = JSON.parse(content);
    } else {
      const rows = csvParse(content, { columns: true });
      imported = rows.map(r=>({
        grade: Number(r.grade), difficulty: r.difficulty, question: r.question,
        options: [r.option1,r.option2,r.option3,r.option4], answer: r.answer, source: r.source
      }));
    }
    // bulk create
    await Question.bulkCreate(imported);
    res.json({ ok: true, imported: imported.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Import failed', details: err.message });
  }
});

module.exports = router;
