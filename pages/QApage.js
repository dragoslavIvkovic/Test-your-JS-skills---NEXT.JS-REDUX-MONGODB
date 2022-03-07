import { connectToDatabase } from "../util/mongodb";

export default function Questions({ questions }) {
  return (
    <div>
      <h1>Top 20 Movies of All Time</h1>
      <p>
        <small>(According to Metacritic)</small>
      </p>
      <ul>
        {questions.map((x) => (
          <li key={x.id}>
            <h2>{x.questionText}</h2>
           
          </li>
        ))}
      </ul>
    </div>
  );
}

export async function getStaticProps() {
  const { db } = await connectToDatabase();

  const questions = await db
    .collection("questions")
    .find({})
    .sort({ metacritic: -1 })
    .limit(20)
    .toArray();

  return {
    props: {
      questions: JSON.parse(JSON.stringify(questions)),
    },
  };
}