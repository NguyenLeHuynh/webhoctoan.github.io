// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { syncModels } = require('./models');
const authRoutes = require('./routes/auth');
const questionsRoutes = require('./routes/questions');
const quizRoutes = require('./routes/quiz');
const adminRoutes = require('./routes/admin');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/data', express.static('data')); // serve JSON files if needed

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/questions', questionsRoutes);
app.use('/api/v1/quiz', quizRoutes);
app.use('/api/v1/admin', adminRoutes);

// health
app.get('/ping', (req,res)=>res.json({ ok:true }));

const PORT = process.env.PORT || 4000;
(async ()=>{
  await syncModels();
  app.listen(PORT, ()=> console.log(`Server running on http://localhost:${PORT}`));
})();
