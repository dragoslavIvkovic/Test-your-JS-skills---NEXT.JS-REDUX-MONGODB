import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Index.module.css';
import clientPromise from '../lib/mongodb';

export default function Home({ users }) {
  
  const beginners = users.filter(user => user.level === "beginner");
  const hardcore = users.filter(user => user.level === "hardcore");
  const intermediate  = users.filter(user => user.level === "intermediate");

  console.log(users.filter(x => x.level == "hardcore"  ))
  return (
    <div className={styles.container}>
      <Head>
        <title> </title>
        {/* <link rel='icon' href='/favicon.ico' /> */}
      </Head>
      <main className={styles.leaderBoard}>
        <div>
          {beginners?.map((x) => (
            <p key={x._id}>
              <Image alt="img" src={x.avatar} width={20} height={20} />
              {x.user} : {x.score} : {x.level}
            </p>
          ))}
        </div>
        
        <div>
          {intermediate?.map((x) => (
            <p key={x._id}>
              <Image alt="img" src={x.avatar} width={20} height={20} />
              {x.user} : {x.score} : {x.level}
            </p>
          ))}
        </div>
        <div>
          {hardcore?.map((x) => (
            <p key={x._id}>
              <Image alt="img" src={x.avatar} width={20} height={20} />
              {x.user} : {x.score} : {x.level}
            </p>
          ))}
        </div>
      </main>
      <footer></footer>
    </div>
  );
}

export async function getServerSideProps() {
  const client = await clientPromise;

  const db = client.db("leaderBoard");

  let res = await fetch("http://localhost:3000/api/usersAPI", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  let users = await res.json();

  return {
    props: { users },
  };
}
