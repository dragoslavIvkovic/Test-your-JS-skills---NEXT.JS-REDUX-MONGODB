import clientPromise from "../../lib/mongodb";


export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db("javascript_questions");;
  switch (req.method) {
    case "POST":
      let bodyObject = JSON.parse(req.body);
      console.log("bodyObject" ,bodyObject)
const query = { user:bodyObject.user };
const update = { $set:{score:bodyObject.score}};
const options = { upsert: true };
 


         let newScore = await db.collection("leaderboard").findOneAndUpdate( query, update , options );



 

      res.json(newScore);
      break;
    case "GET":
      const users = await db.collection("leaderboard").find({}).toArray();
      res.json(users);
      break;
  }
}