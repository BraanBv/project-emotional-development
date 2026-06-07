import { ObjectId } from 'mongodb';
import { MongoConfig } from '../config/db.js';

export async function createQuizAttempt(attemptData) {
  const db = MongoConfig.getDB();
  const attempt = {
    ...attemptData,
    quizId: new ObjectId(attemptData.quizId),
    createdAt: new Date()
  };
  const result = await db.collection('quiz_attempts').insertOne(attempt);
  return { ...attempt, _id: result.insertedId };
}

export async function findAllQuizAttempt(filters = {}) {
  const db = MongoConfig.getDB();
  const query = {};
  if (filters.quizId) query.quizId = new ObjectId(filters.quizId);
  if (filters.resultType) query.resultType = filters.resultType;

  return await db.collection('quiz_attempts').find(query).toArray();
}

export async function findQuizAttemptById(id) {
  const db = MongoConfig.getDB();
  return await db.collection('quiz_attempts').findOne({ _id: new ObjectId(id) });
}

export async function getStatisticsQuizAttempt(quizId) {
  const db = MongoConfig.getDB();
  const stats = await db.collection('quiz_attempts').aggregate([
    { $match: { quizId: new ObjectId(quizId) } },
    {
      $group: {
        _id: '$resultType',
        count: { $sum: 1 },
        averageScore: { $avg: { $sum: Object.values('$scores') } }
      }
    },
    { $sort: { count: -1 } }
  ]).toArray();

  const total = await db.collection('quiz_attempts').countDocuments({ quizId: new ObjectId(quizId) });

  return {
    total,
    results: stats.map(stat => ({
      type: stat._id,
      count: stat.count,
      percentage: ((stat.count / total) * 100).toFixed(2),
      averageScore: stat.averageScore
    }))
  };
}
