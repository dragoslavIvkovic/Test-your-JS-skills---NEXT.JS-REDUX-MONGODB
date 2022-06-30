import React from 'react';
import Link from 'next/link';

import styles from '../styles/Elements.module.css';

function BtnSignIn({
  session, signIn, signOut,
}) {
  return (
   /* <Link href="/api/auth/signin"> */
     <Link href="https://test-your-js-skills-next-js-redux-mongodb-h8z377cql.vercel.app/api/auth">
      <a className={styles.link} href="/#">
        {session ? (
          <>
            Signed in as
            {' '}
            {session.user.email}
            {' '}
            <br />
            <button onClick={() => signOut({ callbackUrl: `${window.location.origin}/` })} type="button">Sign out</button>
          </>
        ) : (
          <>
            Not signed in
            {' '}
            <br />
            <button onClick={() => signIn({ session, callbackUrl: `${window.location.origin}/SaveComponent` })} type="button">Sign in</button>
          </>
        )}
      </a>
    </Link>
  );
}

export default BtnSignIn;
