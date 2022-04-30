import { connectToDatabase } from "../../lib/mongodb";

export default async function handler (req, res)   {
  const { db } = await connectToDatabase();
  const collection = req.query.collection;

  const questions = await db
   .collection(collection)
    .find({})
    .sort({ metacritic: -1 })
    .limit(20)
    .toArray();

  res.json(questions);
};