/* eslint-disable no-case-declarations */
import clientPromise from '../../lib/mongodb';

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db('javascript_questions');
  const { collection } = req.query;
  switch (req.method) {
    case 'GET':
      const questions = await db.collection(collection).find({}).toArray();
      res.json(questions);
      break;

    default:
      console.log('error questions API');
  }
}
