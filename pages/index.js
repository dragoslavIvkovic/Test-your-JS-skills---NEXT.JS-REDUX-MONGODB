import Head from 'next/head'
import Link from 'next/link'
import QApage from './QApage'
import styles from '../styles/Qpage.module.css'
import { useSession } from 'next-auth/react'
import useSWR from 'swr'

export default function Home () {
  const fetcher = (...args) => fetch(...args).then(res => res.json())
  // const {data: session, status} = useSession();

  const { data, error } = useSWR(`/api/leaderBoardApi`, fetcher)
 
  return (
    <div className={styles.container}>
      <Head>
        <title> </title>
        {/* <link rel='icon' href='/favicon.ico' /> */}
      </Head>

      <main>
        <div>
          {data?.map(x => (
            <p key={x._id}>
              {x.name} : {x.SCORE}
            </p>
          ))}
        </div>
      </main>

      <footer></footer>
    </div>
  )
}
