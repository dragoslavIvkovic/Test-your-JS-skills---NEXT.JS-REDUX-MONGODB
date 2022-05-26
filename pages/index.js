import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Elements.module.css";
import clientPromise from "../lib/mongodb";

export default function Home({ users }) {
  const beginners = users.filter((user) => user.level === "beginner");
  const hardcore = users.filter((user) => user.level === "hardcore");
  const intermediate = users.filter((user) => user.level === "intermediate");

  console.log(users.filter((x) => x.level == "hardcore"));
  return (
    <div className={styles.containerIndex}>
      <Head>
        <title> </title>
        {/* <link rel='icon' href='/favicon.ico' /> */}
      </Head>
      <main className={styles.leaderBoard}>
        <div className={styles.levelContainer}>
          <p className={styles.levelTitle}>beginners</p>
          {beginners?.map((x) => (
            <div className={styles.containerUser}>
              <Image alt="img" src={x.avatar} width={20} height={20} />
              <p key={x._id} className={styles.level}>
                {x.user} 
              </p>
              <p key={x._id} className={styles.score}>
                  {x.score}
              </p>
            </div>
          ))}
        </div>

        <div className={styles.levelContainer}>
          <p className={styles.levelTitle}>intermediate</p>
          {intermediate?.map((x) => (
            <div className={styles.containerUser}>
              <Image alt="img" src={x.avatar} width={20} height={20} />
              <p key={x._id} className={styles.level}>
                {x.user} 
              </p>
              <p key={x._id} className={styles.score}>
                  {x.score}
              </p>
            </div>
          ))}
        </div>
        <div className={styles.levelContainer}>
          <p className={styles.levelTitle}>hardcore</p>
           {hardcore?.map((x) => (
            <div className={styles.containerUser}>
              <Image alt="img" src={x.avatar} width={20} height={20} />
              <p key={x._id} className={styles.level}>
                {x.user} 
              </p>
              <p key={x._id} className={styles.score}>
                  {x.score}
              </p>
            </div>
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
