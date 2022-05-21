import clientPromise from '../../lib/mongodb';

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db('leaderBoard');
  switch (req.method) {
    case 'POST': {
      const bodyObject = JSON.parse(req.body);
      const query = { user: bodyObject.user, avatar: bodyObject.avatar, level: bodyObject.level };
      const update = { $set: { score: bodyObject.score } };
      const options = { upsert: true };

      const newScore = await db
        .collection('leaderBoard')
        .findOneAndUpdate(query, update, options);

      res.json(newScore);
      break;
    }
    case 'GET': {
      const users = await db.collection('middle.leaderBoard').find({}).toArray();
      res.json(users);
      break;
    }

    default: {
      // do nothing
    }
  }
}
