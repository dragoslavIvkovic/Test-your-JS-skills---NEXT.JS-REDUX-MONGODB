import Head from 'next/head'
import Link from 'next/link'
import QApage from './QApage'
import styles from '../styles/Qpage.module.css'
import {useSession} from 'next-auth/react'


export default function Home ( ) {
  
const {data: session, status} = useSession();

console.log(session.user.name)
  return (
    <div className={styles.container}>
      <Head>
        <title> </title>
        {/* <link rel='icon' href='/favicon.ico' /> */}
      </Head>

      <main>
        <div>
          <Link href='/QApage'>
            <a>QA</a>
          </Link>
          <span>---</span>
          <Link href='/WrongAnswersPage'>
            <a>WrongAnswersPage</a>
          </Link>
        </div>
      </main>

      <footer>
        
      </footer>
    </div>
  )
}
