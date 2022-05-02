import Head from 'next/head'
import Link from 'next/link'
import QApage from './QApage'
import styles from '../styles/Qpage.module.css'
import { useSession } from 'next-auth/react'
import clientPromise from "../lib/mongodb";

export default function Home ({users}) {
  // const fetcher = (...args) => fetch(...args).then(res => res.json())
  // // const {data: session, status} = useSession();

  // const { data, error } = useSWR(`/api/leaderBoardApi`, fetcher)
 console.log(users)
  return (
    <div className={styles.container}>
      <Head>
        <title> </title>
        {/* <link rel='icon' href='/favicon.ico' /> */}
      </Head>

      <main>
        <div>
          {users?.map(x => (
            <p key={x._id}>
              {x.user} : {x.score}
            </p>
          ))}
        </div>
      </main>

      <footer></footer>
    </div>
  )
}

export async function getServerSideProps( ) {
 const client = await clientPromise;

  const db = client.db("javascript_questions");
 


let res = await fetch("http://localhost:3000/api/usersAPI", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  let users = await res.json();

  return {
    props: {  users },
  };
}