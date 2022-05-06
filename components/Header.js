import React from 'react'
import Link from 'next/link'
import styles from '../styles/Header.module.css'
import Image from 'next/image'
import { useSession, signIn, signOut } from 'next-auth/react';

function Header () {
    const { data: session } = useSession();

const handleOnError = () => {
    setImgSrc("/default-image.png");
  };


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
        {/* Signed in as {session.user.email} <br /> */}
        <Image
        
        //  src={'/default-image.png'}
       
         src={ session?.user?.image}
    alt="image-alt-text"
    width={40}
    height={40} 
 onError={handleOnError}

      
    />
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
