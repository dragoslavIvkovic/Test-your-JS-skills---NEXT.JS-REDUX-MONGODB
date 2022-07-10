import Head from "next/head";
import Link from "next/link";
import QApage from "./QApage"
import styles from '../styles/Qpage.module.css'
 

export default function Home({ isConnected }) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        
      </main>

      <footer>
         
      </footer>
    </div>
  );
}