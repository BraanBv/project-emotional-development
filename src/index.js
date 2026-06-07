import 'dotenv/config';
import express from 'express';
import { MongoConfig } from './config/db.js';
import { quizRouter } from './routes/quizzes.js';
import { quizAttemptsRouter } from './routes/quizAttempts.js';
import { categoriesRouter } from './routes/categories.js';

const app = express();

app.use(express.json());

app.use('/api/quizzes', quizRouter);
app.use('/api/attempts', quizAttemptsRouter);
app.use('/api/categories', categoriesRouter);

app.listen(process.env.PORT, async () => {
  console.log(`Sevidor corriendo en el puerto ${process.env.PORT}`);
  await MongoConfig.connect();
});