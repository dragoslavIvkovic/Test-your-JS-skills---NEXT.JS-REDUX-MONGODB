import React from 'react';
import Link from 'next/link';
import styles from '../styles/Elements.module.css';
import { useSession, signIn, signOut } from 'next-auth/react'

import Image from 'next/image';

function BtnSignIn() {
  const { data: session } = useSession();
  const handleSignIn = (e) => {
    e.preventDefault()
    signIn(session?.user, {
      callbackUrl: '/SaveComponent',
    })
  }    
  const handleSignOut = (e) => {
    e.preventDefault()
    signOut(session?.user, {
      callbackUrl: '/SaveComponent',
    })
  }
 

  const handleOnError = () => {
    // eslint-disable-next-line no-undef
    setImgSrc('/default-image.png');
  };


  return (
    <Link href="/api/auth/signin" >
       
      {session ? (
        <div className={styles.link}>
          <Image
            src={session?.user?.image}
            alt="image-alt-text"
            width={20}
            height={20}
            onError={handleOnError}  
          />
          <a onClick={handleSignOut}  >Sign out</a>
        </div>
      ) : (
        <>
         
            <a onClick={handleSignIn} type="button" className={styles.link}>Sign in</a>
            <p> If you want to save score. Sign in.</p>
        </>
      )}
      
    </Link>
  );
}

export default BtnSignIn;
