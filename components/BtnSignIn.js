import React from 'react';
import Link from 'next/link';

import styles from '../styles/Elements.module.css';

function BtnSignIn({
  session, signIn, signOut,
}) {
  return (
    <Link href="/api/auth/signin">
      <a className={styles.link} href="/#">
        {session ? (
          <>
            Signed in as
            {' '}
            {session.user.email}
            {' '}
            <br />
            <button onClick={() => signOut()} type="button">Sign out</button>
          </>
        ) : (
          <>
            Not signed in
            {' '}
            <br />
            <button onClick={() => signIn({ callbackUrl: `${window.location.origin}/` })} type="button">Sign in</button>
          </>
        )}
      </a>
    </Link>
  );
}

export default BtnSignIn;
