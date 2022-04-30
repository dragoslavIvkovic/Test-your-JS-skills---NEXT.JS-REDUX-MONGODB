import { connectToDatabase } from "../../lib/mongodb";

export default async function handler (req, res)   {
  const { db } = await connectToDatabase();
 

  const users = await db
   .collection("sorts")
    .find({})
     
    .limit(20)
    .toArray();

  res.json(users);
};


