import React from 'react';
import Link from 'next/link';
import styles from '../styles/Elements.module.css';
import { useSession, signIn, signOut } from 'next-auth/react'

function BtnSignIn() {
  const { data: session } = useSession();
  const handleSignIn = (e) => {
    e.preventDefault()
    signIn()
  }    
  const handleSignOut = (e) => {
    e.preventDefault()
    signOut()
  }



  return (
    <Link href="/api/auth/signin">
      <Link className={styles.link} href="/#">
        {session ? (
          <>
            Signed in as
            {' '}
            {session.user.email}
            {' '}
            <br />
            <button onClick={handleSignOut} type="button" className={styles.nextBtn}>Sign out</button>
          </>
        ) : (
          <>
            Not signed in
            {' '}
            <br />
            <button onClick={handleSignIn} type="button" className={styles.nextBtn}>Sign in</button>
          </>
        )}
      </Link>
    </Link>
  );
}

export default BtnSignIn;
