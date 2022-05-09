import Head from "next/head";
import Link from "next/link";
import QApage from "./QApage";
import styles from "../styles/Qpage.module.css";
import { useSession } from "next-auth/react";
import clientPromise from "../lib/mongodb";
import Image from "next/image";

export default function Home({ users }) {
  return (
    <div className={styles.container}>
      <Head>
        <title> </title>
        {/* <link rel='icon' href='/favicon.ico' /> */}
      </Head>

      <main>
        <div>
          {users?.map((x) => (
            <p key={x._id}>
              <Image alt="img" src={x.avatar} width={20} height={20} />
              {x.user} : {x.score}
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
