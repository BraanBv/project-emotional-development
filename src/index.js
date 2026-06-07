import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { MongoConfig } from './config/db.js';
import { quizRouter } from './routes/quizzes.js';
import { quizAttemptsRouter } from './routes/quizAttempts.js';
import { categoriesRouter } from './routes/categories.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/quiz', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'quiz.html'));
});

app.get('/results', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'results.html'));
});

app.use('/api/quizzes', quizRouter);
app.use('/api/attempts', quizAttemptsRouter);
app.use('/api/categories', categoriesRouter);

app.listen(process.env.PORT, async () => {
  console.log(`Sevidor corriendo en el puerto ${process.env.PORT}`);
  await MongoConfig.connect();
});