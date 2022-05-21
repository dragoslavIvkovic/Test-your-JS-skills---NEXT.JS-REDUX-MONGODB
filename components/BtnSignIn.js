import React from 'react'
import Link from 'next/link'
import styles from '../styles/Header.module.css'
import { useSession, signIn, signOut } from 'next-auth/react';

function BtnSignIn({session, useSession, signIn, signOut}) {
  return (
    <>
      

      <Link href="/api/auth/signin">
                    <a className={styles.link}>
                      {session ? (
                        <>
                          Signed in as {session.user.email} <br />
                          <button onClick={() => signOut()}>Sign out</button>
                        </>
                      ) : (
                        <>
                          Not signed in <br />
                          <button onClick={() => signIn()}>Sign in</button>
                        </>
                      )}
                    </a>
                  </Link>
    </>
  )
}

export default BtnSignIn