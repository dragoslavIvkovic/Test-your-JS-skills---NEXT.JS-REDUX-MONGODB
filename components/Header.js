import React from 'react'
import Link from 'next/link'
import styles from '../styles/Header.module.css'
import { useSession, signIn, signOut } from 'next-auth/react';

function Header () {
    const { data: session } = useSession();
  return (
    <div>
      <nav className={styles.topnav}>
        <Link href='/'>
          <a className={styles.link}>Home</a>
        </Link>
         <Link href='/QApage'>
             <a className={styles.link}>QA</a>
          </Link>
        <div className={styles.topnavRight}>
          
         <Link href='/WrongAnswersPage'>
            <a className={styles.link}>WrongAnswersPage</a>



          </Link><Link href='/api/auth/signin'>
            <a className={styles.link}>{
              session ?  <>
        Signed in as {session.user.email} <br />
        <button onClick={() => signOut()}>Sign out</button>
      </> : <>
      Not signed in <br />
      <button onClick={() => signIn()}>Sign in</button>
    </>

            }</a>
          </Link>
         
         
        </div>
      </nav>
    </div>
  )
}

export default Header
